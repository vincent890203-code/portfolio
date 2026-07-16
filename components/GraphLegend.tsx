"use client";

import { useState } from "react";
import { NOTE_ORDER, NOTE_STYLES } from "@/content/graph/noteStyles";

// 圖例:7 類筆記顏色。手機可收合。
export default function GraphLegend() {
  const [open, setOpen] = useState(true);
  return (
    <div className="absolute bottom-4 left-4 rounded-2xl border border-line bg-surface/90 p-4 backdrop-blur">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-6 font-mono text-xs text-dim"
      >
        <span className="text-text">碰撞歷程 · 由外而內</span>
        <span>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <ul className="mt-3 space-y-1.5">
          {NOTE_ORDER.map((k) => {
            const s = NOTE_STYLES[k];
            return (
              <li key={k} className="flex items-center gap-2 text-xs text-dim">
                <span
                  className="inline-block h-3 w-3 flex-shrink-0 rounded-full"
                  style={{
                    background: k === "project" ? "transparent" : s.color,
                    border: k === "project" ? `1px solid ${s.color}` : "none",
                    boxShadow: k === "permanent" ? `0 0 8px ${s.color}` : "none",
                  }}
                />
                {s.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
