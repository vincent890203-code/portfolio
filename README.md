# 郭原辰 · 個人品牌網站

> 從分子醫學研究轉職為 AI 全端工程師的個人形象網站。
> 這個網站本身就是能力證明——最終將內建知識圖譜視覺化與 RAG 第二大腦,面試官可以直接與它對話。

**線上網址**:_部署後補上 `xxx.vercel.app`_

---

## 這是什麼

一個長期經營的 single source of truth 個人網站。核心敘事是「訊號轉換」——用顏色從暖(過去 / 分子醫學)漸變到冷(現在 / AI 工程師),讓視覺本身就在講轉職故事。內容策略採 POSSE:本站為內容本體,其他社群平台只發摘要並引流回來。

## 技術棧

| 類別 | 選型 |
| --- | --- |
| 框架 | Next.js 14(App Router)+ TypeScript |
| 樣式 | Tailwind CSS + Framer Motion |
| 字體 | Noto Sans TC(`next/font`)+ 等寬字點綴 |
| 部署 | Vercel |

## 設計系統

核心概念「訊號轉換」,色票固定:

```
bg      #0A0F1E   深空藍背景        warm  #FFB454   暖橘 = 過去 / 原背景
surface #101830   卡片底色          cool  #22D3EE   電光青 = 現在 / AI 工程師
line    #1E2A4A   邊框              text  #E6EAF5   主文字
                                    dim   #8A93AD   次要文字
```

- **Hero**:神經網路粒子 canvas(呼應第二大腦),連線顏色依 x 座標做 warm→cool 插值
- **時間軸**:垂直線 warm→cool 漸層,節點顏色依時間插值
- **RWD 為一等公民**:手機端粒子數依螢幕寬度縮減、觸控目標 ≥ 44px、尊重 `prefers-reduced-motion`

## 專案結構

```
app/                Next.js App Router(layout、page、globals.css)
components/         NeuralCanvas、RoleTicker、TimelineItem
content/            內容資料層(single source of truth)
  ├─ profile.ts     身分、Hero 文案、角色輪播、證照
  ├─ timeline.ts    職涯時間軸節點
  ├─ links.ts       社群與聯絡連結
  └─ palette.ts     色票 + lerpColor 插值工具
```

> 內容與元件解耦:元件不寫死任何文字,全部從 `content/` 讀取,之後可直接改餵 MDX / CMS / RAG pipeline。

## 開發階段

- [x] **Phase 1** — 網站骨架:Hero、職涯時間軸、聯絡連結、RWD、部署上線
- [ ] **Phase 2** — 內容管線:Coursera 課程與筆記結構化、作品集頁
- [ ] **Phase 3** — 知識圖譜:互動式 force graph,風格銜接 Hero 粒子網路
- [ ] **Phase 4** — RAG 第二大腦:向量化知識庫、聊天介面、附引用來源的回答

## 本地開發

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 正式建置(請先停掉 dev server)
```

---

© 2026 郭原辰(Yuan-Chen Kuo)· Built with Next.js + Claude
