"""領域模型:卡片、邊、圖。純資料 + 查詢,無 IO,方便單元測試。"""
from __future__ import annotations

from dataclasses import dataclass, field
from functools import cached_property


# 卡片盒筆記類型(與前端 noteStyles 對齊)
PERMANENT = "permanent"
LITERATURE = "literature"
QUESTION = "question"
CONCEPT_COLLISION = "concept-collision"
METHOD = "method"
PROJECT = "project"
RAW = "raw"


@dataclass(frozen=True)
class Card:
    """一張卡片(圖的節點)。"""

    id: str
    title: str
    note_type: str
    category: str = ""
    section: str = ""
    summary: str = ""
    degree: int = 0


@dataclass(frozen=True)
class Edge:
    """一條連線。two_way 表示雙向。"""

    source: str
    target: str
    two_way: bool = False


@dataclass
class Graph:
    """卡片 + 連線的集合,提供鄰接查詢。"""

    cards: dict[str, Card]
    edges: list[Edge] = field(default_factory=list)

    @cached_property
    def _adjacency(self) -> dict[str, set[str]]:
        adj: dict[str, set[str]] = {cid: set() for cid in self.cards}
        for e in self.edges:
            if e.source in adj and e.target in adj:
                adj[e.source].add(e.target)
                adj[e.target].add(e.source)
        return adj

    def neighbors(self, card_id: str) -> set[str]:
        """回傳 1-hop 相鄰卡片 id(無向)。"""
        return self._adjacency.get(card_id, set())

    def neighbor_cards(self, card_id: str):
        """回傳 1-hop 相鄰卡片物件。"""
        return [self.cards[n] for n in self.neighbors(card_id) if n in self.cards]

    def has_neighbor_of_type(self, card_id: str, note_type: str) -> bool:
        return any(c.note_type == note_type for c in self.neighbor_cards(card_id))

    def degree(self, card_id: str) -> int:
        """實際計算的度數(以邊為準,不信任卡片上的 degree 欄位)。"""
        return len(self.neighbors(card_id))
