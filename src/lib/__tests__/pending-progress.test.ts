import { beforeEach, afterEach, expect, it, vi } from "vitest";
import { acknowledgePendingSolve, getPendingSolves, queuePendingSolve } from "../pending-progress";
import { syncPendingProgress } from "../sync-pending-progress";
import type { SupabaseClient } from "@supabase/supabase-js";

vi.mock("@/lib/license", () => ({ isCaseFree: (data: { id: string }) => data.id !== "case-004" }));
const storage = new Map<string, string>();
const free = { caseId: "case-001", answer: "correct", locale: "en" };
const paid = { caseId: "case-004", answer: "correct paid answer", locale: "en" };
const alice = "detective-a";
const bob = "detective-b";
let rpc: ReturnType<typeof vi.fn>;
let getUser: ReturnType<typeof vi.fn>;
let client: SupabaseClient;
beforeEach(() => {
  storage.clear();
  vi.stubGlobal("window", Object.assign(new EventTarget(), { localStorage: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => { storage.set(key, value); },
    removeItem: (key: string) => { storage.delete(key); },
  } }));
  getUser = vi.fn().mockResolvedValue({ data: { user: { id: alice } } });
  rpc = vi.fn(() => ({ abortSignal: () => Promise.resolve({ error: null }) }));
  client = { auth: { getUser, getSession: async () => ({ data: { session: { user: { id: alice }, access_token: "synthetic-token" } } }) }, rpc } as unknown as SupabaseClient;
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ correct: true }) }));
});
afterEach(() => vi.unstubAllGlobals());

it("retains only case/answer/locale for the solving account without touching anonymous progress", () => {
  expect(queuePendingSolve(alice, free)).toBe(true);
  expect(getPendingSolves(alice)).toHaveLength(1);
  expect(getPendingSolves(bob)).toEqual([]);
  expect(storage.get("sqlnoir_local_progress")).toBeUndefined();
  expect(JSON.parse([...storage.values()][0])).toEqual(free);
  expect(queuePendingSolve(alice, { ...paid, caseId: "unknown" })).toBe(false);
});
it("does not remove a newer solve when an earlier request is acknowledged", () => {
  queuePendingSolve(alice, paid);
  const previous = getPendingSolves(alice)[0];
  queuePendingSolve(alice, { ...paid, locale: "pt-br" });
  acknowledgePendingSolve(alice, previous);
  expect(getPendingSolves(alice)[0].locale).toBe("pt-br");
});
it("saves a restored free solve once and acknowledges only after the RPC succeeds", async () => {
  queuePendingSolve(alice, free);
  await syncPendingProgress(client, alice, () => true);
  expect(rpc).toHaveBeenCalledWith("increment_user_xp", { user_id: alice, case_id: free.caseId });
  expect(getPendingSolves(alice)).toEqual([]);
  await syncPendingProgress(client, alice, () => true);
  expect(rpc).toHaveBeenCalledTimes(1);
});
it("reverifies a paid answer and license server-side before sending the RPC", async () => {
  queuePendingSolve(alice, paid);
  await syncPendingProgress(client, alice, () => true);
  expect(fetch).toHaveBeenCalledWith("/api/check-solution", expect.objectContaining({
    body: JSON.stringify(paid), headers: expect.objectContaining({ Authorization: "Bearer synthetic-token" }),
  }));
  expect(rpc).toHaveBeenCalledTimes(1);
});
it.each([false, true])("does not credit a refused paid solve and still saves free progress (HTTP success: %s)", async ok => {
  vi.mocked(fetch).mockResolvedValue({ ok, json: async () => ({ correct: false, error: "Answer or license refused" }) } as Response);
  queuePendingSolve(alice, paid);
  queuePendingSolve(alice, free);
  await syncPendingProgress(client, alice, () => true);
  expect(rpc).toHaveBeenCalledTimes(1);
  expect(rpc).toHaveBeenCalledWith("increment_user_xp", { user_id: alice, case_id: free.caseId });
  expect(getPendingSolves(alice).map(solve => solve.caseId)).toEqual([paid.caseId]);
});
it("retains a failed write for retry without adding anonymous migration progress", async () => {
  queuePendingSolve(alice, free);
  rpc.mockReturnValueOnce({ abortSignal: () => Promise.resolve({ error: new Error("offline") }) });
  expect(await syncPendingProgress(client, alice, () => true)).toBe(false);
  expect(getPendingSolves(alice)).toHaveLength(1);
  expect(storage.get("sqlnoir_local_progress")).toBeUndefined();
  await syncPendingProgress(client, alice, () => true);
  expect(getPendingSolves(alice)).toEqual([]);
});
it("refuses a restored solve when the authenticated account is different", async () => {
  queuePendingSolve(alice, free);
  getUser.mockResolvedValue({ data: { user: { id: bob } } });
  await syncPendingProgress(client, alice, () => true);
  expect(rpc).not.toHaveBeenCalled();
  expect(getPendingSolves(alice)).toHaveLength(1);
});
it("discards auth results after sign-out and retains the pending solve", async () => {
  queuePendingSolve(alice, free);
  let finish!: (value: unknown) => void;
  let active = true;
  getUser.mockReturnValue(new Promise(resolve => { finish = resolve; }));
  const task = syncPendingProgress(client, alice, () => active);
  await vi.waitFor(() => expect(finish).toBeTypeOf("function"));
  active = false;
  finish({ data: { user: { id: alice } } });
  await task;
  expect(rpc).not.toHaveBeenCalled();
  expect(getPendingSolves(alice)).toHaveLength(1);
});
it("serializes duplicate replay requests while auth is slow", async () => {
  queuePendingSolve(alice, free);
  let finish!: (value: unknown) => void;
  getUser.mockReturnValue(new Promise(resolve => { finish = resolve; }));
  const first = syncPendingProgress(client, alice, () => true);
  const second = syncPendingProgress(client, alice, () => true);
  await vi.waitFor(() => expect(finish).toBeTypeOf("function"));
  finish({ data: { user: { id: alice } } });
  await Promise.all([first, second]);
  expect(rpc).toHaveBeenCalledTimes(1);
});
