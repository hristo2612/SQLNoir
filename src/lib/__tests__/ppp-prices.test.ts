import { describe, it, expect } from "vitest";
import {
  getCurrencyForCountry,
  getCurrencyForLocale,
  getPriceForLocale,
  getPriceTier,
  roundNicePrice,
} from "../ppp-prices";

// Whitespace-insensitive compare: ICU inserts NBSP (U+00A0) between symbol and
// number for some locales (pt-BR, vi-VN), so normalize before asserting display.
const norm = (s: string) => s.replace(/ /g, " ");
// Only the digits of a price string - separators (grouping, decimal, symbol,
// spaces) are all stripped, so it works across every locale's formatting.
const digits = (s: string) => s.replace(/\D/g, "");

describe("getCurrencyForLocale", () => {
  it("returns usd for en", () => {
    expect(getCurrencyForLocale("en")).toBe("usd");
  });

  it("returns usd for pt-br", () => {
    expect(getCurrencyForLocale("pt-br")).toBe("usd");
  });

  it("returns cny for zh-CN", () => {
    expect(getCurrencyForLocale("zh-CN")).toBe("cny");
  });

  it("returns usd for unknown locales", () => {
    expect(getCurrencyForLocale("xx-YY")).toBe("usd");
    expect(getCurrencyForLocale("")).toBe("usd");
  });
});

describe("getPriceTier", () => {
  it("maps India to the $1.99 floor tier (199 cents, usd)", () => {
    const tier = getPriceTier("IN");
    expect(tier.tier).toBe(1);
    expect(tier.amount).toBe(199);
    expect(tier.currency).toBe("usd");
    expect(tier.display).toBe("$1.99");
  });

  it("maps the US to the $14.99 top tier (1499 cents, usd)", () => {
    const tier = getPriceTier("US");
    expect(tier.tier).toBe(13);
    expect(tier.amount).toBe(1499);
    expect(tier.currency).toBe("usd");
    expect(tier.display).toBe("$14.99");
  });

  it("maps Brazil to tier 4 ($3.99)", () => {
    const tier = getPriceTier("BR");
    expect(tier.tier).toBe(4);
    expect(tier.amount).toBe(399);
    expect(tier.display).toBe("$3.99");
  });

  it("is case-insensitive on the country code", () => {
    expect(getPriceTier("in")).toEqual(getPriceTier("IN"));
  });

  it("falls back to the default top tier for an unknown country", () => {
    const tier = getPriceTier("ZZ");
    expect(tier.tier).toBe(13);
    expect(tier.amount).toBe(1499);
    expect(tier.currency).toBe("usd");
    expect(tier.display).toBe("$14.99");
  });

  it("never exposes a Stripe priceId (dynamic pricing)", () => {
    const tier = getPriceTier("US") as unknown as Record<string, unknown>;
    expect(tier.priceId).toBeUndefined();
  });
});

describe("getPriceForLocale", () => {
  it("returns CNY tier for zh-CN (9900 cents)", () => {
    const price = getPriceForLocale("zh-CN", "CN");
    expect(price.currency).toBe("cny");
    expect(price.amount).toBe(9900);
    expect(price.display).toBe("¥99");
  });

  it("ignores country code for zh-CN (currency is locked to CNY)", () => {
    const priceUS = getPriceForLocale("zh-CN", "US");
    const priceCN = getPriceForLocale("zh-CN", "CN");
    expect(priceUS.currency).toBe("cny");
    expect(priceUS.amount).toBe(9900);
    expect(priceCN.currency).toBe("cny");
    expect(priceCN.amount).toBe(9900);
  });

  it("returns USD PPP tier for en + US (1499 cents)", () => {
    const price = getPriceForLocale("en", "US");
    const tier = getPriceTier("US");
    expect(price.currency).toBe("usd");
    expect(price.amount).toBe(tier.amount); // cents, matches the tier directly
    expect(price.amount).toBe(1499);
    expect(price.display).toBe(tier.display);
    expect(price.display).toBe("$14.99");
  });

  it("returns USD PPP tier for en + IN (cheaper floor tier, 199 cents)", () => {
    const price = getPriceForLocale("en", "IN");
    expect(price.currency).toBe("usd");
    expect(price.amount).toBe(199);
    expect(price.display).toBe("$1.99");
  });

  it("defaults to US tier when country is missing", () => {
    const price = getPriceForLocale("en");
    expect(price.currency).toBe("usd");
    expect(price.amount).toBe(1499);
    expect(price.display).toBe("$14.99");
  });

  it("2-arg/default path returns USD for pt-br + BR (NOT the production path)", () => {
    // NOTE: production checkout/price routes pass { localizeByCountry: true },
    // under which BR bills in BRL (R$20.99) - see the local-currency suite.
    // This asserts only the backward-compatible 2-arg default (USD PPP tier).
    const price = getPriceForLocale("pt-br", "BR");
    expect(price.currency).toBe("usd");
    // BR is tier 4 = $3.99
    expect(price.amount).toBe(399);
    expect(price.display).toBe("$3.99");
  });

  it("never exposes a Stripe priceId (dynamic pricing)", () => {
    const price = getPriceForLocale("en", "US") as unknown as Record<string, unknown>;
    expect(price.priceId).toBeUndefined();
  });
});

