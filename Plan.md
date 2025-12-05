# Plan: Faster Initial Load & Better UX for SQL Noir (Next.js)

## Findings (current state)
- The only blocking loader on first paint comes from `GameApp` waiting on `supabase.auth.getSession()`; everything else (cases, UI) is static and available immediately.
- Supabase is used via the browser client in `GameApp`, `AuthModal`, `ProfileMenu`, and `SolutionSubmission`. There is no server-side session fetch yet.
- Because the session is fetched client-side after hydration, we render a spinner before showing the dashboard/game state even when a user already has a valid session cookie.

## Steps to improve
1) Add SSR/edge session bootstrap  
   - Use a server-side Supabase client (`@supabase/auth-helpers-nextjs` or a small cookie-aware helper) in `src/app/page.tsx` to read the session from cookies during the server render.
   - Pass the initial session (and basic `user_info` row if available) into `GameApp` as props so the page can render immediately without a spinner for signed-in users.

2) Refactor `GameApp` to hydrate from server data  
   - Accept `initialSession`/`initialUserInfo` props and initialize state with them.  
   - Keep a lightweight client check (`onAuthStateChange`) for real-time login/logout, but avoid the blocking “loading” screen on initial load.

3) Polish loading UX where client calls remain  
   - Replace the full-screen spinner with an inline skeleton/toolbar placeholders only when a new fetch is actually in flight (e.g., after login or case switch), keeping the hero/dashboard visible.
   - Ensure random tip selection happens post-hydration to avoid SSR mismatches (already addressed).
