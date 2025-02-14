import React, { useState, useCallback } from "react";
import { Book, Code, Send, Database, HelpCircle } from "lucide-react";
import { CaseBrief } from "./case-study/CaseBrief";
import { SQLWorkspace } from "./case-study/SQLWorkspace";
import { SolutionSubmission } from "./case-study/SolutionSubmission";
import { DatabaseSchema } from "./case-study/DatabaseSchema";
import { HintsAndTips } from "./case-study/HintsAndTips";
import type { Case } from "../types";

const tabs = [
  { id: "brief", label: "Case Brief", icon: Book },
  { id: "workspace", label: "SQL Workspace", icon: Code },
  { id: "submission", label: "Solution", icon: Send },
  { id: "schema", label: "Schema", icon: Database },
  { id: "hints", label: "Hints & Tips", icon: HelpCircle },
];

interface CaseStudyProps {
  caseData: Case;
  onSolve: () => void;
}

export function CaseStudy({ caseData, onSolve }: CaseStudyProps) {
  const [activeTab, setActiveTab] = useState("brief");

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
      if (event.key === "Tab") {
        event.preventDefault();
        const nextIndex = event.shiftKey
          ? (currentIndex - 1 + tabs.length) % tabs.length
          : (currentIndex + 1) % tabs.length;
        setActiveTab(tabs[nextIndex].id);
      }
    },
    [activeTab]
  );

  return (
    <div
      className="min-h-screen bg-amber-50/50 p-4 md:p-8"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="max-w-7xl mx-auto bg-amber-50 rounded-lg shadow-lg border border-amber-900/10">
        <div className="border-b border-amber-900/10">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center px-6 py-4 font-detective text-sm focus:outline-none
                    ${isActive
                      ? "bg-amber-100 text-amber-900 border-b-2 border-amber-900"
                      : "text-amber-700 hover:bg-amber-100/50"
                    }
                  `}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "brief" && <CaseBrief caseData={caseData} />}
          {activeTab === "workspace" && <SQLWorkspace caseId={caseData.id} />}
          {activeTab === "submission" && (
            <SolutionSubmission caseData={caseData} onSolve={onSolve} />
          )}
          {activeTab === "schema" && <DatabaseSchema caseId={caseData.id} />}
          {activeTab === "hints" && <HintsAndTips />}
        </div>
      </div>
    </div>
  );
}
