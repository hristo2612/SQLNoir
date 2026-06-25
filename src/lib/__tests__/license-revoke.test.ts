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
  // userId -> email, used by auth.admin.getUserById for the rollover lookup.
  users?: Record<string, string>;
}

function makeAdmin(db: Record<string, Row[]>, opts: FakeOpts = {}) {
  const users = opts.users || {};
  class QB {
    private op: "select" | "update" | "delete" = "select";
    private payload: Row = {};
    private preds: Array<(r: Row) => boolean> = [];
    private orderCol?: string;
    private orderAsc = true;
    private limitN?: number;
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
      this.preds.push((r) => r[col] === val);
      return this;
    }
    neq(col: string, val: any) {
      this.preds.push((r) => r[col] !== val);
      return this;
    }
    is(col: string, val: any) {
      // Mirrors PostgREST `.is(col, null)`: a missing column reads as null.
      this.preds.push((r) => (r[col] ?? null) === val);
      return this;
    }
    order(col: string, o: { ascending?: boolean } = {}) {
      this.orderCol = col;
      this.orderAsc = o.ascending !== false;
      return this;
    }
    limit(n: number) {
      this.limitN = n;
      return this;
    }

    private match(): Row[] {
      let m = (db[this.table] || []).filter((r) =>
        this.preds.every((p) => p(r))
      );
      if (this.orderCol) {
        const col = this.orderCol;
        const dir = this.orderAsc ? 1 : -1;
        m = [...m].sort((a, b) =>
          a[col] < b[col] ? -1 * dir : a[col] > b[col] ? 1 * dir : 0
        );
      }
      if (this.limitN != null) m = m.slice(0, this.limitN);
      return m;
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
    auth: {
      admin: {
        getUserById: (id: string) =>
          Promise.resolve({
            data: { user: users[id] ? { id, email: users[id] } : null },
            error: null,
          }),
      },
    },
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

  it("rolls the license over to a surviving purchase instead of revoking (double-buy refund)", async () => {
    // Buyer purchased twice on the same email. claim-license backed the license
    // with the newest (pi_new) and left the older (pi_old) UNCLAIMED. Refunding
    // pi_new must keep access by rolling over to pi_old, not pull the license.
    const db = {
      user_info: [
        {
          id: "u1",
          payment_intent: "pi_new",
          stripe_session_id: "cs_new",
          has_license: true,
        },
      ] as Row[],
      pending_licenses: [
        {
          id: "pl_old",
          email: "buyer@example.com",
          payment_intent: "pi_old",
          stripe_session_id: "cs_old",
          stripe_customer_id: "cus_1",
          created_at: "2026-01-01T00:00:00Z",
          claimed_at: null,
        },
      ] as Row[],
    };
    const admin = makeAdmin(db, { users: { u1: "buyer@example.com" } });

    const out = await revokeLicenseByPaymentIntent(admin, "pi_new", "refund");
    expect(out).toEqual({
      result: "rolled_over",
      userId: "u1",
      paymentIntent: "pi_old",
    });
    // Access kept; license re-pointed at the surviving purchase.
    expect(db.user_info[0].has_license).toBe(true);
    expect(db.user_info[0].payment_intent).toBe("pi_old");
    expect(db.user_info[0].stripe_session_id).toBe("cs_old");
    // The surviving pending row is now the claimed backing record.
    expect(db.pending_licenses[0].claimed_at).toBeTruthy();
    expect(db.pending_licenses[0].claimed_by).toBe("u1");
  });

  it("revokes (no rollover) when the buyer has no other unclaimed purchase", async () => {
    const db = {
      user_info: [
        { id: "u1", payment_intent: "pi_new", has_license: true },
      ] as Row[],
      pending_licenses: [] as Row[],
    };
    const admin = makeAdmin(db, { users: { u1: "buyer@example.com" } });

    const out = await revokeLicenseByPaymentIntent(admin, "pi_new", "refund");
    expect(out).toEqual({ result: "revoked_user", userId: "u1" });
    expect(db.user_info[0].has_license).toBe(false);
  });

  it("does not roll over to an already-claimed pending row", async () => {
    // Only UNCLAIMED rows are rollover candidates; a previously-claimed duplicate
    // must not resurrect access.
    const db = {
      user_info: [
        { id: "u1", payment_intent: "pi_new", has_license: true },
      ] as Row[],
      pending_licenses: [
        {
          id: "pl_old",
          email: "buyer@example.com",
          payment_intent: "pi_old",
          created_at: "2026-01-01T00:00:00Z",
          claimed_at: "2026-02-01T00:00:00Z",
          claimed_by: "u1",
        },
      ] as Row[],
    };
    const admin = makeAdmin(db, { users: { u1: "buyer@example.com" } });

    const out = await revokeLicenseByPaymentIntent(admin, "pi_new", "refund");
    expect(out).toEqual({ result: "revoked_user", userId: "u1" });
    expect(db.user_info[0].has_license).toBe(false);
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
