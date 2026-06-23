/**
 * Case-insensitive, whitespace-trimmed email equality.
 *
 * Used to bind a license claim to the buyer email captured at Stripe checkout
 * (see `src/app/api/claim-license/route.ts`). Null/empty/undefined on EITHER
 * side returns false — a missing buyer email must never match a claimant, so an
 * unidentified purchase can't be claimed by anyone.
 */
export function emailsMatch(a?: string | null, b?: string | null): boolean {
  const left = (a || "").trim().toLowerCase();
  const right = (b || "").trim().toLowerCase();
  if (!left || !right) return false;
  return left === right;
}
