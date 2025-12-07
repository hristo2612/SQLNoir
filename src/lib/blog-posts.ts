import type { StaticImageData } from "next/image";
import gamesToLearnSqlHero from "../../public/blog/games-to-learn-sql-hero.webp";

export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  heroImage: StaticImageData;
  lastModified?: string;
}

export const blogPostsMeta: BlogPostMeta[] = [
  {
    slug: "games-to-learn-sql",
    title: "5 SQL Games to Master Database Skills in 2025",
    excerpt:
      "Skip the boring textbooks. These 5 SQL games teach database queries through detective stories, island survival, and murder mysteries.",
    date: "2025-05-28",
    readTime: "12 min read",
    author: "Hristo Bogoev",
    heroImage: gamesToLearnSqlHero,
    lastModified: "2025-05-28",
  },
];

export const getBlogPostMeta = (slug: string) =>
  blogPostsMeta.find((post) => post.slug === slug) ?? null;
