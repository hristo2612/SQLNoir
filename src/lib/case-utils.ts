import type { Case } from "@/types";
import { cases } from "@/cases";

const sanitizeTitle = (title: string) =>
  title
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Build a map of case ID → English title for stable slug generation
const englishTitleMap = new Map<string, string>();
for (const caseList of Object.values(cases)) {
  for (const c of caseList) {
    englishTitleMap.set(c.id, c.title);
  }
}

export const getCaseSlug = (caseData: Case) => {
  const caseNumber = caseData.id.replace(/[^0-9]/g, "");
  // Always use the English title for URL slugs so they're locale-independent
  const englishTitle = englishTitleMap.get(caseData.id) || caseData.title;
  const titleSlug = sanitizeTitle(englishTitle);
  return `${caseNumber}-${titleSlug}`;
};

export const getAllCases = (): Case[] =>
  Object.values(cases).flatMap((caseList) => caseList);

export const findCaseBySlug = (slug: string) => {
  const normalizedSlug = slug.toLowerCase();
  return (
    getAllCases().find(
      (caseData) => getCaseSlug(caseData).toLowerCase() === normalizedSlug
    ) || null
  );
};

// NOTE: getLocalizedCase / getAllLocalizedCases moved to
// src/lib/case-localization.ts (server-only). They load per-locale narrative
// JSON and overlay server-only paid solutions, so they must stay out of this
// module, which is client-reachable (local-progress, CasesExplorer, ...). See C4.
