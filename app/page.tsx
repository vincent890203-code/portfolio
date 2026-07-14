import NeuralCanvas from "@/components/NeuralCanvas";
import RoleTicker from "@/components/RoleTicker";
import TimelineItem from "@/components/TimelineItem";
import { PROFILE, CREDENTIALS } from "@/content/profile";
import { TIMELINE } from "@/content/timeline";
import { LINKS } from "@/content/links";

const SECOND_BRAIN = [
  {
    title: "知識圖譜",
    desc: "互動式 force graph,呈現我所有課程與知識節點的連結。",
    status: "PHASE 3 · 建置中",
    accentClass: "text-warm",
  },
  {
    title: "問我的第二大腦",
    desc: "RAG 驅動的對話介面,直接問它我會什麼、學過什麼,附引用來源。",
    status: "PHASE 4 · 規劃中",
    accentClass: "text-cool",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-text">
      {/* Hero */}
      <header className="relative overflow-hidden" style={{ minHeight: "92vh" }}>
        <NeuralCanvas />
        <div className="relative z-10 mx-auto max-w-4xl px-6 pb-24 pt-28 sm:pt-32">
          <p className="mb-6 font-mono text-xs tracking-widest2 text-dim sm:text-sm">
            FROM {PROFILE.fromField} TO AI ENGINEERING
          </p>
          <h1 className="text-5xl font-bold leading-tight md:text-7xl">
            {PROFILE.name}
          </h1>
          <p className="mt-2 font-mono text-sm text-dim">{PROFILE.nameEn}</p>
          <p className="mt-4 h-10 text-2xl md:text-3xl">
            <RoleTicker />
          </p>
          <p className="mt-6 max-w-lg leading-relaxed text-dim">
            {PROFILE.tagline}
          </p>

          {/* 連結 */}
          <nav className="mt-10 flex flex-wrap gap-3">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                className="group flex min-h-[44px] items-center gap-2 rounded-full border border-line bg-surface/60 px-4 py-2 text-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cool"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-line text-[10px] font-bold text-cool">
                  {l.icon}
                </span>
                <span className="text-dim transition-colors group-hover:text-white">
                  {l.label}
                </span>
              </a>
            ))}
          </nav>

          {/* 證照/語言 */}
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs text-dim">
            {CREDENTIALS.map((c) => (
              <li key={c} className="flex items-center gap-2">
                <span className="text-cool">▹</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
          style={{ background: "linear-gradient(transparent, #0A0F1E)" }}
        />
      </header>

      {/* 時間軸 */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="mb-14 flex items-center gap-4">
          <h2 className="text-3xl font-bold">轉職訊號軸</h2>
          <span className="font-mono text-xs text-dim">/career-timeline</span>
        </div>
        <div className="relative">
          <div
            className="absolute bottom-8 left-[7px] top-2 w-0.5"
            style={{ background: "linear-gradient(#FFB454, #22D3EE)" }}
          />
          {TIMELINE.map((item, i) => (
            <TimelineItem
              key={i}
              item={item}
              index={i}
              total={TIMELINE.length}
            />
          ))}
        </div>
      </section>

      {/* 第二大腦預告 */}
      <section className="mx-auto max-w-4xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-2">
          {SECOND_BRAIN.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-line bg-surface p-8 transition-transform duration-300 hover:-translate-y-1"
            >
              <p
                className={`mb-4 font-mono text-[11px] tracking-widest ${c.accentClass}`}
              >
                {c.status}
              </p>
              <h3 className="text-2xl font-medium">{c.title}</h3>
              <p className="mt-3 leading-relaxed text-dim">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-line py-10 text-center text-sm text-dim">
        © 2026 {PROFILE.name} · 這個網站本身就是一個進行中的專案 · Built with
        Next.js + Claude
      </footer>
    </main>
  );
}
