import { afterEach, expect, it, vi } from 'vitest';
import { withTimeout } from '../request-timeout';
afterEach(() => vi.useRealTimers());
it('releases a UI wait even when the SDK promise never settles', async () => {
  vi.useFakeTimers();
  const request = withTimeout(new Promise(() => {}));
  const rejected = expect(request).rejects.toThrow('Request timed out');
  await vi.advanceTimersByTimeAsync(10_000);
  await rejected;
  expect(vi.getTimerCount()).toBe(0);
});
it('clears the deadline after success and propagates failures', async () => {
  vi.useFakeTimers();
  await expect(withTimeout(Promise.resolve('ready'))).resolves.toBe('ready');
  await expect(withTimeout(Promise.reject(new Error('offline')))).rejects.toThrow('offline');
  expect(vi.getTimerCount()).toBe(0);
});
