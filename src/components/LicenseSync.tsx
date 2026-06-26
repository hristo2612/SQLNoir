"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

/**
 * On every genuine sign-in, ask the server to claim any unclaimed pending
 * license that matches the user's email. This is the reliable backstop for the
 * anonymous purchase flow: the checkout-success page claims by session_id, but
 * that id only lives in the success URL, so a closed tab (or buying before
 * having an account) would otherwise strand the purchase. Fire-and-forget and
 * idempotent on the server, so calling it on every sign-in is safe.
 */
export function LicenseSync() {
  const lastUserRef = useRef<string | null>(null);

  useEffect(() => {
    if (!supabase) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        lastUserRef.current = null;
        return;
      }

      const userId = session?.user?.id ?? null;
      if (!userId) return;

      // Supabase re-fires SIGNED_IN on tab refocus / token refresh; only act on
      // a genuine no-user -> user (or user-switch) transition.
      if (lastUserRef.current === userId) return;
      lastUserRef.current = userId;

      // Email-mode claim (no body). The app uses Supabase's implicit OAuth flow,
      // so the session lives in localStorage, NOT cookies - the server can't read
      // it from cookies on a Google sign-in. Pass the access token as a Bearer
      // header (same as check-solution) so the claim route can authenticate the
      // user; the email is the authorization.
      const token = session?.access_token;
      if (!token) return;
      fetch("/api/claim-license", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      }).catch(() => {
        // Best-effort: the success page and the next sign-in are both backstops.
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
