import { posthog, POSTHOG_KEY } from "./posthog";

type EventProperties = Record<string, string | number | boolean | null>;

export function capture(event: string, properties?: EventProperties) {
  if (!POSTHOG_KEY || typeof window === "undefined" || navigator.doNotTrack === "1") return;
  posthog.capture(event, properties);
}

export function identifyUser(
  userId: string,
  properties?: {
    email?: string;
    sign_up_date?: string;
    cases_completed_count?: number;
  }
) {
  if (!POSTHOG_KEY || typeof window === "undefined" || navigator.doNotTrack === "1") return;
  posthog.identify(userId, properties);
}

export function resetUser() {
  if (!POSTHOG_KEY || typeof window === "undefined") return;
  posthog.reset();
}
