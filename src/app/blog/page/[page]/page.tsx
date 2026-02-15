import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { Blog } from "@/components/Blog";
import { getPostsForPage, getTotalPages, isValidPage } from "@/lib/pagination";

interface PageProps {
  params: Promise<{ page: string }>;
}

export async function generateStaticParams() {
  const totalPages = getTotalPages();
  // Generate pages 2 onwards (page 1 is /blog)
  return Array.from({ length: totalPages - 1 }, (_, i) => ({
    page: String(i + 2),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { page } = await params;
  const pageNum = parseInt(page, 10);

  const title = `Detective's Journal - Page ${pageNum} | SQL Blog`;
  const description =
    "SQL tutorials, tips, and game recommendations from the SQLNoir detective's journal.";

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/page/${pageNum}`,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: `https://www.sqlnoir.com/blog/page/${pageNum}`,
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
      title,
      description,
      images: ["/open-graph-image.png"],
    },
  };
}

export default async function BlogPaginatedPage({ params }: PageProps) {
  const { page } = await params;
  const pageNum = parseInt(page, 10);

  // Redirect page 1 to /blog
  if (pageNum === 1) {
    redirect("/blog");
  }

  // 404 for invalid pages
  if (isNaN(pageNum) || !isValidPage(pageNum)) {
    notFound();
  }

  const posts = getPostsForPage(pageNum);
  const totalPages = getTotalPages();

  const jsonLd = {
    "@context": "https://schema.org",
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
        name: `Page ${pageNum}`,
        item: `https://www.sqlnoir.com/blog/page/${pageNum}`,
      },
    ],
  };

  return (
    <>
      <Blog posts={posts} currentPage={pageNum} totalPages={totalPages} />
      <script
        id="blog-page-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
