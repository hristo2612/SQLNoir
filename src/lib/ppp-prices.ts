/**
 * PPP-based price tiers for Detective License.
 * Formula: $14.99 x (country_GDP_PPP / US_GDP_PPP), floor $1.99, ceiling $14.99.
 * 124 countries across 13 tiers.
 *
 * Pricing is DYNAMIC: amounts are passed to Stripe via `price_data.unit_amount`,
 * so there are no pre-created Stripe Price objects to manage. PPP robustness
 * comes from the amount + currency, not from a per-tier Stripe Price ID.
 *
 * The USD tier (getPriceTier) is the canonical PPP anchor. Local-currency
 * presentment (INR, BRL, JPY, ...) is derived from that USD anchor via a static
 * FX table, so the PPP discount is preserved across every currency.
 */

export type SupportedCurrency =
  | "usd"
  | "cny"
  | "eur"
  // Major PPP markets + major developed markets, billed in local currency.
  | "inr"
  | "brl"
  | "mxn"
  | "idr"
  | "php"
  | "try"
  | "zar"
  | "ngn"
  | "pkr"
  | "egp"
  | "vnd"
  | "thb"
  | "myr"
  | "ars"
  | "cop"
  | "clp"
  | "pen"
  | "gbp"
  | "cad"
  | "aud"
  | "jpy"
  | "chf"
  | "sek"
  | "nok"
  | "dkk"
  | "pln";

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

// Country code -> tier number
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

// EUR price table, parallel to the USD TIERS above. Same tier numbers, clean
// euro prices (floor ~1.99, ceiling ~13.99, monotonic increasing). EUR uses 2
// decimals in Stripe, so amounts are in cents (e.g. 3.99 EUR -> 399).
const EUR_TIERS: Record<number, { amount: number; display: string }> = {
  1: { amount: 199, display: "€1.99" },
  2: { amount: 249, display: "€2.49" },
  3: { amount: 299, display: "€2.99" },
  4: { amount: 349, display: "€3.49" },
  5: { amount: 399, display: "€3.99" },
  6: { amount: 449, display: "€4.49" },
  7: { amount: 499, display: "€4.99" },
  8: { amount: 599, display: "€5.99" },
  9: { amount: 699, display: "€6.99" },
  10: { amount: 799, display: "€7.99" },
  11: { amount: 899, display: "€8.99" },
  12: { amount: 1099, display: "€10.99" },
  13: { amount: 1399, display: "€13.99" },
};

// ISO-2 country codes that use the euro as their currency. Bulgaria (BG) joins
// the Eurozone in 2026.
const EUROZONE = new Set<string>([
  "AT", "BE", "HR", "CY", "EE", "FI", "FR", "DE", "GR", "IE",
  "IT", "LV", "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES",
  "BG",
]);

// ---------------------------------------------------------------------------
// Local-currency presentment for non-Eurozone, non-CN markets.
// ---------------------------------------------------------------------------

/**
 * Country code -> local presentment currency. Eurozone countries are
 * deliberately NOT listed here: the EUROZONE check takes precedence and bills
 * them in EUR. CN is handled by the zh-CN locale path (flat CNY). Anything not
 * listed here falls back to USD.
 */
const CURRENCY_BY_COUNTRY: Record<string, SupportedCurrency> = {
  IN: "inr",
  BR: "brl",
  MX: "mxn",
  ID: "idr",
  PH: "php",
  TR: "try",
  ZA: "zar",
  NG: "ngn",
  PK: "pkr",
  EG: "egp",
  VN: "vnd",
  TH: "thb",
  MY: "myr",
  AR: "ars",
  CO: "cop",
  CL: "clp",
  PE: "pen",
  GB: "gbp",
  CA: "cad",
  AU: "aud",
  JP: "jpy",
  CH: "chf",
  SE: "sek",
  NO: "nok",
  DK: "dkk",
  PL: "pln",
};

/**
 * Approximate units of each currency per 1 USD (mid-2026 approximate rates).
 *
 * WARNING: these are STATIC, hand-maintained rates. They are intentionally
 * approximate (we round to psychologically nice prices anyway), but they WILL
 * drift from the real market over time and must be refreshed periodically.
 * A rate that is badly stale only changes the price magnitude, never the
 * display-equals-charge guarantee (display is derived from the same number).
 */
const CURRENCY_RATES: Record<SupportedCurrency, number> = {
  usd: 1,
  eur: 0.92,
  cny: 7.2,
  inr: 84,
  brl: 5.2,
  mxn: 18,
  idr: 16000,
  php: 58,
  try: 33,
  zar: 18,
  ngn: 1500,
  pkr: 278,
  egp: 48,
  vnd: 25000,
  thb: 36,
  myr: 4.7,
  ars: 950,
  cop: 4000,
  clp: 930,
  pen: 3.7,
  gbp: 0.79,
  cad: 1.37,
  aud: 1.5,
  jpy: 157,
  chf: 0.9,
  sek: 10.6,
  nok: 10.7,
  dkk: 6.9,
  pln: 4.0,
};

