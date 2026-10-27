import React from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getAllCases } from '@/lib/case-utils';
const state = vi.hoisted(() => ({ client: null as SupabaseClient | null, solverMounts: 0 }));
vi.mock('@/lib/supabase', () => ({ get supabase() { return state.client; } }));
vi.mock('@/i18n/navigation', () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }) }));
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));
vi.mock('@/lib/license', () => ({ isCaseFree: () => false, getUserHasLicense: (info: { has_license?: boolean }) => Boolean(info?.has_license) }));
vi.mock('@vercel/analytics/react', () => ({ track: vi.fn() }));
vi.mock('@/lib/posthog-events', () => ({ trackCaseStarted: vi.fn() }));
vi.mock('../CaseSolver', () => ({ CaseSolver: () => { React.useEffect(() => { state.solverMounts++; }, []); return <div>investigation-open</div>; } }));
vi.mock('../PaywallModal', () => ({ PaywallModal: () => null }));
import { CasePageClient } from '../CasePageClient';
const user = { id: 'test-detective', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: '2026-01-01' };
let renderer: ReactTestRenderer;
let profile: () => Promise<Response>;
const tick = () => new Promise<void>(resolve => setTimeout(resolve, 20));
const text = () => JSON.stringify(renderer.toJSON());
beforeEach(async () => {
  state.solverMounts = 0;
  profile = async () => new Response(JSON.stringify({ has_license: true }));
  state.client = createClient('https://case-auth.example.test', 'test-key', {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: async url => String(url).includes('/auth/v1/logout') ? new Response('{}') : String(url).includes('/auth/v1/user') ? new Response(JSON.stringify(user)) : profile() },
  });
  await state.client.auth.initialize();
  await state.client.auth.setSession({ access_token: `x.${btoa(JSON.stringify({ exp: Math.floor(Date.now()/1000)+3600 }))}.x`, refresh_token: 'test-refresh' });
});
afterEach(() => { act(() => renderer.unmount()); state.client?.auth.stopAutoRefresh(); vi.useRealTimers(); });
function mount() { act(() => { renderer = create(<CasePageClient caseData={getAllCases()[3]} />); }); }
it('opens an entitled case and removes access on sign-out', async () => {
  mount(); await act(tick);
  expect(text()).toContain('investigation-open');
  await act(async () => { await state.client!.auth.signOut({ scope: 'local' }); });
  expect(text()).toContain('caseClassified');
  expect(text()).not.toContain('investigation-open');
});
it('rejects a late entitled profile after sign-out', async () => {
  let finish!: (value: Response) => void;
  profile = () => new Promise(resolve => { finish = resolve; });
  mount(); await act(tick);
  await act(async () => { await state.client!.auth.signOut({ scope: 'local' }); });
  await act(async () => { finish(new Response(JSON.stringify({ has_license: true }))); await tick(); });
  expect(text()).toContain('caseClassified');
  expect(text()).not.toContain('investigation-open');
});
it('ends a hung credential check with a retry that can recover', async () => {
  profile = () => new Promise(() => {});
  vi.useFakeTimers();
  mount();
  await act(async () => { await vi.advanceTimersByTimeAsync(10_010); });
  expect(text()).toContain('credentialError');
  profile = async () => new Response(JSON.stringify({ has_license: true }));
  act(() => renderer.root.findByType('button').props.onClick());
  await act(async () => { await vi.advanceTimersByTimeAsync(10); });
  expect(text()).toContain('investigation-open');
});

it('keeps the investigation mounted during same-user refocus', async () => {
  mount(); await act(tick);
  expect(state.solverMounts).toBe(1);
  await act(async () => {
    await state.client!.auth.setSession({ access_token: `x.${btoa(JSON.stringify({ exp: Math.floor(Date.now()/1000)+3600 }))}.x`, refresh_token: 'test-refresh' });
    await tick();
  });
  expect(text()).toContain('investigation-open');
  expect(state.solverMounts).toBe(1);
});
