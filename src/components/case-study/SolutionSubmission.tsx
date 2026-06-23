"use client";

import React, { useEffect, useState } from "react";
import { Send, CheckCircle, XCircle, Loader2, Shield } from "lucide-react";
import { supabase } from "../../lib/supabase";
import type { Case } from "../../types";
import { Paywall } from "../Paywall";
import { track } from "@vercel/analytics/react";
import { trackCaseCompleted, trackCaseAbandoned } from "../../lib/posthog-events";
import { useTranslations, useLocale } from "next-intl";
import { isCaseFree } from "../../lib/license";
import { recordLocalSolve } from "../../lib/local-progress";
import { getPriceForLocale } from "../../lib/ppp-prices";

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
  const [hasLicense, setHasLicense] = useState(false);
  const [attempts, setAttempts] = useState(0);
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
        const solvedUser = supabase
          ? (await supabase.auth.getUser()).data.user
          : null;

        if (solvedUser && supabase) {
          // The hardened RPC looks up the xp reward server-side and is
          // idempotent (dedup + append handled in SQL), so no client-side
          // completed_cases pre-fetch is needed and no client xp is trusted.
          const { error: updateError } = await supabase.rpc(
            "increment_user_xp",
            {
              user_id: solvedUser.id,
              case_id: caseData.id,
            }
          );

          if (updateError) throw updateError;
        } else if (isCaseFree(caseData)) {
          // Anonymous visitor solved a free case - persist locally so it can be
          // migrated onto their account when they sign in.
          recordLocalSolve(caseData.id);
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
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user && supabase) {
        const { data: info } = await supabase
          .from("user_info")
          .select("has_license")
          .eq("id", data.user.id)
          .single();
        setHasLicense(Boolean(info?.has_license));
      }
    });
  }, []);

  const showSuccess = submitted && isCorrect;
  const showIncorrect = submitted && !isCorrect;

  const monetizationEnabled =
    process.env.NEXT_PUBLIC_ENABLE_MONETIZATION === "1";
  const showPurchaseCta =
    monetizationEnabled && isCaseFree(caseData) && !hasLicense;
  const localizedPrice = getPriceForLocale(locale).display;

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <section className="overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-sm">
          <div className="flex items-start gap-3 border-b border-emerald-100 bg-emerald-50 px-5 py-4 sm:px-6">
            <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-emerald-600" />
            <div className="space-y-1">
              <h3 className="font-detective text-2xl text-emerald-950">
                {t('solution.caseSolved')}
              </h3>
              <p className="text-sm leading-6 text-emerald-900">
                {solutionSuccessMessage}
              </p>
            </div>
          </div>

          <div className="space-y-5 px-5 py-5 sm:px-6">
            <div className="space-y-2">
              <h4 className="font-detective text-lg text-amber-950">
                {t('solution.explanation')}
              </h4>
              <p className="leading-7 text-amber-900">
                {solutionExplanation}
              </p>
            </div>

            {showPurchaseCta && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:gap-5">
                <div className="space-y-1">
                  <p className="font-detective text-lg text-amber-950">
                    {t('solution.fullArchiveTitle')}
                  </p>
                  <p className="text-sm leading-6 text-amber-800">
                    {t('solution.fullArchiveDesc')}
                  </p>
                  {!user && (
                    <p className="text-xs text-amber-700">
                      {t('solution.saveXpNote')}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsPaywallOpen(true)}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-800 px-5 py-3 font-detective text-amber-50 shadow-sm transition-colors duration-200 hover:bg-amber-700 sm:mt-0 sm:w-auto"
                >
                  <Shield className="h-4 w-4" />
                  <span>{t('solution.unlockAllCasesCta')} - {localizedPrice}</span>
                </button>
              </div>
            )}
          </div>
        </section>
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
