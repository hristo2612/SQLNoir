import React from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { getAllCases } from '@/lib/case-utils';
import { recordLocalSolve } from '@/lib/local-progress';
import { getPendingSolves, queuePendingSolve } from '@/lib/pending-progress';
import confetti from 'canvas-confetti';

type AuthSession = { user: { id: string }; access_token?: string } | null;
type AuthCallback = (event: string, session: AuthSession) => void;

const backend = vi.hoisted(() => ({
  getUser: vi.fn(),
  getSession: vi.fn(),
  rpc: vi.fn(),
  userInfoSingle: vi.fn(),
  paid: false,
  authUser: null as { id: string } | null,
  accessToken: undefined as string | undefined,
  authCallbacks: new Set<AuthCallback>(),
}));
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      ...backend,
      onAuthStateChange: (callback: AuthCallback) => {
        backend.authCallbacks.add(callback);
        callback(
          'INITIAL_SESSION',
          backend.authUser
            ? { user: backend.authUser, ...(backend.accessToken ? { access_token: backend.accessToken } : {}) }
            : null,
        );
        return {
          data: {
            subscription: {
              unsubscribe() {
                backend.authCallbacks.delete(callback);
              },
            },
          },
        };
      },
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => backend.userInfoSingle(),
        }),
      }),
    }),
    rpc: backend.rpc,
  },
}));
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
const paidCase = {
  ...getAllCases().find(c => c.id === 'case-004')!,
  solution: { answer: '', explanation: '', successMessage: '' },
};
const storage = new Map<string, string>();
const tick = () => new Promise<void>(resolve => setTimeout(resolve, 10));
beforeEach(() => {
  vi.clearAllMocks();
  backend.paid = false;
  backend.authUser = null;
  backend.accessToken = undefined;
  backend.authCallbacks.clear();
  backend.userInfoSingle.mockResolvedValue({ data: null });
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

it('shows already-solved state instead of the submission form when a signed-in user reopens a completed free case', async () => {
  const onSolve = vi.fn();
  backend.authUser = { id: 'returning-detective' };
  backend.userInfoSingle.mockResolvedValue({ data: { has_license: false, completed_cases: ['case-001'] } });

  act(() => { renderer.unmount(); renderer = create(<SolutionSubmission caseData={caseData} onSolve={onSolve} />); });
  await act(tick);

  const rendered = JSON.stringify(renderer.toJSON());
  expect(renderer.root.findAllByType('form')).toHaveLength(0);
  expect(rendered).toContain('solution.alreadySolved');
  expect(rendered).toContain('solution.caseClosedStamp');
  expect(rendered).toContain('solution.submittedAnswer');
  expect(rendered).toContain(caseData.solution.answer);
  expect(rendered).toContain(caseData.solution.explanation);
  expect(confetti).not.toHaveBeenCalled();
  expect(onSolve).not.toHaveBeenCalled();
});

it('fetches and displays solved details when a signed-in licensed user reopens a completed paid case', async () => {
  const onSolve = vi.fn();
  backend.paid = true;
  backend.authUser = { id: 'licensed-detective' };
  backend.accessToken = 'synthetic-token';
  backend.userInfoSingle.mockResolvedValue({ data: { has_license: true, completed_cases: ['case-004'] } });
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      solved: true,
      answer: 'Victor DiMarco',
      explanation: 'Masked ball evidence points to Victor DiMarco.',
      successMessage: 'You solved the masquerade murder.',
    }),
  });
  vi.stubGlobal('fetch', fetchMock);

  act(() => { renderer.unmount(); renderer = create(<SolutionSubmission caseData={paidCase} onSolve={onSolve} />); });
  await act(tick);

  const rendered = JSON.stringify(renderer.toJSON());
  expect(renderer.root.findAllByType('form')).toHaveLength(0);
  expect(fetchMock).toHaveBeenCalledWith(
    '/api/check-solution?caseId=case-004&locale=en',
    expect.objectContaining({
      method: 'GET',
      headers: expect.objectContaining({ Authorization: 'Bearer synthetic-token' }),
    }),
  );
  expect(rendered).toContain('solution.alreadySolved');
  expect(rendered).toContain('Victor DiMarco');
  expect(rendered).toContain('Masked ball evidence points to Victor DiMarco.');
  expect(rendered).toContain('You solved the masquerade murder.');
  expect(confetti).not.toHaveBeenCalled();
  expect(onSolve).not.toHaveBeenCalled();

  // Signing out clears the rendered paid solution details immediately.
  act(() => {
    for (const cb of backend.authCallbacks) cb('SIGNED_OUT', null);
  });
  const afterSignOut = JSON.stringify(renderer.toJSON());
  expect(renderer.root.findAllByType('form')).toHaveLength(1);
  expect(afterSignOut).not.toContain('solution.alreadySolved');
  expect(afterSignOut).not.toContain('Victor DiMarco');
  expect(afterSignOut).not.toContain('Masked ball evidence points to Victor DiMarco.');
});

