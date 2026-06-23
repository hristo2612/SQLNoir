/**
 * ============================================================================
 * BEST-EFFORT, IN-MEMORY RATE LIMITER - READ THIS BEFORE RELYING ON IT
 * ============================================================================
 *
 * This is a dependency-free, in-memory fixed-window rate limiter. It exists as
 * DEFENSE-IN-DEPTH only - a cheap speed bump against brute-force / hammering of
 * unauthenticated-ish endpoints. It is NOT a strong global rate limit.
 *
 * WHY IT IS BEST-EFFORT (PER-INSTANCE):
 *   On Vercel (and most serverless platforms) each request may be served by a
 *   different, isolated instance, each with its OWN module-level `Map`. There is
 *   no shared memory between instances, and instances are recycled frequently.
 *   So the counters here are PER-INSTANCE: an attacker hitting the endpoint can
 *   be load-balanced across many instances and effectively multiply the limit,
 *   and a cold start resets the window entirely.
 *
 * FOR A REAL, GLOBAL LIMIT:
 *   Use a shared store such as Upstash Redis or Vercel KV (atomic INCR + TTL).
 *
 * THE REAL PROTECTION FOR CLAIM-LICENSE IS NOT THIS LIMITER:
 *   The license-theft vector is closed by the email-match gate in
 *   `src/app/api/claim-license/route.ts` (Task B5) - the signed-in user's email
 *   must equal the buyer email captured at Stripe checkout. This limiter merely
 *   slows down abusive request volume; it is intentionally a secondary control.
 * ============================================================================
 */

interface WindowEntry {
  count: number;
  resetAt: number; // epoch ms when the current window expires
}

// Module-level store. Per-instance only (see header note above).
const store = new Map<string, WindowEntry>();

export interface RateLimitOptions {
  /** Max number of allowed requests within the window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
  /**
   * Optional injected clock (epoch ms) for deterministic testing. Defaults to
   * Date.now() in production.
   */
  now?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the caller may retry (0 when allowed). */
  retryAfterSeconds: number;
  /** Remaining requests allowed in the current window (>= 0). */
  remaining: number;
}

/**
 * Fixed-window rate limit check. Increments the counter for `key` and reports
 * whether the request is allowed.
 *
 * Pruning: expired entries are removed opportunistically - the key's own entry
 * on access, plus a light sweep so the Map can't grow unbounded under many
 * distinct keys.
 */
export function rateLimit(key: string, opts: RateLimitOptions): RateLimitResult {
  const now = opts.now ?? Date.now();
  const { limit, windowMs } = opts;

  const existing = store.get(key);

  // No entry, or the previous window has expired → start a fresh window.
  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    maybeSweep(now);
    return { allowed: true, retryAfterSeconds: 0, remaining: limit - 1 };
  }

  // Within an active window.
  if (existing.count < limit) {
    existing.count += 1;
    return {
      allowed: true,
      retryAfterSeconds: 0,
      remaining: limit - existing.count,
    };
  }

  // Over the limit for this window.
  const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
  return { allowed: false, retryAfterSeconds, remaining: 0 };
}

// Opportunistic sweep of expired entries to bound memory. Cheap and only runs
// when we happen to open a new window, so it adds negligible overhead.
let lastSweep = 0;
function maybeSweep(now: number): void {
  // Sweep at most once per second of wall-clock progress.
  if (now - lastSweep < 1000) return;
  lastSweep = now;
  for (const [k, v] of store) {
    if (v.resetAt <= now) store.delete(k);
  }
}

/**
 * Test-only helper to reset the module-level store between cases. Not used in
 * production paths.
 */
export function __resetRateLimitStore(): void {
  store.clear();
  lastSweep = 0;
}
