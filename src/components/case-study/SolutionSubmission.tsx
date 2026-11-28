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
import { getLocalProgress, recordLocalSolve } from "../../lib/local-progress";
import { withTimeout } from "../../lib/request-timeout";
import { getPendingSolves, queuePendingSolve } from "../../lib/pending-progress";

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
  const caseId = caseData.id;
  const isFree = isCaseFree(caseData);
  const defaultAnswer = caseData.solution.answer;
  const defaultExplanation = caseData.solution.explanation;
  const defaultSuccessMessage = caseData.solution.successMessage;

  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [alreadySolved, setAlreadySolved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null); // Storing user data if logged in for conditional rendering XP reward message
  const [hasLicense, setHasLicense] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [solvedAnswer, setSolvedAnswer] = useState(defaultAnswer);
  const [solutionExplanation, setSolutionExplanation] = useState(defaultExplanation);
  const [solutionSuccessMessage, setSolutionSuccessMessage] = useState(defaultSuccessMessage);
  const submittingRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current || alreadySolved) return;
    submittingRef.current = true;
    setIsLoading(true);
    setError(null);
    const attemptsNext = attempts + 1;
    setAttempts(attemptsNext);

    try {
      // For non-free cases, verify server-side; for free cases, check locally
      let isAnswerCorrect: boolean;
      let solvingUserId: string | null = user?.id ?? null;
      let serverExplanation: string | undefined;
      let serverSuccessMessage: string | undefined;

      if (!isCaseFree(caseData)) {
        // Server-side verification for paid cases
        const session = supabase ? await withTimeout(supabase.auth.getSession()) : null;
        const token = session?.data?.session?.access_token;
        solvingUserId = session?.data?.session?.user.id ?? null;

        const res = await fetch("/api/check-solution", {
          signal: AbortSignal.timeout(10_000),
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
        if (solvingUserId) {
          // A document unload destroys promises. Retain the account-owned solve
          // before success renders; the global worker replays it after reload.
          if (!queuePendingSolve(solvingUserId, { caseId: caseData.id, answer: answer.trim(), locale })) {
            setError(t('solution.progressError'));
            return;
          }
        } else if (isCaseFree(caseData)) {
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
      if (isAnswerCorrect) {
        setSolvedAnswer(answer.trim());
      }

      setIsCorrect(isAnswerCorrect);
      setSubmitted(true);

      if (isAnswerCorrect) {
        onSolve();
        try {
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
        } catch {
          // Best-effort analytics must never interrupt submission flow.
        }
      } else {
        try {
          track("case_solve_failure", {
            case_slug: caseData.id,
            attempts: attemptsNext,
            auth: Boolean(user),
          });
          trackCaseAbandoned({
            case_id: caseData.id,
            progress_percentage: 0,
          });
        } catch {
          // Best-effort analytics must never interrupt submission flow.
        }
      }
    } catch (err) {
      setError(
        t('solution.verificationError')
      );
      console.error("Error updating solved cases:", err);
    } finally {
      submittingRef.current = false;
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setAnswer("");
    setSubmitted(false);
    setIsCorrect(false);
    setError(null);
    setAttempts(0);
    setAlreadySolved(false);
    setSolvedAnswer(defaultAnswer);
    setSolutionExplanation(defaultExplanation);
    setSolutionSuccessMessage(defaultSuccessMessage);
  }, [caseId, defaultAnswer, defaultExplanation, defaultSuccessMessage]);

  // Load user entitlement and check whether this case is already solved so
  // returning detectives see the solved status instead of a fresh submit form.
  useEffect(() => {
    const isLocallySolvedFreeCase = () =>
      isFree && getLocalProgress().solvedCaseIds.includes(caseId);

    if (!supabase) {
      setAlreadySolved(isLocallySolvedFreeCase());
      setSolvedAnswer(defaultAnswer);
      return;
    }

    const client = supabase;
    let generation = 0;
    let activeUserId: string | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      const revision = ++generation;
      clearTimeout(timer);
      controller?.abort();

      const nextUser = session?.user ?? null;
      const nextUserId = nextUser?.id ?? null;
      const userChanged = nextUserId !== activeUserId;
      activeUserId = nextUserId;

      setUser(nextUser);

      if (!nextUser) {
        setHasLicense(false);
        if (userChanged) {
          setSubmitted(false);
          setIsCorrect(false);
          setSolutionExplanation(defaultExplanation);
          setSolutionSuccessMessage(defaultSuccessMessage);
        }
        setAlreadySolved(isLocallySolvedFreeCase());
        setSolvedAnswer(defaultAnswer);
        return;
      }

      if (userChanged) {
        setHasLicense(false);
        setSubmitted(false);
        setIsCorrect(false);
        setSolutionExplanation(defaultExplanation);
        setSolutionSuccessMessage(defaultSuccessMessage);
      }

      const pendingSolve = getPendingSolves(nextUser.id).find((s) => s.caseId === caseId);
      if (pendingSolve) {
        setAlreadySolved(true);
        setSolvedAnswer(pendingSolve.answer || defaultAnswer);
      } else if (userChanged) {
        setAlreadySolved(false);
        setSolvedAnswer(defaultAnswer);
      }

      const accessToken = session?.access_token;
      controller = new AbortController();
      const signal = controller.signal;

      timer = setTimeout(() => {
        void (async () => {
          const { data: info } = await withTimeout(
            client
              .from("user_info")
              .select("has_license, completed_cases")
              .eq("id", nextUser.id)
              .single(),
          );
          if (revision !== generation || signal.aborted) return;

          setHasLicense(Boolean(info?.has_license));

          const completedInDb =
            Array.isArray(info?.completed_cases) &&
            info.completed_cases.includes(caseId);
          const pendingNow = getPendingSolves(nextUser.id).find(
            (s) => s.caseId === caseId,
          );
          const isCompleted = completedInDb || Boolean(pendingNow);

          setAlreadySolved(isCompleted);
          if (pendingNow?.answer) {
            setSolvedAnswer(pendingNow.answer);
          }

          if (completedInDb && (!isFree || !defaultAnswer || !defaultExplanation) && accessToken) {
            const res = await withTimeout(
              fetch(
                `/api/check-solution?caseId=${encodeURIComponent(caseId)}&locale=${encodeURIComponent(locale)}`,
                {
                  method: "GET",
                  signal,
                  headers: { Authorization: `Bearer ${accessToken}` },
                },
              ),
            );
            if (revision !== generation || signal.aborted || !res.ok) return;
            const data = await res.json();
            if (revision !== generation || signal.aborted || !data?.solved) return;
            if (data.answer) setSolvedAnswer(data.answer);
            if (data.explanation) setSolutionExplanation(data.explanation);
            if (data.successMessage) setSolutionSuccessMessage(data.successMessage);
          }
        })().catch(() => {});
      }, 0);
    });

    return () => {
      generation++;
      clearTimeout(timer);
      controller?.abort();
      subscription.unsubscribe();
    };
  }, [caseId, isFree, locale, defaultAnswer, defaultExplanation, defaultSuccessMessage]);

  const showFreshSuccess = submitted && isCorrect;
  const showSolvedView = showFreshSuccess || alreadySolved;
  const isReopenedSolve = alreadySolved && !showFreshSuccess;
  const displayAnswer = solvedAnswer || defaultAnswer;
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
    if (!showFreshSuccess) return;
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
  }, [showFreshSuccess]);

  if (showSolvedView) {
    return (
      <div ref={resultRef} className="max-w-2xl mx-auto scroll-mt-28">
        <section className={`${showFreshSuccess ? "animate-card-reveal " : ""}rounded-xl border border-amber-900/15 bg-amber-50 shadow-lg`}>
          <div className="space-y-5 p-5 sm:p-7">
            {/* Single wax-seal badge: the one signature element */}
            <div className="flex flex-col items-center text-center">
              <div className={`${showFreshSuccess ? "animate-badge-pop " : ""}flex h-16 w-16 items-center justify-center rounded-full bg-amber-800 shadow-md ring-4 ring-amber-200`}>
                <ShieldCheck
                  className="h-8 w-8 text-amber-50"
                  strokeWidth={1.75}
                />
              </div>
              <p className="mt-3 font-detective text-[11px] uppercase tracking-[0.3em] text-amber-700">
                {t('solution.caseClosedStamp')}
              </p>
              <h3 className="text-balance font-detective text-2xl leading-tight text-amber-900 sm:text-3xl">
                {isReopenedSolve ? t('solution.alreadySolved') : t('solution.caseSolved')}
              </h3>
              {(solutionSuccessMessage || isReopenedSolve) && (
                <p className="mt-2 max-w-md text-pretty text-sm leading-6 text-amber-800/90">
                  {solutionSuccessMessage || t('solution.alreadySolvedDescription')}
                </p>
              )}
              <span className="mt-3 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 font-detective text-sm font-bold tabular-nums text-amber-900">
                {isReopenedSolve
                  ? t('solution.xpEarned', { xp: caseData.xpReward })
                  : `+${caseData.xpReward} XP`}
              </span>
            </div>

            {displayAnswer && (
              <div className="rounded-lg border border-amber-900/10 bg-white/60 p-4">
                <h4 className="mb-1.5 font-detective text-base text-amber-900">
                  {t('solution.submittedAnswer')}
                </h4>
                <p className="font-mono text-sm text-amber-900">
                  {displayAnswer}
                </p>
              </div>
            )}

            {/* Explanation */}
            {solutionExplanation && (
              <div className="rounded-lg border border-amber-900/10 bg-white/60 p-4">
                <h4 className="mb-1.5 font-detective text-base text-amber-900">
                  {t('solution.explanation')}
                </h4>
                <p className="leading-7 text-amber-800">
                  {solutionExplanation}
                </p>
              </div>
            )}

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
                  <Shield className="h-4 w-4 shrink-0 translate-y-[1px]" />
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
                onClick={() => {
                  setSubmitted(false);
                  setError(null);
                }}
                className="inline-flex items-center justify-center rounded-lg bg-amber-800 px-5 py-2.5 font-detective leading-none text-amber-50 shadow-sm transition-[background-color,box-shadow,transform] duration-200 hover:bg-amber-700 hover:shadow-md active:scale-[0.96]"
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
                  className={`inline-flex items-center justify-center gap-2 rounded-lg bg-amber-700 px-6 py-3 font-detective leading-none text-amber-100 shadow-sm transition-[background-color,box-shadow,transform] duration-200 hover:bg-amber-600 hover:shadow-md active:scale-[0.96] ${
                    isLoading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                      <span className="leading-none">{t('solution.submitting')}</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 shrink-0 translate-y-[1px]" />
                      <span className="leading-none">{t('solution.submitSolution')}</span>
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
