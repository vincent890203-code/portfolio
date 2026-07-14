import { useEffect, useRef, useState } from "react";

// ============================================================
// 個人品牌網站原型 — 骨架 + 職涯時間軸
// 設計語言:「訊號轉換」— 時間軸由暖色(原背景)漸變到冷色(AI 全端),
// 用顏色本身講你的轉職故事。Hero 背景是神經網路粒子,呼應第二大腦。
// 標 [TODO] 的地方換成你的真實內容。
// ============================================================

const PALETTE = {
  bg: "#0A0F1E",
  surface: "#101830",
  line: "#1E2A4A",
  warm: "#FFB454", // 過去
  cool: "#22D3EE", // 現在
  text: "#E6EAF5",
  dim: "#8A93AD",
};

// [TODO] 換成你的真實經歷
const TIMELINE = [
  {
    year: "20XX",
    title: "原本的起點",
    tag: "背景",
    body: "描述你原本的領域、在做什麼、培養了哪些底層能力(溝通、領域知識、解決問題)。這段是故事的錨點。",
  },
  {
    year: "20XX",
    title: "轉折點",
    tag: "覺醒",
    body: "是什麼讓你決定走向軟體與 AI?一個專案、一門課、一個問題。寫得具體,面試官最愛看動機。",
  },
  {
    year: "20XX",
    title: "系統性自學",
    tag: "打底",
    body: "Coursera 課程、線上資源、刻意練習。之後這裡會直接連到你的知識庫,每門課展開成一張知識卡片。",
  },
  {
    year: "20XX",
    title: "第一批實戰專案",
    tag: "實作",
    body: "側專案、開源貢獻、接案。每一項之後都連到作品集頁,附 repo 與 demo 連結。",
  },
  {
    year: "現在",
    title: "AI 全端工程師",
    tag: "現在進行式",
    body: "目前的定位與正在打造的東西——包括這個網站本身:內建知識圖譜與 RAG 第二大腦的活作品集。",
  },
];

// [TODO] 換成你的真實連結
const LINKS = [
  { label: "GitHub", href: "#", icon: "GH" },
  { label: "LinkedIn", href: "#", icon: "in" },
  { label: "Email", href: "#", icon: "@" },
  { label: "Line", href: "#", icon: "L" },
  { label: "Threads", href: "#", icon: "@t" },
  { label: "履歷 PDF", href: "#", icon: "CV" },
];

const ROLES = ["AI 全端工程師", "RAG 系統建造者", "終身學習者", "第二大腦架構師"];

function lerpColor(a, b, t) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

// ---------- Hero 背景:神經網路粒子 ----------
function NeuralCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    let w, h, raf;
    const mouse = { x: -9999, y: -9999 };
    const N = 55;
    const nodes = Array.from({ length: N }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
    }));
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = canvas.width = r.width * devicePixelRatio;
      h = canvas.height = r.height * devicePixelRatio;
    };
    resize();
    window.addEventListener("resize", resize);
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * w;
      mouse.y = ((e.clientY - r.top) / r.height) * h;
    };
    window.addEventListener("pointermove", onMove);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const pts = nodes.map((n) => {
        if (!reduced) {
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > 1) n.vx *= -1;
          if (n.y < 0 || n.y > 1) n.vy *= -1;
        }
        return { px: n.x * w, py: n.y * h };
      });
      const maxD = Math.min(w, h) * 0.22;
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].px - pts[j].px, dy = pts[i].py - pts[j].py;
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
      pts.forEach((p, i) => {
        const near = Math.hypot(p.px - mouse.x, p.py - mouse.y) < maxD;
        ctx.fillStyle = lerpColor(PALETTE.warm, PALETTE.cool, p.px / w);
        ctx.beginPath();
        ctx.arc(p.px, p.py, near ? 3.5 * devicePixelRatio : 1.6 * devicePixelRatio, 0, Math.PI * 2);
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
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.55 }}
      aria-hidden="true"
    />
  );
}

