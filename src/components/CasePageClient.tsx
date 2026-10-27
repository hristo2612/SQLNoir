"use client";

import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { CaseSolver } from "./CaseSolver";
import { PaywallModal } from "./PaywallModal";
import { supabase } from "@/lib/supabase";
import { isCaseFree, getUserHasLicense } from "@/lib/license";
import { track } from "@vercel/analytics/react";
import { trackCaseStarted } from "@/lib/posthog-events";
import { useTranslations } from "next-intl";
import type { Case } from "@/types";

interface CasePageClientProps {
  caseData: Case;
}

export function CasePageClient({ caseData }: CasePageClientProps) {
  const router = useRouter();
  const t = useTranslations("license");
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(!isCaseFree(caseData));
  const [showPaywall, setShowPaywall] = useState(false);
  const [credentialError, setCredentialError] = useState(false);
  const [checkAttempt, setCheckAttempt] = useState(0);
  const [caseStartTime] = useState(() => Date.now());

  const hasLicense = getUserHasLicense(userInfo);
  const needsLicense = !isCaseFree(caseData);

  useEffect(() => {
    track("case_view", {
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

  useEffect(() => {
    if (!needsLicense || !supabase) {
      setLoading(false);
      return;
    }
    const client = supabase;
    let generation = 0;
    let activeUserId: string | null = null;
    let work: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;
    let deadline: ReturnType<typeof setTimeout>;
    const fail = () => {
      clearTimeout(deadline);
      generation++;
      controller?.abort();
      setUserInfo(null);
      setCredentialError(true);
      setLoading(false);
    };
    setLoading(true);
    setCredentialError(false);
    // Also covers an initial auth event that never arrives.
    deadline = setTimeout(fail, 10_000);
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      const revision = ++generation;
      clearTimeout(work);
      clearTimeout(deadline);
      controller?.abort();
      const currentUser = session?.user ?? null;
      const sameUser = currentUser?.id === activeUserId;
      activeUserId = currentUser?.id ?? null;
      if (!sameUser) setUserInfo(null);
      setCredentialError(false);
      if (!currentUser) {
        setLoading(false);
        return;
      }
      // Keep an open investigation mounted during same-user tab refocus.
      if (!sameUser) setLoading(true);
      controller = new AbortController();
      const signal = controller.signal;
      deadline = setTimeout(fail, 10_000);
      // Auth callbacks must return before a query asks the SDK for a session.
      work = setTimeout(() => {
        void (async () => {
          try {
            const { data, error } = await client.from("user_info")
              .select("*").eq("id", currentUser.id).abortSignal(signal).single();
            if (revision !== generation) return;
            if (error) throw error;
            setUserInfo(data);
            setLoading(false);
          } catch {
            if (revision === generation) fail();
          } finally {
            if (revision === generation) clearTimeout(deadline);
          }
        })();
      }, 0);
    });
    return () => {
      generation++;
      clearTimeout(work);
      clearTimeout(deadline);
      controller?.abort();
      subscription.unsubscribe();
    };
  }, [needsLicense, checkAttempt]);

  if (credentialError) {
    return (
      <div className="min-h-screen bg-amber-50/50 flex items-center justify-center px-4">
        <div role="alert" className="text-center space-y-4 text-amber-900">
          <p>{t('credentialError')}</p>
          <button onClick={() => setCheckAttempt(value => value + 1)}
            className="rounded-lg bg-amber-800 px-6 py-3 text-amber-50 font-detective">
            {t('retryCheck')}
          </button>
        </div>
      </div>
    );
  }

  // Show loading while checking license for locked cases
  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-300 border-t-amber-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-detective text-amber-800">
            {t('checkingCredentials')}
          </p>
        </div>
      </div>
    );
  }

  // If case requires license and user doesn't have one, show blocked state
  if (needsLicense && !hasLicense) {
    return (
      <div className="min-h-screen bg-amber-50/50 flex items-center justify-center px-4">
        <div className="paper-texture p-8 rounded-xl shadow-xl border border-amber-900/20 max-w-md text-center">
          <h2 className="font-detective text-2xl text-amber-900 mb-3">
            {t('caseClassified')}
          </h2>
          <p className="text-amber-800/80 mb-6 text-sm">
            {t('caseClassifiedDesc')}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowPaywall(true)}
              className="py-3 px-6 rounded-lg font-detective text-amber-50
                       bg-amber-800 hover:bg-amber-700 transition-colors
                       border-2 border-amber-900/50 shadow-lg"
            >
              {t('getLicense')}
            </button>
            <button
              onClick={() => router.push("/cases")}
              className="py-2 text-amber-700/70 hover:text-amber-800 text-sm font-detective transition-colors"
            >
              {t('backToCaseFiles')}
            </button>
          </div>
        </div>
        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          caseId={caseData.id}
          triggerLocation="case_page"
        />
      </div>
    );
  }

  return (
    <CaseSolver
      caseData={caseData}
      onBack={() => router.push("/cases")}
      onSolve={() => router.refresh()}
      caseStartTime={caseStartTime}
    />
  );
}
