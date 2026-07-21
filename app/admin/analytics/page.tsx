import { createSupabaseServer } from "@/lib/supabase/server";
import { summarize, type RawEvent } from "@/lib/analytics/aggregate";

export const dynamic = "force-dynamic"; // 每次進來都拿最新數據

export default async function AnalyticsPage() {
  const supabase = createSupabaseServer();
  let events: RawEvent[] = [];
  let error: string | null = null;

  if (supabase) {
    const { data, error: e } = await supabase
      .from("events")
      .select("type,path,created_at")
      .order("created_at", { ascending: false })
      .limit(5000);
    if (e) error = e.message;
    else events = (data ?? []) as RawEvent[];
  } else {
    error = "缺 Supabase env";
  }

  const s = summarize(events, new Date());
  const maxDay = Math.max(1, ...s.byDay.map((d) => d.count));

  return (
    <div>
      <h1 className="text-3xl font-bold text-text">觀測數據</h1>
      <p className="mt-2 text-sm text-dim">
        自建事件儀表板(近 5000 筆)。準確總流量另見 Vercel Analytics。
      </p>

      {error && (
        <div className="mt-6 rounded-xl border border-warm/40 bg-surface p-4 text-sm text-dim">
          讀取事件失敗:{error}。若是第一次,請先在 Supabase SQL Editor 跑{" "}
          <span className="font-mono text-warm">supabase/migrations/002_events.sql</span>。
        </div>
      )}

      {/* 數字磚 */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Stat label="總瀏覽" value={s.totalViews} />
        <Stat label="近 7 天瀏覽" value={s.last7Views} />
        <Stat label="總事件" value={s.totalEvents} />
      </div>

      {/* 近 14 天長條 */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-medium text-text">近 14 天瀏覽</h2>
        <div className="flex h-40 items-end gap-1.5">
          {s.byDay.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-cool/70"
                style={{ height: `${(d.count / maxDay) * 100}%`, minHeight: d.count ? 2 : 0 }}
                title={`${d.day}: ${d.count}`}
              />
              <span className="font-mono text-[9px] text-dim">{d.day.slice(5)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 熱門頁面 + 事件類型 */}
      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <RankTable title="熱門頁面" rows={s.topPaths.map((p) => ({ label: p.path, count: p.count }))} />
        <RankTable title="事件類型" rows={s.byType.map((t) => ({ label: t.type, count: t.count }))} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="font-mono text-3xl font-bold text-cool">{value}</div>
      <div className="mt-1 text-xs text-dim">{label}</div>
    </div>
  );
}

function RankTable({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; count: number }[];
}) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-medium text-text">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-dim">尚無資料。</p>
      ) : (
        <ul className="space-y-1.5">
          {rows.map((r) => (
            <li
              key={r.label}
              className="flex items-center justify-between gap-4 rounded-lg border border-line bg-surface px-3 py-2 text-sm"
            >
              <span className="truncate font-mono text-dim">{r.label}</span>
              <span className="shrink-0 text-cool">{r.count}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
