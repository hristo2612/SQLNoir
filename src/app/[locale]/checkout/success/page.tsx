"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Navbar } from "@/components/Navbar";
import { AuthModal } from "@/components/auth/AuthModal";
import { supabase } from "@/lib/supabase";
import { CheckCircle, LogIn } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const stripeSessionId = searchParams.get("session_id");
  const t = useTranslations();
  const tCheckout = useTranslations("checkout");
  const tNav = useTranslations("nav");

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [claimed, setClaimed] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const confirmActiveLicense = useCallback(async () => {
    if (!supabase || !user) return false;
    const { data } = await supabase
      .from("user_info")
      .select("has_license")
      .eq("id", user.id)
      .single();
    return Boolean(data?.has_license);
  }, [user]);

  const claimLicense = useCallback(async () => {
    setClaiming(true);
    setClaimError(null);

    // Stripe redirects here immediately, often BEFORE the async webhook has
    // granted the license (signed-in path) or written the pending row
    // (anonymous path). So poll for up to ~14s instead of failing on the first
    // miss; only show an error once the window is exhausted.
    const MAX_ATTEMPTS = 7;
    const DELAY_MS = 2000;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        // 1. Session-id claim (anonymous purchase). Succeeds once the webhook
        //    has written the pending_licenses row for this checkout.
        if (stripeSessionId) {
          const res = await fetch("/api/claim-license", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stripeSessionId }),
          });
          const data = await res.json();
          if (data.success) {
            setClaimed(true);
            setClaiming(false);
            return;
          }
          // Email mismatch is terminal: retrying never helps, so stop and tell
          // the buyer to sign in with the email they paid with.
          if (res.status === 403) {
            setClaimError(data.error || tCheckout("activationFailed"));
            setClaiming(false);
            return;
          }
          // 404 (pending row not written yet) falls through to the grant check
          // and another attempt.
        }

        // 2. Direct grant check (signed-in purchase: the webhook sets
        //    has_license itself, no pending row; also catches an email-mode
        //    auto-claim that already ran on sign-in).
        if (await confirmActiveLicense()) {
          setClaimed(true);
          setClaiming(false);
          return;
        }
      } catch {
        // Transient network/DB hiccup: just retry.
      }

      if (attempt < MAX_ATTEMPTS) await sleep(DELAY_MS);
    }

    // Webhook is taking unusually long. Offer a manual retry (the button reruns
    // this same loop) rather than leaving the buyer stuck.
    setClaimError(tCheckout("activationFailed"));
    setClaiming(false);
  }, [confirmActiveLicense, stripeSessionId, tCheckout]);

  useEffect(() => {
    if (user && !claimed && !claiming && !claimError) {
      claimLicense();
    }
  }, [user, claimed, claiming, claimError, claimLicense]);

  const showSignInPrompt = !loading && !user;
  const showClaimingState = user && claiming;
  const showClaimError = user && claimError && !claiming;
  const showSuccess = user && claimed && !claiming;

  return (
    <>
      <Navbar
        title="SQLNoir"
        titleHref="/"
        links={[
          { label: tNav("home"), href: "/", activeMatch: "/" },
          { label: tNav("cases"), href: "/cases", activeMatch: "/cases" },
          { label: tNav("help"), href: "/help", activeMatch: "/help" },
        ]}
      />
      <main className="min-h-screen bg-amber-50/50 flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="font-detective text-3xl text-amber-900">
              {showSignInPrompt ? tCheckout("paymentReceived") : tCheckout("welcomeDetective")}
            </h1>
            <p className="text-amber-800 text-lg">
              {showSignInPrompt
                ? tCheckout("signInToActivate")
                : showClaimingState
                ? tCheckout("activatingLicense")
                : showClaimError
                ? claimError
                : tCheckout("licenseActive")}
            </p>
          </div>

          {showSignInPrompt && (
            <button
              onClick={() => setShowAuth(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-50 font-detective text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <LogIn className="w-5 h-5" />
              {tCheckout("signInButton")}
            </button>
          )}

          {showClaimingState && (
            <div className="flex justify-center">
              <div className="w-8 h-8 border-2 border-amber-300 border-t-amber-700 rounded-full animate-spin" />
            </div>
          )}

          {showClaimError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-5 space-y-4 text-left">
              <p className="font-detective text-red-900 text-lg">
                {tCheckout("activationIssue")}
              </p>
              <p className="text-red-800 text-sm">
                {tCheckout("activationIssueHelp")}
              </p>
              <button
                type="button"
                onClick={claimLicense}
                className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white font-detective transition-colors"
              >
                {tCheckout("retryActivation")}
              </button>
            </div>
          )}

          {showSuccess && (
            <>
              <div className="bg-white border border-amber-200 rounded-xl p-6 shadow-sm space-y-3">
                <p className="font-detective text-amber-900 text-lg">
                  {tCheckout("whatYouGet")}
                </p>
                <ul className="text-amber-800 text-left space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    {tCheckout("accessAllCases")}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    {tCheckout("allDifficulties")}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    {tCheckout("unlimitedPractice")}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    {tCheckout("xpTracking")}
                  </li>
                </ul>
              </div>

              <Link
                href="/cases"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-50 font-detective text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {tCheckout("openCaseFiles")}
              </Link>
            </>
          )}

          <p className="text-amber-700/60 text-xs">
            {tCheckout.rich("teamLicense", {
              a: (chunks) => (
                <a
                  href="mailto:support@sqlnoir.com"
                  className="underline hover:text-amber-800"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>

          <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
        </div>
      </main>
    </>
  );
}
