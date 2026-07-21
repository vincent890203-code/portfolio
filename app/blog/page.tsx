import type { Metadata } from "next";
import Nav from "@/components/Nav";
import PostCard from "@/components/PostCard";
import { getBlogPosts } from "@/lib/posts/source";

export const metadata: Metadata = {
  title: "Blog · 郭原辰",
  description: "從分子醫學到 AI 工程的思考筆記:架構、學習方法、第二大腦的建造過程。",
};

// 後台可即時上下架 → 動態渲染,永遠反映最新狀態。
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-4 flex items-center gap-4">
          <h1 className="text-3xl font-bold text-text">Blog</h1>
          <span className="font-mono text-xs text-dim">/blog</span>
        </div>
        <p className="mb-12 max-w-xl leading-relaxed text-dim">
          把學到的東西寫下來、講清楚——這裡是我的思考輸出。內容以本站為本體(POSSE),其他平台只發摘要。
        </p>
        {posts.length === 0 ? (
          <p className="text-dim">還沒有文章,很快就有。</p>
        ) : (
          <div className="grid gap-5">
            {posts.map((p) => (
              <PostCard key={p.slug} meta={{ ...p, published: true }} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
