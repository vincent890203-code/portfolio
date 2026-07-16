"""knowledge_graph:卡片盒知識圖譜的分析大腦。

架構(對應 Alberta 專項所學):
- models      領域模型(Card / Edge / Graph)
- repository  Repository pattern,儲存抽象(JSON → 之後 Supabase)
- analyzers   Strategy pattern,可插拔的缺口分析器
- pipeline    組合分析器,依賴 Analyzer 介面(依賴反轉)
"""
