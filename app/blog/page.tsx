import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog | Evolution Media",
  description: "Tips on web design, launches, and insights from the Evolution Media team.",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      <header className="border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link
            href="/"
            className="font-bold text-xl"
          >
            <span className="bg-gradient-to-r from-[#00d4ff] via-[#ff00aa] to-[#ffb800] bg-clip-text text-transparent">
              Evolution
            </span>
            <span className="text-white"> Media</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-[#00d4ff] hover:underline"
          >
            ← Back
          </Link>
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-gray-400 mb-12 max-w-2xl">
          Tips on web design, project launches, and insights from our team.
        </p>
        <ul className="space-y-6">
          {blogPosts.map((post) => (
            <li key={post.slug}>
              <article className="rounded-xl border border-white/10 bg-[#12121a] p-6 hover:border-[#00d4ff]/30 transition-colors">
                <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                <h2 className="text-xl font-semibold text-white mb-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-[#00d4ff] transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-400 text-sm mb-4">{post.description}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm font-medium text-[#00d4ff] hover:underline"
                >
                  Read more →
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
