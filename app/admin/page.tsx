import Link from "next/link";

export default function AdminHome() {
  const cards = [
    {
      href: "/admin/analytics",
      title: "觀測數據",
      desc: "自建的訪客/事件儀表板(page_view、文章閱讀、圖譜互動…)。搭配 Vercel Analytics 的準確流量。",
    },
  ];
  return (
    <div>
      <h1 className="text-3xl font-bold text-text">後台總覽</h1>
      <p className="mt-2 max-w-xl leading-relaxed text-dim">
        只有你看得到這裡。之後會擴充:知識圖譜的缺口/focus 儀表板、內容 draft→審核→發布佇列、觸發重跑分析。
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-2xl border border-line bg-surface p-6 transition-all hover:-translate-y-1 hover:border-cool/50"
          >
            <h2 className="text-xl font-medium text-text">{c.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-dim">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
