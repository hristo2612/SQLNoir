"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthModal } from "@/components/auth/AuthModal";
import { supabase } from "@/lib/supabase";
import { Shield, LogIn, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

type Status = "idle" | "busy" | "success" | "notFound" | "error";

export default function RestorePurchasePage() {
  const t = useTranslations("restore");
  const tNav = useTranslations("nav");

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) setEmail(session.user.email);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) setEmail((cur) => cur || session.user.email!);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !email.trim()) return;
    setStatus("busy");
    try {
      const token = (await supabase.auth.getSession()).data.session
        ?.access_token;
      const res = await fetch("/api/claim-license", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        return;
      }
      // Email-mode returns { claimed }. >0 (or already licensed) means access is
      // now granted; 0 means nothing matched that email.
      setStatus(data.alreadyLicensed || data.claimed > 0 ? "success" : "notFound");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <Navbar
        title="SQLNoir"
        titleHref="/"
        links={[
          { label: tNav("home"), href: "/" },
          { label: tNav("cases"), href: "/cases", activeMatch: "/cases" },
          { label: tNav("journal"), href: "/blog", activeMatch: ["/blog"] },
          { label: tNav("help"), href: "/help" },
        ]}
        showShare
      />
      <main className="min-h-screen bg-amber-50/50">
        <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-800 shadow-md ring-4 ring-amber-200">
              <Shield className="h-7 w-7 text-amber-50" strokeWidth={1.75} />
            </div>
            <h1 className="mt-4 text-balance font-detective text-3xl text-amber-900">
              {t("title")}
            </h1>
            <p className="mt-3 max-w-md text-pretty leading-6 text-amber-800">
              {t("intro")}
            </p>
          </div>

          <div className="mt-8 rounded-xl border border-amber-900/15 bg-amber-50 p-5 shadow-lg sm:p-7">
            {loading ? (
              <p className="text-center text-amber-700">…</p>
            ) : !user ? (
              <div className="flex flex-col items-center gap-4 text-center">
                <p className="text-amber-800">{t("signInPrompt")}</p>
                <button
                  type="button"
                  onClick={() => setShowAuth(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-800 px-5 py-3 font-detective leading-none text-amber-50 shadow-sm transition-[background-color,box-shadow,transform] duration-200 hover:bg-amber-700 hover:shadow-md active:scale-[0.96]"
                >
                  <LogIn className="h-4 w-4 shrink-0 translate-y-[1px]" />
                  <span className="leading-none">{t("signInButton")}</span>
                </button>
              </div>
            ) : status === "success" ? (
              <div className="flex flex-col items-center gap-4 text-center">
                <CheckCircle className="h-10 w-10 text-amber-700" />
                <p className="text-pretty leading-6 text-amber-800">
                  {t("success")}
                </p>
                <button
                  type="button"
                  onClick={() => window.location.assign("/cases")}
                  className="inline-flex items-center justify-center rounded-lg bg-amber-800 px-5 py-3 font-detective leading-none text-amber-50 shadow-sm transition-[background-color,box-shadow,transform] duration-200 hover:bg-amber-700 hover:shadow-md active:scale-[0.96]"
                >
                  {t("goToCases")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="restore-email"
                    className="block font-detective text-amber-800"
                  >
                    {t("emailLabel")}
                  </label>
                  <input
                    id="restore-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("emailPlaceholder")}
                    disabled={status === "busy"}
                    className="w-full rounded-lg border border-amber-300 bg-white p-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {status === "notFound" && (
                  <p className="rounded-lg border border-amber-300 bg-amber-100/70 px-4 py-3 text-sm leading-5 text-amber-900">
                    {t("notFound")}
                  </p>
                )}
                {status === "error" && (
                  <p className="rounded border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-800">
                    {t("error")}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "busy"}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-800 px-6 py-3 font-detective leading-none text-amber-50 shadow-sm transition-[background-color,box-shadow,transform] duration-200 hover:bg-amber-700 hover:shadow-md active:scale-[0.96] ${
                    status === "busy" ? "cursor-not-allowed opacity-75" : ""
                  }`}
                >
                  <Shield className="h-4 w-4 shrink-0 translate-y-[1px]" />
                  <span className="leading-none">
                    {status === "busy" ? t("busy") : t("button")}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
        <Footer />
      </main>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
