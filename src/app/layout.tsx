import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { CookieConsent } from "@/components/CookieConsent";
import { PostHogProvider } from "@/components/PostHogProvider";
import "./globals.css";

// Root layout - delegates HTML structure to [locale]/layout.tsx
// This exists only to import global CSS and satisfy Next.js requirements
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
