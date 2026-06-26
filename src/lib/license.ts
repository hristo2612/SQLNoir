import type { Case } from "@/types";

// localStorage key holding the Stripe Checkout session_id of a just-completed
// anonymous purchase. Persisted on the success page so the claim survives the
// Google OAuth redirect (which lands on "/", not back on the success page) and
// can be claimed on sign-in regardless of which page we return to.
export const PENDING_CLAIM_SESSION_KEY = "sqlnoir_pending_claim_session";

// When NEXT_PUBLIC_ENABLE_MONETIZATION is not set or "0", the entire app is free.
const monetizationEnabled =
  process.env.NEXT_PUBLIC_ENABLE_MONETIZATION === "1";

// Cases 1-2 (beginner) are free. Cases 3-6 (intermediate + advanced) require a license.
const FREE_CATEGORIES = new Set(["beginner"]);

export function isCaseFree(caseData: Case): boolean {
  if (!monetizationEnabled) return true;
  return FREE_CATEGORIES.has(caseData.category);
}

export function isCaseLocked(caseData: Case, hasLicense: boolean): boolean {
  if (!monetizationEnabled) return false;
  if (isCaseFree(caseData)) return false;
  return !hasLicense;
}

export function isCategoryLocked(
  categoryId: string,
  hasLicense: boolean
): boolean {
  if (!monetizationEnabled) return false;
  if (FREE_CATEGORIES.has(categoryId)) return false;
  return !hasLicense;
}

export function getUserHasLicense(userInfo: any): boolean {
  if (!monetizationEnabled) return true;
  if (!userInfo) return false;
  return Boolean(userInfo.has_license);
}
