import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Nav from "@/components/Nav";
import { mdxComponents } from "@/components/mdx";
import { getBlogPost } from "@/lib/posts/source";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  if (!post) return {};
  return { title: `${post.title} · 郭原辰`, description: post.summary };
}

export default async function PostDetail({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getBlogPost(params.slug);
  if (!post) notFound();

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/blog"
          className="font-mono text-xs text-dim transition-colors hover:text-cool"
        >
          ← 返回 Blog
        </Link>

        <time className="mt-6 block font-mono text-sm text-dim">{post.date}</time>
        <h1 className="mt-2 text-4xl font-bold leading-tight text-text">
          {post.title}
        </h1>
        {post.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-dim"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        <div className="my-8 h-px w-full bg-gradient-to-r from-cool to-transparent" />

        <article>
          <MDXRemote source={post.content} components={mdxComponents} />
        </article>
      </main>
    </>
  );
}
