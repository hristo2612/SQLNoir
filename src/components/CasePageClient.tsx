"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CaseSolver } from "./CaseSolver";
import type { Case } from "@/types";
import { track } from "@vercel/analytics/react";

interface CasePageClientProps {
  caseData: Case;
}

export function CasePageClient({ caseData }: CasePageClientProps) {
  const router = useRouter();

  useEffect(() => {
    track("case_view", {
      case_slug: caseData.id,
      title: caseData.title,
      difficulty: caseData.difficulty,
      category: caseData.category,
      xp_reward: caseData.xpReward,
    });
  }, [caseData]);

  return (
    <CaseSolver
      caseData={caseData}
      onBack={() => router.push("/cases")}
      onSolve={() => router.refresh()}
    />
  );
}
