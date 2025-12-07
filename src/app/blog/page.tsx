import type { Metadata } from "next";
import { Blog } from "@/components/Blog";
import { blogPostsMeta } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Detective's Journal | SQL Blog",
  description:
    "SQL tutorials, tips, and game recommendations from the SQLNoir detective's journal.",
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": "/blog/rss.xml",
    },
  },
  openGraph: {
    type: "website",
    title: "Detective's Journal | SQL Blog",
    description:
      "SQL tutorials, tips, and game recommendations from the SQLNoir detective's journal.",
    url: "https://www.sqlnoir.com/blog",
    images: [
      {
        url: "/open-graph-image.png",
        width: 1200,
        height: 630,
        alt: "SQLNoir blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Detective's Journal | SQL Blog",
    description:
      "SQL tutorials, tips, and game recommendations from the SQLNoir detective's journal.",
    images: ["/open-graph-image.png"],
  },
};

export default function BlogPage() {
  const baseUrl = "https://www.sqlnoir.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.sqlnoir.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: "https://www.sqlnoir.com/blog",
          },
        ],
      },
      {
        "@type": "Blog",
        name: "Detective's Journal",
        description:
          "SQL tutorials, tips, and game recommendations from the SQLNoir detective's journal.",
        url: "https://www.sqlnoir.com/blog",
        blogPost: blogPostsMeta.map((post) => ({
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          dateModified: post.lastModified ?? post.date,
          author: {
            "@type": "Person",
            name: post.author,
          },
          mainEntityOfPage: `https://www.sqlnoir.com/blog/${post.slug}`,
          image: `${baseUrl}${post.heroImage.src}`,
        })),
      },
    ],
  };

  return (
    <>
      <Blog />
      {/* JSON-LD script injected here */}
      <script
        id="blog-index-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
