import type { StaticImageData } from "next/image";
import gamesToLearnSqlHero from "../../public/blog/games-to-learn-sql-hero.webp";
import sqlJoinTypesExplainedHero from "../../public/blog/sql-join-types-explained-hero-new.png";
import sqlForDataAnalystsHero from "../../public/blog/sql-for-data-analysts-hero-new.png";

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
    slug: "sql-for-data-analysts",
    title: "SQL for Data Analysts: Essential Skills You Need to Land the Job (2026)",
    excerpt:
      "Master the 5 SQL concepts every data analyst needs. From basic queries to window functions, these are the practical skills that get you hired.",
    date: "2026-01-28",
    readTime: "12 min read",
    author: "Hristo Bogoev",
    heroImage: sqlForDataAnalystsHero,
    lastModified: "2026-01-28",
  },
  {
    slug: "sql-join-types-explained",
    title: "SQL Join Types Explained: A Visual Guide to INNER, LEFT, RIGHT & FULL Joins (2026)",
    excerpt:
      "Master all 4 SQL join types with visual diagrams and practical examples. Learn when to use INNER, LEFT, RIGHT, and FULL OUTER JOINs.",
    date: "2026-01-26",
    readTime: "10 min read",
    author: "Hristo Bogoev",
    heroImage: sqlJoinTypesExplainedHero,
    lastModified: "2026-01-26",
  },
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
