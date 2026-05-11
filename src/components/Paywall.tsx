"use client";

import { useEffect, useState } from "react";
import { X, Lock, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import posthog from "posthog-js";
import {
  trackPaywallShown,
  trackPaywallCtaClicked,
  trackPaywallDismissed,
} from "@/lib/posthog";

const PRICING_MAP: Record<string, string> = {
  "9-99": "$9.99",
  "14-99": "$14.99",
  "19-99": "$19.99",
};

interface PaywallProps {
  isOpen: boolean;
  onClose: () => void;
  caseSlug: string;
}

export function Paywall({ isOpen, onClose, caseSlug }: PaywallProps) {
  const t = useTranslations("paywall");
  const [price, setPrice] = useState("$14.99");

  useEffect(() => {
    posthog.onFeatureFlags(() => {
      const flag = posthog.getFeatureFlag("pricing-display");
      if (typeof flag === "string" && PRICING_MAP[flag]) {
        setPrice(PRICING_MAP[flag]);
      }
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      trackPaywallShown(caseSlug, "post_solve");
    }
  }, [isOpen, caseSlug]);

  if (!isOpen) return null;

  const handleCtaClick = () => {
    const pricingVariant = posthog.getFeatureFlag("pricing-display");
    const placementVariant = posthog.getFeatureFlag("paywall-placement");
    trackPaywallCtaClicked(caseSlug, {
      price,
      pricing_variant: typeof pricingVariant === "string" ? pricingVariant : "default",
      placement_variant: typeof placementVariant === "string" ? placementVariant : "default",
    });
  };

  const handleDismiss = () => {
    trackPaywallDismissed(caseSlug);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative bg-amber-50 border border-amber-200 rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-amber-600 hover:text-amber-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-100 rounded-full">
            <Sparkles className="w-7 h-7 text-amber-700" />
          </div>
          <h2 className="font-detective text-2xl text-amber-900">
            {t("title")}
          </h2>
          <p className="text-amber-700">
            {t("subtitle")}
          </p>
        </div>

        <div className="bg-white border border-amber-200 rounded-xl p-6 text-center space-y-2">
          <p className="text-amber-600 text-sm font-medium uppercase tracking-wide">
            {t("tierName")}
          </p>
          <p className="font-detective text-4xl text-amber-900">{price}</p>
          <p className="text-amber-600 text-sm">{t("perMonth")}</p>
        </div>

        <ul className="space-y-2 text-amber-800 text-sm">
          <li className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600" />
            {t("feature1")}
          </li>
          <li className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600" />
            {t("feature2")}
          </li>
          <li className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600" />
            {t("feature3")}
          </li>
        </ul>

        <button
          onClick={handleCtaClick}
          className="w-full py-3 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-50 font-detective text-lg transition-colors duration-200 shadow-lg"
        >
          {t("ctaUpgrade")}
        </button>

        <button
          onClick={handleDismiss}
          className="w-full text-center text-amber-600 hover:text-amber-800 text-sm"
        >
          {t("ctaMaybeLater")}
        </button>
      </div>
    </div>
  );
}
