import Link from "next/link";
import PostForm from "@/components/admin/PostForm";
import { createPost } from "../actions";

export default function NewPostPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div>
      <Link
        href="/admin/posts"
        className="font-mono text-xs text-dim transition-colors hover:text-cool"
      >
        ← 返回文章管理
      </Link>
      <h1 className="mb-8 mt-4 text-3xl font-bold text-text">新增文章</h1>
      <PostForm action={createPost} error={searchParams.error} />
    </div>
  );
}
