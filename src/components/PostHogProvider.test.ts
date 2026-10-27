import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const state = vi.hoisted(() => ({
  effects: [] as Array<() => void | (() => void)>,
  client: null as SupabaseClient | null,
  identify: vi.fn(),
  capture: vi.fn(),
  reset: vi.fn(),
}));
vi.mock("react", () => ({
  useEffect: (effect: () => void | (() => void)) => state.effects.push(effect),
  useRef: (value: unknown) => ({ current: value }),
}));
vi.mock("next/navigation", () => ({ usePathname: () => "/cases" }));
vi.mock("posthog-js/react", () => ({ PostHogProvider: () => null }));
vi.mock("@/lib/posthog", () => ({ initPostHog: vi.fn(), posthog: {}, POSTHOG_KEY: "test" }));
vi.mock("@/lib/supabase", () => ({ get supabase() { return state.client; } }));
vi.mock("@/lib/analytics", () => ({
  identifyUser: state.identify, capture: state.capture, resetUser: state.reset,
}));
import { PostHogProvider } from "./PostHogProvider";

const user = {
  id: "00000000-0000-4000-8000-000000000001", email: "player@example.test",
  created_at: "2026-01-01T00:00:00Z", app_metadata: { provider: "google" },
  user_metadata: {}, aud: "authenticated",
};
const token = [
  { alg: "HS256", typ: "JWT" },
  { sub: user.id, exp: Math.floor(Date.now() / 1000) + 3600 },
].map(part => Buffer.from(JSON.stringify(part)).toString("base64url")).join(".") + ".test";
const within = async <T>(operation: PromiseLike<T>): Promise<T> => {
  let timer: ReturnType<typeof setTimeout>;
  try {
    return await Promise.race([
      operation,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("Auth operation blocked by analytics")), 500);
      }),
    ]);
  } finally { clearTimeout(timer!); }
};

let cleanup: (() => void) | void;
let profile: () => Promise<Response>;
let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  state.effects = [];
  vi.clearAllMocks();
  vi.stubGlobal("React", { createElement: () => null });
  profile = async () => new Response(JSON.stringify({ completed_cases: ["case-001"] }));
  fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes("/auth/v1/user")) return new Response(JSON.stringify(user));
    if (url.includes("/rest/v1/user_info")) return profile();
    if (url.includes("/rest/v1/rpc/increment_user_xp")) return new Response("null");
    if (url.includes("/auth/v1/logout")) return new Response(null, { status: 204 });
    throw new Error(`Unexpected request: ${url}`);
  });
  state.client = createClient("https://sqlnoir.example.test", "test-anon-key", {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: fetchMock },
  });
  PostHogProvider({ children: null });
  cleanup = state.effects.at(-1)!();
});
afterEach(() => { cleanup?.(); vi.unstubAllGlobals(); });
const signIn = () => state.client!.auth.setSession({ access_token: token, refresh_token: "test-refresh" });

describe("auth analytics cannot block gameplay", () => {
  it("releases sign-in so credential reads and XP writes can finish", async () => {
    expect((await within(signIn())).error).toBeNull();
    expect((await within(state.client!.auth.getSession())).data.session?.user.id).toBe(user.id);
    expect((await within(state.client!.auth.getUser())).data.user?.id).toBe(user.id);
    expect((await within(state.client!.rpc("increment_user_xp", { user_id: user.id, case_id: "case-001" }))).error).toBeNull();
    await vi.waitFor(() => expect(state.identify).toHaveBeenCalledWith(user.id, expect.objectContaining({ cases_completed_count: 1 })));
  });

  it("keeps auth usable even while the analytics profile request hangs", async () => {
    profile = () => new Promise(() => {});
    expect((await within(signIn())).error).toBeNull();
    expect((await within(state.client!.auth.getSession())).data.session).not.toBeNull();
  });

  it("does not identify a signed-out user when an old profile response arrives", async () => {
    let resolveProfile!: (response: Response) => void;
    profile = () => new Promise(resolve => { resolveProfile = resolve; });
    await within(signIn());
    await vi.waitFor(() => expect(resolveProfile).toBeTypeOf("function"));
    await within(state.client!.auth.signOut());
    resolveProfile(new Response(JSON.stringify({ completed_cases: ["case-001"] })));
    await new Promise(resolve => setTimeout(resolve, 20));
    expect(state.identify).not.toHaveBeenCalled();
    expect(state.reset).toHaveBeenCalledOnce();
  });

  it("ignores an analytics profile response after unmount", async () => {
    let resolveProfile!: (response: Response) => void;
    profile = () => new Promise(resolve => { resolveProfile = resolve; });
    await within(signIn());
    await vi.waitFor(() => expect(resolveProfile).toBeTypeOf("function"));
    cleanup?.();
    resolveProfile(new Response(JSON.stringify({ completed_cases: ["case-001"] })));
    await new Promise(resolve => setTimeout(resolve, 20));
    expect(state.identify).not.toHaveBeenCalled();
  });
});
