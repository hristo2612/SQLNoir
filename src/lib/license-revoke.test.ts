import { describe, it, expect, vi } from "vitest";
import { revokeLicenseByPaymentIntent } from "./license-revoke";

// Build a mock Supabase admin client whose `.from(table)` returns a tiny query builder.
// `select(...).eq(...).maybeSingle()` resolves to the seeded row for that table; `update` and
// `delete` record their calls so we can assert what the revoke did.
function makeAdmin(seed: {
  user?: { id: string } | null;
  pending?: { id: string } | null;
  userErr?: string;
  pendErr?: string;
}) {
  const calls: any = { update: null, updateEq: null, deleteEq: null };

  const builder = (table: string) => {
    const isUser = table === "user_info";
    return {
      // select(...).eq(...).maybeSingle()
      select() {
        return {
          eq() {
            return {
              maybeSingle: async () =>
                isUser
                  ? { data: seed.user ?? null, error: seed.userErr ? { message: seed.userErr } : null }
                  : { data: seed.pending ?? null, error: seed.pendErr ? { message: seed.pendErr } : null },
            };
          },
        };
      },
      // update(payload).eq(col,val)
      update(payload: any) {
        calls.update = payload;
        return { eq: async (_c: string, v: string) => ((calls.updateEq = v), { error: null }) };
      },
      // delete().eq(col,val)
      delete() {
        return { eq: async (_c: string, v: string) => ((calls.deleteEq = v), { error: null }) };
      },
    };
  };

  return { admin: { from: vi.fn(builder) } as any, calls };
}

describe("revokeLicenseByPaymentIntent", () => {
  it("revokes a signed-in/claimed user's license and writes audit fields", async () => {
    const { admin, calls } = makeAdmin({ user: { id: "user-123" } });
    const out = await revokeLicenseByPaymentIntent(admin, "pi_abc", "refund: ch_1");
    expect(out).toEqual({ result: "revoked_user", userId: "user-123" });
    expect(calls.update.has_license).toBe(false);
    expect(calls.update.license_revoked_reason).toBe("refund: ch_1");
    expect(typeof calls.update.license_revoked_at).toBe("string");
    expect(calls.updateEq).toBe("user-123");
  });

  it("deletes an unclaimed pending license when there is no user", async () => {
    const { admin, calls } = makeAdmin({ user: null, pending: { id: "pend-9" } });
    const out = await revokeLicenseByPaymentIntent(admin, "pi_xyz", "refund: ch_2");
    expect(out).toEqual({ result: "deleted_pending", pendingId: "pend-9" });
    expect(calls.deleteEq).toBe("pend-9");
  });

  it("is a no-op when neither a user nor a pending license matches", async () => {
    const { admin } = makeAdmin({ user: null, pending: null });
    const out = await revokeLicenseByPaymentIntent(admin, "pi_none", "refund: ch_3");
    expect(out).toEqual({ result: "not_found" });
  });

  it("returns not_found for an empty payment_intent without touching the db", async () => {
    const { admin } = makeAdmin({ user: { id: "should-not-be-read" } });
    const out = await revokeLicenseByPaymentIntent(admin, "", "refund: ch_4");
    expect(out).toEqual({ result: "not_found" });
    expect((admin.from as any)).not.toHaveBeenCalled();
  });

  it("surfaces a db error from the user lookup", async () => {
    const { admin } = makeAdmin({ userErr: "boom" });
    const out = await revokeLicenseByPaymentIntent(admin, "pi_err", "refund: ch_5");
    expect(out).toEqual({ result: "error", error: "boom" });
  });
});
