// 共用技能詞彙表 —— 專案、課程、(未來)知識圖譜共用同一組 key。
// Phase 3 的圖譜邊(課程 → 技能 → 專案)會從這裡自動長出來,
// 所以新增內容時 skills 欄位務必只用這裡定義的 key。
export const SKILLS = {
  // 軟體工程 / 架構(冷色調,現在)
  oop: "物件導向設計",
  designPatterns: "設計模式",
  architecture: "系統架構",
  soa: "服務導向架構",
  adr: "架構決策紀錄",
  fastapi: "FastAPI",
  mysql: "MySQL",
  refactoring: "重構",
  // AI / LLM(冷色調,現在)
  llm: "LLM 應用",
  rag: "RAG",
  multiAgent: "多代理系統",
  langgraph: "LangGraph",
  mcp: "MCP 工具",
  ml: "機器學習",
  // 資料 / 工程
  dataEngineering: "資料工程",
  webScraping: "網路爬蟲",
  python: "Python",
  // 生醫 / 研究(暖色調,過去)
  molecularBio: "分子生物",
  genetics: "遺傳分析",
  cheminformatics: "化學資訊學",
  research: "獨立研究",
  // 軟實力
  projectMgmt: "專案管理",
} as const;

export type SkillKey = keyof typeof SKILLS;

// 把 skill key 陣列轉成顯示標籤;未知 key 直接原樣回傳(方便漸進擴充)。
export function skillLabels(keys: string[]): string[] {
  return keys.map((k) => (SKILLS as Record<string, string>)[k] ?? k);
}
