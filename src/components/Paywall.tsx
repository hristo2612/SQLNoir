"use client";

import { useEffect, useState } from "react";
import { X, Lock, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  trackPaywallShown,
  trackPaywallCtaClicked,
  trackPaywallDismissed,
  posthog,
} from "@/lib/posthog";
import { getPriceForLocale } from "@/lib/ppp-prices";

interface PaywallProps {
  isOpen: boolean;
  onClose: () => void;
  caseSlug: string;
}

export function Paywall({ isOpen, onClose, caseSlug }: PaywallProps) {
  const t = useTranslations("paywall");
  const locale = useLocale();
  const [price, setPrice] = useState(() => getPriceForLocale(locale).display);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    fetch(`/api/price?locale=${encodeURIComponent(locale)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.display) setPrice(data.display);
      })
      .catch(() => {});
  }, [isOpen, locale]);

  useEffect(() => {
    setPrice(getPriceForLocale(locale).display);
  }, [locale]);

  useEffect(() => {
    if (isOpen) {
      trackPaywallShown(caseSlug, "post_solve");
    }
  }, [isOpen, caseSlug]);

  if (!isOpen) return null;

  const handleCtaClick = async () => {
    const placementVariant = posthog.getFeatureFlag("paywall-placement");
    trackPaywallCtaClicked(caseSlug, {
      price,
      placement_variant: typeof placementVariant === "string" ? placementVariant : "default",
    });
    setLoading(true);
    try {
      posthog.capture("checkout_initiated", {
        case_id: caseSlug,
        trigger_location: "post_solve",
        price,
        locale,
      });
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale }),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert(t("somethingWentWrong"));
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    trackPaywallDismissed(caseSlug);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/65 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl">
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 z-10 rounded-full p-1 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-zinc-950 px-6 py-6 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
            <Sparkles className="h-7 w-7 text-emerald-300" />
          </div>
          <h2 className="font-detective text-2xl text-white">
            {t("title")}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-300">
            {t("subtitle")}
          </p>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
              {t("tierName")}
            </p>
            <p className="mt-1 font-detective text-4xl text-amber-950">
              {price}
            </p>
            <p className="mt-1 text-xs text-amber-700">
              {t("oneTimePayment")}
            </p>
          </div>

          <ul className="space-y-3 text-sm text-zinc-700">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 rounded-md border border-emerald-200 bg-emerald-50 p-1">
                <Lock className="h-4 w-4 text-emerald-700" />
              </span>
              <span>{t("feature1")}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 rounded-md border border-emerald-200 bg-emerald-50 p-1">
                <Lock className="h-4 w-4 text-emerald-700" />
              </span>
              <span>{t("feature2")}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 rounded-md border border-emerald-200 bg-emerald-50 p-1">
                <Lock className="h-4 w-4 text-emerald-700" />
              </span>
              <span>{t("feature3")}</span>
            </li>
          </ul>

          <button
            onClick={handleCtaClick}
            disabled={loading}
            className="w-full rounded-lg bg-zinc-950 py-3 font-detective text-lg text-white shadow-lg transition-colors duration-200 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? t("redirecting") : t("ctaUpgrade")}
          </button>

          <button
            onClick={handleDismiss}
            className="w-full text-center text-sm text-zinc-500 transition-colors hover:text-zinc-800"
          >
            {t("ctaMaybeLater")}
          </button>

          <p className="text-center text-xs text-zinc-500">
            {t.rich("teamLicense", {
              a: (chunks) => (
                <a
                  href="mailto:support@sqlnoir.com"
                  className="underline hover:text-zinc-800"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
