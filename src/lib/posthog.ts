import posthog from "posthog-js";

export const POSTHOG_KEY =
  process.env.NEXT_PUBLIC_POSTHOG_KEY || "phc_C9evTEmJ8kVCqV0JMxU8A0sL3PdbBxmG0f3usUq4X5x";
export const POSTHOG_HOST = "https://us.i.posthog.com";

let initialized = false;

export function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("cookie-consent") === "true";
}

export function initPostHog() {
  if (typeof window === "undefined" || initialized) {
    return;
  }

  if (!hasConsent()) {
    return;
  }

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: true,
    capture_pageleave: true,
    persistence: "localStorage+cookie",
    respect_dnt: true,
  });

  initialized = true;
}

function isDNT(): boolean {
  if (typeof window === "undefined") return true;
  const dnt = navigator.doNotTrack;
  return dnt === "1" || dnt === "true";
}

export function trackPaywallShown(caseId: string, triggerLocation: string) {
  if (isDNT()) return;
  posthog.capture("paywall_shown", {
    case_id: caseId,
    trigger_location: triggerLocation,
  });
}

export function trackPaywallCtaClicked(caseId: string, properties?: Record<string, string | number | boolean | null>) {
  if (isDNT()) return;
  posthog.capture("paywall_cta_clicked", {
    case_id: caseId,
    ...properties,
  });
}

export function trackPaywallDismissed(caseId: string) {
  if (isDNT()) return;
  posthog.capture("paywall_dismissed", {
    case_id: caseId,
  });
}

export { posthog };
