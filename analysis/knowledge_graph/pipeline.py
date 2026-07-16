"""缺口分析 pipeline。組合多個 Analyzer,替每張卡片算出 focusScore。

依賴的是 Analyzer 介面(依賴反轉),所以分析器可自由插拔、單獨測試。
"""
from __future__ import annotations

from dataclasses import dataclass, field

from .analyzers import Analyzer
from .models import Graph


@dataclass
class CardGaps:
    """單張卡片的分析結果。"""

    gaps: list[dict] = field(default_factory=list)  # [{key, reason, weight}]
    focus_score: float = 0.0

    def as_annotation(self) -> dict:
        return {
            "gaps": [{"key": g["key"], "reason": g["reason"]} for g in self.gaps],
            "focusScore": round(self.focus_score, 2),
        }


class GapAnalysisPipeline:
    def __init__(self, analyzers: list[Analyzer]):
        self.analyzers = analyzers

    def run(self, graph: Graph) -> dict[str, CardGaps]:
        results: dict[str, CardGaps] = {cid: CardGaps() for cid in graph.cards}
        for analyzer in self.analyzers:
            for cid, reason in analyzer.analyze(graph).items():
                cg = results[cid]
                cg.gaps.append(
                    {"key": analyzer.key, "reason": reason, "weight": analyzer.weight}
                )
                cg.focus_score += analyzer.weight
        return results

    def top_focus(self, graph: Graph, n: int = 15) -> list[tuple[str, CardGaps]]:
        results = self.run(graph)
        ranked = sorted(
            results.items(), key=lambda kv: kv[1].focus_score, reverse=True
        )
        return [(cid, cg) for cid, cg in ranked if cg.focus_score > 0][:n]
