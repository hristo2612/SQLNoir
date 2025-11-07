import { useState } from "react";
import { CaseFile } from "./CaseFile";
import { Lock, Github, Share2, Coffee } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import { UserMenu } from "./auth/UserMenu";
import { cases, categories } from "../cases";
import { SharePopup } from "./SharePopup";

interface DashboardProps {
  onCaseSelect: (caseData: any) => void;
  userInfo: any;
}

export function Dashboard({ onCaseSelect, userInfo }: DashboardProps) {
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const currentXP = userInfo?.xp || 0;
  const solvedCases = userInfo?.completed_cases || [];

  const isCategoryLocked = (requiredXP: number) => currentXP < requiredXP;

  return (
    <div className="min-h-screen bg-amber-50/50">
      <SharePopup
        isOpen={isSharePopupOpen}
        onClose={() => setIsSharePopupOpen(false)}
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8">
          <h2 className="font-detective text-3xl text-amber-900">Case Files</h2>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="bg-amber-100 px-3 py-2 rounded-lg">
              <span className="font-mono text-amber-900 text-sm sm:text-base">
                XP: {currentXP}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
              <UserMenu user={userInfo} onSignOut={() => {}} />
              <a
                href="https://github.com/hristo2612/SQLNoir"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 
                         text-amber-900 transition-colors duration-200"
                title="Star on GitHub"
              >
                <Github className="w-5 h-5" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
              <a
                href="https://www.buymeacoffee.com/hristobogoev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 
                         text-amber-900 transition-colors duration-200"
                title="Buy me a coffee"
              >
                <Coffee className="w-5 h-5" />
                <span className="hidden sm:inline">Buy Coffee</span>
              </a>
              <a
                href="https://discord.gg/rMQRwrRYHH"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 
                         text-amber-900 transition-colors duration-200"
                title="Join Discord"
              >
                <FaDiscord className="w-5 h-5" />
                <span className="hidden sm:inline">Discord</span>
              </a>
              <button
                onClick={() => setIsSharePopupOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 
                         text-amber-900 transition-colors duration-200"
                title="Share SQL Noir"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
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
