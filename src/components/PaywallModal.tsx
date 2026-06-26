"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { X, Lock, Award, Heart } from "lucide-react";
import {
  trackPaywallShown,
  trackPaywallCtaClicked,
  trackPaywallDismissed,
  posthog,
} from "@/lib/posthog";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getPriceForLocale } from "@/lib/ppp-prices";
import { detectCountry } from "@/lib/geo";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  triggerLocation: string;
  isSignedIn?: boolean;
  onSignInRequired?: () => void;
}

export function PaywallModal({
  isOpen,
  onClose,
  caseId,
  triggerLocation,
}: PaywallModalProps) {
  const t = useTranslations("license");
  const tFooter = useTranslations("footer");
  const tRestore = useTranslations("restore");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [badgeLoaded, setBadgeLoaded] = useState(false);
  // Start null (same on server and client) to avoid a hydration mismatch and to
  // never paint the US "$14.99" before the localized price. The effect fills it
  // synchronously from the client-detected country, then refines via /api/price.
  const [price, setPrice] = useState<string | null>(null);
  const country = detectCountry();

  useEffect(() => {
    if (isOpen) {
      trackPaywallShown(caseId, triggerLocation);
      // Synchronous, no-network: show the country-localized price immediately so
      // there is no US flash. detectCountry runs in the effect (not the useState
      // initializer) to keep SSR/CSR initial state identical (null).
      const c = detectCountry();
      setPrice(
        getPriceForLocale(locale, c, { localizeByCountry: true }).display
      );
      fetch(
        `/api/price?locale=${encodeURIComponent(locale)}${country ? `&country=${country}` : ""}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.display) setPrice(data.display);
        })
        .catch(() => {});
    }
  }, [isOpen, caseId, triggerLocation, locale]);

  const handleCtaClick = async () => {
    trackPaywallCtaClicked(caseId, {
      trigger_location: triggerLocation,
      price,
    });
    setLoading(true);
    try {
      posthog.capture("checkout_initiated", {
        case_id: caseId,
        trigger_location: triggerLocation,
        price,
        locale,
      });
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, ...(country ? { country } : {}) }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    trackPaywallDismissed(caseId);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-amber-950/60 backdrop-blur-sm"
        onClick={handleDismiss}
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-amber-900/20 bg-amber-50 shadow-2xl">
        <div className="relative bg-amber-900 px-6 py-6 text-center">
          <button
            onClick={handleDismiss}
            aria-label={t('continueWithFree')}
            className="absolute right-2.5 top-2.5 grid h-10 w-10 place-items-center rounded-full text-amber-200 transition-[color,background-color,transform] hover:bg-amber-50/10 hover:text-amber-50 active:scale-[0.96]"
          >
            <X className="w-5 h-5" />
          </button>
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
                src="/detective-license-badge.png"
                alt="Detective License badge"
                width={88}
                height={88}
                priority
                onLoad={() => setBadgeLoaded(true)}
                className={`rounded-md drop-shadow-md transition-opacity duration-300 ${
                  badgeLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          </div>
          <h2 className="mb-2 text-balance font-detective text-2xl text-amber-50">
            {t('upgradeTitle')}
          </h2>
          <p className="mx-auto max-w-sm text-pretty text-sm leading-6 text-amber-100/90">
            {t('upgradeSubtitle')}
          </p>
        </div>

        <div className="px-6 py-6">
          <div className="mb-5 rounded-lg border border-amber-900/15 bg-amber-100 px-5 py-4 text-center">
            {price === null ? (
              <span
                aria-hidden="true"
                className="inline-block h-10 w-28 animate-pulse rounded bg-amber-200/60 align-middle"
              />
            ) : (
              <span className="font-detective text-4xl tabular-nums text-amber-950">
                {price}
              </span>
            )}
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-amber-700">
              {t('oneTimePayment')}
            </p>
          </div>

          <div className="mb-6 space-y-3">
            <div className="flex items-center gap-3">
              <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-lg border border-amber-900/15 bg-amber-100">
                <Lock className="h-4 w-4 text-amber-800" />
              </span>
              <p className="font-detective text-sm leading-none text-amber-950">
                {t('unlockCases')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-lg border border-amber-900/15 bg-amber-100">
                <Award className="h-4 w-4 text-amber-800" />
              </span>
              <p className="font-detective text-sm leading-none text-amber-950">
                {t('earnBadges')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-lg border border-amber-900/15 bg-amber-100">
                <Heart className="h-4 w-4 text-amber-800" />
              </span>
              <p className="font-detective text-sm leading-none text-amber-950">
                {t('supportDev')}
              </p>
            </div>
          </div>

          <button
            onClick={handleCtaClick}
            disabled={loading}
            className={`flex w-full items-center justify-center gap-2 rounded-lg bg-amber-800 px-6 py-3 font-detective text-lg text-amber-50 shadow-lg transition-[background-color,transform] duration-200 hover:bg-amber-700 active:scale-[0.96]
                     ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-200 border-t-transparent" />
            ) : (
              <span className="leading-none">{t('getYourLicense')}</span>
            )}
          </button>

          <p className="mt-2 text-center text-xs text-amber-700">
            {tFooter.rich("purchaseAgreement", {
              terms: (chunks) => (
                <Link href="/terms" className="underline hover:text-amber-900">
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

          <button
            onClick={handleDismiss}
            className="mt-3 w-full py-2 text-center font-detective text-sm text-amber-700 transition-colors hover:text-amber-900"
          >
            {t('continueWithFree')}
          </button>

          <p className="mt-1 text-center text-xs text-amber-600">
            <Link href="/restore" className="underline hover:text-amber-900">
              {tRestore('alreadyPurchased')}
            </Link>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
