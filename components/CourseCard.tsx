import Link from "next/link";
import { skillLabels } from "@/content/taxonomy";
import type { CourseMeta } from "@/content/loader";

export default function CourseCard({ meta }: { meta: CourseMeta }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:border-cool/50">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[11px] tracking-widest text-cool">
          {meta.provider}
        </span>
        <span className="font-mono text-[11px] text-dim">{meta.completedAt}</span>
      </div>
      <Link
        href={`/learning/${meta.slug}`}
        className="mt-2 block text-lg font-medium text-text transition-colors hover:text-cool"
      >
        {meta.title}
      </Link>
      <div className="mt-3 flex flex-wrap gap-2">
        {skillLabels(meta.skills).map((s) => (
          <span
            key={s}
            className="rounded-full border border-line px-2 py-0.5 font-mono text-[11px] text-dim"
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
          ✓ 驗證證書
        </a>
      )}
    </div>
  );
}
