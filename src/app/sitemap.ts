import type { MetadataRoute } from "next";
import { blogPostsMeta } from "@/lib/blog-posts";
import { getAllCases, getCaseSlug } from "@/lib/case-utils";

const baseUrl = "https://www.sqlnoir.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/cases`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/help`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const casePages: MetadataRoute.Sitemap = getAllCases().map((caseData) => ({
    url: `${baseUrl}/cases/${getCaseSlug(caseData)}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPostsMeta.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.lastModified ?? post.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...casePages, ...blogPages];
}
