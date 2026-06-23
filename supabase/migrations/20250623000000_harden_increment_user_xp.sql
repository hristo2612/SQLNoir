-- Backward-compatible hardening migration. Safe to apply before the app deploy.

/*
  # Harden increment_user_xp

  Replaces the insecure 4-arg version (20250203224710_polished_temple.sql) which:
    - trusted a client-supplied `xp_amount`, and
    - overwrote `completed_cases` with a client-supplied `cases_array`.

  New 2-arg version `increment_user_xp(user_id uuid, case_id text)`:
    - Looks up the xp reward server-side from a hardcoded map of all six cases
      (licensed users also earn xp on paid cases, so the map is not free-only).
    - Raises on an unknown case_id (never silently credits).
    - Idempotent: only credits xp + APPENDS the case when it is not already in
      `completed_cases` (jsonb `?` existence check); appends with `||`, never
      overwrites the array.
    - Keeps SECURITY DEFINER, SET search_path = public, and the
      `auth.uid() = user_id` ownership guard so a caller can only modify their
      own row.

  Backward compatibility:
    - Recreates the old 4-arg signature as a secure wrapper for currently-live
      clients.
    - The wrapper ignores `xp_amount` and `cases_array`, then delegates to the
      hardened 2-arg function with only `user_id` and `case_id`.
*/

-- Drop the old insecure overload first, then recreate it as a safe wrapper.
DROP FUNCTION IF EXISTS increment_user_xp(uuid, integer, text, jsonb);

CREATE OR REPLACE FUNCTION increment_user_xp(
  user_id uuid,
  case_id text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  reward integer;
  already_solved boolean;
BEGIN
  -- Ownership guard: a caller may only ever modify their own row.
  IF auth.uid() IS NULL OR auth.uid() <> user_id THEN
    RAISE EXCEPTION 'Unable to update user progress';
  END IF;

  -- Server-side reward lookup. All six cases (paid cases credit xp for
  -- licensed users). Unknown ids are rejected, never silently credited.
  reward := CASE case_id
    WHEN 'case-001' THEN 50
    WHEN 'case-002' THEN 100
    WHEN 'case-003' THEN 200
    WHEN 'case-004' THEN 300
    WHEN 'case-005' THEN 1000
    WHEN 'case-006' THEN 250
    ELSE NULL
  END;

  IF reward IS NULL THEN
    RAISE EXCEPTION 'Unknown case_id: %', case_id;
  END IF;

  -- Idempotency check: has this case already been recorded for the user?
  SELECT (COALESCE(completed_cases, '[]'::jsonb) ? case_id)
    INTO already_solved
  FROM user_info
  WHERE id = user_id;

  -- Row must exist (trigger creates it on signup).
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Unable to update user progress';
  END IF;

  -- Already credited: no-op (idempotent re-submit).
  IF already_solved THEN
    RETURN;
  END IF;

  -- Append the case and credit xp atomically. Never overwrites the array.
  UPDATE user_info
  SET
    xp = COALESCE(xp, 0) + reward,
    completed_cases = COALESCE(completed_cases, '[]'::jsonb)
                      || to_jsonb(case_id::text),
    updated_at = now()
  WHERE id = user_id
    AND auth.uid() = user_id; -- defense in depth: re-assert ownership

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Unable to update user progress';
  END IF;
END;
$$;

-- Compatibility wrapper for the currently-live client. This preserves the old
-- RPC shape while discarding the untrusted client-supplied xp and cases array.
CREATE OR REPLACE FUNCTION increment_user_xp(
  user_id uuid,
  xp_amount integer,
  case_id text,
  cases_array jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM increment_user_xp(user_id, case_id);
END;
$$;

-- Re-grant execute to authenticated users for both signatures.
GRANT EXECUTE ON FUNCTION increment_user_xp(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_user_xp(uuid, integer, text, jsonb) TO authenticated;
