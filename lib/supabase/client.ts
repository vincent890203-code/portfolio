import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// 共用的 Supabase client 工廠(模組化:資料層、分析、之後 admin 都用它)。
// 沒設定 env 時回傳 null,呼叫端自行 fallback,確保站台永遠能 build/run。
export function anonClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
