"use client";

import { useEffect, useState } from "react";
import { CaseFile } from "./CaseFile";
import { Lock } from "lucide-react";
import { cases, categories } from "../cases";
import { GetLicenseButton } from "./GetLicenseButton";
import { isCategoryLocked } from "@/lib/license";
import { getLocalProgress } from "@/lib/local-progress";
import type { Case } from "@/types";
import { useTranslations } from "next-intl";

interface DashboardProps {
  onCaseSelect: (caseData: Case) => void;
  onLockedCaseClick: (caseData: Case) => void;
  userInfo: any;
  hasLicense: boolean;
  localizedCases?: Record<string, any[]>;
}

export function Dashboard({
  onCaseSelect,
  onLockedCaseClick,
  userInfo,
  hasLicense,
  localizedCases,
}: DashboardProps) {
  const t = useTranslations();

  // Anonymous (logged-out) local progress. Initialized empty so SSR and the
  // first client render match (hydration-safe); the real value is read from
  // localStorage inside an effect.
  const isAnon = !userInfo;
  const [anonProgress, setAnonProgress] = useState<{
    solvedCaseIds: string[];
    xp: number;
  }>({ solvedCaseIds: [], xp: 0 });

  useEffect(() => {
    if (isAnon) {
      setAnonProgress(getLocalProgress());
    }
  }, [isAnon]);

  const solvedCases: string[] = isAnon
    ? anonProgress.solvedCaseIds
    : userInfo?.completed_cases || [];
  const showUnsyncedBadge = isAnon && anonProgress.solvedCaseIds.length > 0;

  return (
    <div className="min-h-screen bg-amber-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 space-y-2">
          <h1 className="font-detective text-3xl text-amber-900 leading-none">
            {t('cases.caseFiles')}
          </h1>
          {showUnsyncedBadge && (
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 border border-amber-200 px-3 py-1 text-xs text-amber-800">
              <span className="font-detective">
                {anonProgress.xp} {t('common.xp')}
              </span>
              <span aria-hidden="true">·</span>
              <span>{t('cases.unsyncedNote')}</span>
            </div>
          )}
        </div>

        {process.env.NEXT_PUBLIC_ENABLE_MONETIZATION === "1" && !userInfo?.has_license && (
          <div className="mb-8 bg-gradient-to-r from-amber-100 to-amber-50 border border-amber-200 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <p className="font-detective text-xl text-amber-900">
                {t('license.unlockAllCases')}
              </p>
              <p className="text-amber-700 text-sm">
                {t('license.unlockAllCasesDesc')}
              </p>
              <p className="text-amber-700/70 text-xs">
                {t.rich('license.teamLicense', {
                  a: (chunks) => (
                    <a
                      href="mailto:support@sqlnoir.com"
                      className="underline hover:text-amber-900"
                    >
                      {chunks}
                    </a>
                  ),
                })}
              </p>
            </div>
            <GetLicenseButton source="dashboard-banner" />
          </div>
        )}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => {
              const isLocked = isCategoryLocked(category.id, hasLicense);
              const categoryClass = isLocked ? "opacity-75" : "";

              return (
                <div key={category.id} className={`space-y-4 ${categoryClass}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <category.icon className="w-5 h-5 text-amber-700" />
                      <h3 className="font-detective text-xl text-amber-800">
                        {t(`cases.${category.id}` as any)}
                      </h3>
                    </div>
                    {isLocked && (
                      <div className="flex items-center text-amber-600 text-sm">
                        <Lock className="w-4 h-4 mr-1" />
                        <span className="font-detective text-xs">
                          {t('license.licenseRequired')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {((localizedCases || cases)[category.id as keyof typeof cases] || []).map(
                      (caseData) => (
                        <div
                          key={caseData.id}
                          className={`relative rounded-lg transition-transform duration-200 ${
                            isLocked ? "group/locked hover:-translate-y-0.5" : ""
                          }`}
                        >
                          <CaseFile
                            caseData={caseData}
                            onClick={() =>
                              isLocked
                                ? onLockedCaseClick(caseData)
                                : onCaseSelect(caseData)
                            }
                            isSolved={solvedCases.includes(caseData.id)}
                          />
                          {isLocked && (
                            <div
                              className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-amber-950/10 backdrop-blur-[1px] transition-all duration-200 group-hover/locked:bg-amber-950/25 group-hover/locked:backdrop-blur-[2px] group-hover/locked:ring-2 group-hover/locked:ring-amber-500/50"
                              onClick={() => onLockedCaseClick(caseData)}
                            >
                              <div className="flex -rotate-6 items-center rounded-full bg-white/95 px-4 py-2 shadow-lg transition-all duration-200 group-hover/locked:rotate-0 group-hover/locked:scale-105 group-hover/locked:bg-amber-50">
                                <Lock className="w-4 h-4 mr-2 text-amber-700" />
                                <span className="font-detective text-amber-900">
                                  {t('license.unlockCase')}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
