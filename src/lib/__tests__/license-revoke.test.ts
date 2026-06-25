import { describe, it, expect } from "vitest";
import { revokeLicenseByPaymentIntent } from "../license-revoke";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Minimal in-memory stand-in for the Supabase admin client, supporting exactly
 * the query shapes revokeLicenseByPaymentIntent uses:
 *   from(t).select(c).eq(col,val).maybeSingle()
 *   from(t).update(obj).eq(col,val)
 *   from(t).delete().eq(col,val)
 * The builder is thenable so update/delete can be awaited directly, while
 * selects terminate in maybeSingle() - mirroring supabase-js semantics.
 */
type Row = Record<string, any>;
interface FakeOpts {
  errorOn?: { table: string; op: "select" | "update" | "delete" };
}

function makeAdmin(db: Record<string, Row[]>, opts: FakeOpts = {}) {
  class QB {
    private op: "select" | "update" | "delete" = "select";
    private payload: Row = {};
    private filters: Array<[string, any]> = [];
    constructor(private table: string) {}

    select() {
      this.op = "select";
      return this;
    }
    update(obj: Row) {
      this.op = "update";
      this.payload = obj;
      return this;
    }
    delete() {
      this.op = "delete";
      return this;
    }
    eq(col: string, val: any) {
      this.filters.push([col, val]);
      return this;
    }

    private match(): Row[] {
      return (db[this.table] || []).filter((r) =>
        this.filters.every(([c, v]) => r[c] === v)
      );
    }
    private errored() {
      return (
        opts.errorOn &&
        opts.errorOn.table === this.table &&
        opts.errorOn.op === this.op
      );
    }

    maybeSingle() {
      if (this.errored())
        return Promise.resolve({ data: null, error: { message: "boom" } });
      const m = this.match();
      return Promise.resolve({ data: m[0] ?? null, error: null });
    }

    private run() {
      if (this.errored()) return { data: null, error: { message: "boom" } };
      if (this.op === "update") {
        for (const r of this.match()) Object.assign(r, this.payload);
        return { data: null, error: null };
      }
      if (this.op === "delete") {
        const keep = (db[this.table] || []).filter((r) => !this.match().includes(r));
        db[this.table] = keep;
        return { data: null, error: null };
      }
      return { data: this.match(), error: null };
    }
    then(resolve: (v: any) => void, reject?: (e: any) => void) {
      return Promise.resolve(this.run()).then(resolve, reject);
    }
  }

  return {
    from: (table: string) => new QB(table),
  } as unknown as SupabaseClient;
}

describe("revokeLicenseByPaymentIntent", () => {
  it("revokes a signed-in / claimed buyer found via user_info.payment_intent (C2 fix)", async () => {
    // This is the exact state the C2 fix produces: an anonymous purchase that was
    // claimed now carries payment_intent on user_info, so a refund can find it.
    const db = {
      user_info: [
        { id: "u1", payment_intent: "pi_123", has_license: true },
      ] as Row[],
      pending_licenses: [] as Row[],
    };
    const admin = makeAdmin(db);

    const out = await revokeLicenseByPaymentIntent(admin, "pi_123", "refund");
    expect(out).toEqual({ result: "revoked_user", userId: "u1" });
    expect(db.user_info[0].has_license).toBe(false);
    expect(db.user_info[0].license_revoked_reason).toBe("refund");
    expect(db.user_info[0].license_revoked_at).toBeTruthy();
  });

  it("documents the C2 failure mode: a claimed buyer WITHOUT payment_intent is not reachable", async () => {
    // Pre-fix, claim-license never wrote payment_intent. Then the refund cannot
    // map to the user and (with no pending row either) silently leaves access on.
    const db = {
      user_info: [{ id: "u1", has_license: true }], // no payment_intent
      pending_licenses: [] as Row[],
    };
    const admin = makeAdmin(db);

    const out = await revokeLicenseByPaymentIntent(admin, "pi_123", "refund");
    expect(out).toEqual({ result: "not_found" });
    expect(db.user_info[0].has_license).toBe(true); // still licensed - the bug
  });

  it("deletes an unclaimed pending license so it can never be claimed after refund", async () => {
    const db = {
      user_info: [] as Row[],
      pending_licenses: [{ id: "pl1", payment_intent: "pi_999" }],
    };
    const admin = makeAdmin(db);

    const out = await revokeLicenseByPaymentIntent(admin, "pi_999", "dispute");
    expect(out).toEqual({ result: "deleted_pending", pendingId: "pl1" });
    expect(db.pending_licenses).toHaveLength(0);
  });

  it("prefers user_info over pending_licenses when both carry the intent", async () => {
    const db = {
      user_info: [{ id: "u1", payment_intent: "pi_dup", has_license: true }],
      pending_licenses: [{ id: "pl1", payment_intent: "pi_dup" }],
    };
    const admin = makeAdmin(db);

    const out = await revokeLicenseByPaymentIntent(admin, "pi_dup", "refund");
    expect(out).toEqual({ result: "revoked_user", userId: "u1" });
    // pending row is left untouched on the user_info path (audit trail).
    expect(db.pending_licenses).toHaveLength(1);
  });

  it("returns not_found for an unknown payment intent", async () => {
    const admin = makeAdmin({ user_info: [], pending_licenses: [] });
    const out = await revokeLicenseByPaymentIntent(admin, "pi_nope", "refund");
    expect(out).toEqual({ result: "not_found" });
  });

  it("returns not_found for an empty payment intent without touching the db", async () => {
    const admin = makeAdmin({ user_info: [], pending_licenses: [] });
    const out = await revokeLicenseByPaymentIntent(admin, "", "refund");
    expect(out).toEqual({ result: "not_found" });
  });

  it("surfaces a db error on the user_info lookup as an error outcome", async () => {
    const admin = makeAdmin(
      { user_info: [], pending_licenses: [] },
      { errorOn: { table: "user_info", op: "select" } }
    );
    const out = await revokeLicenseByPaymentIntent(admin, "pi_1", "refund");
    expect(out.result).toBe("error");
  });

  it("is idempotent: re-revoking an already-revoked user is a harmless re-flip", async () => {
    const db = {
      user_info: [{ id: "u1", payment_intent: "pi_123", has_license: false }],
      pending_licenses: [] as Row[],
    };
    const admin = makeAdmin(db);
    const out = await revokeLicenseByPaymentIntent(admin, "pi_123", "refund");
    expect(out).toEqual({ result: "revoked_user", userId: "u1" });
    expect(db.user_info[0].has_license).toBe(false);
  });
});
