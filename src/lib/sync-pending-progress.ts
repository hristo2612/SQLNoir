import type { SupabaseClient } from "@supabase/supabase-js";
import { getAllCases } from "@/lib/case-utils";
import { isCaseFree } from "@/lib/license";
import { withTimeout } from "@/lib/request-timeout";
import { acknowledgePendingSolve, getPendingSolves } from "@/lib/pending-progress";

const running = new Map<string, Promise<boolean>>();

/** Replay account-owned solves, independently of the component/document that solved them. */
export async function syncPendingProgress(
  client: SupabaseClient,
  userId: string,
  isCurrent: () => boolean,
): Promise<boolean> {
  const existing = running.get(userId);
  if (existing) return existing;
  const drain = async () => {
    let saved = false;
    try {
      if (!isCurrent() || getPendingSolves(userId).length === 0) return false;
      const { data: { session }, error: sessionError } = await withTimeout(client.auth.getSession());
      if (sessionError || session?.user.id !== userId || !isCurrent()) return false;
      // Supplying the token validates it without holding the SDK's session lock
      // throughout the network request, so background replay cannot stall gameplay.
      const { data: { user }, error: authError } = await withTimeout(client.auth.getUser(session.access_token));
      if (authError || user?.id !== userId || !isCurrent()) return false;
      const attempted = new Set<string>();
      // Re-read after each acknowledgement so another solve queued during saving is included.
      while (isCurrent()) {
        const solve = getPendingSolves(userId).find(item => !attempted.has(item.caseId));
        if (!solve) break;
        attempted.add(solve.caseId);
        const caseData = getAllCases().find(item => item.id === solve.caseId)!;
        if (!isCaseFree(caseData)) {
          // Pending storage is not proof of payment or a correct paid answer.
          const response = await fetch("/api/check-solution", {
            method: "POST",
            signal: AbortSignal.timeout(10_000),
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
            body: JSON.stringify({ caseId: solve.caseId, answer: solve.answer, locale: solve.locale }),
          });
          const result = await response.json();
          if (!isCurrent()) return saved;
          if (!response.ok || !result.correct) continue;
        }
        const { error } = await client.rpc("increment_user_xp", {
          user_id: userId, case_id: solve.caseId,
        }).abortSignal(AbortSignal.timeout(10_000));
        if (error || !isCurrent()) return saved;
        acknowledgePendingSolve(userId, solve);
        saved = true;
      }
    } catch { /* Keep pending records for reload, reconnect or the next retry. */ }
    return saved;
  };
  // Prevent two tabs from replaying the same account's queue at the same time.
  const request = typeof navigator !== "undefined" && navigator.locks
    ? navigator.locks.request(`sqlnoir-progress:${userId}`, drain)
    : drain();
  running.set(userId, request);
  try { return await request; } finally { running.delete(userId); }
}
