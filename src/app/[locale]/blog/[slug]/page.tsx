import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPost } from "@/components/blog/BlogPost";
import { getBlogPostMeta } from "@/lib/blog-posts";
import { getTranslations, getLocale } from "next-intl/server";
import { localePrefix } from "@/lib/seo";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

const BASE_URL = "https://www.sqlnoir.com";

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostMeta(slug);
  const locale = await getLocale();

  if (!post || (post.locale || "en") !== locale) {
    return { title: "Post Not Found | SQLNoir" };
  }

  const heroPath = post.heroImage.src;
  const ogImage = `${BASE_URL}/_next/image?url=${encodeURIComponent(
    heroPath
  )}&w=1200&q=90`;

  // Blog posts are single-locale: each post exists only under its own locale
  // prefix and 404s elsewhere, so a self-referential canonical only - no
  // cross-locale hreflang alternates pointing at non-existent versions.
  const postPath = `${localePrefix(locale)}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: postPath },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${BASE_URL}${postPath}`,
      publishedTime: post.date,
      modifiedTime: post.lastModified ?? post.date,
      authors: [post.author],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 670,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostMeta(slug);
  const locale = await getLocale();

  // 404 if post doesn't exist or doesn't match current locale
  if (!post || (post.locale || "en") !== locale) {
    return notFound();
  }

  const tNav = await getTranslations("nav");

  const prefix = localePrefix(locale);
  const url = `${BASE_URL}${prefix}/blog/${post.slug}`;
  const heroUrl = `${BASE_URL}${post.heroImage.src}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: tNav("home"),
            item: `${BASE_URL}${prefix}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: tNav("blog"),
            item: `${BASE_URL}${prefix}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: url,
          },
        ],
      },
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        image: heroUrl,
        datePublished: post.date,
        dateModified: post.lastModified ?? post.date,
        author: {
          "@type": "Person",
          name: post.author,
        },
        publisher: {
          "@type": "Organization",
          name: "SQLNoir",
          logo: {
            "@type": "ImageObject",
            url: "https://www.sqlnoir.com/open-graph-image.png",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
      },
    ],
  };

  return (
    <>
      <BlogPost slug={post.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
