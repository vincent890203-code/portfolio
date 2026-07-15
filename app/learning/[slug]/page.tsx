import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Nav from "@/components/Nav";
import { mdxComponents } from "@/components/mdx";
import { skillLabels } from "@/content/taxonomy";
import { getAllCourses, getCourse } from "@/content/loader";

export function generateStaticParams() {
  return getAllCourses().map((c) => ({ slug: c.meta.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const doc = getCourse(params.slug);
  if (!doc) return {};
  return {
    title: `${doc.meta.title} · 學習筆記 · 郭原辰`,
    description: `${doc.meta.provider} · ${doc.meta.title}`,
  };
}

export default function CourseDetail({
  params,
}: {
  params: { slug: string };
}) {
  const doc = getCourse(params.slug);
  if (!doc) notFound();
  const { meta, content } = doc;

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/learning"
          className="font-mono text-xs text-dim transition-colors hover:text-cool"
        >
          ← 返回學習軌跡
        </Link>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs tracking-widest text-cool">
            {meta.provider}
          </span>
          <span className="font-mono text-xs text-dim">{meta.completedAt}</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold text-text">{meta.title}</h1>
        {meta.specialization && (
          <p className="mt-2 font-mono text-xs text-dim">
            {meta.specialization} 專項
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {skillLabels(meta.skills).map((s) => (
            <span
              key={s}
              className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-dim"
            >
              {s}
            </span>
          ))}
        </div>

        {meta.verifyUrl && (
          <a
            href={meta.verifyUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex min-h-[44px] items-center gap-1 font-mono text-xs text-warm transition-colors hover:text-cool"
          >
            ✓ 驗證證書{meta.credentialId ? ` · ${meta.credentialId}` : ""}
          </a>
        )}

        <div className="my-8 h-px w-full bg-line" />

        <article>
          <MDXRemote source={content} components={mdxComponents} />
        </article>
      </main>
    </>
  );
}
