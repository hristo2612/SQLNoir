"use client";

import { CaseFile } from "./CaseFile";
import { Lock } from "lucide-react";
import { cases, categories } from "../cases";
import { GetLicenseButton } from "./GetLicenseButton";
import { isCategoryLocked } from "@/lib/license";
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
  const currentXP = userInfo?.xp || 0;
  const solvedCases = userInfo?.completed_cases || [];

  return (
    <div className="min-h-screen bg-amber-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-detective text-3xl text-amber-900 leading-none">
            {t('cases.caseFiles')}
          </h1>
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
                        <div key={caseData.id} className="relative">
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
                            <div className="absolute inset-0 bg-amber-900/10 backdrop-blur-[1px] rounded-lg flex items-center justify-center cursor-pointer"
                              onClick={() => onLockedCaseClick(caseData)}
                            >
                              <div className="bg-amber-100 px-4 py-2 rounded-full flex items-center shadow-lg transform -rotate-12">
                                <Lock className="w-4 h-4 mr-2 text-amber-700" />
                                <span className="font-detective text-amber-900">
                                  {t('common.locked')}
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
