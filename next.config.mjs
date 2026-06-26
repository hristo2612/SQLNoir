import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.VITE_SUPABASE_ANON_KEY,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // sql.js references Node built-ins we don't need in the browser
      config.resolve = config.resolve ?? {};
      config.resolve.fallback = {
        ...(config.resolve.fallback ?? {}),
        fs: false,
        path: false,
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "miro.medium.com",
      },
    ],
  },
  async headers() {
    // The checkout-success URL carries the single-use session_id claim token.
    // Send no referrer from this route so the id can't ride along to any third
    // party in the Referer header. Two patterns because localePrefix is
    // "as-needed": the default locale (en) lives at the un-prefixed
    // /checkout/success, pt-br/zh-CN at /:locale/checkout/success.
    const noReferrer = [{ key: "Referrer-Policy", value: "no-referrer" }];
    return [
      { source: "/checkout/success", headers: noReferrer },
      { source: "/:locale/checkout/success", headers: noReferrer },
    ];
  },
};

export default withNextIntl(nextConfig);
