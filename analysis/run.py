"""CLI:分析知識圖譜的缺口,把 focusScore 寫回 JSON,並印出「該先消化」清單。

用法:
    python -m analysis.run                 # 就地標註 content/graph/software-architecture.json
    python -m analysis.run --dry-run       # 只印報告,不寫檔
"""
from __future__ import annotations

import argparse
from pathlib import Path

from analysis.knowledge_graph.analyzers import default_analyzers
from analysis.knowledge_graph.pipeline import GapAnalysisPipeline
from analysis.knowledge_graph.repository import JsonGraphRepository

DEFAULT_GRAPH = (
    Path(__file__).resolve().parents[1]
    / "content"
    / "graph"
    / "software-architecture.json"
)


def main() -> None:
    parser = argparse.ArgumentParser(description="知識圖譜缺口分析")
    parser.add_argument("--graph", default=str(DEFAULT_GRAPH), help="graph JSON 路徑")
    parser.add_argument("--dry-run", action="store_true", help="只印報告不寫檔")
    parser.add_argument("--top", type=int, default=15, help="印出前 N 個焦點")
    args = parser.parse_args()

    repo = JsonGraphRepository(args.graph)
    graph = repo.load()
    pipeline = GapAnalysisPipeline(default_analyzers())

    results = pipeline.run(graph)
    flagged = sum(1 for cg in results.values() if cg.focus_score > 0)
    print(f"共 {len(graph.cards)} 張卡片,{flagged} 張有待消化的缺口。\n")

    print(f"── 該先消化的 Top {args.top}(focusScore 由高到低)──")
    for cid, cg in pipeline.top_focus(graph, args.top):
        card = graph.cards[cid]
        reasons = "、".join(g["reason"] for g in cg.gaps)
        print(f"[{cg.focus_score:>4.1f}] {card.title}  — {reasons}")

    if not args.dry_run:
        annotations = {cid: cg.as_annotation() for cid, cg in results.items()}
        repo.annotate(annotations)
        print(f"\n已把 gaps / focusScore 寫回 {args.graph}")
    else:
        print("\n(dry-run,未寫檔)")


if __name__ == "__main__":
    main()
