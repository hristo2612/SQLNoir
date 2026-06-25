import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { PostHog } from "posthog-node";
import { revokeLicenseByPaymentIntent } from "@/lib/license-revoke";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Mirror the values from src/lib/posthog.ts without importing that module
// (it pulls in the browser-only posthog-js library).
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = "https://us.i.posthog.com";

function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Capture a server-side `purchase_completed` event in PostHog. Runs in a
// short-lived serverless context, so we always flush + shutdown before
// returning so the event is actually delivered.
async function capturePurchaseCompleted(session: any, paymentIntent: string | null) {
  if (!POSTHOG_KEY) return;

  try {
    const distinctId =
      session.metadata?.user_id ||
      session.customer_details?.email ||
      session.customer_email ||
      session.id;

    const posthog = new PostHog(POSTHOG_KEY, { host: POSTHOG_HOST });
    posthog.capture({
      distinctId,
      event: "purchase_completed",
      properties: {
        amount_total: session.amount_total,
        currency: session.currency ?? session.metadata?.currency ?? null,
        country: session.metadata?.country ?? null,
        tier: session.metadata?.tier ?? null,
        ppp_price: session.metadata?.ppp_price ?? null,
        stripe_session_id: session.id,
        payment_intent: paymentIntent,
      },
    });
    await posthog.shutdown();
  } catch (err) {
    console.error("Failed to capture purchase_completed in PostHog:", err);
  }
}

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.user_id;
    const paymentIntent =
      typeof session.payment_intent === "string" ? session.payment_intent : null;

    if (!session.id) {
      console.error("Webhook received session without id");
      return NextResponse.json(
        { error: "Invalid session data" },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      console.error("Supabase admin client not configured");
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    if (userId) {
      // Idempotency check: skip if this session was already processed
      const { data: existing } = await supabaseAdmin
        .from("user_info")
        .select("stripe_session_id")
        .eq("id", userId)
        .single();

      if (existing?.stripe_session_id === session.id) {
        console.log(`License already granted for session ${session.id}, skipping`);
        return NextResponse.json({ received: true });
      }

      // Signed-in purchase: grant license immediately. UPSERT (not update) so a
      // missing user_info row can never silently swallow the grant: a plain
      // update().eq("id") affects 0 rows without erroring if the row is absent
      // (e.g. the handle_new_user trigger failed), leaving a paying buyer
      // charged but ungranted while the webhook still returns 200. onConflict:id
      // means create-or-update; the row's other columns keep their defaults.
      const { error } = await supabaseAdmin
        .from("user_info")
        .upsert(
          {
            id: userId,
            has_license: true,
            license_purchased_at: new Date().toISOString(),
            stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
            stripe_session_id: session.id,
            payment_intent: paymentIntent,
          },
          { onConflict: "id" }
        );

      if (error) {
        console.error("Failed to update license:", error);
        return NextResponse.json(
          { error: "Failed to update license" },
          { status: 500 }
        );
      }

      console.log(`License granted to user ${userId}`);
      await capturePurchaseCompleted(session, paymentIntent);
    } else {
      // Idempotency check: skip if this session was already stored
      const { data: existingPending } = await supabaseAdmin
        .from("pending_licenses")
        .select("id")
        .eq("stripe_session_id", session.id)
        .maybeSingle();

      if (existingPending) {
        console.log(`Pending license already stored for session ${session.id}, skipping`);
        return NextResponse.json({ received: true });
      }

      const rawEmail = session.customer_details?.email || session.customer_email;
      if (!rawEmail) {
        console.error("Webhook received session without customer email");
        return NextResponse.json(
          { error: "Missing customer email" },
          { status: 400 }
        );
      }
      // Normalize to lowercase + trimmed so the claim-license email-match gate
      // (which also normalizes) is a reliable equality check.
      const email = rawEmail.toLowerCase().trim();

      // Anonymous purchase: store as pending license to be claimed after sign-in
      const { error } = await supabaseAdmin
        .from("pending_licenses")
        .insert({
          email,
          stripe_session_id: session.id,
          stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
          payment_intent: paymentIntent,
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error("Failed to store pending license:", error);
        return NextResponse.json(
          { error: "Failed to store pending license" },
          { status: 500 }
        );
      }

      console.log(`Pending license stored for email: ${email}`);
      await capturePurchaseCompleted(session, paymentIntent);
    }
  } else if (event.type === "charge.refunded") {
    // Revoke access on a FULL refund only. Stripe sets charge.refunded=true once the charge is
    // fully refunded; partial refunds leave it false and keep access.
    const charge = event.data.object;
    if (!charge.refunded) {
      console.log(`Partial refund on charge ${charge.id}, keeping access`);
      return NextResponse.json({ received: true });
    }
    const paymentIntent =
      typeof charge.payment_intent === "string" ? charge.payment_intent : null;
    if (!paymentIntent) {
      console.log("Refund without payment_intent, skipping");
      return NextResponse.json({ received: true });
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      console.error("Supabase admin client not configured");
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const outcome = await revokeLicenseByPaymentIntent(
      supabaseAdmin,
      paymentIntent,
      `refund: ${charge.id}`
    );
    if (outcome.result === "error") {
      console.error(`Failed to revoke on refund ${charge.id}:`, outcome.error);
      return NextResponse.json({ error: "Failed to revoke license" }, { status: 500 });
    }
    console.log(`Refund ${charge.id} -> revoke outcome: ${outcome.result}`);
  } else if (event.type === "charge.dispute.created") {
    // Chargeback: revoke immediately (low-ticket game; if they dispute the charge, pull access).
    const dispute = event.data.object;
    const paymentIntent =
      typeof dispute.payment_intent === "string" ? dispute.payment_intent : null;
    if (!paymentIntent) {
      console.log("Dispute without payment_intent, skipping");
      return NextResponse.json({ received: true });
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      console.error("Supabase admin client not configured");
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const outcome = await revokeLicenseByPaymentIntent(
      supabaseAdmin,
      paymentIntent,
      `chargeback: ${dispute.id}`
    );
    if (outcome.result === "error") {
      console.error(`Failed to revoke on dispute ${dispute.id}:`, outcome.error);
      return NextResponse.json({ error: "Failed to revoke license" }, { status: 500 });
    }
    console.log(`Dispute ${dispute.id} -> revoke outcome: ${outcome.result}`);
  }

  return NextResponse.json({ received: true });
}
