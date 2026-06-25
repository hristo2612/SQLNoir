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
  | { result: "rolled_over"; userId: string; paymentIntent: string }
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
    // Before pulling access, check for a surviving purchase. A buyer can hold more
    // than one purchase on the same email (an accidental double-buy); claim-license
    // backs the license with only the newest and leaves the rest UNCLAIMED. One
    // license unlocks everything, so a refund should only revoke when NO non-refunded
    // purchase remains - otherwise we roll the license over to a still-valid one.
    const { data: authData } = await admin.auth.admin.getUserById(user.id);
    const email = authData?.user?.email?.trim().toLowerCase();
    if (email) {
      const { data: survivor } = await admin
        .from("pending_licenses")
        .select("*")
        .eq("email", email)
        .is("claimed_at", null)
        .neq("payment_intent", paymentIntent)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (survivor?.payment_intent) {
        // Re-point the license at the surviving purchase and keep access. A future
        // refund of THIS purchase will map here via user_info.payment_intent.
        const { error: rollErr } = await admin
          .from("user_info")
          .update({
            payment_intent: survivor.payment_intent,
            stripe_session_id: survivor.stripe_session_id,
            stripe_customer_id: survivor.stripe_customer_id,
            license_purchased_at: survivor.created_at,
          })
          .eq("id", user.id);
        if (rollErr) return { result: "error", error: rollErr.message };

        await admin
          .from("pending_licenses")
          .update({
            claimed_at: new Date().toISOString(),
            claimed_by: user.id,
          })
          .eq("id", survivor.id);

        return {
          result: "rolled_over",
          userId: user.id,
          paymentIntent: survivor.payment_intent,
        };
      }
    }

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
