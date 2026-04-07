import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { BlogBlock, BlogPost } from "@/lib/blog-posts";
import { blogPosts, getPostBySlug } from "@/lib/blog-posts";

function BlogBlocks({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="prose prose-invert prose-gray max-w-none space-y-4">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return (
              <p key={i} className="text-gray-300 leading-relaxed">
                {b.text}
              </p>
            );
          case "inline":
            return (
              <p key={i} className="text-gray-300 leading-relaxed">
                {b.segments.map((s, j) =>
                  typeof s === "string" ? (
                    s
                  ) : (
                    <Link
                      key={j}
                      href={s.href}
                      className="text-[#00d4ff] hover:underline font-medium"
                    >
                      {s.label}
                    </Link>
                  )
                )}
              </p>
            );
          case "h2":
            return (
              <h2 key={i} className="text-xl md:text-2xl font-bold text-white mt-10 mb-3 first:mt-0">
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="text-lg font-semibold text-white mt-6 mb-2">
                {b.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={i} className="list-disc pl-6 text-gray-300 space-y-2 my-4">
                {b.items.map((item, j) => (
                  <li key={j} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            );
          case "table":
            return (
              <div key={i} className="overflow-x-auto my-6 not-prose">
                <table className="w-full min-w-[20rem] text-sm text-left border border-white/10 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      {b.headers.map((h) => (
                        <th key={h} className="px-4 py-3 font-semibold text-white">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, ri) => (
                      <tr key={ri} className="border-b border-white/5 last:border-0">
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-4 py-3 text-gray-300 align-top">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

function BlogBody({ post }: { post: BlogPost }) {
  if (post.blocks?.length) {
    return <BlogBlocks blocks={post.blocks} />;
  }
  return (
    <div className="prose prose-invert prose-gray max-w-none space-y-4">
      {post.paragraphs.map((p, i) => (
        <p key={i} className="text-gray-300 leading-relaxed">
          {p}
        </p>
      ))}
    </div>
  );
}

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
        <BlogBody post={post} />
      </main>
    </div>
  );
}
