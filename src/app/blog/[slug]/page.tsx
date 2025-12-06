import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { BlogPost } from "@/components/blog/BlogPost";
import { getBlogPostMeta } from "@/lib/blog-posts";

interface BlogPostPageProps {
  params: { slug: string };
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = getBlogPostMeta(params.slug);

  if (!post) {
    return { title: "Post Not Found | SQLNoir" };
  }

  const baseUrl = "https://www.sqlnoir.com";
  const heroPath = post.heroImage;
  const ogImage = `${baseUrl}/_next/image?url=${encodeURIComponent(
    heroPath
  )}&w=1200&q=90`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${baseUrl}/blog/${post.slug}`,
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

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostMeta(params.slug);

  if (!post) {
    return notFound();
  }

  const url = `https://www.sqlnoir.com/blog/${post.slug}`;

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
        image: post.heroImage,
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
      <Script
        id="blog-post-json-ld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
