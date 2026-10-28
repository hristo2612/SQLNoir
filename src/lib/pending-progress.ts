import { getAllCases } from "@/lib/case-utils";

export const PENDING_PROGRESS_EVENT = "sqlnoir-pending-progress";
export const PROGRESS_SAVED_EVENT = "sqlnoir-progress-saved";
const PREFIX = "sqlnoir_pending_solve_v1:";
const caseIds = new Set(getAllCases().map(caseData => caseData.id));
const locales = new Set(["en", "pt-br", "zh-CN"]);

export interface PendingSolve {
  caseId: string;
  answer: string;
  locale: string;
}
export interface StoredSolve extends PendingSolve {
  serialized: string;
}

function key(userId: string, caseId: string): string {
  return `${PREFIX}${encodeURIComponent(userId)}:${caseId}`;
}

function valid(value: PendingSolve): boolean {
  return caseIds.has(value.caseId) && typeof value.answer === "string" &&
    value.answer.length <= 256 && locales.has(value.locale);
}

/** Persist before showing success. No tokens, entitlement or XP are stored. */
export function queuePendingSolve(userId: string, solve: PendingSolve): boolean {
  if (!userId || !valid(solve) || typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key(userId, solve.caseId), JSON.stringify(solve));
  } catch {
    return false;
  }
  window.dispatchEvent(new Event(PENDING_PROGRESS_EVENT));
  return true;
}

/** Read only the solving account's entries. Storage is untrusted input. */
export function getPendingSolves(userId: string): StoredSolve[] {
  if (!userId || typeof window === "undefined") return [];
  const result: StoredSolve[] = [];
  // Six known keys avoid mixing accounts or losing unrelated writes in a shared array.
  for (const caseId of caseIds) {
    try {
      const serialized = window.localStorage.getItem(key(userId, caseId));
      if (!serialized) continue;
      const parsed = JSON.parse(serialized);
      if (parsed && parsed.caseId === caseId && valid(parsed)) {
        result.push({ ...parsed, serialized });
      }
    } catch { /* Corrupt or unavailable storage cannot grant progress. */ }
  }
  return result;
}

/** A late acknowledgement must not remove a newer pending solve. */
export function acknowledgePendingSolve(userId: string, solve: StoredSolve): void {
  try {
    const storageKey = key(userId, solve.caseId);
    if (window.localStorage.getItem(storageKey) === solve.serialized) {
      window.localStorage.removeItem(storageKey);
    }
  } catch { /* Retrying an acknowledged solve is safe on the server. */ }
}
