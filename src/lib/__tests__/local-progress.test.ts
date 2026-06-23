import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  recordLocalSolve,
  getLocalProgress,
  clearLocalProgress,
  FREE_CASE_XP,
} from "@/lib/local-progress";

const STORAGE_KEY = "sqlnoir_local_progress";

// Minimal in-memory Storage stub (node has no localStorage).
class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  clear(): void {
    this.store.clear();
  }
}

let storage: MemoryStorage;

beforeEach(() => {
  storage = new MemoryStorage();
  (globalThis as any).localStorage = storage;
  (globalThis as any).window = { localStorage: storage };
});

afterEach(() => {
  delete (globalThis as any).window;
  delete (globalThis as any).localStorage;
});

describe("FREE_CASE_XP", () => {
  it("is derived from the real beginner cases (case-001=50, case-002=100)", () => {
    expect(FREE_CASE_XP).toEqual({ "case-001": 50, "case-002": 100 });
  });
});

describe("recordLocalSolve", () => {
  it("ignores non-free / unknown case ids", () => {
    recordLocalSolve("case-003"); // paid
    recordLocalSolve("bogus-id"); // unknown
    expect(getLocalProgress()).toEqual({ solvedCaseIds: [], xp: 0 });
  });

  it("records a known free case and persists under the right key", () => {
    recordLocalSolve("case-001");
    const raw = storage.getItem(STORAGE_KEY);
    expect(raw).toBe(JSON.stringify(["case-001"]));
  });

  it("dedups repeated solves of the same case", () => {
    recordLocalSolve("case-001");
    recordLocalSolve("case-001");
    const progress = getLocalProgress();
    expect(progress.solvedCaseIds).toEqual(["case-001"]);
    expect(progress.xp).toBe(50);
  });

  it("accumulates multiple distinct free cases", () => {
    recordLocalSolve("case-001");
    recordLocalSolve("case-002");
    const progress = getLocalProgress();
    expect(new Set(progress.solvedCaseIds)).toEqual(
      new Set(["case-001", "case-002"])
    );
    expect(progress.xp).toBe(150);
  });
});

describe("getLocalProgress", () => {
  it("recomputes xp from the free map and never trusts stored junk", () => {
    // Tampered storage: extra/unknown ids and a paid case the client tries to
    // smuggle in. getLocalProgress must filter to free cases and recompute xp.
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify(["case-001", "case-003", "not-a-case"])
    );
    const progress = getLocalProgress();
    expect(progress.solvedCaseIds).toEqual(["case-001"]);
    expect(progress.xp).toBe(50); // recomputed, not inflated by the junk ids
  });

  it("returns empty progress on corrupt JSON", () => {
    storage.setItem(STORAGE_KEY, "{not valid json");
    expect(getLocalProgress()).toEqual({ solvedCaseIds: [], xp: 0 });
  });

  it("returns empty progress on the server (no window)", () => {
    delete (globalThis as any).window;
    expect(getLocalProgress()).toEqual({ solvedCaseIds: [], xp: 0 });
  });
});

describe("clearLocalProgress", () => {
  it("empties stored progress", () => {
    recordLocalSolve("case-001");
    recordLocalSolve("case-002");
    clearLocalProgress();
    expect(getLocalProgress()).toEqual({ solvedCaseIds: [], xp: 0 });
    expect(storage.getItem(STORAGE_KEY)).toBeNull();
  });
});
