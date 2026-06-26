"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
  PENDING_CLAIM_SESSION_KEY,
  PENDING_CLAIM_LOCALE_KEY,
  localePrefix,
} from "@/lib/license";

/**
 * On every genuine sign-in, claim any purchase belonging to the user. Two paths:
 *
 *  1. A just-completed anonymous purchase, identified by a Stripe session_id we
 *     persisted to localStorage on the success page. This survives the Google
 *     OAuth redirect (which lands on "/", not back on the success page) and the
 *     session_id claim has NO email gate, so it works even when the checkout
 *     email differs from the login email (Apple Pay relay, a different Google
 *     account, etc.). We poll briefly because Stripe often redirects before the
 *     webhook has written the pending_licenses row.
 *
 *  2. Email-mode backstop: claim any unclaimed pending license matching the
 *     signed-in user's email (covers a closed success tab when the emails match).
 *
 * Fire-and-forget and idempotent on the server, so running on every sign-in is
 * safe.
 */
export function LicenseSync() {
  const lastUserRef = useRef<string | null>(null);

  useEffect(() => {
    if (!supabase) return;

    // Send the buyer to the success page (their purchase locale, falling back to
    // the current path's prefix). No-op if already there, so it can't loop.
    const goToSuccess = (query: string) => {
      if (typeof window === "undefined") return;
      if (window.location.pathname.includes("/checkout/success")) return;
      let storedLocale: string | null = null;
      try {
        storedLocale = localStorage.getItem(PENDING_CLAIM_LOCALE_KEY);
      } catch {
        // ignore
      }
      const seg = window.location.pathname.split("/")[1];
      const fallback = seg === "pt-br" || seg === "zh-CN" ? `/${seg}` : "";
      const prefix = storedLocale ? localePrefix(storedLocale) : fallback;
      window.location.assign(`${prefix}/checkout/success${query}`);
    };

    const claimSessionId = async (token: string, stripeSessionId: string) => {
      // Poll ~14s: the webhook that writes the pending row can lag the redirect.
      const MAX_ATTEMPTS = 7;
      const DELAY_MS = 2000;
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
          const res = await fetch("/api/claim-license", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ stripeSessionId }),
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok && data.success) {
            localStorage.removeItem(PENDING_CLAIM_SESSION_KEY);
            // Send the buyer to the celebratory success page (not silently into
            // "/" or /cases) so an anonymous-purchase -> Google-OAuth flow ends on
            // the "Welcome, Detective / license active" confirmation. claimed=1
            // tells the success page the license is already granted, so it renders
            // the success state immediately instead of re-querying (that re-query
            // could race/hang on the fresh page load).
            goToSuccess("?claimed=1");
            return true;
          }
          // 403 shouldn't happen on the session_id path (no email gate), but if
          // it ever does, stop and clear so we don't loop.
          if (res.status === 403) {
            localStorage.removeItem(PENDING_CLAIM_SESSION_KEY);
            return false;
          }
          // 404 = pending row not written yet (webhook lag): wait and retry.
        } catch {
          // Network hiccup: retry.
        }
        if (attempt < MAX_ATTEMPTS) {
          await new Promise((r) => setTimeout(r, DELAY_MS));
        }
      }
      return false;
    };

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

      const token = session?.access_token;
      if (!token) return;

      void (async () => {
        // 1. Pending anonymous purchase (works across email mismatch + redirect).
        const pendingSessionId =
          typeof window !== "undefined"
            ? localStorage.getItem(PENDING_CLAIM_SESSION_KEY)
            : null;
        if (pendingSessionId) {
          const claimed = await claimSessionId(token, pendingSessionId);
          if (claimed) return; // already granted + redirected
          // Webhook hasn't produced a claimable row within the poll window. Don't
          // strand the buyer on "/": hand off to the success page, which owns the
          // polling + retry UI and reads the pending id from localStorage.
          goToSuccess("");
          return;
        }

        // 2. Email-mode backstop (same-email closed tab). Best-effort.
        fetch("/api/claim-license", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }).catch(() => {});
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
