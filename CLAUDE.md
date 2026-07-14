# 個人品牌網站 — 專案脈絡

## 專案願景
長期經營的個人形象網站,核心敘事是「從 [原領域] 轉職為 AI 全端工程師」。
最終目標:投履歷時只需附上這個網址。網站本身就是能力證明——
內建知識圖譜視覺化與 RAG 第二大腦,面試官可以直接與它對話。

內容策略採 POSSE:本站是唯一內容本體(single source of truth),
Medium / LinkedIn / Threads 只發摘要並引流回來(Medium 設 canonical URL)。

## 技術棧(已定案)
- Next.js(App Router)+ TypeScript
- Tailwind CSS + Framer Motion(動畫)
- MDX(故事與文章內容,放在 repo 內,之後直接餵 RAG pipeline)
- 部署:Vercel(免費層)
- 資料庫(Phase 4):Supabase 免費層 + pgvector
- LLM:Claude API(回答用 Haiku 控制成本,設支出上限 + rate limit)
- Embedding:Voyage 或 OpenAI 小模型

## 開發階段
- **Phase 1(現在)**:網站骨架 — Hero、職涯時間軸、聯絡連結、RWD、部署上線
- **Phase 2**:內容管線 — Coursera 課程與筆記結構化(MDX / JSON),作品集頁
- **Phase 3**:知識圖譜 — react-force-graph 互動視覺化,風格銜接 Hero 粒子網路
- **Phase 4**:RAG 第二大腦 — 向量化知識庫、聊天介面、附引用來源的回答
- 每個 Phase 結束時網站都必須是「可直接放進履歷」的完成狀態

## 設計系統(已定案,勿隨意更換)
核心概念:「訊號轉換」— 顏色從暖到冷,隱喻轉職歷程。

```
bg:      #0A0F1E   深空藍背景
surface: #101830   卡片底色
line:    #1E2A4A   邊框
warm:    #FFB454   暖橘 = 過去 / 原背景
cool:    #22D3EE   電光青 = 現在 / AI 工程師
text:    #E6EAF5   主文字
dim:     #8A93AD   次要文字
```

- 時間軸:垂直線為 warm→cool 漸層,節點顏色依時間插值
- Hero:神經網路粒子 canvas(呼應第二大腦),連線顏色依 x 座標做 warm→cool 插值
- 字體:Noto Sans TC 為主,等寬字(ui-monospace)做年份、標籤、路徑等點綴
- 中文為主要語言,保留部分英文 monospace 標籤增加科技感

## 既有程式碼
`portfolio-prototype.jsx` 是已驗收的視覺原型(單檔 React 元件),
移植時拆分為:`NeuralCanvas`、`RoleTicker`、`TimelineItem` 等獨立元件,
時間軸資料抽到 `content/timeline.ts`(之後改餵 MDX/CMS)。

## RWD 要求(一等公民)
- 手機端粒子數量依螢幕寬度縮減(省效能與電量)
- 觸控目標 ≥ 44px;hover 效果需有觸控替代方案
- 窄螢幕時間軸左邊距收緊
- 尊重 prefers-reduced-motion
- 後期加 PWA manifest(可加入主畫面)

## 待補內容([TODO],由本人提供)
- 真實姓名 / 代號、原領域、轉折點故事
- 時間軸各階段的真實年份與敘述
- 社群連結:GitHub、LinkedIn、Email、Line、Threads、履歷 PDF
- Coursera 課程清單(同時是 Phase 2 知識庫第一批資料)

## 慣例
- Commit 訊息用英文,遵循 conventional commits
- 元件放 `components/`,內容資料放 `content/`
- 每完成一個區塊,手機檢視驗一次再繼續
