import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import {
  getPriceTier,
  getCurrencyForLocale,
  getPriceForLocale,
} from "@/lib/ppp-prices";

const PRODUCT_NAME = "SQLNoir Detective License";
const DEFAULT_PUBLIC_SITE_URL = "https://www.sqlnoir.com";

function stripTrailingSlash(value: string): string {
  return value.replace(/\/$/, "");
}

function getBadgeImageUrl(origin: string): string {
  if (process.env.STRIPE_PRODUCT_IMAGE_URL) {
    return process.env.STRIPE_PRODUCT_IMAGE_URL;
  }

  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const publicBase =
    configuredSiteUrl?.startsWith("https://")
      ? configuredSiteUrl
      : origin.startsWith("https://")
      ? origin
      : DEFAULT_PUBLIC_SITE_URL;

  return `${stripTrailingSlash(publicBase)}/detective-license-badge.jpg`;
}

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  try {
    // Parse body (locale is optional — defaults to "en" for backwards compat).
    let body: { locale?: string } = {};
    try {
      body = (await req.json()) as { locale?: string };
    } catch {
      // No body or invalid JSON — fine, locale defaults to "en".
    }
    const locale = body.locale || "en";

    // Check if user is signed in (optional — not required for checkout)
    const supabase = createServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const origin = req.headers.get("origin") || "https://www.sqlnoir.com";

    // Detect country for PPP pricing
    const country = req.headers.get("x-vercel-ip-country") || "US";
    const priceTier = getPriceTier(country);
    const currency = getCurrencyForLocale(locale);
    const localizedPrice = getPriceForLocale(locale, country);

    // Dynamic pricing via Stripe `price_data` — no pre-created Price objects.
    // The PPP amount (in cents) and currency come straight from the resolved
    // locale/country tier; zh-CN bills ¥99 in CNY, everyone else USD per tier.
    const priceData: {
      currency: string;
      unit_amount: number;
      product_data?: { name: string; images?: string[] };
    } = {
      currency: localizedPrice.currency,
      unit_amount: localizedPrice.amount,
      // Inline product data guarantees Checkout can show the badge without
      // depending on a manually configured Stripe dashboard Product. Stripe must
      // be able to fetch this URL publicly; local/Tailscale URLs are not usable.
      product_data: {
        name: PRODUCT_NAME,
        images: [getBadgeImageUrl(origin)],
      },
    };

    const lineItems = [{ price_data: priceData, quantity: 1 }];

    // Sanity check: every line item must agree on currency or Stripe rejects
    // the session. Fail loudly here so the bug is obvious in logs.
    const currencies = new Set(lineItems.map((li) => li.price_data.currency));
    if (currencies.size > 1) {
      throw new Error(
        `Mixed currencies in checkout for country=${country}: ${[...currencies].join(", ")}`
      );
    }

    const paymentMethodTypes =
      locale === "zh-CN"
        ? (["card", "alipay", "wechat_pay"] as const)
        : (["card"] as const);

    const checkoutParams: any = {
      mode: "payment" as const,
      payment_method_types: paymentMethodTypes,
      line_items: lineItems,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cases`,
      metadata: {
        country,
        locale,
        currency,
        tier: String(priceTier.tier),
        ppp_price: priceTier.display,
        localized_price: localizedPrice.display,
      } as Record<string, string>,
    };

    // wechat_pay requires explicit client setting per Stripe docs.
    if (locale === "zh-CN") {
      checkoutParams.payment_method_options = {
        wechat_pay: { client: "web" },
      };
    }

    if (session?.user) {
      // Signed-in user: attach user_id and pre-fill email
      checkoutParams.customer_email = session.user.email;
      checkoutParams.metadata.user_id = session.user.id;
    } else {
      // Anonymous user: Stripe will collect email, we'll link after sign-in.
      // Force `customer_creation: "always"` so Stripe reliably creates a
      // Customer and captures the buyer email into `customer_details.email` on
      // the completed session. The webhook persists that email onto the
      // pending_licenses row, and claim-license binds the claim to it — so the
      // email MUST be present for the anonymous path to be claimable.
      checkoutParams.customer_creation = "always";
      checkoutParams.metadata.anonymous = "true";
    }

    const checkoutSession = await stripe.checkout.sessions.create(checkoutParams);

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
