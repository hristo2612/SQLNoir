// Template for creating new blog posts
// Copy this file and rename it to your new post component

import Link from "next/link";
import { Home, Calendar, Clock, ExternalLink } from "lucide-react";

export function NewBlogPost() {
  const post = {
    title: "Your Blog Post Title Here",
    excerpt:
      "A compelling excerpt that summarizes your post and makes people want to read more...",
    date: "2025-01-26",
    readTime: "5 min read",
    author: "SQL Noir Team",
    heroImage: "https://images.unsplash.com/your-hero-image-url",
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm bg-white/95">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-amber-900 hover:text-amber-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="text-lg font-detective">SQL Noir</span>
          </Link>
          <Link
            href="/blog"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span>Back to Blog</span>
          </Link>
        </div>
      </header>

      {/* Hero Image */}
      <div className="aspect-[3/1] overflow-hidden">
        <img
          src={post.heroImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-8">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{post.readTime}</span>
          </div>
          <span>By {post.author}</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-detective text-amber-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-xl text-gray-600 mb-12 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            Your blog post content goes here. Use regular HTML/JSX elements for
            formatting.
          </p>

          <h2 className="text-3xl font-detective text-amber-900 mt-12 mb-6">
            Section Heading
          </h2>

          <div className="mb-8">
            <img
              src="https://images.unsplash.com/your-section-image-url"
              alt="Section description"
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            Regular paragraph text with good readability.
          </p>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8">
            <h4 className="font-bold text-amber-900 mb-3">Key Points:</h4>
            <ul className="space-y-2 text-gray-700">
              <li>• Point one</li>
              <li>• Point two</li>
              <li>• Point three</li>
            </ul>
          </div>

          {/* Add more content sections as needed */}
        </div>

        {/* Call to Action */}
        <div className="mt-16 p-8 bg-amber-50 rounded-lg border border-amber-200 text-center">
          <h3 className="text-2xl font-detective text-amber-900 mb-4">
            Ready to Start Your SQL Detective Journey?
          </h3>
          <p className="text-amber-800 mb-6">
            Jump into SQL Noir and solve your first mystery using database
            queries!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-amber-800/90 hover:bg-amber-700/90 
                     text-amber-100 rounded-lg font-detective text-lg transition-colors"
          >
            Start Playing SQL Noir
            <ExternalLink className="w-5 h-5" />
          </Link>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600 mb-4">
            Keep investigating with SQL Noir - where mysteries meet databases.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/blog"
              className="text-amber-700 hover:text-amber-900 transition-colors"
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

/* 
  To add a new blog post:
  
  1. Copy this file and rename it (e.g., YourNewPost.tsx)
  2. Update the post object with your content
  3. Add your blog post to the BLOG_POSTS array in BlogIndex.tsx
  4. Add your blog post to the BLOG_POSTS object in BlogPost.tsx
  5. Import and add the route in App.tsx if needed (optional - dynamic routing handles this)
  
  Example:
  - File: SQLTipsAndTricks.tsx
  - Slug: "sql-tips-and-tricks"
  - URL: /blog/sql-tips-and-tricks
*/
