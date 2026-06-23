"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Lock, Shield, Award, Heart } from "lucide-react";
import {
  trackPaywallShown,
  trackPaywallCtaClicked,
  trackPaywallDismissed,
  posthog,
} from "@/lib/posthog";
import { useLocale, useTranslations } from "next-intl";
import { getPriceForLocale } from "@/lib/ppp-prices";

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
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(() => getPriceForLocale(locale).display);

  useEffect(() => {
    if (isOpen) {
      trackPaywallShown(caseId, triggerLocation);
      fetch(`/api/price?locale=${encodeURIComponent(locale)}`)
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
        body: JSON.stringify({ locale }),
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
        className="absolute inset-0 bg-zinc-950/65 backdrop-blur-sm"
        onClick={handleDismiss}
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl">
        <div className="relative bg-zinc-950 px-6 py-6 text-center">
          <button
            onClick={handleDismiss}
            className="absolute right-4 top-4 rounded-full p-1 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="mb-4 flex justify-center">
            <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 p-3">
              <Shield className="h-8 w-8 text-emerald-300" />
            </div>
          </div>
          <h2 className="mb-2 font-detective text-2xl text-white">
            {t('upgradeTitle')}
          </h2>
          <p className="mx-auto max-w-sm text-sm leading-6 text-zinc-300">
            {t('upgradeSubtitle')}
          </p>
        </div>

        <div className="px-6 py-6">
          <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-5 py-4 text-center">
            <div className="inline-flex items-baseline gap-1">
              <span className="font-detective text-4xl text-amber-950">
                {price}
              </span>
            </div>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-amber-700">
              {t('oneTimePayment')}
            </p>
          </div>

          <div className="mb-6 space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg border border-emerald-200 bg-emerald-50 p-1.5">
                <Lock className="h-4 w-4 text-emerald-700" />
              </div>
              <div>
                <p className="font-detective text-sm text-zinc-950">
                  {t('unlockCases')}
                </p>
                <p className="mt-0.5 text-xs leading-5 text-zinc-600">
                  {t('unlockCasesDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg border border-emerald-200 bg-emerald-50 p-1.5">
                <Award className="h-4 w-4 text-emerald-700" />
              </div>
              <div>
                <p className="font-detective text-sm text-zinc-950">
                  {t('earnBadges')}
                </p>
                <p className="mt-0.5 text-xs leading-5 text-zinc-600">
                  {t('earnBadgesDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg border border-emerald-200 bg-emerald-50 p-1.5">
                <Heart className="h-4 w-4 text-emerald-700" />
              </div>
              <div>
                <p className="font-detective text-sm text-zinc-950">
                  {t('supportDev')}
                </p>
                <p className="mt-0.5 text-xs leading-5 text-zinc-600">
                  {t('supportDevDesc')}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleCtaClick}
            disabled={loading}
            className={`flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 px-6 py-3 font-detective text-lg text-white shadow-lg transition-colors hover:bg-zinc-800
                     ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-200 border-t-transparent" />
            ) : (
              <>
                <Shield className="h-5 w-5" />
                {t('getYourLicense')}
              </>
            )}
          </button>

          <button
            onClick={handleDismiss}
            className="mt-3 w-full py-2 text-center font-detective text-sm text-zinc-500 transition-colors hover:text-zinc-800"
          >
            {t('continueWithFree')}
          </button>

          <p className="mt-4 text-center text-xs text-zinc-500">
            {t.rich('teamLicense', {
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
    </div>,
    document.body
  );
}
