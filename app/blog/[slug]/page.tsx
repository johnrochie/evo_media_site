import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getPostBySlug } from "@/lib/blog-posts";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post | Evolution Media" };
  return {
    title: `${post.title} | Evolution Media`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      <header className="border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl">
            <span className="bg-gradient-to-r from-[#00d4ff] via-[#ff00aa] to-[#ffb800] bg-clip-text text-transparent">
              Evolution
            </span>
            <span className="text-white"> Media</span>
          </Link>
          <Link href="/blog" className="text-sm text-[#00d4ff] hover:underline">
            ← All posts
          </Link>
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <p className="text-sm text-gray-500 mb-2">{post.date}</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{post.title}</h1>
        <p className="text-lg text-gray-400 mb-10">{post.description}</p>
        <div className="prose prose-invert prose-gray max-w-none space-y-4">
          {post.paragraphs.map((p, i) => (
            <p key={i} className="text-gray-300 leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </main>
    </div>
  );
}
