"""分析器與 pipeline 的單元測試。用小手工圖,驗證每個缺口偵測邏輯。"""
from __future__ import annotations

from analysis.knowledge_graph.models import Card, Edge, Graph
from analysis.knowledge_graph.analyzers import (
    UndigestedLiteratureAnalyzer,
    UnansweredQuestionAnalyzer,
    OrphanAnalyzer,
    SynthesisOpportunityAnalyzer,
    default_analyzers,
)
from analysis.knowledge_graph.pipeline import GapAnalysisPipeline


def card(cid, note_type, title="t"):
    return Card(id=cid, title=title, note_type=note_type)


def graph_from(cards, edges):
    return Graph(cards={c.id: c for c in cards}, edges=edges)


# ── Graph 基礎 ──────────────────────────────────────────
def test_neighbors_are_undirected():
    g = graph_from(
        [card("a", "literature"), card("b", "permanent")],
        [Edge("a", "b")],
    )
    assert g.neighbors("a") == {"b"}
    assert g.neighbors("b") == {"a"}
    assert g.degree("a") == 1


def test_edge_to_missing_node_is_ignored():
    g = graph_from([card("a", "literature")], [Edge("a", "ghost")])
    assert g.neighbors("a") == set()
    assert g.degree("a") == 0


# ── UndigestedLiteratureAnalyzer ───────────────────────
def test_literature_without_permanent_neighbor_is_flagged():
    g = graph_from(
        [card("lit", "literature"), card("other", "literature")],
        [Edge("lit", "other")],
    )
    flagged = UndigestedLiteratureAnalyzer().analyze(g)
    assert "lit" in flagged


def test_literature_with_permanent_neighbor_is_clean():
    g = graph_from(
        [card("lit", "literature"), card("perm", "permanent")],
        [Edge("lit", "perm")],
    )
    flagged = UndigestedLiteratureAnalyzer().analyze(g)
    assert "lit" not in flagged


def test_concept_collision_is_a_target_by_default():
    g = graph_from([card("c", "concept-collision")], [])
    assert "c" in UndigestedLiteratureAnalyzer().analyze(g)


def test_target_types_are_pluggable():
    g = graph_from([card("m", "method")], [])
    # 預設不含 method
    assert "m" not in UndigestedLiteratureAnalyzer().analyze(g)
    # 換一組 target 就會被抓
    assert "m" in UndigestedLiteratureAnalyzer(target_types=("method",)).analyze(g)


# ── UnansweredQuestionAnalyzer ─────────────────────────
def test_question_without_permanent_is_flagged():
    g = graph_from([card("q", "question")], [])
    assert "q" in UnansweredQuestionAnalyzer().analyze(g)


def test_question_answered_by_permanent_is_clean():
    g = graph_from(
        [card("q", "question"), card("p", "permanent")], [Edge("q", "p")]
    )
    assert "q" not in UnansweredQuestionAnalyzer().analyze(g)


# ── OrphanAnalyzer ─────────────────────────────────────
def test_orphan_detection_respects_threshold():
    g = graph_from(
        [card("a", "literature"), card("b", "literature"), card("c", "literature")],
        [Edge("a", "b")],
    )
    flagged = OrphanAnalyzer(max_degree=1).analyze(g)
    assert "c" in flagged  # degree 0
    assert "a" in flagged  # degree 1 <= threshold
    assert flagged  # non-empty


# ── SynthesisOpportunityAnalyzer ───────────────────────
def test_hub_without_permanent_is_synthesis_opportunity():
    leaves = [card(f"n{i}", "literature") for i in range(6)]
    hub = card("hub", "literature")
    edges = [Edge("hub", f"n{i}") for i in range(6)]
    g = graph_from([hub, *leaves], edges)
    assert "hub" in SynthesisOpportunityAnalyzer(min_degree=6).analyze(g)


def test_hub_next_to_permanent_is_not_flagged():
    leaves = [card(f"n{i}", "literature") for i in range(5)]
    hub = card("hub", "literature")
    perm = card("p", "permanent")
    edges = [Edge("hub", f"n{i}") for i in range(5)] + [Edge("hub", "p")]
    g = graph_from([hub, perm, *leaves], edges)
    assert "hub" not in SynthesisOpportunityAnalyzer(min_degree=6).analyze(g)


# ── Pipeline ───────────────────────────────────────────
def test_pipeline_sums_weights_into_focus_score():
    # 一張孤立、未消化的文獻卡 → undigested(3.0)+ isolated(1.5)= 4.5
    g = graph_from([card("lit", "literature")], [])
    pipeline = GapAnalysisPipeline(default_analyzers())
    results = pipeline.run(g)
    assert results["lit"].focus_score == 4.5
    keys = {gap["key"] for gap in results["lit"].gaps}
    assert keys == {"undigested", "isolated"}


def test_top_focus_orders_by_score_desc_and_drops_zero():
    g = graph_from(
        [card("lit", "literature"), card("perm", "permanent")],
        [Edge("lit", "perm")],  # lit 已消化;perm 不是缺口
    )
    pipeline = GapAnalysisPipeline(default_analyzers())
    top = pipeline.top_focus(g, n=10)
    ids = [cid for cid, _ in top]
    assert "perm" not in ids  # focus 0 被濾掉