describe("getCurrencyForCountry", () => {
  it("maps Eurozone countries (incl. post-euro Bulgaria) to eur", () => {
    expect(getCurrencyForCountry("BG")).toBe("eur");
    expect(getCurrencyForCountry("DE")).toBe("eur");
    expect(getCurrencyForCountry("FR")).toBe("eur");
  });

  it("maps local-currency markets to their own currency", () => {
    expect(getCurrencyForCountry("IN")).toBe("inr");
    expect(getCurrencyForCountry("JP")).toBe("jpy");
    expect(getCurrencyForCountry("BR")).toBe("brl");
    expect(getCurrencyForCountry("GB")).toBe("gbp");
  });

  it("falls back to usd for unknown / missing country", () => {
    expect(getCurrencyForCountry("ZZ")).toBe("usd");
    expect(getCurrencyForCountry(undefined)).toBe("usd");
    expect(getCurrencyForCountry("US")).toBe("usd");
  });

  it("is case-insensitive", () => {
    expect(getCurrencyForCountry("bg")).toBe("eur");
    expect(getCurrencyForCountry("in")).toBe("inr");
  });
});

describe("EUR presentment (Eurozone)", () => {
  it("bills Bulgaria in EUR at its PPP tier (BG = tier 5, EUR3.99)", () => {
    const p = getPriceForLocale("en", "BG");
    expect(p.currency).toBe("eur");
    expect(p.tier).toBe(5);
    expect(p.amount).toBe(399); // EUR uses 2 decimals: 3.99 -> 399 minor units
    expect(norm(p.display)).toBe("€3.99");
  });

  it("bills Germany in EUR at its PPP tier (DE = tier 11, EUR8.99)", () => {
    const p = getPriceForLocale("en", "DE");
    expect(p.currency).toBe("eur");
    expect(p.tier).toBe(11);
    expect(p.amount).toBe(899);
    expect(norm(p.display)).toBe("€8.99");
  });

  it("EUR path does not require the localizeByCountry opt-in", () => {
    // Eurozone takes precedence over the opt-in flag in both directions.
    const off = getPriceForLocale("en", "BG");
    const on = getPriceForLocale("en", "BG", { localizeByCountry: true });
    expect(off).toEqual(on);
  });
});

