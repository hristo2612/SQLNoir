import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const state = vi.hoisted(() => ({
  authUser: null as { id: string } | null,
  authError: null as { message: string } | null,
  userInfo: null as { has_license?: boolean; completed_cases?: string[] } | null,
  freeOverride: null as boolean | null,
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: {
      getUser: vi.fn(async () => ({
        data: { user: state.authUser },
        error: state.authError,
      })),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: state.userInfo, error: null }),
        }),
      }),
    }),
  }),
}));

vi.mock('@/lib/license', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/license')>();
  return {
    ...actual,
    isCaseFree: (caseData: Parameters<typeof actual.isCaseFree>[0]) =>
      state.freeOverride !== null ? state.freeOverride : actual.isCaseFree(caseData),
  };
});

import { GET } from '../route';

let ipCounter = 1;
function makeGetRequest(query: string, token?: string) {
  const headers: Record<string, string> = {
    'x-forwarded-for': `10.0.0.${ipCounter++}`,
  };
  if (token) headers.authorization = `Bearer ${token}`;
  return new NextRequest(`https://www.sqlnoir.com/api/check-solution${query}`, {
    method: 'GET',
    headers,
  });
}

describe('GET /api/check-solution', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'synthetic-service-key';
    state.authUser = { id: 'detective-1' };
    state.authError = null;
    state.userInfo = { has_license: true, completed_cases: ['case-004'] };
    state.freeOverride = false;
  });

  it('returns 400 when caseId is missing', async () => {
    const res = await GET(makeGetRequest('', 'token-1'));
    expect(res.status).toBe(400);
  });

  it('returns 404 when caseId does not exist', async () => {
    const res = await GET(makeGetRequest('?caseId=case-999', 'token-1'));
    expect(res.status).toBe(404);
  });

  it('returns 401 without a Bearer token', async () => {
    const res = await GET(makeGetRequest('?caseId=case-004'));
    expect(res.status).toBe(401);
  });

  it('returns 403 for a paid case when user lacks a license', async () => {
    state.userInfo = { has_license: false, completed_cases: ['case-004'] };
    const res = await GET(makeGetRequest('?caseId=case-004', 'token-1'));
    expect(res.status).toBe(403);
  });

  it('returns solved: false without leaking solution details when the case is not completed', async () => {
    state.userInfo = { has_license: true, completed_cases: ['case-001'] };
    const res = await GET(makeGetRequest('?caseId=case-004&locale=en', 'token-1'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ solved: false });
    expect(body.answer).toBeUndefined();
    expect(body.explanation).toBeUndefined();
    expect(body.successMessage).toBeUndefined();
  });

  it('returns localized solution details with private no-store caching when the authenticated user has solved the case', async () => {
    const resEn = await GET(makeGetRequest('?caseId=case-004&locale=en', 'token-1'));
    expect(resEn.status).toBe(200);
    expect(resEn.headers.get('cache-control')).toBe('private, no-store');
    const bodyEn = await resEn.json();
    expect(bodyEn.solved).toBe(true);
    expect(bodyEn.answer.length).toBeGreaterThan(0);
    expect(bodyEn.explanation.length).toBeGreaterThan(0);
    expect(bodyEn.successMessage.length).toBeGreaterThan(0);

    const resPt = await GET(makeGetRequest('?caseId=case-004&locale=pt-br', 'token-1'));
    expect(resPt.status).toBe(200);
    const bodyPt = await resPt.json();
    expect(bodyPt.solved).toBe(true);
    expect(bodyPt.explanation).not.toBe(bodyEn.explanation);
  });
});
