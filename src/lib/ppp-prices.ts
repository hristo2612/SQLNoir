/**
 * PPP-based price tiers for Detective License.
 * Formula: $14.99 × (country_GDP_PPP / US_GDP_PPP), floor $1.99, ceiling $14.99.
 * 124 countries across 13 tiers.
 *
 * Pricing is DYNAMIC: amounts are passed to Stripe via `price_data.unit_amount`,
 * so there are no pre-created Stripe Price objects to manage. PPP robustness
 * comes from the amount + currency, not from a per-tier Stripe Price ID.
 */

export type SupportedCurrency = "usd" | "cny";

export interface PriceTier {
  amount: number; // in cents (Stripe unit_amount)
  currency: SupportedCurrency;
  display: string; // formatted price string
  tier: number;
}

const TIERS: Record<number, { amount: number; display: string }> = {
  1: { amount: 199, display: "$1.99" },
  2: { amount: 249, display: "$2.49" },
  3: { amount: 299, display: "$2.99" },
  4: { amount: 399, display: "$3.99" },
  5: { amount: 449, display: "$4.49" },
  6: { amount: 499, display: "$4.99" },
  7: { amount: 599, display: "$5.99" },
  8: { amount: 699, display: "$6.99" },
  9: { amount: 799, display: "$7.99" },
  10: { amount: 899, display: "$8.99" },
  11: { amount: 999, display: "$9.99" },
  12: { amount: 1199, display: "$11.99" },
  13: { amount: 1499, display: "$14.99" },
};

// Country code → tier number
const COUNTRY_TIERS: Record<string, number> = {
  // Tier 1 - $1.99
  IN: 1, PK: 1, BD: 1, ET: 1, NP: 1, MM: 1, TJ: 1, KG: 1,
  MG: 1, MW: 1, MZ: 1, BF: 1, ML: 1, NE: 1, TD: 1, CF: 1,
  CD: 1, BI: 1, SL: 1, LR: 1, AF: 1, HT: 1, YE: 1, SO: 1,

  // Tier 2 - $2.49
  NG: 2, KE: 2, GH: 2, TZ: 2, UG: 2, KH: 2, SN: 2, CI: 2,
  CM: 2, ZW: 2, ZM: 2, RW: 2, LA: 2, BJ: 2, TG: 2, GM: 2,

  // Tier 3 - $2.99
  PH: 3, VN: 3, EG: 3, UZ: 3, MA: 3, DZ: 3, TN: 3, JO: 3,
  LK: 3, BO: 3, PY: 3, HN: 3, NI: 3, GT: 3, SV: 3,

  // Tier 4 - $3.99
  BR: 4, CO: 4, PE: 4, UA: 4, ID: 4, ZA: 4, DO: 4, GE: 4,
  AM: 4, AZ: 4, MD: 4, AL: 4, BA: 4, MK: 4, XK: 4, JM: 4,

  // Tier 5 - $4.49
  CN: 5, MX: 5, TH: 5, RS: 5, BG: 5, EC: 5, KZ: 5, BY: 5,
  PA: 5, TT: 5, MU: 5, BW: 5, NA: 5, MN: 5,

  // Tier 6 - $4.99
  AR: 6, MY: 6, CR: 6, ME: 6, TR: 6, UY: 6, CL: 6,

  // Tier 7 - $5.99
  HU: 7, HR: 7, RO: 7, PL: 7, LV: 7, LT: 7, SK: 7,

  // Tier 8 - $6.99
  CZ: 8, EE: 8, PT: 8, GR: 8, CY: 8, MT: 8,

  // Tier 9 - $7.99
  SI: 9, KR: 9, ES: 9, IT: 9, JP: 9, NZ: 9, TW: 9, HK: 9,

  // Tier 10 - $8.99
  FR: 10, GB: 10, IL: 10, FI: 10, BE: 10,

  // Tier 11 - $9.99
  DE: 11, CA: 11, AT: 11, SE: 11,

  // Tier 12 - $11.99
  AU: 12, NL: 12, DK: 12, IS: 12,

  // Tier 13 - $14.99 (default)
  US: 13, NO: 13, CH: 13, LU: 13, IE: 13, SG: 13, QA: 13,
  AE: 13, KW: 13, BH: 13, BN: 13, MO: 13, SA: 13,
};

const DEFAULT_TIER = 13;

export function getPriceTier(countryCode: string): PriceTier {
  const code = countryCode?.toUpperCase() || "US";
  const tier = COUNTRY_TIERS[code] ?? DEFAULT_TIER;
  const { amount, display } = TIERS[tier];

  return { amount, currency: "usd", display, tier };
}

export function getDefaultPrice(): PriceTier {
  return getPriceTier("US");
}

// ---------------------------------------------------------------------------
// Locale-aware pricing (zh-CN → CNY, all others → USD)
// ---------------------------------------------------------------------------

export interface LocalizedPrice {
  amount: number; // unit amount in CENTS (Stripe unit_amount)
  currency: SupportedCurrency;
  display: string; // e.g. "$14.99" or "¥99"
  tier: number;
}

/**
 * Map a UI locale to the Stripe currency we should bill in.
 * Only zh-CN gets CNY for now; everyone else stays on USD.
 */
export function getCurrencyForLocale(locale: string): SupportedCurrency {
  return locale === "zh-CN" ? "cny" : "usd";
}

// Single CNY tier (PPP-equivalent to $14.99 for a developer/student audience).
// CEO range: ¥69 / ¥99 / ¥139 - default is ¥99. CNY uses 2 decimal places in
// Stripe, so ¥99 → 9900 minor units.
const CNY_AMOUNT_CENTS = 9900;
const CNY_DISPLAY = "¥99"; // ¥99 - no decimals at this price point

/**
 * Locale + country aware price lookup.
 *
 * - zh-CN locale → CNY single tier (¥99 → 9900 cents).
 * - Any other locale → existing USD PPP tier resolved from countryCode.
 *
 * Amount is in CENTS (Stripe unit_amount) so it can be passed straight into
 * `price_data.unit_amount` - there are no Stripe Price IDs anymore.
 */
export function getPriceForLocale(
  locale: string,
  countryCode?: string
): LocalizedPrice {
  const currency = getCurrencyForLocale(locale);
  const tier = getPriceTier(countryCode || "US");

  if (currency === "cny") {
    return {
      amount: CNY_AMOUNT_CENTS,
      currency,
      display: CNY_DISPLAY,
      tier: tier.tier,
    };
  }

  return {
    amount: tier.amount,
    currency: "usd",
    display: tier.display,
    tier: tier.tier,
  };
}