describe("local-currency presentment (opt-in localizeByCountry)", () => {
  // Each tuple is the production-path expectation: country -> currency, exact
  // Stripe unit_amount, whether the currency is zero-decimal (whole units, not
  // x100), and the exact native-formatted display (digits compared for the
  // NBSP-bearing locales).
  const CASES = [
    { country: "IN", currency: "inr", amount: 16900, zeroDecimal: false, display: "₹169" },
    { country: "GB", currency: "gbp", amount: 799, zeroDecimal: false, display: "£7.99" },
    { country: "PL", currency: "pln", amount: 2399, zeroDecimal: false, display: "23,99 zł" },
    { country: "BR", currency: "brl", amount: 2099, zeroDecimal: false, displayDigits: "2099" },
    { country: "JP", currency: "jpy", amount: 1299, zeroDecimal: true, displayDigits: "1299" },
    { country: "VN", currency: "vnd", amount: 74999, zeroDecimal: true, displayDigits: "74999" },
  ] as const;

  for (const c of CASES) {
    it(`${c.country} -> ${c.currency} amount ${c.amount}`, () => {
      const p = getPriceForLocale("en", c.country, { localizeByCountry: true });
      expect(p.currency).toBe(c.currency);
      expect(p.amount).toBe(c.amount);
      if ("display" in c && c.display) {
        expect(norm(p.display)).toBe(c.display);
      }
      if ("displayDigits" in c && c.displayDigits) {
        expect(digits(p.display)).toBe(c.displayDigits);
      }
    });
  }

  it("zero-decimal currencies use WHOLE units, never x100 (the 100x bug guard)", () => {
    const jp = getPriceForLocale("en", "JP", { localizeByCountry: true });
    const vn = getPriceForLocale("en", "VN", { localizeByCountry: true });
    // If these were wrongly x100'd, amounts would be 129900 / 7499900.
    expect(jp.amount).toBe(1299);
    expect(vn.amount).toBe(74999);
    expect(jp.amount).toBeLessThan(2000);
    expect(vn.amount).toBeLessThan(100000);
  });

  it("INVARIANT: display always equals the charged amount in every currency", () => {
    // The single most important pricing guarantee - what the user is shown is
    // exactly what Stripe bills. For zero-decimal, the major value is `amount`;
    // otherwise it is amount/100. Comparing digits-only is locale-agnostic.
    const ZERO_DECIMAL = new Set(["jpy", "vnd"]);
    const countries = ["US", "IN", "GB", "PL", "BR", "JP", "VN", "BG", "DE"];
    for (const country of countries) {
      const p = getPriceForLocale("en", country, { localizeByCountry: true });
      const major = ZERO_DECIMAL.has(p.currency) ? p.amount : p.amount / 100;
      expect(digits(p.display)).toBe(digits(String(major)));
    }
  });

  it("the opt-in is required: without it, local-currency markets stay on USD", () => {
    // Backward-compat: the 2-arg signature must keep its original behaviour so
    // existing callers (and the old tests) are unaffected.
    const inUsd = getPriceForLocale("en", "IN");
    expect(inUsd.currency).toBe("usd");
    expect(inUsd.amount).toBe(199);
    const jpUsd = getPriceForLocale("en", "JP");
    expect(jpUsd.currency).toBe("usd");
    expect(jpUsd.amount).toBe(799);
  });

  it("zh-CN stays flat CNY even with the opt-in and a local-currency country", () => {
    const p = getPriceForLocale("zh-CN", "IN", { localizeByCountry: true });
    expect(p.currency).toBe("cny");
    expect(p.amount).toBe(9900);
  });
});

describe("roundNicePrice", () => {
  it("uses a .99 ending for small (near 1:1) values", () => {
    expect(roundNicePrice(20.748, "brl")).toBeCloseTo(20.99, 2);
    expect(roundNicePrice(7.1, "gbp")).toBeCloseTo(7.99, 2);
  });

  it("rounds large values to a nice magnitude ending in 9s", () => {
    expect(roundNicePrice(167.16, "inr")).toBe(169);
    expect(roundNicePrice(1254.43, "jpy")).toBe(1299);
    expect(roundNicePrice(74750, "vnd")).toBe(74999);
  });

  it("zero-decimal currencies never produce fractional units", () => {
    expect(Number.isInteger(roundNicePrice(1254.43, "jpy"))).toBe(true);
    expect(Number.isInteger(roundNicePrice(74750, "vnd"))).toBe(true);
  });
});

describe("monetization gate (STRIPE_SECRET_KEY)", () => {
  it("pricing helpers work without Stripe being configured", async () => {
    // The gate is in src/lib/stripe.ts and the route handler. We assert here
    // that pricing helpers work without Stripe being configured - i.e. they
    // do NOT require STRIPE_SECRET_KEY to be set.
    const originalKey = process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_SECRET_KEY;
    try {
      const price = getPriceForLocale("zh-CN", "CN");
      expect(price.currency).toBe("cny");
      expect(price.amount).toBe(9900);
      // No throw, no Stripe init triggered.
    } finally {
      if (originalKey !== undefined) {
        process.env.STRIPE_SECRET_KEY = originalKey;
      }
    }
  });
});
