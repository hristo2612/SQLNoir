import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { computeMigration, getFreeCaseXpMap } from "@/lib/migrate-progress";

/**
 * POST /api/migrate-progress
 *
 * Migrates an anonymous user's locally-stored solved FREE cases onto their
 * account after they sign in.
 *
 * SECURITY: the client sends ONLY case ids — never xp numbers. The server is the
 * sole source of truth:
 *   - the caller is authenticated via a Bearer access token (writes go ONLY to
 *     that user's own row);
 *   - incoming ids are filtered to KNOWN FREE (beginner) cases — paid cases
 *     (003–006) can never be credited here;
 *   - xp is recomputed from canonical case data, not from the request;
 *   - the merge is a set-union APPEND (never an overwrite) and is idempotent, so
 *     replaying the request credits nothing new.
 *
 * The pure recompute helpers live in `@/lib/migrate-progress` because App Router
 * route files may only export HTTP method handlers.
 */

export async function POST(req: NextRequest) {
  // --- Authenticate the caller ---
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }
  const token = authHeader.replace("Bearer ", "");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json(
      { error: "Invalid authentication" },
      { status: 401 }
    );
  }

  // --- Parse body (ids only; any xp the client sends is ignored) ---
  let body: { caseIds?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const incoming = Array.isArray(body.caseIds)
    ? body.caseIds.filter((x): x is string => typeof x === "string")
    : [];

  // --- Read current server-side state ---
  const { data: existingRow, error: fetchError } = await supabaseAdmin
    .from("user_info")
    .select("xp, completed_cases")
    .eq("id", user.id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json(
      { error: "Failed to read progress" },
      { status: 500 }
    );
  }

  const existingCases: string[] = Array.isArray(existingRow?.completed_cases)
    ? existingRow!.completed_cases.filter(
        (x: unknown): x is string => typeof x === "string"
      )
    : [];
  const currentXp: number =
    typeof existingRow?.xp === "number" ? existingRow!.xp : 0;

  // --- Server recompute (free-only, set-difference, canonical xp) ---
  const freeMap = getFreeCaseXpMap();
  const { newCases, addedXp } = computeMigration(
    freeMap,
    incoming,
    existingCases
  );

  if (newCases.length === 0) {
    // Idempotent no-op (nothing new to credit).
    return NextResponse.json({ success: true, addedXp: 0, added: [] });
  }

  const mergedCases = [...existingCases, ...newCases];
  const newXp = currentXp + addedXp;

  // Upsert by primary key. On an existing row this updates only the provided
  // columns (xp, completed_cases), preserving has_license and other fields. If
  // the row is somehow absent (it normally exists via the handle_new_user
  // trigger), it is created instead of crashing.
  const { error: writeError } = await supabaseAdmin
    .from("user_info")
    .upsert(
      { id: user.id, xp: newXp, completed_cases: mergedCases },
      { onConflict: "id" }
    );

  if (writeError) {
    return NextResponse.json(
      { error: "Failed to save progress" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, addedXp, added: newCases });
}
