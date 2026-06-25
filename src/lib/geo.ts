/**
 * Client-side country detection, used as a dev/local fallback when the
 * Vercel `x-vercel-ip-country` header is absent (e.g. local or Tailscale dev).
 *
 * In production the server header is authoritative; this is only a hint the
 * client appends so dev sees a localized price. Dependency-free.
 */

// Timezone -> ISO-2 country. Covers the Eurozone major zones plus a few common
// non-euro zones. Not exhaustive: anything unmapped falls through to the
// navigator.language region subtag or undefined.
const TIMEZONE_COUNTRY: Record<string, string> = {
  // Eurozone
  "Europe/Sofia": "BG",
  "Europe/Berlin": "DE",
  "Europe/Paris": "FR",
  "Europe/Madrid": "ES",
  "Europe/Rome": "IT",
  "Europe/Amsterdam": "NL",
  "Europe/Lisbon": "PT",
  "Europe/Athens": "GR",
  "Europe/Vienna": "AT",
  "Europe/Brussels": "BE",
  "Europe/Dublin": "IE",
  "Europe/Helsinki": "FI",
  "Europe/Bratislava": "SK",
  "Europe/Ljubljana": "SI",
  "Europe/Vilnius": "LT",
  "Europe/Riga": "LV",
  "Europe/Tallinn": "EE",
  "Europe/Zagreb": "HR",
  "Europe/Luxembourg": "LU",
  "Europe/Valletta": "MT",
  "Asia/Nicosia": "CY",
  // Common non-euro
  "America/New_York": "US",
  "America/Los_Angeles": "US",
  "America/Chicago": "US",
  "Europe/London": "GB",
  "Asia/Kolkata": "IN",
  "Asia/Shanghai": "CN",
  "America/Sao_Paulo": "BR",
  // Local-currency markets (PPP majors + developed)
  "America/Mexico_City": "MX",
  "Asia/Jakarta": "ID",
  "Asia/Manila": "PH",
  "Europe/Istanbul": "TR",
  "Africa/Johannesburg": "ZA",
  "Africa/Lagos": "NG",
  "Asia/Karachi": "PK",
  "Africa/Cairo": "EG",
  "Asia/Ho_Chi_Minh": "VN",
  "Asia/Bangkok": "TH",
  "Asia/Kuala_Lumpur": "MY",
  "America/Argentina/Buenos_Aires": "AR",
  "America/Bogota": "CO",
  "America/Santiago": "CL",
  "America/Lima": "PE",
  "Asia/Tokyo": "JP",
  "Australia/Sydney": "AU",
  "America/Toronto": "CA",
  "Europe/Warsaw": "PL",
  "Europe/Stockholm": "SE",
  "Europe/Oslo": "NO",
  "Europe/Copenhagen": "DK",
  "Europe/Zurich": "CH",
};

/**
 * Best-effort ISO-2 (UPPERCASE) country detection. Client-only.
 * Returns undefined when nothing resolves.
 */
export function detectCountry(): string | undefined {
  if (typeof window === "undefined") return undefined;

  // 1. Timezone -> country.
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && TIMEZONE_COUNTRY[tz]) {
      return TIMEZONE_COUNTRY[tz];
    }
  } catch {
    // Intl unavailable - fall through.
  }

  // 2. navigator.language region subtag (e.g. "bg-BG" -> BG).
  try {
    const lang = navigator.language || "";
    const parts = lang.split("-");
    const region = parts[1];
    if (region && /^[A-Za-z]{2}$/.test(region)) {
      return region.toUpperCase();
    }
  } catch {
    // navigator unavailable - fall through.
  }

  // 3. Nothing resolved.
  return undefined;
}
