import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn("STRIPE_SECRET_KEY is not set — Stripe integration disabled");
}

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey)
  : null;
