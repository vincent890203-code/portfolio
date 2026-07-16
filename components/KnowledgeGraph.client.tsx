"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";
import { forceRadial } from "d3-force-3d";
import { styleOf } from "@/content/graph/noteStyles";

// react-force-graph-3d 觸碰 window/WebGL,必須 client-only。
// 透過 wrapper 傳 ref(next/dynamic 不轉發 ref)。
const ForceGraph3D = dynamic(() => import("@/components/ForceGraph3DWrapper"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-dim">
      載入第二大腦…
    </div>
  ),
});

type GraphNode = {
  id: string;
  title: string;
  category: string;
  section?: string;
  summary?: string;
  degree: number;
  noteType: string;
  x?: number;
  y?: number;
  z?: number;
};
type GraphLink = { source: string; target: string; label?: string; twoWay?: boolean };
export type GraphData = { nodes: GraphNode[]; links: GraphLink[] };

export default function KnowledgeGraph({ data }: { data: GraphData }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fgRef = useRef<any>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [reduced, setReduced] = useState(false);

  // 建立「節點 → 相鄰節點/連線」索引,供 hover 高亮與突觸粒子。
  const adjacency = useMemo(() => {
    const map = new Map<string, Set<string>>();
    data.links.forEach((l) => {
      const s = typeof l.source === "string" ? l.source : (l.source as GraphNode).id;
      const t = typeof l.target === "string" ? l.target : (l.target as GraphNode).id;
      if (!map.has(s)) map.set(s, new Set());
      if (!map.has(t)) map.set(t, new Set());
      map.get(s)!.add(t);
      map.get(t)!.add(s);
    });
    return map;
  }, [data.links]);

  // 尺寸自適應。用 rAF 延後 setState,避免在 canvas render 期間更新 state
  // (ResizeObserver 同步觸發會引發 setState-during-render)。
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() =>
        setSize({ w: el.clientWidth, h: el.clientHeight })
      );
    };
    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    setReduced(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  // 徑向「洋蔥」布局 + bloom + 霧化。必須在模擬「開始前」設定力,
  // 所以用 mount 後輪詢 ref 的方式設定,再 reheat 讓徑向力生效。
  useEffect(() => {
    let tries = 0;
    const iv = setInterval(async () => {
      const fg = fgRef.current;
      if (!fg) {
        if (++tries > 60) clearInterval(iv);
        return;
      }
      clearInterval(iv);

      // 徑向力:每類節點被拉向目標半徑(外圈生資料 → 核心永久筆記)。
      fg.d3Force(
        "radial",
        forceRadial((n: any) => styleOf(n.noteType).radius, 0, 0, 0).strength(0.9)
      );
      fg.d3Force("charge")?.strength(-22);
      fg.d3Force("link")?.distance(16);

      const scene = fg.scene?.();
      if (scene) scene.fog = new THREE.FogExp2(0x0a0f1e, 0.0018);

      if (!reduced) {
        try {
          const { UnrealBloomPass } = await import(
            "three/examples/jsm/postprocessing/UnrealBloomPass.js"
          );
          const composer = fg.postProcessingComposer?.();
          if (composer) {
            const bloom = new UnrealBloomPass(
              new THREE.Vector2(size.w || 800, size.h || 600),
              1.6,
              0.85,
              0.1
            );
            composer.addPass(bloom);
          }
        } catch {
          /* bloom 失敗不影響圖譜本體 */
        }
      }
      // 套用徑向力後重新加熱模擬,讓洋蔥布局成形。
      fg.d3ReheatSimulation?.();
    }, 120);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  // 模擬收斂後置中並縮放到剛好。
  const onEngineStop = useCallback(() => {
    fgRef.current?.zoomToFit?.(500, 40);
  }, []);

  const isDim = useCallback(
    (nodeId: string) => {
      if (!hoverId) return false;
      return nodeId !== hoverId && !adjacency.get(hoverId)?.has(nodeId);
    },
    [hoverId, adjacency]
  );

  return (
    <div ref={wrapRef} className="relative h-full w-full">
      <ForceGraph3D
        innerRef={fgRef}
        width={size.w || undefined}
        height={size.h || undefined}
        graphData={data}
        backgroundColor="#0A0F1E"
        showNavInfo={false}
        cooldownTicks={reduced ? 0 : 260}
        onEngineStop={onEngineStop}
        // 節點:顏色依筆記類型,大小依連線數
        nodeVal={(n: any) => 2 + (n.degree || 0) * 0.9}
        nodeColor={(n: any) =>
          isDim(n.id) ? "rgba(138,147,173,0.25)" : styleOf(n.noteType).color
        }
        nodeOpacity={0.95}
        nodeResolution={12}
        nodeLabel={(n: any) => `<div style="font:12px sans-serif;color:#E6EAF5;background:#101830cc;padding:4px 8px;border-radius:6px;border:1px solid #1E2A4A">${n.title}</div>`}
        // 專案筆記 → 立方框(不上節點色)
        nodeThreeObject={(n: any) => {
          if (n.noteType !== "project") return undefined as unknown as THREE.Object3D;
          const size3 = 6 + (n.degree || 0);
          const geo = new THREE.BoxGeometry(size3, size3, size3);
          const edges = new THREE.EdgesGeometry(geo);
          return new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0x8a93ad })
          );
        }}
        nodeThreeObjectExtend={false}
        // 連線:靜止時暗,hover 亮;彎曲更有機
        linkColor={(l: any) => {
          const s = typeof l.source === "string" ? l.source : (l.source as GraphNode).id;
          const t = typeof l.target === "string" ? l.target : (l.target as GraphNode).id;
          if (hoverId && (s === hoverId || t === hoverId)) return "#22D3EE";
          return "rgba(138,147,173,0.18)";
        }}
        linkCurvature={0.18}
        linkWidth={(l: any) => {
          const s = typeof l.source === "string" ? l.source : (l.source as GraphNode).id;
          const t = typeof l.target === "string" ? l.target : (l.target as GraphNode).id;
          return hoverId && (s === hoverId || t === hoverId) ? 1.4 : 0.4;
        }}
        // 突觸粒子:只在 hover 節點的連線上「放電」
        linkDirectionalParticles={(l: any) => {
          if (reduced || !hoverId) return 0;
          const s = typeof l.source === "string" ? l.source : (l.source as GraphNode).id;
          const t = typeof l.target === "string" ? l.target : (l.target as GraphNode).id;
          return s === hoverId || t === hoverId ? 2 : 0;
        }}
        linkDirectionalParticleSpeed={0.006}
        linkDirectionalParticleWidth={1.6}
        linkDirectionalParticleColor={() => "#22D3EE"}
        onNodeHover={(n: any) => setHoverId(n ? n.id : null)}
        onNodeClick={(n: any) => {
          setSelected(n);
          const fg = fgRef.current;
          if (fg && n.x !== undefined) {
            // 相機停在節點前方固定距離,看向該節點(不飛向原點)。
            fg.cameraPosition(
              { x: n.x, y: n.y, z: (n.z ?? 0) + 90 },
              { x: n.x, y: n.y, z: n.z ?? 0 },
              1000
            );
          }
        }}
        onBackgroundClick={() => setSelected(null)}
      />

      {/* 點擊節點 → 側欄 */}
      {selected && (
        <aside className="pointer-events-auto absolute right-4 top-4 max-h-[80%] w-72 overflow-auto rounded-2xl border border-line bg-surface/95 p-5 backdrop-blur">
          <div className="flex items-center justify-between">
            <span
              className="rounded-full px-2 py-0.5 font-mono text-[11px]"
              style={{
                color: styleOf(selected.noteType).color,
                border: `1px solid ${styleOf(selected.noteType).color}`,
              }}
            >
              {styleOf(selected.noteType).label}
            </span>
            <button
              onClick={() => setSelected(null)}
              className="text-dim transition-colors hover:text-text"
              aria-label="關閉"
            >
              ✕
            </button>
          </div>
          <h3 className="mt-3 text-lg font-medium text-text">{selected.title}</h3>
          {selected.summary && (
            <p className="mt-2 text-sm leading-relaxed text-dim">{selected.summary}</p>
          )}
          <dl className="mt-4 space-y-1 font-mono text-[11px] text-dim">
            {selected.section && (
              <div>
                <span className="text-cool">section</span> · {selected.section}
              </div>
            )}
            <div>
              <span className="text-cool">連結數</span> · {selected.degree}
            </div>
          </dl>
        </aside>
      )}
    </div>
  );
}
