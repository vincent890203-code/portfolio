"""把知識圖譜 JSON 灌進 Supabase(cards / edges,status=published)。

用 service_role key(繞過 RLS 批次寫入)。key 從 .env.local 讀,絕不寫進程式碼。
冪等:先清空 cards(cascade 清 edges),再重新插入。

用法(從專案根目錄):
    analysis/.venv/bin/python -m analysis.load_to_supabase
"""
from __future__ import annotations

import json
import os
import sys
import urllib.request
import urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GRAPH = ROOT / "content" / "graph" / "software-architecture.json"
ENV = ROOT / ".env.local"


def load_env() -> dict[str, str]:
    env: dict[str, str] = {}
    if ENV.exists():
        for line in ENV.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip()
    # 環境變數可覆寫檔案
    for k in ("SUPABASE_URL", "SUPABASE_SERVICE_KEY"):
        if os.environ.get(k):
            env[k] = os.environ[k]
    return env


def req(method: str, url: str, key: str, body=None, prefer: str | None = None):
    data = json.dumps(body).encode("utf-8") if body is not None else None
    r = urllib.request.Request(url, data=data, method=method)
    r.add_header("apikey", key)
    r.add_header("Authorization", f"Bearer {key}")
    r.add_header("Content-Type", "application/json")
    if prefer:
        r.add_header("Prefer", prefer)
    try:
        with urllib.request.urlopen(r) as resp:
            return resp.status, resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")


def chunked(items, n):
    for i in range(0, len(items), n):
        yield items[i : i + n]


def main() -> None:
    env = load_env()
    url = env.get("SUPABASE_URL")
    key = env.get("SUPABASE_SERVICE_KEY")
    if not url or not key:
        sys.exit(
            "缺 SUPABASE_URL 或 SUPABASE_SERVICE_KEY。請把 service_role key 貼進 .env.local 的 SUPABASE_SERVICE_KEY= 那行。"
        )
    rest = f"{url}/rest/v1"

    d = json.loads(GRAPH.read_text(encoding="utf-8"))
    cards = [
        {
            "id": n["id"],
            "title": n.get("title", ""),
            "summary": n.get("summary", ""),
            "note_type": n.get("noteType", "literature"),
            "category": n.get("category", ""),
            "section": n.get("section", ""),
            "degree": n.get("degree", 0),
            "gaps": n.get("gaps", []),
            "focus_score": n.get("focusScore", 0),
            "status": "published",
            "whiteboard": "software-architecture",
        }
        for n in d["nodes"]
    ]
    edges = [
        {
            "src": l["source"],
            "dst": l["target"],
            "rel": l.get("type", "connection"),
            "two_way": bool(l.get("twoWay")),
            "label": l.get("label"),
        }
        for l in d["links"]
    ]

    # 1. 清空(cascade 清 edges / embeddings)
    status, resp = req("DELETE", f"{rest}/cards?id=not.is.null", key, prefer="return=minimal")
    print(f"delete cards → {status}")
    if status >= 300:
        sys.exit(f"清空失敗:{resp}")

    # 2. 插入 cards(分批 upsert)
    for batch in chunked(cards, 100):
        status, resp = req(
            "POST", f"{rest}/cards", key, body=batch, prefer="resolution=merge-duplicates,return=minimal"
        )
        if status >= 300:
            sys.exit(f"插入 cards 失敗:{status} {resp}")
    print(f"inserted {len(cards)} cards")

    # 3. 插入 edges
    for batch in chunked(edges, 100):
        status, resp = req("POST", f"{rest}/edges", key, body=batch, prefer="return=minimal")
        if status >= 300:
            sys.exit(f"插入 edges 失敗:{status} {resp}")
    print(f"inserted {len(edges)} edges")

    print("\n✓ 完成。cards/edges 已灌入 Supabase(status=published)。")


if __name__ == "__main__":
    main()
