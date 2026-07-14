"use client";

import { useEffect, useRef } from "react";
import { PALETTE, lerpColor } from "@/content/palette";

// Hero 背景:神經網路粒子(呼應第二大腦)。
// 連線顏色依 x 座標做 warm→cool 插值,用顏色講轉職故事。
// RWD:粒子數依螢幕寬度縮減以省效能與電量;尊重 prefers-reduced-motion。
export default function NeuralCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // 粒子數依螢幕寬度縮減:手機省電、桌機才給滿。
    const nodeCount = () => {
      const w = window.innerWidth;
      if (w < 480) return 26;
      if (w < 768) return 38;
      return 55;
    };

    let w = 0;
    let h = 0;
    let raf = 0;
    let N = nodeCount();
    const mouse = { x: -9999, y: -9999 };

    const makeNodes = (n: number) =>
      Array.from({ length: n }, () => ({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0006,
        vy: (Math.random() - 0.5) * 0.0006,
      }));

    let nodes = makeNodes(N);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = canvas.width = r.width * devicePixelRatio;
      h = canvas.height = r.height * devicePixelRatio;
      const next = nodeCount();
      if (next !== N) {
        N = next;
        nodes = makeNodes(N);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * w;
      mouse.y = ((e.clientY - r.top) / r.height) * h;
    };
    window.addEventListener("pointermove", onMove);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const pts = nodes.map((n) => {
        if (!reduced) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > 1) n.vx *= -1;
          if (n.y < 0 || n.y > 1) n.vy *= -1;
        }
        return { px: n.x * w, py: n.y * h };
      });
      const maxD = Math.min(w, h) * 0.22;
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].px - pts[j].px;
          const dy = pts[i].py - pts[j].py;
          const d = Math.hypot(dx, dy);
          if (d < maxD) {
            const t = pts[i].px / w;
            ctx.strokeStyle = lerpColor(PALETTE.warm, PALETTE.cool, t);
            ctx.globalAlpha = (1 - d / maxD) * 0.35;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pts[i].px, pts[i].py);
            ctx.lineTo(pts[j].px, pts[j].py);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      pts.forEach((p) => {
        const near = Math.hypot(p.px - mouse.x, p.py - mouse.y) < maxD;
        ctx.fillStyle = lerpColor(PALETTE.warm, PALETTE.cool, p.px / w);
        ctx.beginPath();
        ctx.arc(
          p.px,
          p.py,
          near ? 3.5 * devicePixelRatio : 1.6 * devicePixelRatio,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 h-full w-full"
      style={{ opacity: 0.55 }}
      aria-hidden="true"
    />
  );
}
