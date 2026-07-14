// 基本身分與 Hero 文案。之後可改由 MDX / CMS 供給。
export const PROFILE = {
  name: "郭原辰",
  nameEn: "Yuan-Chen Kuo",
  alias: "Vincent",
  // Hero 標語:FROM [原領域] TO AI ENGINEERING
  fromField: "MOLECULAR MEDICINE",
  // Hero 副標敘事
  tagline:
    "我把自己的轉職路、學過的每一門課、腦中的知識圖譜,全部建成一個可以對話的第二大腦——你現在就站在它上面。",
  // 求職定位,可放進 metadata 與頁尾
  headline: "AI Systems Engineer · 從分子醫學轉職的 AI 全端工程師",
} as const;

// Hero 打字輪播角色(貼合履歷求職定位)
export const ROLES = [
  "AI Systems Engineer",
  "LLM / Multi-Agent 工程師",
  "Software Architect(進行式)",
  "從分子醫學到 AI 的轉職者",
] as const;

// 證照與語言
export const CREDENTIALS = [
  "TOEIC 805",
  "Certiport ITS Python",
  "英文:可國際會議簡報",
] as const;
