import { getAllCases } from "@/lib/case-utils";

/**
 * Pure, DB-free logic for migrating anonymous local progress onto an account.
 *
 * Lives in a lib (not the route file) because Next.js App Router `route.ts`
 * files may only export HTTP method handlers — any other export breaks the
 * build. Keeping these helpers here also makes them unit-testable without a DB.
 *
 * SECURITY: the server is the sole source of truth. Callers send case ids only;
 * xp is recomputed here from canonical case data, and only KNOWN FREE (beginner)
 * cases are ever credited — paid cases (003–006) are filtered out.
 */

/** FREE (beginner) case ids → canonical xpReward (server source of truth). */
export function getFreeCaseXpMap(): Record<string, number> {
  const map: Record<string, number> = {};
  for (const c of getAllCases()) {
    if (c.category === "beginner") {
      map[c.id] = c.xpReward;
    }
  }
  return map;
}

/**
 * Filters `incoming` to ids present in `freeMap` (known free cases), removes any
 * already in `existing`, dedups within the request, and sums the canonical xp
 * for the genuinely-new free cases.
 */
export function computeMigration(
  freeMap: Record<string, number>,
  incoming: string[],
  existing: string[]
): { newCases: string[]; addedXp: number } {
  const existingSet = new Set(existing);
  const seen = new Set<string>();
  const newCases: string[] = [];
  let addedXp = 0;

  for (const id of incoming) {
    if (!(id in freeMap)) continue; // discard non-free / unknown ids
    if (existingSet.has(id)) continue; // already credited (idempotent)
    if (seen.has(id)) continue; // dedup within the request
    seen.add(id);
    newCases.push(id);
    addedXp += freeMap[id];
  }

  return { newCases, addedXp };
}
