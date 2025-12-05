"use client";

import { useRouter } from "next/navigation";
import { CaseSolver } from "./CaseSolver";
import type { Case } from "@/types";

interface CasePageClientProps {
  caseData: Case;
}

export function CasePageClient({ caseData }: CasePageClientProps) {
  const router = useRouter();

  return (
    <CaseSolver
      caseData={caseData}
      onBack={() => router.push("/cases")}
      onSolve={() => router.refresh()}
    />
  );
}
