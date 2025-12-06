import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const siteUrl = "https://www.sqlnoir.com";
const defaultTitle =
  "Interactive SQL Game | Learn SQL by Solving Detective Cases | SQLNoir";
const defaultDescription =
  "SQLNoir is an interactive SQL game where you solve crimes and mysteries using SQL queries. Learn SQL by playing detective in this engaging SQL learning game.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | SQLNoir",
  },
  description: defaultDescription,
  keywords: [
    "SQL game",
    "learn SQL",
    "interactive SQL tutorial",
    "SQL practice",
    "SQL detective game",
  ],
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/blog/rss.xml",
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "SQLNoir",
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: "/open-graph-image.png",
        width: 1200,
        height: 630,
        alt: "SQLNoir interactive SQL detective game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/open-graph-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-96x96.png",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#92400e",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "SQLNoir",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/open-graph-image.png`,
        width: 1200,
        height: 630,
      },
      sameAs: [
        "https://github.com/hristo2612/SQLNoir",
        "https://discord.gg/rMQRwrRYHH",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "SQLNoir",
      description: defaultDescription,
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/cases?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SiteNavigationElement",
      "@id": `${siteUrl}/#site-navigation`,
      name: ["Home", "Cases", "Blog", "Help"],
      url: [
        `${siteUrl}/`,
        `${siteUrl}/cases`,
        `${siteUrl}/blog`,
        `${siteUrl}/help`,
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          id="seo-json-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
