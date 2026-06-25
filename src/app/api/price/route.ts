import { NextRequest, NextResponse } from "next/server";
import { getPriceTier, getPriceForLocale } from "@/lib/ppp-prices";

export async function GET(req: NextRequest) {
  const country =
    req.headers.get("x-vercel-ip-country") ||
    req.nextUrl.searchParams.get("country") ||
    "US";

  const locale = req.nextUrl.searchParams.get("locale") || "en";

  const localized = getPriceForLocale(locale, country, {
    localizeByCountry: true,
  });
  const { tier } = getPriceTier(country);

  return NextResponse.json({
    amount: localized.amount,
    display: localized.display,
    currency: localized.currency,
    tier,
    country: country.toUpperCase(),
    locale,
  });
}
