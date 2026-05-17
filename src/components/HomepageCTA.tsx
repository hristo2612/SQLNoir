"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { TrackedLink } from "./TrackedLink";
import posthog from "posthog-js";

interface HomepageCTAProps {
  ctaId: string;
  source: string;
  className: string;
  children?: React.ReactNode;
}

export function HomepageCTA({ ctaId, source, className, children }: HomepageCTAProps) {
  const t = useTranslations();

  const CTA_COPY_MAP: Record<string, string> = useMemo(
    () => ({
      "start-investigating": t("home.cta.startInvestigating"),
      "solve-first-case": t("home.cta.solveFirstCase"),
      "begin-mystery": t("home.cta.beginMystery"),
    }),
    [t]
  );

  const [ctaText, setCtaText] = useState(t("home.cta.default"));

  useEffect(() => {
    posthog.onFeatureFlags(() => {
      const flag = posthog.getFeatureFlag("homepage-cta-copy");
      if (typeof flag === "string" && CTA_COPY_MAP[flag]) {
        setCtaText(CTA_COPY_MAP[flag]);
      }
    });
  }, [CTA_COPY_MAP]);

  return (
    <TrackedLink
      href="/cases"
      event="cta_click"
      eventProps={{
        cta_id: ctaId,
        page: "/",
        source,
        cta_variant: (posthog.getFeatureFlag("homepage-cta-copy") as string) ?? "default",
      }}
      className={className}
    >
      {children || ctaText}
    </TrackedLink>
  );
}
