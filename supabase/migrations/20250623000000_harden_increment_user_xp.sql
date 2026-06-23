-- NOT YET APPLIED. Coordinator/Jimbo applies migrations separately.

/*
  # Harden increment_user_xp

  Replaces the INSECURE 4-arg version (20250203224710_polished_temple.sql) which:
    - trusted a client-supplied `xp_amount`, and
    - OVERWROTE `completed_cases` with a client-supplied `cases_array`.

  New 2-arg version `increment_user_xp(user_id uuid, case_id text)`:
    - Looks up the xp reward SERVER-SIDE from a hardcoded map of ALL SIX cases
      (licensed users also earn xp on paid cases, so the map is not free-only).
    - RAISES on an unknown case_id (never silently credits).
    - Idempotent: only credits xp + APPENDS the case when it is not already in
      `completed_cases` (jsonb `?` existence check); appends with `||`, never
      overwrites the array.
    - Keeps SECURITY DEFINER, SET search_path = public, and the
      `auth.uid() = user_id` ownership guard so a caller can only modify their
      own row.
*/

-- Drop the old, insecure overload first so the 2-arg version is unambiguous.
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

  -- Server-side reward lookup. ALL SIX cases (paid cases credit xp for
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

  -- Already credited → no-op (idempotent re-submit).
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

-- Re-grant execute to authenticated users for the new signature.
GRANT EXECUTE ON FUNCTION increment_user_xp(uuid, text) TO authenticated;
