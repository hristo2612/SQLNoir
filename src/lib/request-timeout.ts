/** Bound UI waits even when an SDK operation is waiting for its auth lock. */
export async function withTimeout<T>(request: PromiseLike<T>, ms = 10_000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      Promise.resolve(request),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('Request timed out. Please try again.')), ms);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}
