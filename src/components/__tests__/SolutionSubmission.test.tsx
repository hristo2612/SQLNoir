import React from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { getAllCases } from '@/lib/case-utils';
import { getPendingSolves } from '@/lib/pending-progress';

const backend = vi.hoisted(() => ({ getUser: vi.fn(), getSession: vi.fn(), rpc: vi.fn(), paid: false, authUser: null as { id: string } | null }));
vi.mock('@/lib/supabase', () => ({ supabase: { auth: { ...backend,
  onAuthStateChange: (callback: (event: string, session: { user: { id: string } } | null) => void) => { callback("INITIAL_SESSION", backend.authUser ? { user: backend.authUser } : null); return { data: { subscription: { unsubscribe() {} } } }; } }, rpc: backend.rpc } }));
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key, useLocale: () => 'en' }));
vi.mock('@vercel/analytics/react', () => ({ track: vi.fn() }));
vi.mock('@/lib/posthog-events', () => ({ trackCaseCompleted: vi.fn(), trackCaseAbandoned: vi.fn() }));
vi.mock('@/lib/license', async importOriginal => ({ ...await importOriginal<typeof import('@/lib/license')>(), isCaseFree: () => !backend.paid }));
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));
vi.mock('../Paywall', () => ({ Paywall: () => null }));
import { track } from '@vercel/analytics/react';
import { trackCaseAbandoned, trackCaseCompleted } from '@/lib/posthog-events';
import { SolutionSubmission } from '../case-study/SolutionSubmission';

let renderer: ReactTestRenderer;
const caseData = getAllCases().find(c => c.id === 'case-001')!;
const stolenSoundCase = getAllCases().find(c => c.id === 'case-002')!;
const storage = new Map<string, string>();
beforeEach(() => {
  vi.clearAllMocks();
  backend.paid = false;
  backend.authUser = null;
  storage.clear();
  vi.stubGlobal('window', Object.assign(new EventTarget(), { matchMedia: () => ({ matches: true }), localStorage: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
  } }));
  backend.getUser.mockReturnValue(new Promise(() => {}));
  backend.rpc.mockResolvedValue({ error: null });
  act(() => { renderer = create(<SolutionSubmission caseData={caseData} onSolve={vi.fn()} />); });
});
afterEach(() => { act(() => renderer.unmount()); vi.unstubAllGlobals(); vi.useRealTimers(); });
async function submit(answer = caseData.solution.answer) {
  act(() => renderer.root.findByType('input').props.onChange({ target: { value: answer } }));
  await act(async () => renderer.root.findByType('form').props.onSubmit({ preventDefault() {} }));
}
it('keeps anonymous free play immediate and available for migration', async () => {
  await submit();
  expect(JSON.stringify(renderer.toJSON())).toContain('solution.caseSolved');
  expect(JSON.parse(storage.get('sqlnoir_local_progress')!)).toContain(caseData.id);
});
it('retains a signed-in solve before success and after component unmount without awaiting auth', async () => {
  backend.authUser = { id: 'test-detective' };
  act(() => { renderer.unmount(); renderer = create(<SolutionSubmission caseData={caseData} onSolve={vi.fn()} />); });
  await submit();
  expect(JSON.stringify(renderer.toJSON())).toContain('solution.caseSolved');
  expect(backend.getUser).not.toHaveBeenCalled();
  expect(getPendingSolves('test-detective')).toHaveLength(1);
  expect(storage.get('sqlnoir_local_progress')).toBeUndefined();
  act(() => renderer.unmount());
  expect(getPendingSolves('test-detective')[0].caseId).toBe(caseData.id);
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

it('keeps a verified paid solve scoped to the account used by the server request', async () => {
  backend.paid = true;
  backend.getSession.mockResolvedValue({ data: { session: { user: { id: 'licensed-detective' }, access_token: 'synthetic-token' } } });
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ correct: true }) }));
  await submit();
  expect(JSON.stringify(renderer.toJSON())).toContain('solution.caseSolved');
  expect(getPendingSolves('licensed-detective')).toHaveLength(1);
  expect(storage.get('sqlnoir_local_progress')).toBeUndefined();
});
it('does not claim saved success if durable storage fails', async () => {
  backend.authUser = { id: 'test-detective' };
  act(() => { renderer.unmount(); renderer = create(<SolutionSubmission caseData={caseData} onSolve={vi.fn()} />); });
  vi.spyOn(window.localStorage, 'setItem').mockImplementationOnce(() => { throw new Error('quota'); });
  await submit();
  expect(JSON.stringify(renderer.toJSON())).not.toContain('solution.caseSolved');
  expect(JSON.stringify(renderer.toJSON())).toContain('solution.progressError');
  expect(renderer.root.findByProps({ type: 'submit' }).props.disabled).toBe(false);
});

