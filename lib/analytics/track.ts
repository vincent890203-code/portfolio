import type { AnalyticsEventType } from "./events";

// 前端埋點:把事件送到 /api/track。用 sendBeacon(離開頁面也送得出),
// 失敗一律吞掉——追蹤絕不能影響使用者體驗。
export function track(
  type: AnalyticsEventType,
  meta?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  try {
    const payload = JSON.stringify({
      type,
      path: window.location.pathname,
      meta: meta ?? {},
    });
    const beacon = navigator.sendBeacon?.bind(navigator);
    if (beacon) {
      beacon("/api/track", new Blob([payload], { type: "application/json" }));
    } else {
      void fetch("/api/track", {
        method: "POST",
        body: payload,
        keepalive: true,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch {
    /* 忽略 */
  }
}
