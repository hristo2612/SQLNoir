"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getPendingSolves, PENDING_PROGRESS_EVENT, PROGRESS_SAVED_EVENT } from "@/lib/pending-progress";
import { syncPendingProgress } from "@/lib/sync-pending-progress";

/** Lives across routes and recovers signed-in saves after document reload. */
export function ProgressSync() {
  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    let active = true;
    let userId: string | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      clearTimeout(timer);
      if (!active || !userId) return;
      // Never await a Supabase operation inside an auth notification.
      timer = setTimeout(() => {
        const solvingUser = userId!;
        const isCurrent = () => active && userId === solvingUser;
        void syncPendingProgress(client, solvingUser, isCurrent).then(saved => {
          if (!isCurrent()) return;
          if (saved) window.dispatchEvent(new CustomEvent(PROGRESS_SAVED_EVENT, { detail: { userId: solvingUser } }));
          if (getPendingSolves(solvingUser).length) timer = setTimeout(schedule, 15_000);
        }).catch(() => {
          if (isCurrent()) timer = setTimeout(schedule, 15_000);
        });
      }, 0);
    };
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      userId = session?.user?.id ?? null;
      schedule();
    });
    const refocus = () => { if (document.visibilityState === "visible") schedule(); };
    window.addEventListener(PENDING_PROGRESS_EVENT, schedule);
    window.addEventListener("online", schedule);
    window.addEventListener("storage", schedule);
    document.addEventListener("visibilitychange", refocus);
    return () => {
      active = false;
      clearTimeout(timer);
      subscription.unsubscribe();
      window.removeEventListener(PENDING_PROGRESS_EVENT, schedule);
      window.removeEventListener("online", schedule);
      window.removeEventListener("storage", schedule);
      document.removeEventListener("visibilitychange", refocus);
    };
  }, []);
  return null;
}
