"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import { track } from "@vercel/analytics/react";
import { posthog } from "@/lib/posthog";
import { useTranslations } from "next-intl";

interface GetLicenseButtonProps {
  className?: string;
  source?: string;
}

export function GetLicenseButton({
  className,
  source = "dashboard",
}: GetLicenseButtonProps) {
  const t = useTranslations("license");
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    track("cta_click", {
      cta_id: "get-detective-license",
      page: "/cases",
      source,
    });

    try {
      posthog.capture("checkout_initiated", {
        source,
        trigger_location: source,
      });
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert(t('somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={
        className ||
        "inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-50 font-detective text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      }
    >
      <Shield className="w-5 h-5" />
      {loading ? t('redirecting') : t('getLicense')}
    </button>
  );
}
