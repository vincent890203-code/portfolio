import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Nav from "@/components/Nav";
import { mdxComponents } from "@/components/mdx";
import { PALETTE, lerpColor } from "@/content/palette";
import { skillLabels } from "@/content/taxonomy";
import { getAllProjects, getProject, type ProjectMeta } from "@/content/loader";

const KIND_T: Record<ProjectMeta["kind"], number> = {
  research: 0,
  bridge: 0.5,
  ai: 1,
};

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.meta.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const doc = getProject(params.slug);
  if (!doc) return {};
  return { title: `${doc.meta.title} · 郭原辰`, description: doc.meta.summary };
}

export default function ProjectDetail({
  params,
}: {
  params: { slug: string };
}) {
  const doc = getProject(params.slug);
  if (!doc) notFound();
  const { meta, content } = doc;
  const accent = lerpColor(PALETTE.warm, PALETTE.cool, KIND_T[meta.kind]);

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/projects"
          className="font-mono text-xs text-dim transition-colors hover:text-cool"
        >
          ← 返回作品集
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="font-mono text-sm tracking-widest" style={{ color: accent }}>
            {meta.period}
          </span>
          {meta.confidential && (
            <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-dim">
              公司專案 · 抽象化
            </span>
          )}
        </div>
        <h1 className="mt-2 text-4xl font-bold text-text">{meta.title}</h1>
        <p className="mt-2 font-mono text-sm text-dim">{meta.role}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {(meta.stack.length ? meta.stack : skillLabels(meta.skills)).map((t) => (
            <span
              key={t}
              className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-dim"
            >
              {t}
            </span>
          ))}
        </div>

        {(meta.links.repo || meta.links.demo) && (
          <div className="mt-4 flex gap-3">
            {meta.links.repo && (
              <a
                href={meta.links.repo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[44px] items-center rounded-full border border-line px-4 text-sm text-cool hover:border-cool"
              >
                GitHub Repo
              </a>
            )}
            {meta.links.demo && (
              <a
                href={meta.links.demo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[44px] items-center rounded-full border border-line px-4 text-sm text-cool hover:border-cool"
              >
                Live Demo
              </a>
            )}
          </div>
        )}

        <div
          className="my-8 h-px w-full"
          style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        />

        <article>
          <MDXRemote source={content} components={mdxComponents} />
        </article>
      </main>
    </>
  );
}
