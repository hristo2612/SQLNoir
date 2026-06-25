"use client";

import React, { useEffect, useRef, useState } from "react";
import { Send, Loader2, Shield, ShieldCheck, Fingerprint } from "lucide-react";
import confetti from "canvas-confetti";
import { supabase } from "../../lib/supabase";
import type { Case } from "../../types";
import { Paywall } from "../Paywall";
import { track } from "@vercel/analytics/react";
import { trackCaseCompleted, trackCaseAbandoned } from "../../lib/posthog-events";
import { useTranslations, useLocale } from "next-intl";
import { isCaseFree } from "../../lib/license";
import { recordLocalSolve } from "../../lib/local-progress";

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
          //
          // XP persistence must NOT gate the success render: a correct answer
          // earns the Case Solved screen + confetti even if the XP write hiccups
          // (RLS, network, a not-yet-migrated RPC). Log and continue.
          try {
            const { error: updateError } = await supabase.rpc(
              "increment_user_xp",
              {
                user_id: solvedUser.id,
                case_id: caseData.id,
              }
            );
            if (updateError) throw updateError;
          } catch (xpErr) {
            console.error("XP persistence failed (non-blocking):", xpErr);
          }
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

  // When the result renders, bring it to the top of the viewport. On mobile the
  // submit button sits below the fold, so without this the user lands mid-card
  // and has to scroll up to see the headline. scroll-mt on the cards clears the
  // sticky mobile header.
  const resultRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!submitted) return;
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    resultRef.current?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }, [submitted, isCorrect]);

  const monetizationEnabled =
    process.env.NEXT_PUBLIC_ENABLE_MONETIZATION === "1";
  const showPurchaseCta =
    monetizationEnabled && isCaseFree(caseData) && !hasLicense;

  // Fire a themed, on-brand confetti burst when the case is cracked.
  // Imperative (never in the React tree) and reduced-motion-safe.
  useEffect(() => {
    if (!showSuccess) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const colors = ["#b45309", "#78350f", "#fcd34d", "#fef3c7", "#1c1917"];
    // Two angled bursts from the lower corners...
    confetti({
      particleCount: 45,
      angle: 60,
      spread: 55,
      startVelocity: 45,
      origin: { x: 0, y: 0.9 },
      colors,
    });
    confetti({
      particleCount: 45,
      angle: 120,
      spread: 55,
      startVelocity: 45,
      origin: { x: 1, y: 0.9 },
      colors,
    });
    // ...then a short center pop a beat later.
    const popTimer = window.setTimeout(() => {
      confetti({
        particleCount: 30,
        spread: 70,
        startVelocity: 35,
        origin: { x: 0.5, y: 0.55 },
        colors,
      });
    }, 180);

    return () => window.clearTimeout(popTimer);
  }, [showSuccess]);

  if (showSuccess) {
    return (
      <div ref={resultRef} className="max-w-2xl mx-auto scroll-mt-28">
        <section className="animate-card-reveal rounded-xl border border-amber-900/15 bg-amber-50 shadow-lg">
          <div className="space-y-5 p-5 sm:p-7">
            {/* Single wax-seal badge: the one signature element */}
            <div className="flex flex-col items-center text-center">
              <div className="animate-badge-pop flex h-16 w-16 items-center justify-center rounded-full bg-amber-800 shadow-md ring-4 ring-amber-200">
                <ShieldCheck
                  className="h-8 w-8 text-amber-50"
                  strokeWidth={1.75}
                />
              </div>
              <p className="mt-3 font-detective text-[11px] uppercase tracking-[0.3em] text-amber-700">
                {t('solution.caseClosedStamp')}
              </p>
              <h3 className="text-balance font-detective text-2xl leading-tight text-amber-900 sm:text-3xl">
                {t('solution.caseSolved')}
              </h3>
              <p className="mt-2 max-w-md text-pretty text-sm leading-6 text-amber-800/90">
                {solutionSuccessMessage}
              </p>
              <span className="mt-3 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 font-detective text-sm font-bold tabular-nums text-amber-900">
                +{caseData.xpReward} XP
              </span>
            </div>

            {/* Explanation */}
            <div className="rounded-lg border border-amber-900/10 bg-white/60 p-4">
              <h4 className="mb-1.5 font-detective text-base text-amber-900">
                {t('solution.explanation')}
              </h4>
              <p className="leading-7 text-amber-800">
                {solutionExplanation}
              </p>
            </div>

            {/* Reward lands first, then the offer rises in */}
            {showPurchaseCta && (
              <div className="animate-cta-rise rounded-lg border border-amber-300 bg-amber-100/70 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
                <div className="space-y-1">
                  <p className="font-detective text-base text-amber-900">
                    {t('solution.fullArchiveTitle')}
                  </p>
                  {!user && (
                    <p className="text-xs leading-5 text-amber-700">
                      {t('solution.saveXpNote')}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsPaywallOpen(true)}
                  className="mt-3 inline-flex w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-amber-800 px-5 py-3 font-detective leading-none text-amber-50 shadow-sm transition-[background-color,transform] duration-200 hover:bg-amber-700 active:scale-[0.96] sm:mt-0 sm:w-auto"
                >
                  <Shield className="h-4 w-4 shrink-0" />
                  <span className="leading-none">
                    {t('solution.unlockAllCasesCta')}
                  </span>
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
    <div ref={resultRef} className="max-w-2xl mx-auto scroll-mt-28">
      <section className="rounded-xl border border-amber-900/15 bg-amber-50 shadow-lg">
        <div className="space-y-5 p-5 sm:p-7">
          <h3 className="font-detective text-2xl leading-tight text-amber-900 sm:text-3xl">
            {t('solution.submitFindings')}
          </h3>
          {showIncorrect ? (
            <div className="animate-shake rounded-lg border border-amber-900/15 bg-amber-100/60 p-4 sm:p-5 space-y-3">
              <div className="flex items-start gap-3">
                <Fingerprint className="w-6 h-6 text-amber-800 flex-shrink-0" />
                <div>
                  <h4 className="font-detective text-xl text-amber-900">
                    {t('solution.notQuiteRight')}
                  </h4>
                  <p className="text-amber-800 mt-1">
                    {t('solution.tryAgainMessage')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="font-detective text-amber-800 underline-offset-2 hover:text-amber-900 hover:underline"
              >
                {t('solution.tryAgain')}
              </button>
            </div>
          ) : (
            <p className="text-amber-800 leading-6">
              {t('solution.submitDescription')}
            </p>
          )}

          {!showIncorrect && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block font-detective text-amber-800">
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
                <p className="text-sm text-amber-700">
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
                    flex items-center justify-center font-detective transition-colors
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
      </section>
    </div>
  );
}
