import Link from "next/link";
import { listAll } from "@/lib/posts/repository";
import { toggleStatus, deletePost } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await listAll();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-text">文章管理</h1>
        <Link
          href="/admin/posts/new"
          className="min-h-[44px] rounded-xl bg-cool/90 px-5 font-medium leading-[44px] text-bg transition-colors hover:bg-cool"
        >
          + 新增文章
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-dim">
          還沒有文章。點「新增文章」開始寫。(若這裡是空的但你已建 posts 表,先確認已在 SQL Editor 跑{" "}
          <span className="font-mono text-warm">003_posts.sql</span>。)
        </p>
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => {
            const published = p.status === "published";
            return (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface p-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${
                        published
                          ? "bg-cool/15 text-cool"
                          : "bg-line text-dim"
                      }`}
                    >
                      {published ? "已上架" : "草稿"}
                    </span>
                    <span className="truncate font-medium text-text">
                      {p.title}
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-xs text-dim">
                    {p.date} · /blog/{p.slug}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* 上/下架 */}
                  <form
                    action={toggleStatus.bind(
                      null,
                      p.id,
                      published ? "draft" : "published"
                    )}
                  >
                    <button className="rounded-lg border border-line px-3 py-1.5 text-sm text-dim transition-colors hover:border-cool hover:text-cool">
                      {published ? "下架" : "上架"}
                    </button>
                  </form>
                  <Link
                    href={`/admin/posts/${p.id}`}
                    className="rounded-lg border border-line px-3 py-1.5 text-sm text-dim transition-colors hover:border-cool hover:text-cool"
                  >
                    編輯
                  </Link>
                  {published && (
                    <Link
                      href={`/blog/${p.slug}`}
                      target="_blank"
                      className="rounded-lg border border-line px-3 py-1.5 text-sm text-dim transition-colors hover:text-cool"
                    >
                      預覽
                    </Link>
                  )}
                  <form action={deletePost.bind(null, p.id)}>
                    <button className="rounded-lg border border-line px-3 py-1.5 text-sm text-dim transition-colors hover:border-warm hover:text-warm">
                      刪除
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