/**
 * Stripe ZERO-DECIMAL currencies: their `unit_amount` is in WHOLE units, NOT
 * multiplied by 100. For every other currency `unit_amount` is in minor units
 * (x100). Codes are uppercase ISO-4217 to match Stripe's published list.
 * Ref: https://stripe.com/docs/currencies#zero-decimal
 */
const STRIPE_ZERO_DECIMAL = new Set<string>([
  "BIF", "CLP", "DJF", "GNF", "JPY", "KMF", "KRW", "MGA", "PYG",
  "RWF", "UGX", "VND", "VUV", "XAF", "XOF", "XPF",
]);

function isZeroDecimal(currency: SupportedCurrency): boolean {
  return STRIPE_ZERO_DECIMAL.has(currency.toUpperCase());
}

/**
 * Representative formatting locale per currency, so each price renders with its
 * native symbol POSITION (before vs after), grouping separators, and decimal
 * mark. Pinning a single "en-US" locale forced symbol-first for everything,
 * which is wrong for currencies conventionally written symbol-after (zloty,
 * krona, lira, dong, euro-style, ...). Anything not listed falls back to en-US.
 */
const CURRENCY_LOCALE: Partial<Record<SupportedCurrency, string>> = {
  usd: "en-US",
  gbp: "en-GB",
  inr: "en-IN",
  brl: "pt-BR",
  mxn: "es-MX",
  idr: "id-ID",
  php: "en-PH",
  try: "tr-TR",
  zar: "en-ZA",
  ngn: "en-NG",
  pkr: "en-PK",
  egp: "en-EG",
  vnd: "vi-VN",
  thb: "th-TH",
  myr: "ms-MY",
  ars: "es-AR",
  cop: "es-CO",
  clp: "es-CL",
  pen: "es-PE",
  cad: "en-CA",
  aud: "en-AU",
  jpy: "ja-JP",
  chf: "de-CH",
  sek: "sv-SE",
  nok: "nb-NO",
  dkk: "da-DK",
  pln: "pl-PL",
  eur: "de-DE",
  cny: "zh-CN",
};

/**
 * Round a raw converted amount (in whole local units) to a psychologically
 * nice price. Large-denomination values are rounded to a clean magnitude step
 * and nudged to end in 9 / 99 / 999. Small (~1:1 to USD) values use a .99
 * ending. Zero-decimal currencies always take the integer path so we never
 * emit fractional whole units.
 */
export function roundNicePrice(value: number, currency: SupportedCurrency): number {
  if (isZeroDecimal(currency) || value >= 50) {
    // Whole-number path: round to a magnitude-based step, then drop 1 unit so
    // the price ends in 9s (e.g. 1300 -> 1299, 170 -> 169).
    let step: number;
    if (value >= 100000) step = 10000;
    else if (value >= 10000) step = 1000;
    else if (value >= 1000) step = 100;
    else step = 10;

    const rounded = Math.round(value / step) * step;
    const nice = rounded - 1;
    return nice > 0 ? nice : rounded;
  }

  // Small-denomination path: keep the whole part and use a .99 ending.
  const floored = Math.floor(value);
  return floored + 0.99;
}

/**
 * Format a nice local amount (in whole units) into a display string from the
 * SAME number the Stripe amount is derived from, so display and charge can
 * never diverge. Integer values render with no decimals; fractional values
 * (the .99 endings) render with 2.
 */
