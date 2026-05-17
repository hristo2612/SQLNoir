import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_CONFIG } from "@/lib/stripe";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import {
  getPriceTier,
  getCurrencyForLocale,
  getPriceForLocale,
} from "@/lib/ppp-prices";

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

    // Locale-aware line items + payment methods.
    // - zh-CN: CNY price (if STRIPE_PRICE_ID_CNY is provisioned) + card/alipay/wechat_pay
    // - everyone else: USD PPP tier + card only
    let lineItems: Array<{ price: string; quantity: number }>;
    if (currency === "cny") {
      if (!localizedPrice.priceId) {
        return NextResponse.json(
          { error: "CNY checkout not yet provisioned (STRIPE_PRICE_ID_CNY missing)" },
          { status: 503 }
        );
      }
      lineItems = [{ price: localizedPrice.priceId, quantity: 1 }];
    } else {
      const hasTierPriceId =
        priceTier.priceId && priceTier.priceId.startsWith("price_");
      lineItems = hasTierPriceId
        ? [{ price: priceTier.priceId, quantity: 1 }]
        : [{ price: STRIPE_CONFIG.priceId, quantity: 1 }];
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
      // Anonymous user: Stripe will collect email, we'll link after sign-in
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
