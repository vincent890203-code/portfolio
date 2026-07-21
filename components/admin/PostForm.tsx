import type { Post } from "@/lib/posts/types";

// 文章編輯表單(新增/編輯共用)。用原生 form action = server action,不需 client JS。
export default function PostForm({
  post,
  action,
  error,
}: {
  post?: Post;
  action: (fd: FormData) => void | Promise<void>;
  error?: string;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const label = "mb-1 block font-mono text-xs text-dim";
  const input =
    "w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-text outline-none focus:border-cool";

  return (
    <form action={action} className="space-y-5">
      {error && (
        <p className="rounded-lg border border-warm/40 bg-surface p-3 text-sm text-warm">
          {error}
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label}>標題</label>
          <input name="title" required defaultValue={post?.title} className={input} />
        </div>
        <div>
          <label className={label}>slug(網址,英數-,不可重複)</label>
          <input
            name="slug"
            required
            pattern="[a-z0-9\-]+"
            defaultValue={post?.slug}
            placeholder="my-first-post"
            className={`${input} font-mono`}
          />
        </div>
        <div>
          <label className={label}>日期</label>
          <input
            name="date"
            type="date"
            defaultValue={post?.date ?? today}
            className={input}
          />
        </div>
        <div>
          <label className={label}>標籤(逗號分隔)</label>
          <input
            name="tags"
            defaultValue={post?.tags?.join(", ")}
            placeholder="轉職, 架構"
            className={input}
          />
        </div>
      </div>

      <div>
        <label className={label}>摘要</label>
        <input name="summary" defaultValue={post?.summary} className={input} />
      </div>

      <div>
        <label className={label}>正文(Markdown)</label>
        <textarea
          name="body"
          rows={18}
          defaultValue={post?.body}
          placeholder="## 標題&#10;&#10;內容用 Markdown 寫。可在 Heptabase/編輯器寫好再貼進來。"
          className={`${input} resize-y font-mono text-sm leading-relaxed`}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <label className={label}>狀態</label>
          <select
            name="status"
            defaultValue={post?.status ?? "draft"}
            className={`${input} w-auto`}
          >
            <option value="draft">草稿(下架)</option>
            <option value="published">發布(上架)</option>
          </select>
        </div>
        <button
          type="submit"
          className="min-h-[44px] rounded-xl bg-cool/90 px-6 font-medium text-bg transition-colors hover:bg-cool"
        >
          儲存
        </button>
      </div>
    </form>
  );
}
