"use client";

import { useEffect, useRef, useState } from "react";
import { PALETTE, lerpColor } from "@/content/palette";
import type { TimelineNode } from "@/content/timeline";

// 時間軸單一節點。顏色依 index 在 warm→cool 間插值,進入視窗時淡入。
export default function TimelineItem({
  item,
  index,
  total,
}: {
  item: TimelineNode;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => e.isIntersecting && setSeen(true),
      { threshold: 0.35 }
    );
    const el = ref.current;
    if (el) ob.observe(el);
    return () => ob.disconnect();
  }, []);

  const t = total <= 1 ? 1 : index / (total - 1);
  const color = lerpColor(PALETTE.warm, PALETTE.cool, t);

  return (
    <div
      ref={ref}
      className="relative pb-12 pl-8 transition-all duration-700 sm:pl-10"
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? "translateY(0)" : "translateY(24px)",
      }}
    >
      <div
        className="absolute left-0 top-1 h-4 w-4 rounded-full"
        style={{ background: color, boxShadow: `0 0 16px ${color}` }}
      />
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="font-mono text-sm tracking-widest" style={{ color }}>
          {item.year}
        </span>
        <span
          className="rounded-full border px-2 py-0.5 text-xs"
          style={{ borderColor: color, color }}
        >
          {item.tag}
        </span>
      </div>
      <h3 className="mt-2 text-xl font-medium text-text">{item.title}</h3>
      <p className="mt-2 max-w-xl leading-relaxed text-dim">{item.body}</p>
    </div>
  );
}