it('solves case-002 (The Stolen Sound) for anonymous users after wrong attempts without looping', async () => {
  act(() => { renderer.unmount(); renderer = create(<SolutionSubmission caseData={stolenSoundCase} onSolve={vi.fn()} />); });

  for (const wrongName of ['Tony Ramirez', 'Mickey Rivera']) {
    await submit(wrongName);
    expect(JSON.stringify(renderer.toJSON())).toContain('solution.notQuiteRight');
    act(() => renderer.root.findByType('button').props.onClick());
    expect(renderer.root.findByProps({ type: 'submit' }).props.disabled).toBe(false);
  }

  await submit('  rico delgado  ');
  expect(JSON.stringify(renderer.toJSON())).toContain('solution.caseSolved');
  expect(JSON.parse(storage.get('sqlnoir_local_progress')!)).toContain('case-002');
});

it('solves case-002 (The Stolen Sound) for signed-in users without stalling and retains pending progress across reload', async () => {
  backend.authUser = { id: 'stolen-sound-detective' };
  act(() => { renderer.unmount(); renderer = create(<SolutionSubmission caseData={stolenSoundCase} onSolve={vi.fn()} />); });

  await submit('Tony Ramirez');
  expect(JSON.stringify(renderer.toJSON())).toContain('solution.notQuiteRight');
  act(() => renderer.root.findByType('button').props.onClick());

  await submit('Rico Delgado');
  expect(JSON.stringify(renderer.toJSON())).toContain('solution.caseSolved');
  expect(backend.getUser).not.toHaveBeenCalled();
  expect(getPendingSolves('stolen-sound-detective')).toEqual([
    expect.objectContaining({ caseId: 'case-002', answer: 'Rico Delgado', locale: 'en' }),
  ]);
  expect(storage.get('sqlnoir_local_progress')).toBeUndefined();

  // Simulate page reload before background XP sync finishes
  act(() => renderer.unmount());
  expect(getPendingSolves('stolen-sound-detective')[0].caseId).toBe('case-002');
});

it('isolates analytics failures so case-002 retries and solves never show verification errors', async () => {
  act(() => { renderer.unmount(); renderer = create(<SolutionSubmission caseData={stolenSoundCase} onSolve={vi.fn()} />); });
  vi.mocked(track).mockImplementation(() => { throw new Error('analytics blocked'); });
  vi.mocked(trackCaseAbandoned).mockImplementation(() => { throw new Error('posthog blocked'); });
  vi.mocked(trackCaseCompleted).mockImplementation(() => { throw new Error('posthog blocked'); });

  await submit('Tony Ramirez');
  expect(JSON.stringify(renderer.toJSON())).toContain('solution.notQuiteRight');
  act(() => renderer.root.findByType('button').props.onClick());
  expect(JSON.stringify(renderer.toJSON())).not.toContain('solution.verificationError');
  expect(renderer.root.findByProps({ type: 'submit' }).props.disabled).toBe(false);

  await submit('Rico Delgado');
  expect(JSON.stringify(renderer.toJSON())).toContain('solution.caseSolved');
  expect(JSON.stringify(renderer.toJSON())).not.toContain('solution.verificationError');
});

it('ignores duplicate form submits while a submission is already in flight', async () => {
  backend.paid = true;
  let resolveSession!: (value: { data: { session: { user: { id: string }; access_token: string } } }) => void;
  backend.getSession.mockImplementation(() => new Promise(resolve => { resolveSession = resolve; }));
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ correct: true }) });
  vi.stubGlobal('fetch', fetchMock);

  act(() => renderer.root.findByType('input').props.onChange({ target: { value: 'Rico Delgado' } }));
  let first!: Promise<void>;
  let second!: Promise<void>;
  act(() => {
    first = renderer.root.findByType('form').props.onSubmit({ preventDefault() {} });
    second = renderer.root.findByType('form').props.onSubmit({ preventDefault() {} });
  });
  await act(async () => {
    resolveSession({ data: { session: { user: { id: 'licensed-detective' }, access_token: 'synthetic-token' } } });
    await Promise.all([first, second]);
  });
  expect(backend.getSession).toHaveBeenCalledTimes(1);
  expect(fetchMock).toHaveBeenCalledTimes(1);
});
