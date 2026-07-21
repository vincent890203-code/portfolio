import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import SignOutButton from "@/components/admin/SignOutButton.client";

export const metadata = { title: "後台 · 郭原辰", robots: { index: false } };

// 後台外殼。middleware 已守門,這裡再驗一次(defense in depth)。
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServer();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!user) redirect("/login?next=/admin");

  const nav = [
    { href: "/admin", label: "總覽" },
    { href: "/admin/analytics", label: "觀測數據" },
  ];

  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="sticky top-0 z-50 border-b border-line/60 bg-bg/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <span className="font-mono text-sm tracking-widest text-cool">
              /admin
            </span>
            <nav className="flex gap-1">
              {nav.map((i) => (
                <Link
                  key={i.href}
                  href={i.href}
                  className="rounded-full px-3 py-1 text-sm text-dim transition-colors hover:text-cool"
                >
                  {i.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden font-mono text-xs text-dim sm:inline">
              {user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
