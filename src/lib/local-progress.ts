import { getAllCases } from "@/lib/case-utils";

/**
 * Anonymous (logged-out) progress, persisted in localStorage.
 *
 * SECURITY / TRUST MODEL: localStorage is fully client-controlled, so we treat
 * it as untrusted input. We NEVER persist or read an XP number from storage —
 * only a set of solved case ids, filtered to KNOWN FREE (beginner) cases. XP is
 * always RECOMPUTED from the canonical case data. This means a tampered
 * localStorage value can at most claim a free case was solved (which credits the
 * fixed free reward); it can never forge XP or unlock paid cases. The real
 * server-side credit happens via the migrate-progress route, which re-filters to
 * free cases again.
 */

const STORAGE_KEY = "sqlnoir_local_progress";

// Canonical FREE-case xp map, derived from real case data (beginner category),
// e.g. { "case-001": 50, "case-002": 100 }. Derived — not a hardcoded duplicate.
export const FREE_CASE_XP: Record<string, number> = (() => {
  const map: Record<string, number> = {};
  for (const c of getAllCases()) {
    if (c.category === "beginner") {
      map[c.id] = c.xpReward;
    }
  }
  return map;
})();

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** Read + sanitize the stored solved set. Returns only known free case ids. */
function readSolvedSet(): Set<string> {
  if (!isBrowser()) return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(
      parsed.filter(
        (id): id is string => typeof id === "string" && id in FREE_CASE_XP
      )
    );
  } catch {
    // Corrupt JSON / unavailable storage — treat as empty.
    return new Set();
  }
}

function writeSolvedSet(set: Set<string>): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    // Private mode / quota exceeded — silently ignore.
  }
}

/**
 * Record a solved case in local progress. Only known FREE (beginner) case ids
 * are accepted; any other id is ignored. Deduped automatically.
 */
export function recordLocalSolve(caseId: string): void {
  if (!isBrowser()) return;
  if (!(caseId in FREE_CASE_XP)) return; // ignore non-free / unknown ids
  const set = readSolvedSet();
  if (set.has(caseId)) return; // dedup
  set.add(caseId);
  writeSolvedSet(set);
}

/**
 * Read local progress. XP is ALWAYS recomputed from the canonical free-case map
 * — a stored xp number is never trusted (and is never written in the first
 * place). Returns empty progress on the server or when storage is empty/corrupt.
 */
export function getLocalProgress(): { solvedCaseIds: string[]; xp: number } {
  if (!isBrowser()) return { solvedCaseIds: [], xp: 0 };
  const solvedCaseIds = [...readSolvedSet()];
  const xp = solvedCaseIds.reduce(
    (sum, id) => sum + (FREE_CASE_XP[id] ?? 0),
    0
  );
  return { solvedCaseIds, xp };
}

/** Clear all local progress (e.g. after a successful migrate-on-signin). */
export function clearLocalProgress(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
