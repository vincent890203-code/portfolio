import type { Metadata } from "next";
import Nav from "@/components/Nav";
import KnowledgeGraph, { type GraphData } from "@/components/KnowledgeGraph.client";
import GraphLegend from "@/components/GraphLegend";
import { loadGraph } from "@/lib/graphSource";

export const metadata: Metadata = {
  title: "第二大腦 · 知識圖譜 · 郭原辰",
  description:
    "把「軟體設計與架構」的學習消化成一張互動知識圖譜:外圈是別人的知識,越往核心越是我碰撞出的永久筆記。",
};

// ISR:大多時候是靜態,發布新資料後每 10 分鐘自動更新一次。
export const revalidate = 600;

type GapNode = GraphData["nodes"][number] & {
  focusScore?: number;
  gaps?: { key: string; reason: string }[];
};

export default async function BrainPage() {
  const data = await loadGraph();
  const permanentCount = data.nodes.filter((n) => n.noteType === "permanent").length;

  // 「該先消化」清單:由 Python 分析器算出的 focusScore 排序。
  const focus = (data.nodes as GapNode[])
    .filter((n) => (n.focusScore ?? 0) > 0)
    .sort((a, b) => (b.focusScore ?? 0) - (a.focusScore ?? 0))
    .slice(0, 8);

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-4xl px-6 pt-10">
        <div className="mb-3 flex items-center gap-4">
          <h1 className="text-3xl font-bold text-text">第二大腦</h1>
          <span className="font-mono text-xs text-dim">/brain</span>
        </div>
        <p className="mb-2 max-w-2xl leading-relaxed text-dim">
          這不是課程清單,是我把「軟體設計與架構」的知識
          <span className="text-text">碰撞內化</span>的過程——
          {data.nodes.length} 個節點、{data.links.length}{" "}
          條我親手畫的連結。外圈是別人的觀點,越往核心越是我自己的洞察;
          發亮的青色核心是 {permanentCount} 則永久筆記(我真正的原創思考)。
        </p>
        <p className="mb-4 font-mono text-xs text-dim">
          拖曳旋轉 · 滾輪縮放 · 點節點看內容 · hover 看神經連線放電
        </p>
      </main>

      {/* 全幅圖譜畫布 */}
      <section className="relative mx-auto h-[82vh] max-w-6xl px-2">
        <div className="relative h-full w-full overflow-hidden rounded-2xl border border-line">
          <KnowledgeGraph data={data} />
          <GraphLegend />
        </div>
      </section>

      {/* 思考工具:該先消化什麼(由分析器算出的 focusScore) */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-3 flex items-center gap-4">
          <h2 className="text-2xl font-bold text-text">接下來該消化什麼</h2>
          <span className="font-mono text-xs text-dim">/focus</span>
        </div>
        <p className="mb-8 max-w-2xl text-sm leading-relaxed text-dim">
          這張圖不只給人看,也是我的思考工具。分析器找出「已吸收別人觀點、但還沒長成永久筆記」的卡片,
          依槓桿排序——用最小摩擦力告訴我:下一則永久筆記,從這裡開始。
        </p>
        <ol className="space-y-3">
          {focus.map((n, i) => (
            <li
              key={n.id}
              className="flex gap-4 rounded-xl border border-line bg-surface p-4"
            >
              <span className="font-mono text-sm text-cool">{i + 1}</span>
              <div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-medium text-text">{n.title}</span>
                  <span className="font-mono text-[11px] text-warm">
                    focus {n.focusScore?.toFixed(1)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-dim">
                  {(n.gaps ?? []).map((g) => g.reason).join(" · ")}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
