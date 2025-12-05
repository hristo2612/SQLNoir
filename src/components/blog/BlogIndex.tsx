import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { BsIncognito } from "react-icons/bs";
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  slug: string;
  heroImage: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "5 Best SQL Games to Master Database Skills in 2025",
    excerpt:
      "Skip the boring textbooks. These 5 SQL games teach database queries through detective stories, island survival, and murder mysteries.",
    date: "2025-05-28",
    readTime: "12 min read",
    author: "Hristo Bogoev",
    slug: "games-to-learn-sql",
    heroImage:
      "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6pp6SQWVUJREwSGgwRk6aA.png",
  },
];

export function BlogIndex() {
  useEffect(() => {
    // Update document title for blog index
    document.title =
      "SQL Game Tutorials & Tips - Detective's Journal | SQL Noir";

    return () => {
      // Reset title when component unmounts
      document.title = "SQL Noir";
    };
  }, []);

  return (
    <div className="min-h-screen bg-amber-50/50">
      <Navbar
        title="Detective's Journal"
        links={[
          { label: "Home", href: "/", activeMatch: "/" },
          { label: "Journal", href: "/blog", activeMatch: "/blog" },
        ]}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {BLOG_POSTS.map((post) => (
            <article key={post.id} className="group">
              <Link href={`/blog/${post.slug}`} className="block h-full">
                <div className="bg-white/90 rounded-2xl overflow-hidden shadow-lg border border-amber-200 h-full flex flex-col transition-colors duration-200 hover:border-amber-300">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={post.heroImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3 text-xs sm:text-sm text-amber-700">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BsIncognito className="w-4 h-4" />
                        <span className="text-amber-700 text-xs sm:text-sm">
                          {post.author}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-detective text-amber-900 group-hover:text-amber-700 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-amber-800 text-base leading-relaxed flex-1">
                      {post.excerpt}
                    </p>

                    <span
                      className="inline-flex items-center w-full sm:w-auto justify-center px-5 py-3 bg-amber-800/90 text-amber-100 
                                   rounded-lg font-detective group-hover:bg-amber-700/90 transition-colors"
                    >
                      Read full article
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
