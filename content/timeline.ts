// 職涯時間軸 —「轉職訊號軸」。由舊到新,顏色由暖→冷插值。
// 資料來源:郭原辰履歷。之後 Phase 2/3 每個節點可展開連到知識卡片。
export type TimelineNode = {
  year: string;
  title: string;
  tag: string;
  body: string;
};

export const TIMELINE: TimelineNode[] = [
  {
    year: "2023–2025",
    title: "分子醫學碩士研究 · 台大醫學院",
    tag: "研究底子",
    body: "以 Project Lead 身分獨立主導橫跨多期的研究專案,探討秀麗隱桿線蟲(C. elegans)對 Chryseobacterium indologenes 的抵抗機制。透過遺傳篩選與神經傳導物質(Tyramine、GABA)分析拆解訊號路徑,培養出「在資訊不足下做決策、為結果負責」的核心能力。",
  },
  {
    year: "2025",
    title: "決定轉向 AI 工程",
    tag: "覺醒",
    body: "意識到自己真正擅長的不是「跑實驗」,而是「面對複雜未知、拆解問題、找出下一步」——這正是軟體與 AI 需要的能力。決定把研究方法論帶進工程領域,展開系統性轉型。",
  },
  {
    year: "2025–2026",
    title: "ITRI 轉職計畫 × Coursera 系統打底",
    tag: "打底",
    body: "進入工研院(ITRI)AI 轉職培訓,系統性修習 Python、機器學習(Scikit-learn)、深度學習。同步完成 Coursera 上的物件導向設計、Design Patterns、Software Architecture 等專項,把工程思維從零建立起來。",
  },
  {
    year: "2026 / 01–02",
    title: "DeepTox × Ares — 生醫 × AI 的個人專案",
    tag: "實作",
    body: "DeepTox 用 RDKit 做分子特徵工程 + Random Forest / SVM 預測藥物毒性;Ares 以三層「工廠」架構(Spider / Refinery / Brain)自動化生醫文獻爬取與清洗。用真實專案把 OOP、設計模式與架構思維練成肌肉記憶。",
  },
  {
    year: "現在",
    title: "智平衡健康事業 · 唯一 AI 工程師",
    tag: "現在進行式",
    body: "獨力負責公司 AI 應用從商業分析(BA)、系統架構(SA)到部署上線的完整交付。主導 SAI 語音內容生成系統(Whisper large-v3 + LLM),開發 12 項 MCP 工具伺服器,並以 LangGraph 打造多代理系統;同時把單體程式重構為分層架構,建立 ADR 決策紀錄習慣。下一步目標:專精 AI Agent 系統的 Software Architect。",
  },
];
