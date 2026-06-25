import { describe, it, expect, beforeEach } from "vitest";
import { rateLimit, __resetRateLimitStore } from "./rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    __resetRateLimitStore();
  });

  it("allows up to `limit` requests within the window", () => {
    const opts = { limit: 3, windowMs: 1000, now: 0 };
    expect(rateLimit("k", opts).allowed).toBe(true);
    expect(rateLimit("k", opts).allowed).toBe(true);
    expect(rateLimit("k", opts).allowed).toBe(true);
  });

  it("blocks the limit+1-th request within the window", () => {
    const opts = { limit: 3, windowMs: 1000, now: 0 };
    rateLimit("k", opts);
    rateLimit("k", opts);
    rateLimit("k", opts);
    const fourth = rateLimit("k", opts);
    expect(fourth.allowed).toBe(false);
    expect(fourth.remaining).toBe(0);
  });

  it("returns a sane retryAfterSeconds when blocked", () => {
    const opts = { limit: 1, windowMs: 5000, now: 0 };
    rateLimit("k", opts); // consume the single allowed request
    const blocked = rateLimit("k", { ...opts, now: 1000 }); // 1s into the window
    expect(blocked.allowed).toBe(false);
    // 5000ms window, 1000ms elapsed → ~4s remaining.
    expect(blocked.retryAfterSeconds).toBe(4);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("reports remaining count while allowed", () => {
    const opts = { limit: 3, windowMs: 1000, now: 0 };
    expect(rateLimit("k", opts).remaining).toBe(2);
    expect(rateLimit("k", opts).remaining).toBe(1);
    expect(rateLimit("k", opts).remaining).toBe(0);
  });

  it("resets and allows again after the window expires (injected clock)", () => {
    const limit = 2;
    const windowMs = 1000;
    rateLimit("k", { limit, windowMs, now: 0 });
    rateLimit("k", { limit, windowMs, now: 0 });
    expect(rateLimit("k", { limit, windowMs, now: 500 }).allowed).toBe(false);
    // Window boundary at now=1000 (resetAt <= now) → fresh window.
    expect(rateLimit("k", { limit, windowMs, now: 1000 }).allowed).toBe(true);
    expect(rateLimit("k", { limit, windowMs, now: 1000 }).allowed).toBe(true);
    expect(rateLimit("k", { limit, windowMs, now: 1000 }).allowed).toBe(false);
  });

  it("treats distinct keys independently", () => {
    const opts = { limit: 1, windowMs: 1000, now: 0 };
    expect(rateLimit("a", opts).allowed).toBe(true);
    expect(rateLimit("a", opts).allowed).toBe(false);
    // Different key has its own fresh window.
    expect(rateLimit("b", opts).allowed).toBe(true);
  });

  it("defaults to Date.now() when no clock is injected", () => {
    const result = rateLimit("real-clock", { limit: 1, windowMs: 1000 });
    expect(result.allowed).toBe(true);
  });
});