it('keeps already-solved state when a signed-in solve is still pending sync', async () => {
  backend.authUser = { id: 'pending-detective' };
  queuePendingSolve('pending-detective', { caseId: 'case-001', answer: 'Vincent Malone', locale: 'en' });
  backend.userInfoSingle.mockResolvedValue({ data: { has_license: false, completed_cases: [] } });

  act(() => { renderer.unmount(); renderer = create(<SolutionSubmission caseData={caseData} onSolve={vi.fn()} />); });
  await act(tick);

  const rendered = JSON.stringify(renderer.toJSON());
  expect(renderer.root.findAllByType('form')).toHaveLength(0);
  expect(rendered).toContain('solution.alreadySolved');
  expect(rendered).toContain('Vincent Malone');
  expect(confetti).not.toHaveBeenCalled();
});

it('keeps the submission form visible when a signed-in user has only solved other cases', async () => {
  backend.authUser = { id: 'detective-other' };
  backend.userInfoSingle.mockResolvedValue({ data: { has_license: false, completed_cases: ['case-002'] } });
  recordLocalSolve('case-001');

  act(() => { renderer.unmount(); renderer = create(<SolutionSubmission caseData={caseData} onSolve={vi.fn()} />); });
  await act(tick);

  const rendered = JSON.stringify(renderer.toJSON());
  expect(renderer.root.findAllByType('form')).toHaveLength(1);
  expect(rendered).not.toContain('solution.alreadySolved');
});

it('clears paid solved details on sign-out and ignores late profile responses', async () => {
  backend.paid = true;
  backend.authUser = { id: 'licensed-detective' };
  backend.accessToken = 'synthetic-token';
  let resolveProfile!: (val: { data: { has_license: boolean; completed_cases: string[] } }) => void;
  backend.userInfoSingle.mockImplementation(() => new Promise(resolve => { resolveProfile = resolve; }));

  act(() => { renderer.unmount(); renderer = create(<SolutionSubmission caseData={paidCase} onSolve={vi.fn()} />); });
  await act(tick);

  act(() => {
    for (const cb of backend.authCallbacks) cb('SIGNED_OUT', null);
  });
  await act(async () => {
    resolveProfile({ data: { has_license: true, completed_cases: ['case-004'] } });
    await tick();
  });

  const rendered = JSON.stringify(renderer.toJSON());
  expect(renderer.root.findAllByType('form')).toHaveLength(1);
  expect(rendered).not.toContain('solution.alreadySolved');
});

it('shows already-solved state for anonymous users reopening a locally solved free case without confetti', async () => {
  recordLocalSolve('case-001');
  act(() => { renderer.unmount(); renderer = create(<SolutionSubmission caseData={caseData} onSolve={vi.fn()} />); });
  await act(tick);

  const rendered = JSON.stringify(renderer.toJSON());
  expect(renderer.root.findAllByType('form')).toHaveLength(0);
  expect(rendered).toContain('solution.alreadySolved');
  expect(rendered).toContain(caseData.solution.answer);
  expect(confetti).not.toHaveBeenCalled();
});
