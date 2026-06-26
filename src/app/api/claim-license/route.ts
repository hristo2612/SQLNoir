import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { emailsMatch } from "@/lib/email-match";
import { rateLimit } from "@/lib/rate-limit";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Defense-in-depth rate limit (best-effort, per-instance - see rate-limit.ts).
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

    // stripeSessionId is OPTIONAL. With it, we claim that one purchase (the
    // checkout-success path). Without it, we claim ANY unclaimed pending license
    // matching the signed-in user's email - the auto-claim-on-sign-in path that
    // rescues a purchase whose success tab was closed, or one made before the
    // buyer had an account.
    const body = await req
      .json()
      .catch(() => ({}) as { stripeSessionId?: string });
    const stripeSessionId: string | undefined = body?.stripeSessionId;

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    // Resolve the signed-in user. The app uses Supabase's implicit OAuth flow, so
    // a Google sign-in stores the session in the BROWSER (localStorage), not in
    // cookies - the cookie-based server client only sees it for some flows. So
    // prefer the Bearer access token the client sends (same pattern as
    // check-solution), and fall back to the cookie session when there's no header.
    let authedUser: { id: string; email: string | null } | null = null;

    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const {
        data: { user },
      } = await supabaseAdmin.auth.getUser(token);
      if (user) authedUser = { id: user.id, email: user.email ?? null };
    }

    if (!authedUser) {
      const {
        data: { session },
      } = await createServerSupabaseClient().auth.getSession();
      if (session?.user) {
        authedUser = { id: session.user.id, email: session.user.email ?? null };
      }
    }

    if (!authedUser) {
      return NextResponse.json(
        { error: "You must be signed in to claim your license" },
        { status: 401 }
      );
    }

    const claimantEmail = (authedUser.email || "").trim().toLowerCase();

    if (stripeSessionId) {
      // --- Session-ID claim (checkout-success path) ---
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
      // success URL, so matching on it alone lets anyone who obtains a
      // session_id steal the purchase. Bind the claim to the buyer email
      // captured at checkout: the signed-in user's email must equal the pending
      // row's email, case-insensitively. A null/empty pending email never
      // matches, so an unidentified purchase can't be claimed by anyone.
      if (!emailsMatch(authedUser.email, pending.email)) {
        return NextResponse.json(
          {
            error:
              "This purchase is registered to a different email. Sign in with the email used at checkout.",
          },
          { status: 403 }
        );
      }

      // Grant the license. UPSERT (not update) so a missing user_info row can't
      // silently swallow the grant - see the webhook grant for the full rationale.
      const { error: updateError } = await supabaseAdmin
        .from("user_info")
        .upsert(
          {
            id: authedUser.id,
            has_license: true,
            license_purchased_at: pending.created_at,
            stripe_customer_id: pending.stripe_customer_id,
            stripe_session_id: pending.stripe_session_id,
            // Persist payment_intent so a later refund/dispute can map back to this
            // buyer. Revocation looks the buyer up by user_info.payment_intent, and
            // the anonymous-buy-then-claim path is the only place it gets written
            // for claimed purchases. Without this, a refunded anon-claimed buyer
            // would keep access.
            payment_intent: pending.payment_intent,
          },
          { onConflict: "id" }
        );

      if (updateError) {
        console.error("Failed to grant license:", updateError);
        return NextResponse.json(
          { error: "Failed to grant license" },
          { status: 500 }
        );
      }

      // Mark pending license as claimed (only after a successful grant).
      await supabaseAdmin
        .from("pending_licenses")
        .update({
          claimed_at: new Date().toISOString(),
          claimed_by: authedUser.id,
        })
        .eq("id", pending.id);

      return NextResponse.json({ success: true });
    }

    // --- Email-mode claim (auto-claim on sign-in) ---
    // No session id: grant if any unclaimed pending license matches the signed-in
    // user's email. Idempotent: no match -> no-op; already licensed -> harmless
    // re-grant. The email is the authorization (same binding as above), so this
    // is safe to call on every sign-in.
    if (!claimantEmail) {
      return NextResponse.json({ success: true, claimed: 0 });
    }

    // Stable no-op once licensed. This runs on every sign-in (LicenseSync), so if
    // the user already holds a license we must NOT consume their remaining pending
    // purchases: a buyer can have more than one purchase on the same email (an
    // accidental double-buy), and the extras are kept UNCLAIMED on purpose so a
    // later refund can roll the license over to a still-valid purchase instead of
    // pulling access (see revokeLicenseByPaymentIntent). Consuming them here would
    // also rewrite user_info.payment_intent backwards on each sign-in.
    const { data: current } = await supabaseAdmin
      .from("user_info")
      .select("has_license")
      .eq("id", authedUser.id)
      .maybeSingle();
    if (current?.has_license) {
      return NextResponse.json({
        success: true,
        claimed: 0,
        alreadyLicensed: true,
      });
    }

    const { data: pendings, error: pendingsError } = await supabaseAdmin
      .from("pending_licenses")
      .select("*")
      .is("claimed_at", null)
      .eq("email", claimantEmail)
      // Newest first so `pendings[0]` (whose payment_intent we persist to
      // user_info) is deterministically the most recent purchase.
      .order("created_at", { ascending: false });

    if (pendingsError) {
      console.error("Failed to read pending licenses:", pendingsError);
      return NextResponse.json(
        { error: "Failed to claim license" },
        { status: 500 }
      );
    }

    if (!pendings || pendings.length === 0) {
      return NextResponse.json({ success: true, claimed: 0 });
    }

    // Back the license with exactly ONE purchase (the newest). One license unlocks
    // everything, so a second purchase adds nothing but insurance. Claiming only the
    // newest keeps user_info.payment_intent a clean 1:1 with the backing purchase;
    // any older same-email purchases stay UNCLAIMED as refund-rollover candidates.
    const newest = pendings[0];
    const { error: grantError } = await supabaseAdmin
      .from("user_info")
      .upsert(
        {
          id: authedUser.id,
          has_license: true,
          license_purchased_at: newest.created_at,
          stripe_customer_id: newest.stripe_customer_id,
          stripe_session_id: newest.stripe_session_id,
          // See session-id branch: persist payment_intent so refund revocation can
          // find this buyer by user_info.payment_intent.
          payment_intent: newest.payment_intent,
        },
        { onConflict: "id" }
      );

    if (grantError) {
      console.error("Failed to grant license (email mode):", grantError);
      return NextResponse.json(
        { error: "Failed to grant license" },
        { status: 500 }
      );
    }

    // Mark only the backing (newest) pending row claimed (after a successful grant).
    await supabaseAdmin
      .from("pending_licenses")
      .update({
        claimed_at: new Date().toISOString(),
        claimed_by: authedUser.id,
      })
      .eq("id", newest.id);

    return NextResponse.json({ success: true, claimed: 1 });
  } catch (error: any) {
    console.error("Claim license error:", error);
    return NextResponse.json(
      { error: "Failed to claim license" },
      { status: 500 }
    );
  }
}
