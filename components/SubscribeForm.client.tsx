"use client";

import { useState } from "react";
import { track } from "@/lib/analytics/track";

// 電子報訂閱表單(模組化,可放在任何頁面)。
export default function SubscribeForm({ source = "site" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      if (res.ok) {
        setState("done");
        track("link_click", { kind: "subscribe", source });
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <h3 className="text-lg font-medium text-text">訂閱電子報</h3>
      <p className="mt-1 text-sm leading-relaxed text-dim">
        新文章與思考筆記,直接寄到你信箱。不寄垃圾,隨時可退訂。
      </p>
      {state === "done" ? (
        <p className="mt-4 rounded-xl border border-cool/40 bg-bg/40 p-3 text-sm text-cool">
          訂閱成功,謝謝你 🙌
        </p>
      ) : (
        <form onSubmit={submit} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="min-h-[44px] flex-1 rounded-xl border border-line bg-bg/40 px-4 text-text outline-none focus:border-cool"
          />
          <button
            type="submit"
            disabled={state === "loading"}
            className="min-h-[44px] rounded-xl bg-cool/90 px-5 font-medium text-bg transition-colors hover:bg-cool disabled:opacity-50"
          >
            {state === "loading" ? "訂閱中…" : "訂閱"}
          </button>
        </form>
      )}
      {state === "error" && (
        <p className="mt-2 text-sm text-warm">訂閱失敗,請稍後再試。</p>
      )}
    </div>
  );
}
