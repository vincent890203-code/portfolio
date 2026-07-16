// 筆記類型 → 視覺樣式。
// 顏色 = 卡片盒碰撞歷程;radius = 徑向布局的目標半徑(外圈生資料 → 核心永久筆記)。
// 這一份是圖譜的視覺語言單一來源(色票、圖例、徑向力都讀它)。
export type NoteType =
  | "raw"
  | "question"
  | "literature"
  | "method"
  | "concept-collision"
  | "permanent"
  | "project";

export type NoteStyle = {
  label: string; // 圖例顯示名
  color: string; // 節點顏色
  radius: number; // forceRadial 目標半徑(越小越靠核心)
  emissive: number; // 發光強度 0–1(永久筆記最亮)
};

// 徑向:raw 最外 → permanent 核心。碰撞歷程由外而內(緊湊尺度,方便觀看)。
export const NOTE_STYLES: Record<NoteType, NoteStyle> = {
  raw: { label: "別人觀點", color: "#E6EAF5", radius: 130, emissive: 0.15 },
  question: { label: "問題 · 碰撞點", color: "#A78BFA", radius: 100, emissive: 0.5 },
  literature: { label: "文獻筆記", color: "#FFB454", radius: 74, emissive: 0.35 },
  method: { label: "方法", color: "#4ADE80", radius: 52, emissive: 0.45 },
  "concept-collision": { label: "概念碰撞", color: "#FF6B6B", radius: 34, emissive: 0.6 },
  permanent: { label: "永久筆記", color: "#22D3EE", radius: 8, emissive: 1.0 },
  project: { label: "專案筆記", color: "#8A93AD", radius: 62, emissive: 0.3 },
};

export const NOTE_ORDER: NoteType[] = [
  "raw",
  "question",
  "literature",
  "method",
  "concept-collision",
  "permanent",
  "project",
];

export function styleOf(noteType: string): NoteStyle {
  return NOTE_STYLES[(noteType as NoteType) ?? "literature"] ?? NOTE_STYLES.literature;
}
