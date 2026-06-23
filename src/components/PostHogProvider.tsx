"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { initPostHog, posthog, POSTHOG_KEY } from "@/lib/posthog";
import { supabase } from "@/lib/supabase";
import { identifyUser, resetUser } from "@/lib/analytics";

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
  useEffect(() => {
    if (!supabase) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!POSTHOG_KEY) return;
      if (event === "SIGNED_IN" && session?.user) {
        const user = session.user;

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
        resetUser();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!POSTHOG_KEY) return <>{children}</>;

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
