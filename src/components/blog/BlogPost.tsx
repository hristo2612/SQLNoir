"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Calendar, Clock, ExternalLink } from "lucide-react";
import { useEffect } from "react";
import { BsIncognito } from "react-icons/bs";
import { Navbar } from "@/components/Navbar";
import { track } from "@vercel/analytics/react";
import { getBlogPostMeta } from "@/lib/blog-posts";

interface BlogPostProps {
  slug: string;
}

// Dynamically import post content components
const postComponents: Record<string, React.ComponentType> = {
  "union-vs-union-all": dynamic(() => import("./posts/union-vs-union-all")),
  "having-vs-where-sql": dynamic(() => import("./posts/having-vs-where-sql")),
  "is-sql-hard-to-learn": dynamic(() => import("./posts/is-sql-hard-to-learn")),
  "games-to-learn-sql": dynamic(() => import("./posts/games-to-learn-sql")),
  "sql-join-types-explained": dynamic(() => import("./posts/sql-join-types-explained")),
  "sql-for-data-analysts": dynamic(() => import("./posts/sql-for-data-analysts")),
  "sql-for-business-analysts": dynamic(() => import("./posts/sql-for-business-analysts")),
  "sql-for-data-engineers": dynamic(() => import("./posts/sql-for-data-engineers")),
  "sql-for-finance": dynamic(() => import("./posts/sql-for-finance")),
  "sql-for-healthcare": dynamic(() => import("./posts/sql-for-healthcare")),
  "sql-for-marketing": dynamic(() => import("./posts/sql-for-marketing")),
};

export function BlogPost({ slug }: BlogPostProps) {
  const metadata = getBlogPostMeta(slug);
  const PostContent = postComponents[slug];

  useEffect(() => {
    if (!metadata) return;
    
    track("blog_view", {
      post_slug: metadata.slug,
      title: metadata.title,
    });

    const depths = [25, 50, 75, 100];
    const seen = new Set<number>();
    const handler = () => {
      const scrolled =
        ((window.scrollY + window.innerHeight) /
          document.documentElement.scrollHeight) *
        100;
      const hit = depths.find((d) => scrolled >= d && !seen.has(d));
      if (hit !== undefined) {
        seen.add(hit);
        track("blog_read_depth", { post_slug: metadata.slug, depth: hit });
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [metadata]);

  if (!metadata || !PostContent) {
    return (
      <div className="min-h-screen bg-amber-50/50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-detective text-amber-900 mb-4">
            Post Not Found
          </h1>
          <Link href="/blog" className="text-amber-700 hover:text-amber-900">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50/50">
      <Navbar
        title="Detective's Journal"
        titleHref="/blog"
        links={[
          { label: "Home", href: "/", activeMatch: "/" },
          { label: "Journal", href: "/blog", activeMatch: "/blog" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="max-w-4xl w-full mx-auto overflow-hidden rounded-2xl border border-amber-100 shadow-sm bg-white">
          <div className="relative aspect-[16/9]">
            <Image
              src={metadata.heroImage}
              alt={metadata.title}
              fill
              sizes="(min-width: 1280px) 1150px, (min-width: 1024px) 85vw, 100vw"
              className="object-cover"
              placeholder="blur"
              priority
            />
          </div>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-10 sm:py-12 bg-white rounded-2xl shadow-sm border border-amber-100 mt-6">
        {/* Meta */}
        <div className="flex items-center gap-3 flex-wrap text-sm text-amber-700 mb-6">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(metadata.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{metadata.readTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <BsIncognito className="w-4 h-4" />
            <span>{metadata.author}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-detective text-amber-900 mb-3 leading-snug sm:leading-tight">
          {metadata.title}
        </h1>

        {/* Excerpt */}
        <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 leading-relaxed">
          {metadata.excerpt}
        </p>

        {/* Content */}
        <div className="prose prose-base sm:prose-lg max-w-none">
          <PostContent />
        </div>

        {/* Call to Action */}
        <div className="mt-16 p-8 bg-amber-50 rounded-lg border border-amber-200 text-center">
          <h3 className="text-2xl font-detective text-amber-900 mb-4">
            Ready to start your next investigation?
          </h3>
          <p className="text-amber-800 mb-6">
            Jump into the SQLNoir case files and put these tips to work.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/cases"
              className="inline-flex items-center gap-2 px-8 py-3 bg-amber-800/90 hover:bg-amber-700/90 
                       text-amber-100 rounded-lg font-detective text-lg transition-colors"
            >
              Explore Cases
              <ExternalLink className="w-5 h-5" />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 border border-amber-300 text-amber-900 rounded-lg font-detective text-base hover:bg-amber-100 transition-colors"
            >
              Back to Journal
            </Link>
          </div>
        </div>
      </article>

      <footer className="bg-amber-50/80 border-t border-amber-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-amber-800 mb-4">
            Keep investigating with SQL Noir - where mysteries meet databases.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/blog"
              className="text-amber-800 hover:text-amber-900 transition-colors"
            >
              Back to Blog
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-amber-800/90 hover:bg-amber-700/90 
                       text-amber-100 rounded-lg transition-colors"
            >
              Play Game
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
