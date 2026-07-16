"""儲存抽象(Repository pattern)。

現在是 JSON;之後換 Supabase / pgvector 只要新增一個實作,
pipeline 依賴的是 GraphRepository 介面,不動。(依賴反轉)
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Protocol

from .models import Card, Edge, Graph


class GraphRepository(Protocol):
    """圖的載入/儲存介面。"""

    def load(self) -> Graph: ...

    def annotate(self, annotations: dict[str, dict]) -> None:
        """把每張卡片的分析結果(gaps / focusScore)寫回儲存。"""
        ...


class JsonGraphRepository:
    """讀寫前端用的 software-architecture.json。"""

    def __init__(self, path: str | Path):
        self.path = Path(path)
        self._raw: dict | None = None

    def _read(self) -> dict:
        if self._raw is None:
            self._raw = json.loads(self.path.read_text(encoding="utf-8"))
        return self._raw

    def load(self) -> Graph:
        raw = self._read()
        cards = {
            n["id"]: Card(
                id=n["id"],
                title=n.get("title", ""),
                note_type=n.get("noteType", "literature"),
                category=n.get("category", ""),
                section=n.get("section", ""),
                summary=n.get("summary", ""),
                degree=int(n.get("degree", 0)),
            )
            for n in raw["nodes"]
        }
        edges = [
            Edge(source=l["source"], target=l["target"], two_way=bool(l.get("twoWay")))
            for l in raw["links"]
        ]
        return Graph(cards=cards, edges=edges)

    def annotate(self, annotations: dict[str, dict]) -> None:
        raw = self._read()
        for node in raw["nodes"]:
            ann = annotations.get(node["id"])
            if ann is not None:
                node["gaps"] = ann["gaps"]
                node["focusScore"] = ann["focusScore"]
            else:
                node["gaps"] = []
                node["focusScore"] = 0
        self.path.write_text(
            json.dumps(raw, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
