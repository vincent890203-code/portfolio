// 事件聚合(純函式,方便單元測試)。頁面把 raw events + 現在時間丟進來。
export type RawEvent = {
  type: string;
  path: string | null;
  created_at: string;
};

export type Summary = {
  totalViews: number;
  last7Views: number;
  totalEvents: number;
  byDay: { day: string; count: number }[]; // 近 14 天 page_view
  topPaths: { path: string; count: number }[];
  byType: { type: string; count: number }[];
};

function dayKey(iso: string): string {
  return iso.slice(0, 10); // YYYY-MM-DD
}

export function summarize(events: RawEvent[], now: Date): Summary {
  const views = events.filter((e) => e.type === "page_view");
  const nowMs = now.getTime();
  const day = 86_400_000;

  const last7Views = views.filter(
    (e) => nowMs - new Date(e.created_at).getTime() <= 7 * day
  ).length;

  // 近 14 天,每天 page_view 數(補零)
  const counts = new Map<string, number>();
  for (const e of views) counts.set(dayKey(e.created_at), (counts.get(dayKey(e.created_at)) ?? 0) + 1);
  const byDay: { day: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(nowMs - i * day).toISOString().slice(0, 10);
    byDay.push({ day: d, count: counts.get(d) ?? 0 });
  }

  const topPaths = tally(views.map((e) => e.path || "/"))
    .slice(0, 8)
    .map(({ key, count }) => ({ path: key, count }));
  const byType = tally(events.map((e) => e.type)).map(({ key, count }) => ({
    type: key,
    count,
  }));

  return {
    totalViews: views.length,
    last7Views,
    totalEvents: events.length,
    byDay,
    topPaths,
    byType,
  };
}

function tally(keys: string[]): { key: string; count: number }[] {
  const m = new Map<string, number>();
  for (const k of keys) m.set(k, (m.get(k) ?? 0) + 1);
  return Array.from(m.entries())
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}
