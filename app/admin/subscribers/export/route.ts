import { listSubscribers } from "@/lib/subscribers/repository";
import { createSupabaseServer } from "@/lib/supabase/server";

// 匯出訂閱名單 CSV(登入才可)。middleware 已守 /admin,這裡再驗一次。
export async function GET() {
  const supabase = createSupabaseServer();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!user) return new Response("Unauthorized", { status: 401 });

  const subs = await listSubscribers();
  const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
  const rows = [
    "email,source,status,created_at",
    ...subs.map((s) =>
      [s.email, s.source, s.status, s.created_at].map(esc).join(",")
    ),
  ].join("\n");

  return new Response(rows, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="subscribers.csv"',
    },
  });
}