// ---------- 打字輪播 ----------
function RoleTicker() {
  const [idx, setIdx] = useState(0);
  const [txt, setTxt] = useState("");
  useEffect(() => {
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
    <span style={{ color: PALETTE.cool, fontFamily: "ui-monospace, monospace" }}>
      {txt}
      <span className="animate-pulse">▍</span>
    </span>
  );
}

// ---------- 時間軸項目 ----------
function TimelineItem({ item, index, total }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => e.isIntersecting && setSeen(true),
      { threshold: 0.35 }
    );
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);
  const t = total <= 1 ? 1 : index / (total - 1);
  const color = lerpColor(PALETTE.warm, PALETTE.cool, t);
  return (
    <div
      ref={ref}
      className="relative pl-10 pb-12 transition-all duration-700"
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? "translateY(0)" : "translateY(24px)",
      }}
    >
      <div
        className="absolute left-0 top-1 w-4 h-4 rounded-full"
        style={{ background: color, boxShadow: `0 0 16px ${color}` }}
      />
      <div className="flex items-baseline gap-3 flex-wrap">
        <span
          className="text-sm tracking-widest"
          style={{ color, fontFamily: "ui-monospace, monospace" }}
        >
          {item.year}
        </span>
        <span
          className="text-xs px-2 py-0.5 rounded-full border"
          style={{ borderColor: color, color }}
        >
          {item.tag}
        </span>
      </div>
      <h3 className="text-xl mt-2 font-medium" style={{ color: PALETTE.text }}>
        {item.title}
      </h3>
      <p className="mt-2 leading-relaxed max-w-xl" style={{ color: PALETTE.dim }}>
        {item.body}
      </p>
    </div>
  );
}

// ---------- 主頁面 ----------
export default function Portfolio() {
  return (
    <div style={{ background: PALETTE.bg, color: PALETTE.text, minHeight: "100vh", fontFamily: "'Noto Sans TC', system-ui, sans-serif" }}>
      {/* Hero */}
      <header className="relative overflow-hidden" style={{ minHeight: "92vh" }}>
        <NeuralCanvas />
        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24">
          <p className="text-sm tracking-[0.3em] mb-6" style={{ color: PALETTE.dim, fontFamily: "ui-monospace, monospace" }}>
            FROM [你的原領域] TO AI ENGINEERING
          </p>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            你的名字
            {/* [TODO] 換成真名或代號 */}
          </h1>
          <p className="text-2xl md:text-3xl mt-4 h-10">
            <RoleTicker />
          </p>
          <p className="mt-6 max-w-lg leading-relaxed" style={{ color: PALETTE.dim }}>
            我把自己的轉職路、學過的每一門課、腦中的知識圖譜,
            全部建成一個可以對話的第二大腦——你現在就站在它上面。
          </p>
          <div className="flex flex-wrap gap-3 mt-10">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="group flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-all duration-300 hover:-translate-y-0.5"
                style={{ borderColor: PALETTE.line, background: "rgba(16,24,48,0.6)" }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: PALETTE.line, color: PALETTE.cool }}
                >
                  {l.icon}
                </span>
                <span style={{ color: PALETTE.dim }} className="group-hover:text-white transition-colors">
                  {l.label}
                </span>
              </a>
            ))}
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: `linear-gradient(transparent, ${PALETTE.bg})` }}
        />
      </header>

      {/* 時間軸 */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="flex items-center gap-4 mb-14">
          <h2 className="text-3xl font-bold">轉職訊號軸</h2>
          <span className="text-xs" style={{ color: PALETTE.dim, fontFamily: "ui-monospace, monospace" }}>
            /career-timeline
          </span>
        </div>
        <div className="relative">
          <div
            className="absolute left-[7px] top-2 bottom-8 w-0.5"
            style={{ background: `linear-gradient(${PALETTE.warm}, ${PALETTE.cool})` }}
          />
          {TIMELINE.map((item, i) => (
            <TimelineItem key={i} item={item} index={i} total={TIMELINE.length} />
          ))}
        </div>
      </section>

      {/* 第二大腦預告 */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: "知識圖譜",
              desc: "互動式 force graph,呈現我所有課程與知識節點的連結。",
              status: "PHASE 3 · 建置中",
              accent: PALETTE.warm,
            },
            {
              title: "問我的第二大腦",
              desc: "RAG 驅動的對話介面,直接問它我會什麼、學過什麼。",
              status: "PHASE 4 · 規劃中",
              accent: PALETTE.cool,
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border p-8 transition-transform duration-300 hover:-translate-y-1"
              style={{ borderColor: PALETTE.line, background: PALETTE.surface }}
            >
              <p
                className="text-[11px] tracking-widest mb-4"
                style={{ color: c.accent, fontFamily: "ui-monospace, monospace" }}
              >
                {c.status}
              </p>
              <h3 className="text-2xl font-medium">{c.title}</h3>
              <p className="mt-3 leading-relaxed" style={{ color: PALETTE.dim }}>
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t py-10 text-center text-sm" style={{ borderColor: PALETTE.line, color: PALETTE.dim }}>
        © 2026 · 這個網站本身就是一個進行中的專案 · Built with Next.js + Claude
      </footer>
    </div>
  );
}
