import { describe, it, expect } from "vitest";
import { emailsMatch } from "../email-match";

describe("emailsMatch (license claim binding)", () => {
  it("matches identical emails", () => {
    expect(emailsMatch("a@b.com", "a@b.com")).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(emailsMatch("Buyer@Example.COM", "buyer@example.com")).toBe(true);
  });

  it("trims surrounding whitespace", () => {
    expect(emailsMatch("  buyer@example.com ", "buyer@example.com")).toBe(true);
  });

  it("rejects different emails", () => {
    expect(emailsMatch("a@b.com", "c@d.com")).toBe(false);
  });

  it("SECURITY: a null/empty buyer email never matches (unidentified purchase is unclaimable)", () => {
    // The core anti-theft guarantee: an empty/missing pending-row email must not
    // be claimable by anyone, including a claimant with an empty email.
    expect(emailsMatch("buyer@example.com", null)).toBe(false);
    expect(emailsMatch("buyer@example.com", "")).toBe(false);
    expect(emailsMatch("buyer@example.com", undefined)).toBe(false);
    expect(emailsMatch(null, "buyer@example.com")).toBe(false);
    expect(emailsMatch("", "")).toBe(false);
    expect(emailsMatch(null, null)).toBe(false);
    expect(emailsMatch("   ", "   ")).toBe(false);
  });
});
