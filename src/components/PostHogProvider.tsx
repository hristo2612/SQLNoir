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

    let active = true;
    let identityVersion = 0;
    let identifyTimer: ReturnType<typeof setTimeout> | undefined;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
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
          try { capture("login", { method: "oauth" }); } catch { /* Best-effort analytics. */ }
        }

        // Supabase waits for auth subscribers while holding its session lock.
        // A query here obtains its token via getSession(), so awaiting it in the
        // subscriber deadlocks auth, license checks and answer/XP submissions.
        // Defer analytics until the auth notification has released that lock.
        const version = ++identityVersion;
        clearTimeout(identifyTimer);
        identifyTimer = setTimeout(async () => {
          if (!active || version !== identityVersion) return;
          let casesCompleted = 0;
          try {
            const { data } = await supabase!
              .from("user_info")
              .select("completed_cases")
              .eq("id", user.id)
              .abortSignal(AbortSignal.timeout(10_000))
              .single();
            if (Array.isArray(data?.completed_cases)) {
              casesCompleted = data.completed_cases.length;
            }
          } catch {
            // Analytics enrichment is best-effort and must not affect gameplay.
          }

          // An old request must not restore an identity after sign-out, a user
          // switch, another auth notification or unmount.
          if (!active || version !== identityVersion) return;
          try { identifyUser(user.id, {
            email: user.email,
            sign_up_date: user.created_at,
            cases_completed_count: casesCompleted,
          }); } catch { /* Analytics must never interrupt gameplay. */ }
        }, 0);
      } else if (event === "SIGNED_OUT") {
        identityVersion += 1;
        clearTimeout(identifyTimer);
        signedInUserRef.current = null;
        try { resetUser(); } catch { /* Best-effort analytics. */ }
      }
    });

    return () => {
      active = false;
      clearTimeout(identifyTimer);
      subscription.unsubscribe();
      signedInUserRef.current = null;
    };
  }, []);

  if (!POSTHOG_KEY) return <>{children}</>;

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
