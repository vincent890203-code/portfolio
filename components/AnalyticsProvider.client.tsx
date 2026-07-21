"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import { track } from "@/lib/analytics/track";

// 兩條觀測一起打通:
// 1. Vercel Web Analytics(準確流量,零維護)
// 2. 自訂事件 → Supabase(page_view;其他事件由各元件呼叫 track())
export default function AnalyticsProvider() {
  const pathname = usePathname();

  useEffect(() => {
    track("page_view");
  }, [pathname]);

  return <Analytics />;
}
