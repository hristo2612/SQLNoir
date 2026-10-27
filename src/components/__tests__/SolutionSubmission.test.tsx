import React from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { getAllCases } from '@/lib/case-utils';

const backend = vi.hoisted(() => ({ getUser: vi.fn(), getSession: vi.fn(), rpc: vi.fn(), paid: false, authUser: null as { id: string } | null }));
vi.mock('@/lib/supabase', () => ({ supabase: { auth: { ...backend,
  onAuthStateChange: (callback: (event: string, session: { user: { id: string } } | null) => void) => { callback("INITIAL_SESSION", backend.authUser ? { user: backend.authUser } : null); return { data: { subscription: { unsubscribe() {} } } }; } }, rpc: backend.rpc } }));
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key, useLocale: () => 'en' }));
vi.mock('@vercel/analytics/react', () => ({ track: vi.fn() }));
vi.mock('@/lib/posthog-events', () => ({ trackCaseCompleted: vi.fn(), trackCaseAbandoned: vi.fn() }));
vi.mock('@/lib/license', async importOriginal => ({ ...await importOriginal<typeof import('@/lib/license')>(), isCaseFree: () => !backend.paid }));
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));
vi.mock('../Paywall', () => ({ Paywall: () => null }));
import { SolutionSubmission } from '../case-study/SolutionSubmission';

let renderer: ReactTestRenderer;
const caseData = getAllCases().find(c => c.id === 'case-001')!;
const storage = new Map<string, string>();
beforeEach(() => {
  vi.clearAllMocks();
  backend.paid = false;
  backend.authUser = null;
  storage.clear();
  vi.stubGlobal('window', { matchMedia: () => ({ matches: true }), localStorage: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  } });
  backend.getUser.mockReturnValue(new Promise(() => {}));
  backend.rpc.mockResolvedValue({ error: null });
  act(() => { renderer = create(<SolutionSubmission caseData={caseData} onSolve={vi.fn()} />); });
});
afterEach(() => { act(() => renderer.unmount()); vi.unstubAllGlobals(); vi.useRealTimers(); });
async function submit(answer = caseData.solution.answer) {
  act(() => renderer.root.findByType('input').props.onChange({ target: { value: answer } }));
  await act(async () => renderer.root.findByType('form').props.onSubmit({ preventDefault() {} }));
}
it('shows a correct free answer even if getUser never finishes and retains migration progress', async () => {
  await submit();
  expect(JSON.stringify(renderer.toJSON())).toContain('solution.caseSolved');
  expect(JSON.parse(storage.get('sqlnoir_local_progress')!)).toContain(caseData.id);
});
it('shows success before a delayed XP write, and lets that write finish after unmount', async () => {
  let finish!: (value: { error: null }) => void;
  backend.getUser.mockResolvedValue({ data: { user: { id: 'test-detective' } } });
  backend.rpc.mockReturnValue(new Promise(resolve => { finish = resolve; }));
  await submit();
  expect(JSON.stringify(renderer.toJSON())).toContain('solution.caseSolved');
  expect(backend.rpc).toHaveBeenCalledWith('increment_user_xp', { user_id: 'test-detective', case_id: caseData.id });
  act(() => renderer.unmount());
  finish({ error: null });
});
it('leaves wrong answers retryable', async () => {
  await submit('incorrect');
  expect(JSON.stringify(renderer.toJSON())).toContain('solution.notQuiteRight');
  expect(backend.rpc).not.toHaveBeenCalled();
  act(() => renderer.root.findByType('button').props.onClick());
  expect(renderer.root.findAllByType('form')).toHaveLength(1);
});

it('restores the paid submit button after a stalled session request', async () => {
  backend.paid = true;
  backend.getSession.mockReturnValue(new Promise(() => {}));
  vi.useFakeTimers();
  act(() => renderer.root.findByType('input').props.onChange({ target: { value: 'answer' } }));
  let submission!: Promise<void>;
  act(() => { submission = renderer.root.findByType('form').props.onSubmit({ preventDefault() {} }); });
  await act(async () => { await vi.advanceTimersByTimeAsync(10_000); await submission; });
  expect(JSON.stringify(renderer.toJSON())).toContain('solution.verificationError');
  expect(renderer.root.findByProps({ type: 'submit' }).props.disabled).toBe(false);
});

it('keeps a signed-in write out of anonymous migration and retains a failed free solve', async () => {
  const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {});
  try {
    backend.authUser = { id: 'test-detective' };
    backend.getUser.mockResolvedValue({ data: { user: backend.authUser } });
    let finish!: (value: { error: Error }) => void;
    backend.rpc.mockReturnValue(new Promise(resolve => { finish = resolve; }));
    act(() => { renderer.unmount(); renderer = create(<SolutionSubmission caseData={caseData} onSolve={vi.fn()} />); });
    await submit();
    expect(JSON.stringify(renderer.toJSON())).toContain('solution.caseSolved');
    expect(storage.get('sqlnoir_local_progress')).toBeUndefined();
    await act(async () => { finish({ error: new Error('offline') }); });
    expect(JSON.parse(storage.get('sqlnoir_local_progress')!)).toContain(caseData.id);
  } finally { errorLog.mockRestore(); }
});
