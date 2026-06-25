// SERVER-ONLY case localization.
//
// This module dynamically imports the per-locale case narratives
// (messages/cases/<locale>/<id>.json) AND overlays the server-only real
// solutions for paid cases (src/cases/solutions.server.ts). Both of those must
// stay out of the client bundle, so this file must NOT be imported from any
// "use client" component or any module reachable from one. It is deliberately
// kept separate from case-utils (which IS client-reachable via local-progress /
// CasesExplorer) so webpack never pulls the json import-context or the paid
// answers into a client chunk. See C4 in PRELAUNCH-REVIEW.md.
import type { Case } from "@/types";
import { cases } from "@/cases";
import { isCaseFree } from "@/lib/license";
import { paidCaseSolutions } from "@/cases/solutions.server";

const EMPTY_SOLUTION: Case["solution"] = {
  answer: "",
  successMessage: "",
  explanation: "",
};

// Overlay the real (server-only) solution onto a paid case. Free cases aren't in
// the map, so they keep the solution that ships in their own case file.
//
// Overlay by PRESENCE in the map, NOT by isCaseFree(): when monetization is off
// (the open-source / self-host default) isCaseFree() is true for every case, and
// short-circuiting on it here would leave cases 003-006 with their empty
// placeholder solution -> permanently unsolvable on a fresh clone. This module is
// server-only, so always overlaying is safe; with monetization ON the /cases list
// and the detail page still strip paid solutions before they reach the client.
function withRealSolution(caseData: Case): Case {
  const real = paidCaseSolutions[caseData.id];
  return real ? { ...caseData, solution: real } : caseData;
}

// Full localized case INCLUDING the real solution. Used by server-side answer
// checking (check-solution) and the case-detail page (which itself strips the
// solution before sending to the client for unlicensed users).
export async function getLocalizedCase(
  caseData: Case,
  locale: string
): Promise<Case> {
  const base = withRealSolution(caseData);
  if (locale === "en") return base;
  try {
    const narratives = await import(
      `../../messages/cases/${locale}/${caseData.id}.json`
    );
    const t = narratives.default || narratives;
    return {
      ...base,
      title: t.title || base.title,
      description: t.description || base.description,
      brief: t.brief || base.brief,
      objectives: t.objectives || base.objectives,
      solution: {
        ...base.solution,
        answer: t.solution?.answer ?? base.solution.answer,
        successMessage: t.solution?.successMessage || base.solution.successMessage,
        explanation: t.solution?.explanation || base.solution.explanation,
      },
    };
  } catch {
    return base;
  }
}

// List-safe localized cases for the /cases page: localizes the display fields
// but FORCES paid-case solutions to empty, so the list payload never carries a
// paid answer to the client. Free-case solutions are preserved (public).
export async function getAllLocalizedCases(
  locale: string
): Promise<Record<string, Case[]>> {
  const result: Record<string, Case[]> = {};
  for (const [category, caseList] of Object.entries(cases)) {
    result[category] = await Promise.all(
      caseList.map(async (c) => {
        const localized = await getLocalizedCase(c, locale);
        return isCaseFree(c)
          ? localized
          : { ...localized, solution: EMPTY_SOLUTION };
      })
    );
  }
  return result;
}
