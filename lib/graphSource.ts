import { createClient } from "@supabase/supabase-js";
import type { GraphData } from "@/components/KnowledgeGraph.client";
import localGraph from "@/content/graph/software-architecture.json";

// 知識圖譜資料來源。
// 有設定 Supabase env 就讀 DB(只會拿到 status='published',由 RLS 擋);
// 沒設定或讀取失敗則 fallback 到 repo 內的 JSON,確保站台永遠能 build。
export async function loadGraph(): Promise<GraphData> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return localGraph as GraphData;

  try {
    const supabase = createClient(url, anon);
    const [{ data: cards, error: cErr }, { data: edges, error: eErr }] =
      await Promise.all([
        supabase
          .from("cards")
          .select("id,title,summary,note_type,category,section,degree,gaps,focus_score"),
        supabase.from("edges").select("src,dst,rel,two_way,label"),
      ]);
    if (cErr || eErr || !cards || !edges || cards.length === 0) {
      return localGraph as GraphData;
    }
    return {
      nodes: cards.map((c) => ({
        id: c.id,
        title: c.title,
        summary: c.summary ?? "",
        noteType: c.note_type,
        category: c.category ?? "",
        section: c.section ?? "",
        degree: c.degree ?? 0,
        // 缺口分析欄位(供 focus 面板)
        focusScore: c.focus_score ?? 0,
        gaps: c.gaps ?? [],
      })),
      links: edges.map((e) => ({
        source: e.src,
        target: e.dst,
        type: e.rel ?? "connection",
        twoWay: e.two_way ?? false,
        label: e.label ?? undefined,
      })),
    } as GraphData;
  } catch {
    return localGraph as GraphData;
  }
}
