-- 3 Nov 2026: pending_licenses had row level security off, and anon and authenticated held full
-- table rights, so anyone with the public anon key could read buyer emails and Stripe ids and
-- forge, claim or delete rows. Only the server routes use this table, through the service role,
-- which bypasses RLS and keeps its rights.
alter table public.pending_licenses enable row level security;
revoke all on table public.pending_licenses from anon, authenticated;
