"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

// 登入頁:magic link(email OTP)。只有你一人(Supabase 已關註冊)。
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const supabase = createSupabaseBrowser();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`,
        },
      });
      if (error) setErr(error.message);
      else setSent(true);
    } catch {
      setErr("登入服務尚未設定(缺 Supabase env)。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="text-2xl font-bold text-text">後台登入</h1>
      <p className="mt-2 text-sm text-dim">
        輸入你的 Email,收一封 magic link 就能登入(不用密碼)。
      </p>

      {sent ? (
        <div className="mt-8 rounded-2xl border border-cool/40 bg-surface p-6 text-sm leading-relaxed text-dim">
          已寄出登入連結到 <span className="text-cool">{email}</span>,去信箱點開即可。
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-text outline-none focus:border-cool"
          />
          {err && <p className="text-sm text-warm">{err}</p>}
          <button
            type="submit"
            disabled={loading}
            className="min-h-[44px] w-full rounded-xl bg-cool/90 px-4 font-medium text-bg transition-colors hover:bg-cool disabled:opacity-50"
          >
            {loading ? "寄送中…" : "寄送登入連結"}
          </button>
        </form>
      )}
    </main>
  );
}
