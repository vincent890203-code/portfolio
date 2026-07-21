// 訂閱者 Repository:公開端只寫(anon),後台讀名單(登入 session)。
import { anonClient } from "@/lib/supabase/client";
import { createSupabaseServer } from "@/lib/supabase/server";

export type Subscriber = {
  id: string;
  email: string;
  source: string;
  status: "active" | "unsubscribed";
  created_at: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}

// 公開:新增訂閱。重複 email 視為成功(不洩漏是否已訂閱)。
export async function subscribe(
  emailRaw: string,
  source = "site"
): Promise<{ ok: boolean }> {
  const email = emailRaw.toLowerCase().trim();
  if (!isValidEmail(email)) return { ok: false };
  const s = anonClient();
  if (!s) return { ok: true }; // 沒設 env → 靜默成功,不擋使用者
  const { error } = await s.from("subscribers").insert({ email, source });
  // 23505 = unique violation(已訂閱)→ 當成成功
  if (error && error.code !== "23505") return { ok: false };
  return { ok: true };
}

// 後台:讀名單。
export async function listSubscribers(): Promise<Subscriber[]> {
  const s = createSupabaseServer();
  if (!s) return [];
  const { data } = await s
    .from("subscribers")
    .select("id,email,source,status,created_at")
    .order("created_at", { ascending: false });
  return (data ?? []) as Subscriber[];
}
