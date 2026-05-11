import { describe, it, expect, beforeEach, afterEach } from "vitest";
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

describe("getPriceForLocale", () => {
  const originalCnyPriceId = process.env.STRIPE_PRICE_ID_CNY;

  beforeEach(() => {
    delete process.env.STRIPE_PRICE_ID_CNY;
  });

  afterEach(() => {
    if (originalCnyPriceId === undefined) {
      delete process.env.STRIPE_PRICE_ID_CNY;
    } else {
      process.env.STRIPE_PRICE_ID_CNY = originalCnyPriceId;
    }
  });

  it("returns CNY tier for zh-CN", () => {
    const price = getPriceForLocale("zh-CN", "CN");
    expect(price.currency).toBe("cny");
    expect(price.amount).toBe(99);
    expect(price.display).toBe("¥99");
    expect(price.priceId).toBeNull(); // env var unset by default
  });

  it("uses STRIPE_PRICE_ID_CNY env var for CNY priceId when set", () => {
    process.env.STRIPE_PRICE_ID_CNY = "price_test_cny_123";
    const price = getPriceForLocale("zh-CN");
    expect(price.priceId).toBe("price_test_cny_123");
  });

  it("ignores country code for zh-CN (currency is locked to CNY)", () => {
    const priceUS = getPriceForLocale("zh-CN", "US");
    const priceCN = getPriceForLocale("zh-CN", "CN");
    expect(priceUS).toEqual(priceCN);
    expect(priceUS.currency).toBe("cny");
  });

  it("returns USD PPP tier for en + US", () => {
    const price = getPriceForLocale("en", "US");
    const tier = getPriceTier("US");
    expect(price.currency).toBe("usd");
    expect(price.amount).toBe(tier.amount / 100); // major units
    expect(price.display).toBe(tier.display); // "$14.99"
    expect(price.display).toBe("$14.99");
  });

  it("returns USD PPP tier for en + IN (cheaper tier)", () => {
    const price = getPriceForLocale("en", "IN");
    expect(price.currency).toBe("usd");
    expect(price.display).toBe("$1.99");
    expect(price.amount).toBe(1.99);
  });

  it("defaults to US tier when country is missing", () => {
    const price = getPriceForLocale("en");
    expect(price.currency).toBe("usd");
    expect(price.display).toBe("$14.99");
  });

  it("returns USD for pt-br regardless of country", () => {
    const price = getPriceForLocale("pt-br", "BR");
    expect(price.currency).toBe("usd");
    // BR is tier 4 = $3.99
    expect(price.display).toBe("$3.99");
  });
});

describe("monetization gate (STRIPE_SECRET_KEY)", () => {
  it("stays OFF when STRIPE_SECRET_KEY is unset", async () => {
    // The gate is in src/lib/stripe.ts and the route handler. We assert here
    // that pricing helpers work without Stripe being configured — i.e. they
    // do NOT require STRIPE_SECRET_KEY to be set.
    const originalKey = process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_SECRET_KEY;
    try {
      const price = getPriceForLocale("zh-CN", "CN");
      expect(price.currency).toBe("cny");
      // No throw, no Stripe init triggered.
    } finally {
      if (originalKey !== undefined) {
        process.env.STRIPE_SECRET_KEY = originalKey;
      }
    }
  });
});
