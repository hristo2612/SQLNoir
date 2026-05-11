"use client";

import React, { useEffect, useState } from "react";
import { Send, CheckCircle, XCircle, Loader2, Share2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import type { Case } from "../../types";
import { SharePopup } from "../SharePopup";
import { Paywall } from "../Paywall";
import { track } from "@vercel/analytics/react";
import { trackCaseCompleted, trackCaseAbandoned } from "../../lib/posthog-events";
import { posthog } from "../../lib/posthog";
import { useTranslations, useLocale } from "next-intl";
import { isCaseFree } from "../../lib/license";

interface SolutionSubmissionProps {
  caseData: Case;
  onSolve: () => void;
  caseStartTime?: number;
}

export function SolutionSubmission({
  caseData,
  onSolve,
  caseStartTime,
}: SolutionSubmissionProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null); // Storing user data if logged in for conditional rendering XP reward message
  const [attempts, setAttempts] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareContext, setShareContext] = useState("case-solved");
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [solutionExplanation, setSolutionExplanation] = useState(caseData.solution.explanation);
  const [solutionSuccessMessage, setSolutionSuccessMessage] = useState(caseData.solution.successMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const attemptsNext = attempts + 1;
    setAttempts(attemptsNext);

    try {
      // For non-free cases, verify server-side; for free cases, check locally
      let isAnswerCorrect: boolean;
      let serverExplanation: string | undefined;
      let serverSuccessMessage: string | undefined;

      if (!isCaseFree(caseData)) {
        // Server-side verification for paid cases
        const session = supabase ? await supabase.auth.getSession() : null;
        const token = session?.data?.session?.access_token;

        const res = await fetch("/api/check-solution", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ caseId: caseData.id, answer: answer.trim(), locale }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to verify solution");

        isAnswerCorrect = data.correct;
        serverExplanation = data.explanation;
        serverSuccessMessage = data.successMessage;
      } else {
        isAnswerCorrect =
          answer.trim().toLowerCase() === caseData.solution.answer.toLowerCase();
      }

      if (isAnswerCorrect) {
        const user = supabase ? (await supabase.auth.getUser()).data.user : null;

        if (user && supabase) {
          // Get current user info to check if case was already solved
          const { data: userInfo, error: fetchError } = await supabase
            .from("user_info")
            .select("completed_cases")
            .eq("id", user.id)
            .single();

          if (fetchError) throw fetchError;

          const completedCases = Array.isArray(userInfo?.completed_cases)
            ? userInfo.completed_cases
            : [];

          // Only update if case hasn't been solved before
          if (!completedCases.includes(caseData.id)) {
            completedCases.push(caseData.id);

            // Use SQL's addition operator to increment XP
            const { error: updateError } = await supabase.rpc(
              "increment_user_xp",
              {
                user_id: user.id,
                xp_amount: caseData.xpReward,
                case_id: caseData.id,
                cases_array: completedCases,
              }
            );

            if (updateError) throw updateError;
          }
        }
      }

      // Update explanation/successMessage from server response for paid cases
      if (isAnswerCorrect && serverExplanation) {
        setSolutionExplanation(serverExplanation);
      }
      if (isAnswerCorrect && serverSuccessMessage) {
        setSolutionSuccessMessage(serverSuccessMessage);
      }

      setIsCorrect(isAnswerCorrect);
      setSubmitted(true);

      if (isAnswerCorrect) {
        onSolve();
        track("case_solve_success", {
          case_slug: caseData.id,
          title: caseData.title,
          difficulty: caseData.difficulty,
          category: caseData.category,
          xp_reward: caseData.xpReward,
          attempts: attemptsNext,
          auth: Boolean(user),
        });
        const timeSpent = caseStartTime ? Math.round((Date.now() - caseStartTime) / 1000) : 0;
        trackCaseCompleted({
          case_id: caseData.id,
          time_spent_seconds: timeSpent,
          query_count: attemptsNext,
        });

        // Show paywall based on A/B test placement (only when monetization is enabled)
        if (process.env.NEXT_PUBLIC_ENABLE_MONETIZATION === "1") {
          const placement = posthog.getFeatureFlag("paywall-placement");
          const triggerAfterCase1 = placement === "after-case-1" && caseData.id === "case-001";
          const triggerAfterCase2 = placement !== "after-case-1" && caseData.id === "case-002";
          if (triggerAfterCase1 || triggerAfterCase2) {
            setTimeout(() => setIsPaywallOpen(true), 1500);
          }
        }
      } else {
        track("case_solve_failure", {
          case_slug: caseData.id,
          attempts: attemptsNext,
          auth: Boolean(user),
        });
        trackCaseAbandoned({
          case_id: caseData.id,
          progress_percentage: 0,
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while updating progress"
      );
      console.error("Error updating solved cases:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Storing the user data in state if user is logged in
  // This will allow us to show the XP reward message conditionally
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const showSuccess = submitted && isCorrect;
  const showIncorrect = submitted && !isCorrect;

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6 space-y-4">
          <div className="flex flex-col items-start justify-center gap-3">
            <div className="flex items-center justify-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <h3 className="font-detective text-2xl text-green-900">
                {t('solution.caseSolved')}
              </h3>
            </div>
            <p className="text-green-800 mt-1">
              {solutionSuccessMessage}
            </p>
          </div>

          <div className="pt-4 border-t border-green-200">
            <h4 className="font-detective text-lg text-green-900 mb-2">
              {t('solution.explanation')}
            </h4>
            <p className="text-green-800 leading-relaxed">
              {solutionExplanation}
            </p>
          </div>

          {!user && (
            <div className="bg-white border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 text-sm font-medium">
                {t('solution.saveXpNote')}
              </p>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3 sm:flex sm:items-center sm:justify-between sm:space-y-0 gap-4">
            <div>
              <p className="font-detective text-amber-900">
                {t('solution.enjoyedMystery')}
              </p>
              <p className="text-amber-700 text-sm">
                {t('solution.shareMessage')}
              </p>
            </div>
            <div className="flex sm:block">
              <button
                type="button"
                onClick={() => {
                  setShareContext("case-solved");
                  track("share_open", { context: "case-solved", case_slug: caseData.id });
                  setIsShareOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-700 text-amber-50 hover:bg-amber-600 transition-colors duration-200 text-sm sm:text-base whitespace-nowrap"
              >
                <Share2 className="w-4 h-4" />
                <span>{t('solution.shareSqlnoir')}</span>
              </button>
            </div>
          </div>
        </div>
        <SharePopup
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          context={shareContext}
        />
        <Paywall
          isOpen={isPaywallOpen}
          onClose={() => setIsPaywallOpen(false)}
          caseSlug={caseData.id}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-amber-50 p-4 sm:p-6 rounded-xl border border-amber-900/10 space-y-4">
        <h3 className="font-detective text-2xl text-amber-900">
          {t('solution.submitFindings')}
        </h3>
        {showIncorrect ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-5 space-y-3">
            <div className="flex items-start gap-3">
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h4 className="font-detective text-xl text-red-800">
                  {t('solution.notQuiteRight')}
                </h4>
                <p className="text-red-700 mt-1">
                  {t('solution.tryAgainMessage')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="text-red-700 hover:text-red-800 font-detective"
            >
              {t('solution.tryAgain')}
            </button>
          </div>
        ) : (
          <p className="text-amber-700">
            {t('solution.submitDescription')}
          </p>
        )}

        {!showIncorrect && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-detective text-amber-800 mb-2">
                {t('solution.yourAnswer')}
              </label>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full bg-white border border-amber-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder={t('solution.enterAnswer')}
                disabled={isLoading}
              />
              <p className="mt-2 text-sm text-amber-700">
                {t('solution.answerHint')}
              </p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  bg-amber-700 hover:bg-amber-600 text-amber-100 px-6 py-2 rounded-lg
                  flex items-center font-detective transition-colors
                  ${isLoading ? "opacity-75 cursor-not-allowed" : ""}
                `}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('solution.submitting')}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {t('solution.submitSolution')}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
