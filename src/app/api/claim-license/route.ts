import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { emailsMatch } from "@/lib/email-match";
import { rateLimit } from "@/lib/rate-limit";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Defense-in-depth rate limit (best-effort, per-instance — see rate-limit.ts).
// Claiming is a sensitive, infrequent action; 10 attempts / 60s per IP is
// generous for legitimate use but throttles brute-forcing of session IDs.
const CLAIM_RATE_LIMIT = 10;
const CLAIM_RATE_WINDOW_MS = 60_000;

function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey);
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-vercel-forwarded-for") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  try {
    // Rate-limit early, before any work, keyed by IP + route.
    const ip = getClientIp(req);
    const limit = rateLimit(`claim-license:${ip}`, {
      limit: CLAIM_RATE_LIMIT,
      windowMs: CLAIM_RATE_WINDOW_MS,
    });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests, please slow down." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }

    const { stripeSessionId } = await req.json();

    if (!stripeSessionId) {
      return NextResponse.json(
        { error: "Missing stripe session ID" },
        { status: 400 }
      );
    }

    // User must be signed in to claim
    const supabase = createServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be signed in to claim your license" },
        { status: 401 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    // Look up the unclaimed pending license by Stripe session ID. The email
    // match below is what actually authorizes the claim.
    const { data: pending, error: fetchError } = await supabaseAdmin
      .from("pending_licenses")
      .select("*")
      .eq("stripe_session_id", stripeSessionId)
      .is("claimed_at", null)
      .single();

    if (fetchError || !pending) {
      return NextResponse.json(
        { error: "No pending license found for this purchase" },
        { status: 404 }
      );
    }

    // SECURITY (claim binding): the session_id is exposed in the checkout
    // success URL, so matching on it alone lets anyone who obtains a session_id
    // steal the purchase. Bind the claim to the buyer email captured at
    // checkout: the signed-in user's email must equal the pending row's email,
    // case-insensitively. A null/empty pending email never matches, so an
    // unidentified purchase can't be claimed by anyone.
    if (!emailsMatch(session.user.email, pending.email)) {
      return NextResponse.json(
        {
          error:
            "This purchase is registered to a different email. Sign in with the email used at checkout.",
        },
        { status: 403 }
      );
    }

    // Grant the license
    const { error: updateError } = await supabaseAdmin
      .from("user_info")
      .update({
        has_license: true,
        license_purchased_at: pending.created_at,
        stripe_customer_id: pending.stripe_customer_id,
        stripe_session_id: pending.stripe_session_id,
      })
      .eq("id", session.user.id);

    if (updateError) {
      console.error("Failed to grant license:", updateError);
      return NextResponse.json(
        { error: "Failed to grant license" },
        { status: 500 }
      );
    }

    // Mark pending license as claimed
    await supabaseAdmin
      .from("pending_licenses")
      .update({
        claimed_at: new Date().toISOString(),
        claimed_by: session.user.id,
      })
      .eq("id", pending.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Claim license error:", error);
    return NextResponse.json(
      { error: "Failed to claim license" },
      { status: 500 }
    );
  }
}
