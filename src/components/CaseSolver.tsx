"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Book,
  Code,
  Send,
  Database,
  ArrowLeft,
  PenLine,
  Columns,
  LayoutGrid,
} from "lucide-react";
import { CaseBrief } from "./case-study/CaseBrief";
import { SQLWorkspace } from "./case-study/SQLWorkspace";
import { SolutionSubmission } from "./case-study/SolutionSubmission";
import { DatabaseSchema } from "./case-study/DatabaseSchema";
import { CaseNotes } from "./case-study/CaseNotes";
import type { Case } from "../types";
import { track } from "@vercel/analytics/react";
import { trackCaseStarted } from "../lib/posthog-events";
import { useTranslations } from "next-intl";

interface CaseSolverProps {
  caseData: Case;
  onBack: () => void;
  onSolve: () => void;
  caseStartTime?: number;
}

export function CaseSolver({ caseData, onBack, onSolve, caseStartTime }: CaseSolverProps) {
  const t = useTranslations();

  const tabs = [
    { id: "brief", label: t('caseSolver.caseBrief'), icon: Book },
    { id: "workspace", label: t('caseSolver.sqlWorkspace'), icon: Code },
    { id: "schema", label: t('caseSolver.schema'), icon: Database },
    { id: "notes", label: t('caseSolver.notes'), icon: PenLine },
    { id: "submit", label: t('caseSolver.submit'), icon: Send },
  ];

  const [activeTab, setActiveTab] = useState("brief");
  const [isSolved, setIsSolved] = useState(false);
  const [isSideBySide, setIsSideBySide] = useState(false);
  const [secondaryTab, setSecondaryTab] = useState("schema");
  const [activeTabSelector, setActiveTabSelector] = useState<1 | 2>(1);

  useEffect(() => {
    track("case_start", {
      case_slug: caseData.id,
      title: caseData.title,
      difficulty: caseData.difficulty,
      category: caseData.category,
      xp_reward: caseData.xpReward,
    });
    trackCaseStarted({
      case_id: caseData.id,
      case_name: caseData.title,
      difficulty: caseData.difficulty,
    });
  }, [caseData]);

  // Function to handle side-by-side toggle
  const handleSideBySideToggle = () => {
    if (isSideBySide) {
      // When disabling side-by-side, keep only the primary tab
      setSecondaryTab("schema");
      setActiveTabSelector(1);
    }
    setIsSideBySide(!isSideBySide);
  };

  const handleCaseSolved = () => {
    setIsSolved(true);
    onSolve();
  };

  // Create all components once
  const tabComponents = useMemo(
    () => ({
      brief: <CaseBrief caseData={caseData} />,
      workspace: <SQLWorkspace caseId={caseData.id} />,
      schema: <DatabaseSchema caseId={caseData.id} />,
      notes: <CaseNotes caseId={caseData.id} />,
      submit: (
        <SolutionSubmission caseData={caseData} onSolve={handleCaseSolved} caseStartTime={caseStartTime} />
      ),
    }),
    [caseData]
  );

  // Function to handle tab switching
  const handleTabClick = (tabId: string) => {
    if (isSideBySide) {
      if (activeTabSelector === 1) {
        setActiveTab(tabId);
      } else {
        setSecondaryTab(tabId);
      }
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-amber-100 border-b border-amber-200 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="flex items-center text-amber-900 hover:text-amber-700 font-detective"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('caseSolver.back')}
          </button>
          <span className="font-mono text-amber-900 text-sm">
            Case #{caseData.id.split("-")[1]} • {caseData.xpReward} XP
          </span>
        </div>

        {/* Mobile Navigation - Always Visible */}
        <div className="border-t border-amber-200 overflow-x-auto">
          <div className="flex p-2 gap-2 w-max min-w-full justify-center lg:justify-start">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  aria-label={tab.label}
                  title={tab.label}
                  className={`
                  flex items-center px-3 py-2 rounded-lg font-detective text-sm whitespace-nowrap
                  ${
                    isActive
                      ? "bg-amber-200 text-amber-900"
                      : "bg-amber-100/50 text-amber-700 hover:bg-amber-100"
                  }
                `}
                >
                  {isActive ? (
                    <Icon className="w-4 h-4 mr-2" />
                  ) : (
                    <Icon className="w-4 h-4 lg:mr-2" />
                  )}
                  {isActive ? tab.label : ""}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-amber-900 hover:text-amber-700 font-detective"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('caseSolver.backToCases')}
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSideBySideToggle}
              className={`
                flex items-center px-3 py-1.5 rounded-lg font-detective text-sm
                ${
                  isSideBySide
                    ? "bg-amber-200 text-amber-900"
                    : "bg-amber-100/50 text-amber-700 hover:bg-amber-100"
                }
              `}
            >
              {isSideBySide ? (
                <LayoutGrid className="w-4 h-4 mr-2" />
              ) : (
                <Columns className="w-4 h-4 mr-2" />
              )}
              {isSideBySide ? t('caseSolver.stackView') : t('caseSolver.sideBySide')}
            </button>
            <div className="bg-amber-100 px-4 py-2 rounded-lg">
              <span className="font-mono text-amber-900">
                Case #{caseData.id.split("-")[1]} • {caseData.xpReward} XP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8 mt-4 lg:mt-0">
        <div className="bg-amber-50 rounded-lg shadow-lg border border-amber-900/10">
          {/* Desktop Navigation */}
          <div className="hidden lg:block border-b border-amber-900/10">
            <div className="flex items-center justify-between">
              <div className="flex">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActiveInTab1 = activeTab === tab.id;
                  const isActiveInTab2 =
                    isSideBySide && secondaryTab === tab.id;
                  const isActive = isActiveInTab1 || isActiveInTab2;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`
                        flex items-center px-6 py-4 font-detective text-sm focus:outline-none whitespace-nowrap
                        ${
                          isActive
                            ? `bg-amber-100 text-amber-900 border-b-2 ${
                                isActiveInTab1
                                  ? "border-amber-900"
                                  : "border-amber-500"
                              }`
                            : "text-amber-700 hover:bg-amber-100/50"
                        }
                      `}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tab.label}
                      {isSideBySide && isActive && (
                        <span className="ml-2 text-xs opacity-75">
                          {isActiveInTab1 ? `(${t('caseSolver.tab1')})` : `(${t('caseSolver.tab2')})`}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {isSideBySide && (
                <div className="flex items-center gap-2 bg-amber-100 rounded-lg p-1 mr-4">
                  <button
                    onClick={() => setActiveTabSelector(1)}
                    className={`px-3 py-1.5 rounded-md font-detective text-sm transition-colors ${
                      activeTabSelector === 1
                        ? "bg-amber-200 text-amber-900"
                        : "text-amber-700 hover:bg-amber-100"
                    }`}
                  >
                    {t('caseSolver.tab1')}
                  </button>
                  <button
                    onClick={() => setActiveTabSelector(2)}
                    className={`px-3 py-1.5 rounded-md font-detective text-sm transition-colors ${
                      activeTabSelector === 2
                        ? "bg-amber-200 text-amber-900"
                        : "text-amber-700 hover:bg-amber-100"
                    }`}
                  >
                    {t('caseSolver.tab2')}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tab Content */}
          <div
            className={`p-4 lg:p-6 ${
              isSideBySide ? "lg:flex lg:gap-6 overflow-hidden" : ""
            }`}
          >
            <div className={`${isSideBySide ? "lg:w-1/2 min-w-0" : ""}`}>
              {isSideBySide && (
                <div className="mb-4 text-sm font-detective text-amber-900">
                  {t('caseSolver.tab1')}
                </div>
              )}
              {Object.entries(tabComponents).map(([id, component]) => (
                <div key={id} className={activeTab === id ? "" : "hidden"}>
                  {component}
                </div>
              ))}
            </div>
            {isSideBySide && (
              <div className="hidden lg:block lg:w-1/2 min-w-0 border-l border-amber-200 pl-6">
                <div className="mb-4 text-sm font-detective text-amber-900">
                  {t('caseSolver.tab2')}
                </div>
                {Object.entries(tabComponents).map(([id, component]) => (
                  <div key={id} className={secondaryTab === id ? "" : "hidden"}>
                    {component}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
