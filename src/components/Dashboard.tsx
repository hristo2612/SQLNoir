import { CaseFile } from "./CaseFile";
import { Lock } from "lucide-react";
import { cases, categories } from "../cases";

interface DashboardProps {
  onCaseSelect: (caseData: any) => void;
  userInfo: any;
}

export function Dashboard({
  onCaseSelect,
  userInfo,
}: DashboardProps) {
  const currentXP = userInfo?.xp || 0;
  const solvedCases = userInfo?.completed_cases || [];

  const isCategoryLocked = (requiredXP: number) => currentXP < requiredXP;

  return (
    <div className="min-h-screen bg-amber-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="font-detective text-3xl text-amber-900 leading-none">
            Case Files
          </h2>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => {
              const isLocked = isCategoryLocked(category.requiredXP);
              const categoryClass = isLocked ? "opacity-75" : "";

              return (
                <div key={category.id} className={`space-y-4 ${categoryClass}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <category.icon className="w-5 h-5 text-amber-700" />
                      <h3 className="font-detective text-xl text-amber-800">
                        {category.title}
                      </h3>
                    </div>
                    {isLocked && (
                      <div className="flex items-center text-amber-600 text-sm">
                        <Lock className="w-4 h-4 mr-1" />
                        <span>{category.requiredXP} XP required</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {cases[category.id as keyof typeof cases].map(
                      (caseData) => (
                        <div key={caseData.id} className="relative">
                          <CaseFile
                            caseData={caseData}
                            onClick={() => !isLocked && onCaseSelect(caseData)}
                            isSolved={solvedCases.includes(caseData.id)}
                          />
                          {isLocked && (
                            <div className="absolute inset-0 bg-amber-900/10 backdrop-blur-[1px] rounded-lg flex items-center justify-center">
                              <div className="bg-amber-100 px-4 py-2 rounded-full flex items-center shadow-lg transform -rotate-12">
                                <Lock className="w-4 h-4 mr-2 text-amber-700" />
                                <span className="font-detective text-amber-900">
                                  Locked
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
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-1 px-4 pt-20">
              <p className="text-lg font-detective text-amber-800">
                More coming soon...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
