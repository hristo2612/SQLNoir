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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleDismiss}
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border-2 border-amber-700/50 shadow-2xl">
        <div className="paper-texture-dark px-6 py-5 text-center relative">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-amber-200/70 hover:text-amber-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex justify-center mb-3">
            <div className="bg-amber-400/20 p-3 rounded-full border border-amber-400/30">
              <Shield className="w-8 h-8 text-amber-300" />
            </div>
          </div>
          <h2 className="font-detective text-2xl text-amber-100 mb-1">
            {t('upgradeTitle')}
          </h2>
          <p className="text-amber-300/80 text-sm font-detective">
            {t('upgradeSubtitle')}
          </p>
        </div>

        <div className="paper-texture px-6 py-6">
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-amber-100 p-1.5 rounded-lg border border-amber-300">
                <Lock className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <p className="font-detective text-amber-900 text-sm">
                  {t('unlockCases')}
                </p>
                <p className="text-amber-700/70 text-xs mt-0.5">
                  {t('unlockCasesDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-amber-100 p-1.5 rounded-lg border border-amber-300">
                <Award className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <p className="font-detective text-amber-900 text-sm">
                  {t('earnBadges')}
                </p>
                <p className="text-amber-700/70 text-xs mt-0.5">
                  {t('earnBadgesDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-amber-100 p-1.5 rounded-lg border border-amber-300">
                <Heart className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <p className="font-detective text-amber-900 text-sm">
                  {t('supportDev')}
                </p>
                <p className="text-amber-700/70 text-xs mt-0.5">
                  {t('supportDevDesc')}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mb-5">
            <div className="inline-flex items-baseline gap-1">
              <span className="font-detective text-3xl text-amber-900">
                {price}
              </span>
            </div>
            <p className="text-amber-700/70 text-xs mt-1 font-detective">
              {t('oneTimePayment')}
            </p>
          </div>

          <button
            onClick={handleCtaClick}
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-detective text-lg text-amber-50
                     bg-amber-800 hover:bg-amber-700 transition-colors
                     border-2 border-amber-900/50 shadow-lg hover:shadow-xl
                     flex items-center justify-center gap-2
                     ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-amber-200 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Shield className="w-5 h-5" />
                {t('getYourLicense')}
              </>
            )}
          </button>

          <button
            onClick={handleDismiss}
            className="w-full mt-3 py-2 text-center text-amber-700/70 hover:text-amber-800
                     text-sm font-detective transition-colors"
          >
            {t('continueWithFree')}
          </button>

          <p className="mt-4 text-center text-xs text-amber-700/60">
            {t.rich('teamLicense', {
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
        </div>
      </div>
    </div>,
    document.body
  );
}
