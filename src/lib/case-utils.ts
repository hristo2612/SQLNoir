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

export async function getLocalizedCase(caseData: Case, locale: string): Promise<Case> {
  if (locale === 'en') return caseData;
  try {
    const narratives = await import(`../../messages/cases/${locale}/${caseData.id}.json`);
    const t = narratives.default || narratives;
    return {
      ...caseData,
      title: t.title || caseData.title,
      description: t.description || caseData.description,
      brief: t.brief || caseData.brief,
      objectives: t.objectives || caseData.objectives,
      solution: {
        ...caseData.solution,
        answer: t.solution?.answer ?? caseData.solution.answer,
        successMessage: t.solution?.successMessage || caseData.solution.successMessage,
        explanation: t.solution?.explanation || caseData.solution.explanation,
      },
    };
  } catch {
    return caseData;
  }
}

export async function getAllLocalizedCases(locale: string): Promise<Record<string, Case[]>> {
  if (locale === 'en') return cases;
  const result: Record<string, Case[]> = {};
  for (const [category, caseList] of Object.entries(cases)) {
    result[category] = await Promise.all(
      caseList.map((c) => getLocalizedCase(c, locale))
    );
  }
  return result;
}
