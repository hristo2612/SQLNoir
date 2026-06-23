import { describe, it, expect } from "vitest";
import { computeMigration } from "@/lib/migrate-progress";

// Server source of truth (free beginner cases only).
const FREE: Record<string, number> = { "case-001": 50, "case-002": 100 };

describe("computeMigration", () => {
  it("filters to free cases only, discarding paid and unknown ids", () => {
    const r = computeMigration(FREE, ["case-001", "case-003", "case-999"], []);
    expect(r.newCases).toEqual(["case-001"]);
    expect(r.addedXp).toBe(50);
  });

  it("never credits paid cases even with empty existing", () => {
    const r = computeMigration(FREE, ["case-004", "case-005", "bogus"], []);
    expect(r.newCases).toEqual([]);
    expect(r.addedXp).toBe(0);
  });

  it("computes the set-difference against already-completed cases", () => {
    const r = computeMigration(FREE, ["case-001", "case-002"], ["case-001"]);
    expect(r.newCases).toEqual(["case-002"]);
    expect(r.addedXp).toBe(100);
  });

  it("sums addedXp across multiple genuinely-new free cases", () => {
    const r = computeMigration(FREE, ["case-001", "case-002"], []);
    expect(new Set(r.newCases)).toEqual(new Set(["case-001", "case-002"]));
    expect(r.addedXp).toBe(150);
  });

  it("is idempotent — re-running with everything completed adds nothing", () => {
    const r = computeMigration(
      FREE,
      ["case-001", "case-002"],
      ["case-001", "case-002"]
    );
    expect(r.newCases).toEqual([]);
    expect(r.addedXp).toBe(0);
  });

  it("dedups duplicate ids within a single request", () => {
    const r = computeMigration(FREE, ["case-001", "case-001"], []);
    expect(r.newCases).toEqual(["case-001"]);
    expect(r.addedXp).toBe(50);
  });
});
