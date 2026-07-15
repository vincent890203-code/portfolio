import Link from "next/link";
import { PALETTE, lerpColor } from "@/content/palette";
import { skillLabels } from "@/content/taxonomy";
import type { ProjectMeta } from "@/content/loader";

// 專案類別 → 訊號轉換配色:research=暖(過去)、bridge=中間、ai=冷(現在)。
const KIND_T: Record<ProjectMeta["kind"], number> = {
  research: 0,
  bridge: 0.5,
  ai: 1,
};

export default function ProjectCard({ meta }: { meta: ProjectMeta }) {
  const accent = lerpColor(PALETTE.warm, PALETTE.cool, KIND_T[meta.kind]);
  const tags = meta.stack.length ? meta.stack : skillLabels(meta.skills);

  return (
    <Link
      href={`/projects/${meta.slug}`}
      className="group block rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cool/50"
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs tracking-widest" style={{ color: accent }}>
          {meta.period}
        </span>
        {meta.confidential && (
          <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-dim">
            公司專案 · 抽象化
          </span>
        )}
      </div>
      <h3 className="mt-2 text-xl font-medium text-text transition-colors group-hover:text-white">
        {meta.title}
      </h3>
      <p className="mt-1 font-mono text-xs text-dim">{meta.role}</p>
      <p className="mt-3 leading-relaxed text-dim">{meta.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.slice(0, 6).map((t) => (
          <span
            key={t}
            className="rounded-full border border-line px-2 py-0.5 font-mono text-[11px] text-dim"
          >
            {t}
          </span>
        ))}
      </div>
    </Link>
  );
}
