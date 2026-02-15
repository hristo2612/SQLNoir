import { BlogIndex } from "./blog/BlogIndex";
import { type BlogPostMeta } from "@/lib/blog-posts";

interface BlogProps {
  posts: BlogPostMeta[];
  currentPage: number;
  totalPages: number;
}

export function Blog({ posts, currentPage, totalPages }: BlogProps) {
  return (
    <BlogIndex
      posts={posts}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
