// 設計系統核心色票 —「訊號轉換」:暖(過去)→ 冷(現在)
// 同時被 Tailwind theme 與 canvas 繪圖(需 JS 端的十六進位值)引用。
export const PALETTE = {
  bg: "#0A0F1E",
  surface: "#101830",
  line: "#1E2A4A",
  warm: "#FFB454", // 過去 / 原背景(分子醫學)
  cool: "#22D3EE", // 現在 / AI 工程師
  text: "#E6EAF5",
  dim: "#8A93AD",
} as const;

// 在兩個十六進位色之間做線性插值,回傳 rgb() 字串。
// t=0 → a,t=1 → b。用於時間軸節點顏色與粒子連線漸層。
export function lerpColor(a: string, b: string, t: number): string {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}
