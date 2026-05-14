import type { MetadataRoute } from "next";
import { blogPostsMeta } from "@/lib/blog-posts";
import { getAllCases, getCaseSlug } from "@/lib/case-utils";

const baseUrl = "https://www.sqlnoir.com";
const prefixedLocales = ["pt-br", "zh-CN"] as const;

function withAlternates(url: string) {
  // Every URL in an hreflang cluster must reference all versions including
  // itself (en) and an x-default. `path` is the locale-agnostic path segment.
  const path = url === baseUrl ? "" : url.replace(baseUrl, "");
  const languages: Record<string, string> = {
    en: url,
    "x-default": url,
  };
  for (const locale of prefixedLocales) {
    languages[locale] = `${baseUrl}/${locale}${path}`;
  }
  return {
    alternates: {
      languages,
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/cases", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/help", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/contact", priority: 0.4, changeFrequency: "monthly" as const },
  ];

  const staticPages: MetadataRoute.Sitemap = staticPaths.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
    ...withAlternates(`${baseUrl}${path}`),
  }));

  const casePages: MetadataRoute.Sitemap = getAllCases().map((caseData) => {
    const url = `${baseUrl}/cases/${getCaseSlug(caseData)}`;
    return {
      url,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      ...withAlternates(url),
    };
  });

  // Blog posts are single-locale: each post exists only under its own locale
  // prefix and 404s elsewhere, so no cross-locale hreflang alternates.
  const blogPages: MetadataRoute.Sitemap = blogPostsMeta.map((post) => {
    const locale = post.locale ?? "en";
    const localePrefix = locale === "en" ? "" : `/${locale}`;
    return {
      url: `${baseUrl}${localePrefix}/blog/${post.slug}`,
      lastModified: new Date(post.lastModified ?? post.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    };
  });

  // Locale-specific landing pages (pt-br only): no cross-locale alternates.
  const localeLandingPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/pt-br/praticar`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pt-br/sql-para-iniciantes`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  return [...staticPages, ...casePages, ...blogPages, ...localeLandingPages];
}
