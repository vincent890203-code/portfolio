import Link from "next/link";
import { PROFILE } from "@/content/profile";

// 全站頂部導覽。sticky,深色半透明底,呼應設計系統。
export default function Nav() {
  const items = [
    { href: "/", label: "首頁" },
    { href: "/projects", label: "作品" },
    { href: "/learning", label: "學習" },
    { href: "/blog", label: "Blog" },
    { href: "/brain", label: "第二大腦" },
  ];
  return (
    <nav className="sticky top-0 z-50 border-b border-line/60 bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="font-mono text-sm tracking-widest text-text transition-colors hover:text-cool"
        >
          {PROFILE.nameEn}
        </Link>
        <div className="flex gap-1">
          {items.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className="flex min-h-[44px] items-center rounded-full px-4 text-sm text-dim transition-colors hover:text-cool"
            >
              {i.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
