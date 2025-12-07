import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { BsIncognito } from "react-icons/bs";
import { Navbar } from "@/components/Navbar";
import { blogPostsMeta } from "@/lib/blog-posts";

export function BlogIndex() {
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {blogPostsMeta.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="block h-full">
                <div className="bg-white/90 rounded-2xl overflow-hidden shadow-lg border border-amber-200 h-full flex flex-col transition-colors duration-200 hover:border-amber-300">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={post.heroImage}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                      placeholder="blur"
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
