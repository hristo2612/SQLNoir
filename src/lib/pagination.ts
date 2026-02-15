import { blogPostsMeta, type BlogPostMeta } from "./blog-posts";

export const POSTS_PER_PAGE = 6;

export function getTotalPages(): number {
  return Math.ceil(blogPostsMeta.length / POSTS_PER_PAGE);
}

export function getPostsForPage(page: number): BlogPostMeta[] {
  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;
  return blogPostsMeta.slice(start, end);
}

export function isValidPage(page: number): boolean {
  return page >= 1 && page <= getTotalPages();
}
