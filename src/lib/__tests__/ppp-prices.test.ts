import { describe, it, expect } from "vitest";
import {
  getCurrencyForLocale,
  getPriceForLocale,
  getPriceTier,
} from "../ppp-prices";

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
    const tier = getPriceTier("US") as Record<string, unknown>;
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

  it("returns USD for pt-br regardless of country", () => {
    const price = getPriceForLocale("pt-br", "BR");
    expect(price.currency).toBe("usd");
    // BR is tier 4 = $3.99
    expect(price.amount).toBe(399);
    expect(price.display).toBe("$3.99");
  });

  it("never exposes a Stripe priceId (dynamic pricing)", () => {
    const price = getPriceForLocale("en", "US") as Record<string, unknown>;
    expect(price.priceId).toBeUndefined();
  });
});

describe("monetization gate (STRIPE_SECRET_KEY)", () => {
  it("pricing helpers work without Stripe being configured", async () => {
    // The gate is in src/lib/stripe.ts and the route handler. We assert here
    // that pricing helpers work without Stripe being configured — i.e. they
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
