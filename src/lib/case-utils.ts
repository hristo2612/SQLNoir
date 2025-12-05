import type { Case } from "@/types";
import { cases } from "@/cases";

const sanitizeTitle = (title: string) =>
  title
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getCaseSlug = (caseData: Case) => {
  const caseNumber = caseData.id.replace(/[^0-9]/g, "");
  const titleSlug = sanitizeTitle(caseData.title);
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
