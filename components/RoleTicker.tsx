"use client";

import { useEffect, useState } from "react";
import { ROLES } from "@/content/profile";

// 打字輪播 Hero 角色。reduced-motion 時直接顯示第一個角色不做動畫。
export default function RoleTicker() {
  const [idx, setIdx] = useState(0);
  const [txt, setTxt] = useState("");

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      setTxt(ROLES[0]);
      return;
    }

    const target = ROLES[idx];
    let i = 0;
    const typer = setInterval(() => {
      i++;
      setTxt(target.slice(0, i));
      if (i >= target.length) {
        clearInterval(typer);
        setTimeout(() => setIdx((p) => (p + 1) % ROLES.length), 1800);
      }
    }, 90);
    return () => clearInterval(typer);
  }, [idx]);

  return (
    <span className="font-mono text-cool">
      {txt}
      <span className="animate-pulse">▍</span>
    </span>
  );
}
