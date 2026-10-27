import React from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const state = vi.hoisted(() => ({ client: null as SupabaseClient | null }));
const analytics = vi.hoisted(() => ({ capture: vi.fn(), identifyUser: vi.fn(), resetUser: vi.fn() }));
vi.mock('@/lib/supabase', () => ({ get supabase() { return state.client; } }));
vi.mock('next/navigation', () => ({ usePathname: () => '/cases' }));
vi.mock('@/lib/analytics', () => analytics);
vi.mock('@/lib/posthog', () => ({ POSTHOG_KEY: 'test-key', initPostHog: vi.fn(), posthog: { capture: vi.fn() } }));
vi.mock('posthog-js/react', () => ({ PostHogProvider: ({ children }: { children: React.ReactNode }) => children }));
import { PostHogProvider } from '../PostHogProvider';

const user = { id: 'test-detective', email: 'detective@example.test', created_at: '2026-01-01', app_metadata: { provider: 'google' }, user_metadata: {}, aud: 'authenticated' };
let renderer: ReactTestRenderer;
let profile: () => Promise<Response>;
let authUser = user;
beforeEach(async () => {
  vi.clearAllMocks();
  authUser = user;
  vi.stubGlobal('React', React);
  vi.stubGlobal('window', Object.assign(new EventTarget(), { location: { href: 'https://game.example.test/cases' } }));
  profile = async () => new Response(JSON.stringify({ completed_cases: ['case-001'] }));
  state.client = createClient('https://auth.example.test', 'test-anon-key', {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: async (url) => String(url).includes('/auth/v1/logout') ? new Response('{}') : String(url).includes('/auth/v1/user')
      ? new Response(JSON.stringify(authUser)) : profile() },
  });
  await state.client.auth.initialize();
  act(() => { renderer = create(<PostHogProvider><span>game</span></PostHogProvider>); });
});
afterEach(() => {
  act(() => renderer.unmount());
  state.client?.auth.stopAutoRefresh();
  vi.unstubAllGlobals();
});
const tick = () => new Promise(resolve => setTimeout(resolve, 30));
const signIn = () => state.client!.auth.setSession({ access_token: `x.${btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }))}.x`, refresh_token: 'test-refresh' });

it('releases the real SDK auth lock before querying an analytics profile', async () => {
  const result = await Promise.race([signIn().then(() => 'signed-in'), new Promise(resolve => setTimeout(() => resolve('auth-lock-stalled'), 250))]);
  expect(result).toBe('signed-in');
  await tick();
  expect(analytics.identifyUser).toHaveBeenCalledWith(user.id, expect.objectContaining({ cases_completed_count: 1 }));
  // Same auth operation occurs on refocus: it must remain usable and not count another login.
  await signIn();
  await tick();
  expect(analytics.capture).toHaveBeenCalledTimes(1);
  expect((await state.client!.auth.getSession()).data.session?.user.id).toBe(user.id);
});

it('does not identify a signed-out user when a delayed profile completes', async () => {
  let finish!: (value: Response) => void;
  profile = () => new Promise(resolve => { finish = resolve; });
  const signedIn = signIn();
  await tick();
  await Promise.race([signedIn, tick()]);
  const signedOut = state.client!.auth.signOut({ scope: 'local' });
  await tick();
  finish(new Response(JSON.stringify({ completed_cases: [] })));
  await Promise.race([signedOut, tick()]);
  await tick();
  expect(analytics.resetUser).toHaveBeenCalledTimes(1);
  expect(analytics.identifyUser).not.toHaveBeenCalled();
});

it('ignores analytics failures', async () => {
  profile = async () => { throw new Error('analytics unavailable'); };
  await Promise.race([signIn(), tick()]);
  await tick();
  expect((await Promise.race([state.client!.auth.getSession().then(() => 'ready'), tick().then(() => 'stalled')]))).toBe('ready');
});

it('ignores a profile that finishes after unmount', async () => {
  let finish!: (value: Response) => void;
  profile = () => new Promise(resolve => { finish = resolve; });
  await signIn();
  await tick();
  act(() => renderer.unmount());
  finish(new Response(JSON.stringify({ completed_cases: [] })));
  await tick();
  expect(analytics.identifyUser).not.toHaveBeenCalled();
});

it('does not identify the previous account after a user switch', async () => {
  let finish!: (value: Response) => void;
  profile = () => new Promise(resolve => { finish = resolve; });
  await signIn();
  await tick();
  authUser = { ...user, id: 'another-detective' };
  profile = async () => new Response(JSON.stringify({ completed_cases: [] }));
  await signIn();
  await tick();
  finish(new Response(JSON.stringify({ completed_cases: ['case-001'] })));
  await tick();
  expect(analytics.identifyUser).toHaveBeenCalledTimes(1);
  expect(analytics.identifyUser).toHaveBeenCalledWith('another-detective', expect.anything());
});

it('keeps sign-in and sign-out working when the analytics client throws', async () => {
  analytics.capture.mockImplementationOnce(() => { throw new Error('analytics offline'); });
  analytics.resetUser.mockImplementationOnce(() => { throw new Error('analytics offline'); });
  await signIn();
  await state.client!.auth.signOut({ scope: 'local' });
  expect((await state.client!.auth.getSession()).data.session).toBeNull();
});
