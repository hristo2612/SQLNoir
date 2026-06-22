"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (user && !claimed && stripeSessionId) {
      claimLicense();
    }
  }, [user, claimed, stripeSessionId]);

  const claimLicense = async () => {
    if (!stripeSessionId) return;
    setClaiming(true);
    try {
      const res = await fetch("/api/claim-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stripeSessionId }),
      });
      const data = await res.json();
      if (data.success || data.error === "No pending license found for this purchase") {
        setClaimed(true);
      }
    } catch {
      setClaimed(true);
    } finally {
      setClaiming(false);
    }
  };

  const showSignInPrompt = !loading && !user;
  const showClaimingState = user && claiming;
  const showSuccess = user && (claimed || !claiming);

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
