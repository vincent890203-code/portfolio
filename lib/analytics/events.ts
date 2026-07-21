// 自訂事件的型別定義(模組化:新增事件只改這裡)。
export type AnalyticsEventType =
  | "page_view"
  | "post_read"
  | "project_view"
  | "graph_node_click"
  | "link_click";

export type AnalyticsEvent = {
  type: AnalyticsEventType;
  path: string;
  meta?: Record<string, unknown>;
};
