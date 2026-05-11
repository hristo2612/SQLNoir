import type { MetadataRoute } from "next";
import { blogPostsMeta } from "@/lib/blog-posts";
import { getAllCases, getCaseSlug } from "@/lib/case-utils";

const baseUrl = "https://www.sqlnoir.com";
const alternateLocales = ["pt-br", "zh-CN"] as const;

function withAlternates(url: string) {
  return {
    alternates: {
      languages: Object.fromEntries(
        alternateLocales.map((locale) => [locale, `${baseUrl}/${locale}${url === baseUrl ? "" : url.replace(baseUrl, "")}`])
      ),
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

  const blogPages: MetadataRoute.Sitemap = blogPostsMeta.map((post) => {
    const url = `${baseUrl}/blog/${post.slug}`;
    return {
      url,
      lastModified: new Date(post.lastModified ?? post.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      ...withAlternates(url),
    };
  });

  return [...staticPages, ...casePages, ...blogPages];
}
