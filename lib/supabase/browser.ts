import { createBrowserClient } from "@supabase/ssr";

// 瀏覽器端 Supabase client(登入表單用)。
export function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
