"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Lock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  trackPaywallShown,
  trackPaywallCtaClicked,
  trackPaywallDismissed,
  posthog,
} from "@/lib/posthog";
import { getPriceForLocale } from "@/lib/ppp-prices";
import { detectCountry } from "@/lib/geo";

interface PaywallProps {
  isOpen: boolean;
  onClose: () => void;
  caseSlug: string;
}

export function Paywall({ isOpen, onClose, caseSlug }: PaywallProps) {
  const t = useTranslations("paywall");
  const tFooter = useTranslations("footer");
  const tRestore = useTranslations("restore");
  const locale = useLocale();
  // Start null (same on server and client) to avoid a hydration mismatch and to
  // never paint the US "$14.99" before the localized price. The effect fills it
  // synchronously from the client-detected country, then refines via /api/price.
  const [price, setPrice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [badgeLoaded, setBadgeLoaded] = useState(false);
  const country = detectCountry();

  useEffect(() => {
    if (!isOpen) return;
    // Synchronous, no-network: show the country-localized price immediately so
    // there is no US flash. detectCountry runs in the effect (not the useState
    // initializer) to keep SSR/CSR initial state identical (null).
    const c = detectCountry();
    setPrice(getPriceForLocale(locale, c, { localizeByCountry: true }).display);
    fetch(
      `/api/price?locale=${encodeURIComponent(locale)}${country ? `&country=${country}` : ""}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.display) setPrice(data.display);
      })
      .catch(() => {});
  }, [isOpen, locale]);

  useEffect(() => {
    // Keep the displayed price localized when the locale changes too, so a
    // locale switch never falls back to the US price.
    const c = detectCountry();
    setPrice(getPriceForLocale(locale, c, { localizeByCountry: true }).display);
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
        body: JSON.stringify({ locale, ...(country ? { country } : {}) }),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-amber-950/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-amber-900/20 bg-amber-50 shadow-2xl">
        <button
          onClick={handleDismiss}
          aria-label={t("ctaMaybeLater")}
          className="absolute right-2.5 top-2.5 z-10 grid h-10 w-10 place-items-center rounded-full text-amber-200 transition-[color,background-color,transform] hover:bg-amber-50/10 hover:text-amber-50 active:scale-[0.96]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-amber-900 px-6 py-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="relative h-[88px] w-[88px]">
              {/* Reserve the box and hold a faint placeholder so the badge
                  fades in on decode instead of popping in abruptly. */}
              {!badgeLoaded && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 animate-pulse rounded-md bg-amber-50/10"
                />
              )}
              <Image
                src="/detective-license-badge.webp"
                alt="Detective License badge"
                width={88}
                height={88}
                priority
                // A cached/priority image can finish loading before onLoad is
                // attached; reveal it via .complete on mount so it can't strand
                // at opacity-0. onError reveals it too rather than pulse forever.
                ref={(node) => {
                  if (node?.complete) setBadgeLoaded(true);
                }}
                onLoad={() => setBadgeLoaded(true)}
                onError={() => setBadgeLoaded(true)}
                className={`rounded-md drop-shadow-md transition-opacity duration-300 ${
                  badgeLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          </div>
          <h2 className="text-balance font-detective text-2xl text-amber-50">
            {t("title")}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-pretty text-sm leading-6 text-amber-100/90">
            {t("subtitle")}
          </p>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div className="rounded-lg border border-amber-900/15 bg-amber-100 p-5 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
              {t("tierName")}
            </p>
            {price === null ? (
              <span
                aria-hidden="true"
                className="mt-1 inline-block h-10 w-28 animate-pulse rounded bg-amber-200/60"
              />
            ) : (
              <p className="mt-1 font-detective text-4xl tabular-nums text-amber-950">
                {price}
              </p>
            )}
            <p className="mt-1 text-xs text-amber-700">
              {t("oneTimePayment")}
            </p>
          </div>

          <ul className="space-y-3 text-sm text-amber-900">
            <li className="flex items-center gap-3">
              <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-lg border border-amber-900/15 bg-amber-100">
                <Lock className="h-4 w-4 text-amber-800" />
              </span>
              <span className="leading-none">{t("feature1")}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-lg border border-amber-900/15 bg-amber-100">
                <Lock className="h-4 w-4 text-amber-800" />
              </span>
              <span className="leading-none">{t("feature2")}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-lg border border-amber-900/15 bg-amber-100">
                <Lock className="h-4 w-4 text-amber-800" />
              </span>
              <span className="leading-none">{t("feature3")}</span>
            </li>
          </ul>

          <div className="space-y-2">
            <button
              onClick={handleCtaClick}
              disabled={loading}
              className="w-full rounded-lg bg-amber-800 py-3 font-detective text-lg text-amber-50 shadow-lg transition-[background-color,transform] duration-200 hover:bg-amber-700 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? t("redirecting") : t("ctaUpgrade")}
            </button>
            <p className="text-center text-xs text-amber-700">
              {tFooter.rich("purchaseAgreement", {
                terms: (chunks) => (
                  <Link
                    href="/terms"
                    className="underline hover:text-amber-900"
                  >
                    {chunks}
                  </Link>
                ),
                privacy: (chunks) => (
                  <Link
                    href="/privacy"
                    className="underline hover:text-amber-900"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>

          <button
            onClick={handleDismiss}
            className="w-full text-center text-sm text-amber-700 transition-colors hover:text-amber-900"
          >
            {t("ctaMaybeLater")}
          </button>

          <p className="text-center text-xs text-amber-600">
            <Link href="/restore" className="underline hover:text-amber-900">
              {tRestore("alreadyPurchased")}
            </Link>
          </p>

          <p className="text-center text-xs text-amber-600">
            {t.rich("teamLicense", {
              a: (chunks) => (
                <a
                  href="mailto:support@sqlnoir.com"
                  className="underline hover:text-amber-900"
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
