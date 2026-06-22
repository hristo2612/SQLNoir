// Revoke a SQLNoir license when its purchase is refunded or charged back.
//
// A Stripe refund/dispute event carries the charge's `payment_intent`, NOT the checkout
// session id. We persist `payment_intent` at checkout.session.completed time (see the Stripe
// webhook), so here we can map the refund back to the buyer and revoke access.
//
// Two cases:
//  - The purchase was made signed-in (or an anonymous purchase that was already claimed):
//    a `user_info` row carries the payment_intent -> set has_license=false + audit fields.
//  - The purchase was anonymous and never claimed: a `pending_licenses` row carries it ->
//    delete it so it can never be claimed after the refund.
//
// Idempotent: re-running on an already-revoked row is a harmless no-op.

import type { SupabaseClient } from "@supabase/supabase-js";

export type RevokeOutcome =
  | { result: "revoked_user"; userId: string }
  | { result: "deleted_pending"; pendingId: string }
  | { result: "not_found" }
  | { result: "error"; error: string };

export async function revokeLicenseByPaymentIntent(
  admin: SupabaseClient,
  paymentIntent: string,
  reason: string
): Promise<RevokeOutcome> {
  if (!paymentIntent) return { result: "not_found" };

  // 1) Signed-in / claimed purchase: revoke on user_info.
  const { data: user, error: userErr } = await admin
    .from("user_info")
    .select("id")
    .eq("payment_intent", paymentIntent)
    .maybeSingle();

  if (userErr) return { result: "error", error: userErr.message };

  if (user?.id) {
    const { error: updErr } = await admin
      .from("user_info")
      .update({
        has_license: false,
        license_revoked_at: new Date().toISOString(),
        license_revoked_reason: reason,
      })
      .eq("id", user.id);
    if (updErr) return { result: "error", error: updErr.message };
    return { result: "revoked_user", userId: user.id };
  }

  // 2) Unclaimed anonymous purchase: drop the pending license so it can't be claimed.
  const { data: pending, error: pendErr } = await admin
    .from("pending_licenses")
    .select("id")
    .eq("payment_intent", paymentIntent)
    .maybeSingle();

  if (pendErr) return { result: "error", error: pendErr.message };

  if (pending?.id) {
    const { error: delErr } = await admin
      .from("pending_licenses")
      .delete()
      .eq("id", pending.id);
    if (delErr) return { result: "error", error: delErr.message };
    return { result: "deleted_pending", pendingId: pending.id };
  }

  return { result: "not_found" };
}