function formatLocalPrice(value: number, currency: SupportedCurrency): string {
  const zeroDecimal = isZeroDecimal(currency);
  const fractionDigits = zeroDecimal || Number.isInteger(value) ? 0 : 2;
  try {
    // Format in the currency's OWN representative locale so the symbol position
    // (before vs after), grouping separators, and decimal mark are native-correct
    // (e.g. "20,99 zl", "159 kr", "3,99 EUR-symbol"). narrowSymbol still renders
    // the symbol (Rs, lira, naira, Rp, R$) rather than the ISO code. Fall back to
    // en-US for any currency missing from CURRENCY_LOCALE.
    return new Intl.NumberFormat(CURRENCY_LOCALE[currency] ?? "en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(value);
  } catch {
    // Intl could not resolve the currency: fall back to a plain code + value.
    return `${currency.toUpperCase()} ${value.toFixed(fractionDigits)}`;
  }
}

/**
 * Convert the canonical USD anchor (in USD cents) into a local-currency
 * LocalizedPrice. Produces the Stripe `amount` correctly for the currency's
 * decimal class: zero-decimal -> whole units, otherwise minor units (x100).
 * The display string is formatted from the SAME nice amount.
 */
function localizeFromUsdCents(
  usdCents: number,
  currency: SupportedCurrency,
  tier: number
): LocalizedPrice {
  const usd = usdCents / 100;
  const rate = CURRENCY_RATES[currency];
  const raw = usd * rate;
  const nice = roundNicePrice(raw, currency);

  const amount = isZeroDecimal(currency)
    ? Math.round(nice)
    : Math.round(nice * 100);

  return {
    amount,
    currency,
    display: formatLocalPrice(nice, currency),
    tier,
  };
}

/**
 * Map a country to its presentment currency, reflecting the full resolution:
 * Eurozone -> "eur", else the local-currency mapping, else "usd". (CNY is
 * resolved by the zh-CN locale path, not by country, so it is not returned
 * here.) The canonical PPP anchor stays USD via getPriceTier.
 */
export function getCurrencyForCountry(countryCode?: string): SupportedCurrency {
  const code = countryCode?.toUpperCase() || "US";
  if (EUROZONE.has(code)) return "eur";
  return CURRENCY_BY_COUNTRY[code] ?? "usd";
}

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
// Locale-aware pricing
// ---------------------------------------------------------------------------

export interface LocalizedPrice {
  amount: number; // unit amount in the currency's Stripe unit (minor units, or whole units for zero-decimal)
  currency: SupportedCurrency;
  display: string; // e.g. "$14.99", "¥99", "₹1,299"
  tier: number;
}

/**
 * Map a UI locale to the Stripe currency we should bill in based on locale
 * alone. Only zh-CN gets CNY; everyone else is "usd" here. Country-driven
 * local currency is resolved separately in getPriceForLocale.
 */
export function getCurrencyForLocale(locale: string): SupportedCurrency {
  return locale === "zh-CN" ? "cny" : "usd";
}

// Single CNY tier (PPP-equivalent to $14.99 for a developer/student audience).
// CEO range: ¥69 / ¥99 / ¥139 - default is ¥99. CNY uses 2 decimal places in
// Stripe, so ¥99 -> 9900 minor units.
const CNY_AMOUNT_CENTS = 9900;
const CNY_DISPLAY = "¥99"; // ¥99 - no decimals at this price point

export interface PriceForLocaleOptions {
  /**
   * When true, non-Eurozone countries that have a local presentment currency
   * (CURRENCY_BY_COUNTRY) are billed in that currency, converted from the USD
   * PPP anchor. Defaults to false so the 2-arg signature keeps its original
   * USD/EUR/CNY-only behavior (backward compatible for existing callers).
   * The production price/checkout routes opt in by passing true.
   */
  localizeByCountry?: boolean;
}

/**
 * Locale + country aware price lookup. Precedence:
 *
 * 1. zh-CN locale -> CNY single tier (¥99 -> 9900 cents).
 * 2. Eurozone country -> EUR price for the PPP tier resolved from countryCode.
 * 3. (opt-in) country with a local presentment currency -> that currency,
 *    converted + rounded from the USD PPP anchor.
 * 4. Any other case -> existing USD PPP tier resolved from countryCode.
 *
 * The PPP tier NUMBER always comes from getPriceTier(countryCode), so the
 * discount for poorer countries is preserved in every currency; only the
 * currency, amount, and display selection differ per branch.
 *
 * Amount is in the currency's Stripe unit (minor units, or whole units for a
 * zero-decimal currency) so it can be passed straight into
 * `price_data.unit_amount`.
 */
export function getPriceForLocale(
  locale: string,
  countryCode?: string,
  options?: PriceForLocaleOptions
): LocalizedPrice {
  const tier = getPriceTier(countryCode || "US");
  const code = (countryCode || "US").toUpperCase();

  // 1. zh-CN keeps its single CNY tier exactly as before.
  if (getCurrencyForLocale(locale) === "cny") {
    return {
      amount: CNY_AMOUNT_CENTS,
      currency: "cny",
      display: CNY_DISPLAY,
      tier: tier.tier,
    };
  }

  // 2. Eurozone countries bill in EUR using the same PPP tier number.
  if (EUROZONE.has(code)) {
    const eur = EUR_TIERS[tier.tier];
    return {
      amount: eur.amount,
      currency: "eur",
      display: eur.display,
      tier: tier.tier,
    };
  }

  // 3. Opt-in: local presentment currency converted from the USD anchor.
  if (options?.localizeByCountry) {
    const localCurrency = CURRENCY_BY_COUNTRY[code];
    if (localCurrency) {
      return localizeFromUsdCents(tier.amount, localCurrency, tier.tier);
    }
  }

  // 4. Everyone else stays on the USD PPP tier.
  return {
    amount: tier.amount,
    currency: "usd",
    display: tier.display,
    tier: tier.tier,
  };
}
