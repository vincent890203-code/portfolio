# analysis — 卡片盒知識圖譜的分析大腦(Python)

前端(Next.js)負責呈現;這個 Python 套件負責**思考**:分析知識圖譜,
指出「哪些卡片該繼續消化成永久筆記」,替使用者減少判斷疲勞。

## 架構(刻意對應 Alberta「Software Design and Architecture」專項)

| 模組 | 職責 | 設計 |
| --- | --- | --- |
| `knowledge_graph/models.py` | 領域模型 Card / Edge / Graph | 純資料 + 查詢,無 IO |
| `knowledge_graph/repository.py` | 圖的載入/寫回 | **Repository**:JSON 現在,Supabase/pgvector 之後只加一個實作 |
| `knowledge_graph/analyzers.py` | 缺口偵測 | **Strategy**:每種缺口一個可插拔分析器 |
| `knowledge_graph/pipeline.py` | 組合分析器算 focusScore | 依賴 `Analyzer` 介面(**依賴反轉**) |

model / analyzer 可插拔、pipeline 對介面編程,所以**好加新分析維度、好寫單元測試、之後好換 embedding / LLM 供應商**。

## 目前的缺口分析器

- `undigested` — 文獻/概念碰撞卡片還沒連到任何永久筆記(最有槓桿的「該消化」訊號)
- `open-question` — 問題卡片還沒收斂成洞察
- `synthesis` — 樞紐級素材密集但缺乏綜合
- `isolated` — 知識孤島,還沒跟其他卡片碰撞

## 用法

```bash
cd analysis && python -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt

# 從專案根目錄執行
cd .. 
python -m analysis.run --dry-run     # 只印「該先消化」清單
python -m analysis.run               # 並把 gaps / focusScore 寫回 graph JSON
pytest analysis                      # 單元測試
```

## Roadmap

- [x] 純圖結構的缺口分析(無外部依賴、100% 單元測試)
- [ ] Embedding 相似度 → 找出「你還沒連的隱藏關聯」(可插拔 EmbeddingProvider,Strategy)
- [ ] RAG:pgvector 檢索 + 子圖擴展 + Claude Haiku 回答(Phase 4)
