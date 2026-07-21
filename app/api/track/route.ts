import { NextResponse } from "next/server";
import { anonClient } from "@/lib/supabase/client";
import type { AnalyticsEventType } from "@/lib/analytics/events";

const VALID: AnalyticsEventType[] = [
  "page_view",
  "post_read",
  "project_view",
  "graph_node_click",
  "link_click",
];

// 收自訂事件,寫進 Supabase events 表(anon INSERT-only,靠 RLS)。
// 追蹤失敗一律回 200,不讓它影響前端。
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !VALID.includes(body.type)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const supabase = anonClient();
    if (!supabase) return NextResponse.json({ ok: true }); // 沒設 env → 靜默略過

    await supabase.from("events").insert({
      type: body.type as string,
      path: String(body.path ?? "").slice(0, 300),
      meta: body.meta ?? {},
      referrer: (req.headers.get("referer") ?? "").slice(0, 300),
      ua: (req.headers.get("user-agent") ?? "").slice(0, 300),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
