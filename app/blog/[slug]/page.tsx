import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Nav from "@/components/Nav";
import { mdxComponents } from "@/components/mdx";
import { getAllPosts, getPost } from "@/content/loader";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.meta.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const doc = getPost(params.slug);
  if (!doc) return {};
  return { title: `${doc.meta.title} · 郭原辰`, description: doc.meta.summary };
}

export default function PostDetail({ params }: { params: { slug: string } }) {
  const doc = getPost(params.slug);
  if (!doc || doc.meta.published === false) notFound();
  const { meta, content } = doc;

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

        <time className="mt-6 block font-mono text-sm text-dim">{meta.date}</time>
        <h1 className="mt-2 text-4xl font-bold leading-tight text-text">
          {meta.title}
        </h1>
        {meta.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {meta.tags.map((t) => (
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
          <MDXRemote source={content} components={mdxComponents} />
        </article>
      </main>
    </>
  );
}
