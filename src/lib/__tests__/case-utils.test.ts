import { describe, it, expect } from "vitest";
import {
  getCaseSlug,
  findCaseBySlug,
  getAllCases,
  getLocalizedCase,
} from "../case-utils";
import type { Case } from "@/types";

// Create a mock case with Portuguese title to simulate localized case data
function makeMockCase(overrides: Partial<Case> = {}): Case {
  return {
    id: "case-001",
    title: "The Vanishing Briefcase",
    difficulty: 1,
    description: "A briefcase has vanished.",
    xpReward: 50,
    completed: false,
    isNew: false,
    category: "beginner",
    brief: "A briefcase has vanished.",
    objectives: ["Find the briefcase."],
    solution: {
      answer: "test",
      successMessage: "Correct!",
      explanation: "The answer was test.",
    },
    ...overrides,
  };
}

describe("getCaseSlug", () => {
  it("generates correct English slug", () => {
    const c = makeMockCase();
    const slug = getCaseSlug(c);
    expect(slug).toBe("001-The-Vanishing-Briefcase");
  });

  it("always uses English title even when case has localized title", () => {
    // This is the critical test: a case with Portuguese title should still
    // produce an English slug so URLs are locale-independent
    const localizedCase = makeMockCase({ title: "A Maleta Desaparecida" });
    const slug = getCaseSlug(localizedCase);
    expect(slug).toBe("001-The-Vanishing-Briefcase");
  });

  it("handles cases with special characters in English title", () => {
    const c = makeMockCase({
      id: "case-003",
      title: "The Miami Marina Murder",
    });
    const slug = getCaseSlug(c);
    expect(slug).toBe("003-The-Miami-Marina-Murder");
  });
});

describe("findCaseBySlug", () => {
  it("finds a case by its English slug", () => {
    const found = findCaseBySlug("001-The-Vanishing-Briefcase");
    expect(found).not.toBeNull();
    expect(found?.id).toBe("case-001");
  });

  it("finds a case with case-insensitive slug", () => {
    const found = findCaseBySlug("001-the-vanishing-briefcase");
    expect(found).not.toBeNull();
    expect(found?.id).toBe("case-001");
  });

  it("returns null for a Portuguese slug (slugs are always English)", () => {
    const found = findCaseBySlug("001-A-Maleta-Desaparecida");
    // This should return null since we always use English slugs in URLs
    // The important thing is that getCaseSlug never generates this slug
    expect(found).toBeNull();
  });

  it("returns null for nonexistent slug", () => {
    const found = findCaseBySlug("999-nonexistent-case");
    expect(found).toBeNull();
  });
});

describe("getAllCases", () => {
  it("returns all cases", () => {
    const all = getAllCases();
    expect(all.length).toBeGreaterThanOrEqual(6);
  });

  it("all cases have unique IDs", () => {
    const all = getAllCases();
    const ids = all.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all cases produce unique slugs", () => {
    const all = getAllCases();
    const slugs = all.map((c) => getCaseSlug(c));
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("getLocalizedCase", () => {
  it("returns the original case unchanged for 'en' locale", async () => {
    const c = makeMockCase();
    const result = await getLocalizedCase(c, "en");
    expect(result).toBe(c);
    expect(result.solution.answer).toBe("test");
  });

  it("falls back to English answer when locale JSON does not provide one (pt-br pattern)", async () => {
    // Use case-001's real id — pt-br/case-001.json exists but has no solution.answer
    const all = getAllCases();
    const c001 = all.find((c) => c.id === "case-001");
    expect(c001).toBeDefined();
    const englishAnswer = c001!.solution.answer;
    const result = await getLocalizedCase(c001!, "pt-br");
    expect(result.solution.answer).toBe(englishAnswer);
    // Other fields should be localized (sanity check)
    expect(result.title).not.toBe(c001!.title);
  });

  it("falls back to English answer when no locale JSON exists at all", async () => {
    const c = makeMockCase({ id: "case-001" });
    // 'no-such-locale' has no JSON files, so import throws and we return caseData
    const result = await getLocalizedCase(c, "no-such-locale");
    expect(result.solution.answer).toBe("test");
  });

  it("uses locale JSON answer when provided (zh-CN pattern)", async () => {
    // Uses fixture at messages/cases/__test__/case-001.json which provides
    // a Chinese solution.answer override — simulates Phase 4 zh-CN data.
    const c = makeMockCase({ id: "case-001" });
    const result = await getLocalizedCase(c, "__test__");
    expect(result.solution.answer).toBe("赵俊豪");
    expect(result.title).toBe("案件零");
    expect(result.solution.successMessage).toBe("成功！");
    expect(result.solution.explanation).toBe("解释。");
  });

  // The case-detail page's generateMetadata feeds title/description through
  // getLocalizedCase before building <title>, OG, and Twitter tags. These
  // assertions lock in that it returns localized (non-English) title +
  // description for the non-default locales — the contract metadata relies on.
  // Full metadata-object integration is covered by the render-verification wave.
  it("returns a localized title and description for pt-br (metadata contract)", async () => {
    const c001 = getAllCases().find((c) => c.id === "case-001")!;
    const result = await getLocalizedCase(c001, "pt-br");
    expect(result.title).not.toBe(c001.title);
    expect(result.description).not.toBe(c001.description);
    expect(result.title.length).toBeGreaterThan(0);
  });

  it("returns a localized title for the zh-CN-style locale (metadata contract)", async () => {
    const c = makeMockCase({ id: "case-001" });
    const result = await getLocalizedCase(c, "__test__");
    expect(result.title).toBe("案件零");
    expect(result.description).not.toBe(c.description);
  });
});
