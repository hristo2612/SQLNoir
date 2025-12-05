'use client';

import { useParams } from "next/navigation";
import { BlogPost } from "@/components/blog/BlogPost";

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const slugParam = params?.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam ?? "";

  return <BlogPost slug={slug} />;
}
