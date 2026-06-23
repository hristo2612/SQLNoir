import { describe, it, expect } from "vitest";
import { emailsMatch } from "./email-match";

describe("emailsMatch", () => {
  it("matches identical emails", () => {
    expect(emailsMatch("buyer@example.com", "buyer@example.com")).toBe(true);
  });

  it("matches case-insensitively", () => {
    expect(emailsMatch("Buyer@Example.com", "buyer@example.COM")).toBe(true);
  });

  it("trims surrounding whitespace before comparing", () => {
    expect(emailsMatch("  buyer@example.com ", "buyer@example.com")).toBe(true);
  });

  it("does not match different emails", () => {
    expect(emailsMatch("buyer@example.com", "thief@example.com")).toBe(false);
  });

  it("returns false when either side is null", () => {
    expect(emailsMatch(null, "buyer@example.com")).toBe(false);
    expect(emailsMatch("buyer@example.com", null)).toBe(false);
    expect(emailsMatch(null, null)).toBe(false);
  });

  it("returns false when either side is undefined", () => {
    expect(emailsMatch(undefined, "buyer@example.com")).toBe(false);
    expect(emailsMatch("buyer@example.com", undefined)).toBe(false);
  });

  it("returns false when either side is empty or whitespace-only", () => {
    expect(emailsMatch("", "buyer@example.com")).toBe(false);
    expect(emailsMatch("buyer@example.com", "   ")).toBe(false);
    expect(emailsMatch("   ", "   ")).toBe(false);
  });
});
