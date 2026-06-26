import type { Case } from "@/types";

// localStorage key holding the Stripe Checkout session_id of a just-completed
// anonymous purchase. Persisted on the success page so the claim survives the
// Google OAuth redirect (which lands on "/", not back on the success page) and
// can be claimed on sign-in regardless of which page we return to.
export const PENDING_CLAIM_SESSION_KEY = "sqlnoir_pending_claim_session";

// Locale the purchase was made in, persisted alongside the pending claim so the
// post-OAuth redirect can return the buyer to the success page in their own
// language (Google OAuth lands on "/", losing the locale otherwise).
export const PENDING_CLAIM_LOCALE_KEY = "sqlnoir_pending_claim_locale";

// next-intl localePrefix "as-needed": default (en) has no prefix; pt-br/zh-CN do.
export function localePrefix(locale: string | null | undefined): string {
  return locale === "pt-br" || locale === "zh-CN" ? `/${locale}` : "";
}

// Last-known license state, cached client-side. Auth is cookie-less (implicit
// OAuth → session in localStorage), so the server can't know the license and a
// licensed user briefly sees locked cases on navigation. We seed the unlocked
// state from this cache before paint to kill that flash, then confirm via fetch.
export const LICENSE_CACHE_KEY = "sqlnoir_has_license";

export function readLicenseCache(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(LICENSE_CACHE_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeLicenseCache(hasLicense: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (hasLicense) localStorage.setItem(LICENSE_CACHE_KEY, "1");
    else localStorage.removeItem(LICENSE_CACHE_KEY);
  } catch {
    // localStorage unavailable (private mode): cache is best-effort.
  }
}

export function clearLicenseCache(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LICENSE_CACHE_KEY);
  } catch {
    // ignore
  }
}

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
