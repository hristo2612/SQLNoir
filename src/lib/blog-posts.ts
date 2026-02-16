import type { StaticImageData } from "next/image";
import gamesToLearnSqlHero from "../../public/blog/games-to-learn-sql-hero.webp";
import sqlJoinTypesExplainedHero from "../../public/blog/sql-join-types-explained-hero.png";
import sqlForDataAnalystsHero from "../../public/blog/sql-for-data-analysts-hero.png";
import sqlForBusinessAnalystsHero from "../../public/blog/sql-for-business-analysts-hero.png";
import sqlForDataEngineersHero from "../../public/blog/sql-for-data-engineers-hero.png";
import sqlForFinanceHero from "../../public/blog/sql-for-finance-hero.png";
import sqlForHealthcareHero from "../../public/blog/sql-for-healthcare-hero.png";
import sqlForMarketingHero from "../../public/blog/sql-for-marketing-hero.png";
import isSqlHardToLearnHero from "../../public/blog/is-sql-hard-to-learn-hero.jpg";
import havingVsWhereSqlHero from "../../public/blog/having-vs-where-sql-hero.png";
import unionVsUnionAllHero from "../../public/blog/union-vs-union-all-hero.png";
import deleteVsTruncateHero from "../../public/blog/delete-vs-truncate-hero.png";
import sqlWindowFunctionsHero from "../../public/blog/sql-window-functions-hero.png";
import sqlVsExcelHero from "../../public/blog/sql-vs-excel-hero.png";

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
    slug: "sql-vs-excel",
    title: "SQL vs Excel: When to Use Each (With Side-by-Side Examples)",
    excerpt:
      "SQL vs Excel: which should you learn? Visual comparison with side-by-side code examples, decision flowchart, and practical use cases for every role.",
    date: "2026-02-16",
    readTime: "12 min read",
    author: "Hristo Bogoev",
    heroImage: sqlVsExcelHero,
    lastModified: "2026-02-16",
  },
  {
    slug: "sql-window-functions",
    title: "SQL Window Functions Explained: The Complete Visual Guide (2026)",
    excerpt:
      "Master SQL window functions with visual examples. Learn ROW_NUMBER, RANK, LAG, LEAD, and more with before/after diagrams and interactive quizzes.",
    date: "2026-02-12",
    readTime: "14 min read",
    author: "Hristo Bogoev",
    heroImage: sqlWindowFunctionsHero,
    lastModified: "2026-02-12",
  },
  {
    slug: "delete-vs-truncate",
    title: "DELETE vs TRUNCATE in SQL: When to Use Each (Visual Guide)",
    excerpt:
      "Learn the key differences between DELETE and TRUNCATE in SQL with visual examples, decision flowcharts, and common mistakes to avoid.",
    date: "2026-02-09",
    readTime: "12 min read",
    author: "Hristo Bogoev",
    heroImage: deleteVsTruncateHero,
    lastModified: "2026-02-09",
  },
  {
    slug: "union-vs-union-all",
    title: "SQL UNION vs UNION ALL: When to Use Each (With Visual Examples)",
    excerpt:
      "Learn the key differences between UNION and UNION ALL in SQL. Visual examples showing when duplicates matter, performance tips, and a decision flowchart.",
    date: "2026-02-07",
    readTime: "11 min read",
    author: "Hristo Bogoev",
    heroImage: unionVsUnionAllHero,
    lastModified: "2026-02-07",
  },
  {
    slug: "having-vs-where-sql",
    title: "HAVING vs WHERE in SQL: What's the Difference? (Visual Guide)",
    excerpt:
      "Learn the difference between HAVING and WHERE in SQL with visual execution diagrams, code examples, and a quick decision guide. WHERE filters rows, HAVING filters groups.",
    date: "2026-02-05",
    readTime: "10 min read",
    author: "Hristo Bogoev",
    heroImage: havingVsWhereSqlHero,
    lastModified: "2026-02-05",
  },
  {
    slug: "is-sql-hard-to-learn",
    title: "Is SQL Hard to Learn? What to Actually Expect in 2026",
    excerpt:
      "Is SQL hard to learn? Here's what SQL actually looks like at every level, with real code examples, honest timelines, and a role-by-role difficulty breakdown.",
    date: "2026-02-03",
    readTime: "12 min read",
    author: "Hristo Bogoev",
    heroImage: isSqlHardToLearnHero,
    lastModified: "2026-02-03",
  },
  {
    slug: "sql-for-marketing",
    title: "SQL for Marketing: Essential Queries Every Marketing Professional Needs (2026)",
    excerpt:
      "Master SQL for marketing analytics. Practical queries for campaign ROI, email performance, funnel analysis, and interview prep for marketing analyst roles.",
    date: "2026-02-02",
    readTime: "15 min read",
    author: "Hristo Bogoev",
    heroImage: sqlForMarketingHero,
    lastModified: "2026-02-02",
  },
  {
    slug: "sql-for-healthcare",
    title: "SQL for Healthcare: Essential Queries Every Healthcare Professional Needs (2026)",
    excerpt:
      "Master SQL for healthcare analytics. Practical queries for readmission tracking, ER wait times, patient outcomes, and interview prep for health data roles.",
    date: "2026-02-01",
    readTime: "15 min read",
    author: "Hristo Bogoev",
    heroImage: sqlForHealthcareHero,
    lastModified: "2026-02-01",
  },
  {
    slug: "sql-for-finance",
    title: "SQL for Finance: Essential Skills and Queries Every Financial Professional Needs (2026)",
    excerpt:
      "Master SQL for financial analysis. Practical queries for revenue reporting, budget variance, customer segmentation, and interview prep for finance roles.",
    date: "2026-01-31",
    readTime: "14 min read",
    author: "Hristo Bogoev",
    heroImage: sqlForFinanceHero,
    lastModified: "2026-01-31",
  },
  {
    slug: "sql-for-data-engineers",
    title: "SQL for Data Engineers: The Complete Guide to Building Data Pipelines (2026)",
    excerpt:
      "Master the 7 SQL skills every data engineer needs. From CTEs and window functions to SCD patterns, pipeline optimization, and interview prep.",
    date: "2026-01-30",
    readTime: "16 min read",
    author: "Hristo Bogoev",
    heroImage: sqlForDataEngineersHero,
    lastModified: "2026-02-03",
  },
  {
    slug: "sql-for-business-analysts",
    title: "SQL for Business Analysts: Essential Skills and Queries for 2026",
    excerpt:
      "Master the 5 SQL skills every business analyst needs. From practical queries to interview prep, learn exactly what BAs need to know.",
    date: "2026-01-29",
    readTime: "14 min read",
    author: "Hristo Bogoev",
    heroImage: sqlForBusinessAnalystsHero,
    lastModified: "2026-01-29",
  },
  {
    slug: "sql-for-data-analysts",
    title: "SQL for Data Analysts: The Complete Guide to Getting Hired (2026)",
    excerpt:
      "Master SQL for data analysts with real business queries, visual guides, and interview prep. From SELECT to window functions, the skills that get you hired.",
    date: "2026-01-28",
    readTime: "14 min read",
    author: "Hristo Bogoev",
    heroImage: sqlForDataAnalystsHero,
    lastModified: "2026-02-03",
  },
  {
    slug: "sql-join-types-explained",
    title: "SQL Join Types Explained: All 6 Types With Visual Examples (2026)",
    excerpt:
      "SQL join types explained with Venn diagrams, code examples, and results for all 6 types: INNER, LEFT, RIGHT, FULL OUTER, CROSS, and SELF JOIN.",
    date: "2026-01-26",
    readTime: "14 min read",
    author: "Hristo Bogoev",
    heroImage: sqlJoinTypesExplainedHero,
    lastModified: "2026-02-03",
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
