import Link from "next/link";
import { listSubscribers } from "@/lib/subscribers/repository";

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  const subs = await listSubscribers();
  const active = subs.filter((s) => s.status === "active").length;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-text">電子報訂閱者</h1>
        {subs.length > 0 && (
          <Link
            href="/admin/subscribers/export"
            className="min-h-[44px] rounded-xl border border-line px-5 leading-[44px] text-sm text-dim transition-colors hover:border-cool hover:text-cool"
          >
            匯出 CSV
          </Link>
        )}
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Stat label="有效訂閱" value={active} />
        <Stat label="總計" value={subs.length} />
      </div>

      {subs.length === 0 ? (
        <p className="text-dim">
          還沒有訂閱者。/blog 底部有訂閱表單。(若空的但已建表,確認已跑{" "}
          <span className="font-mono text-warm">004_subscribers.sql</span>。)
        </p>
      ) : (
        <ul className="divide-y divide-line rounded-xl border border-line">
          {subs.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
            >
              <span className="truncate font-mono text-text">{s.email}</span>
              <span className="shrink-0 font-mono text-xs text-dim">
                {s.source} · {s.created_at.slice(0, 10)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-8 text-xs leading-relaxed text-dim">
        寄送電子報建議接 Resend/Buttondown(送達率、退訂、法遵);可用上面的 CSV 匯入,或之後在此接 API。
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="font-mono text-3xl font-bold text-cool">{value}</div>
      <div className="mt-1 text-xs text-dim">{label}</div>
    </div>
  );
}
