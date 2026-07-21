import Link from "next/link";
import type { PostMeta } from "@/content/loader";

// 部落格文章卡片。沿用設計系統的深色卡 + cool 點綴。
export default function PostCard({ meta }: { meta: PostMeta }) {
  return (
    <Link
      href={`/blog/${meta.slug}`}
      className="group block rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cool/50"
    >
      <time className="font-mono text-xs text-dim">{meta.date}</time>
      <h3 className="mt-2 text-xl font-medium text-text transition-colors group-hover:text-cool">
        {meta.title}
      </h3>
      <p className="mt-2 leading-relaxed text-dim">{meta.summary}</p>
      {meta.tags?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {meta.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-line px-2 py-0.5 font-mono text-[11px] text-dim"
            >
              #{t}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
