"""缺口分析器(Strategy pattern)。

每個分析器回答一個問題:「這張卡片為什麼需要你繼續思考/消化?」
新增分析維度 = 新增一個 Analyzer,不動 pipeline。全部是純函式,好測試。

設計目的:用最小摩擦力,替使用者指出「該把哪張卡片長成永久筆記」,
減少判斷疲勞,讓注意力集中在濃縮知識本身。
"""
from __future__ import annotations

from typing import Protocol

from .models import (
    Graph,
    PERMANENT,
    LITERATURE,
    QUESTION,
    CONCEPT_COLLISION,
    PROJECT,
)


class Analyzer(Protocol):
    """一種缺口偵測策略。回傳 {card_id: 原因}。"""

    key: str
    weight: float

    def analyze(self, graph: Graph) -> dict[str, str]: ...


class UndigestedLiteratureAnalyzer:
    """文獻/概念碰撞卡片,尚未連到任何永久筆記 → 還沒被你內化。

    卡片盒的核心:文獻筆記的唯一目的是長成永久筆記。
    這是最有槓桿的「該消化」訊號。
    """

    key = "undigested"
    weight = 3.0

    def __init__(self, target_types: tuple[str, ...] = (LITERATURE, CONCEPT_COLLISION)):
        self.target_types = target_types

    def analyze(self, graph: Graph) -> dict[str, str]:
        out: dict[str, str] = {}
        for cid, card in graph.cards.items():
            if card.note_type in self.target_types and not graph.has_neighbor_of_type(
                cid, PERMANENT
            ):
                out[cid] = "已吸收別人觀點,但還沒長出自己的永久筆記"
        return out


class UnansweredQuestionAnalyzer:
    """問題卡片沒有連到永久筆記 → 你提的問題還沒收斂成洞察。"""

    key = "open-question"
    weight = 2.5

    def analyze(self, graph: Graph) -> dict[str, str]:
        out: dict[str, str] = {}
        for cid, card in graph.cards.items():
            if card.note_type == QUESTION and not graph.has_neighbor_of_type(
                cid, PERMANENT
            ):
                out[cid] = "你提的問題還沒收斂成洞察"
        return out


class OrphanAnalyzer:
    """孤島卡片(度數 <= 門檻)→ 知識沒有跟其他東西碰撞。

    永久筆記與專案筆記本身就是終點,不算「待消化」,故排除。
    """

    key = "isolated"
    weight = 1.5

    def __init__(
        self,
        max_degree: int = 1,
        exclude_types: tuple[str, ...] = (PERMANENT, PROJECT),
    ):
        self.max_degree = max_degree
        self.exclude_types = exclude_types

    def analyze(self, graph: Graph) -> dict[str, str]:
        out: dict[str, str] = {}
        for cid, card in graph.cards.items():
            if card.note_type in self.exclude_types:
                continue
            if graph.degree(cid) <= self.max_degree:
                out[cid] = "知識孤島,還沒跟其他卡片碰撞"
        return out


class SynthesisOpportunityAnalyzer:
    """高連結的樞紐,本身不是永久筆記、周圍也沒有永久筆記
    → 這裡累積了大量素材,最該做一次綜合。
    """

    key = "synthesis"
    weight = 2.0

    def __init__(self, min_degree: int = 6):
        self.min_degree = min_degree

    def analyze(self, graph: Graph) -> dict[str, str]:
        out: dict[str, str] = {}
        for cid, card in graph.cards.items():
            if (
                card.note_type != PERMANENT
                and graph.degree(cid) >= self.min_degree
                and not graph.has_neighbor_of_type(cid, PERMANENT)
            ):
                out[cid] = "樞紐級素材密集,最適合做一次綜合"
        return out


def default_analyzers() -> list[Analyzer]:
    """預設的分析器組合。"""
    return [
        UndigestedLiteratureAnalyzer(),
        UnansweredQuestionAnalyzer(),
        SynthesisOpportunityAnalyzer(),
        OrphanAnalyzer(),
    ]
