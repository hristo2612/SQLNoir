"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { initPostHog, posthog, POSTHOG_KEY } from "@/lib/posthog";
import { supabase } from "@/lib/supabase";
import { capture, identifyUser, resetUser } from "@/lib/analytics";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();

    // Re-init when cookie consent is granted
    const handleConsent = () => initPostHog();
    window.addEventListener("cookie-consent-granted", handleConsent);
    return () => window.removeEventListener("cookie-consent-granted", handleConsent);
  }, []);

  // Track route changes for SPA navigation
  const pathname = usePathname();
  useEffect(() => {
    if (!POSTHOG_KEY || typeof window === "undefined" || navigator.doNotTrack === "1") return;
    posthog.capture("$pageview", { $current_url: window.location.href });
  }, [pathname]);

  // Identify user on auth state change
  // Tracks the currently signed-in user id so we only treat a no-user -> user
  // transition as a fresh login (Supabase can re-fire SIGNED_IN on tab refocus).
  const signedInUserRef = useRef<string | null>(null);
  useEffect(() => {
    if (!supabase) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!POSTHOG_KEY) return;
      if (event === "SIGNED_IN" && session?.user) {
        const user = session.user;

        // Only fire `login` on a genuine no-user -> user transition. Supabase
        // emits SIGNED_IN again on tab refocus for an already-active session,
        // and uses separate INITIAL_SESSION / TOKEN_REFRESHED events for
        // session restore and token refresh, but the ref guard keeps us safe
        // regardless. Email/password logins already fire `login` from
        // AuthModal (trackLogin), so we only capture here for OAuth providers
        // (provider !== "email") to avoid double-counting.
        const isNewSignIn = signedInUserRef.current !== user.id;
        signedInUserRef.current = user.id;
        const provider = user.app_metadata?.provider;
        if (isNewSignIn && provider && provider !== "email") {
          capture("login", { method: "oauth" });
        }

        // Fetch completed cases count
        let casesCompleted = 0;
        const { data } = await supabase!
          .from("user_info")
          .select("completed_cases")
          .eq("id", user.id)
          .single();
        if (data?.completed_cases) {
          casesCompleted = Array.isArray(data.completed_cases)
            ? data.completed_cases.length
            : 0;
        }

        identifyUser(user.id, {
          email: user.email,
          sign_up_date: user.created_at,
          cases_completed_count: casesCompleted,
        });
      } else if (event === "SIGNED_OUT") {
        signedInUserRef.current = null;
        resetUser();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!POSTHOG_KEY) return <>{children}</>;

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
