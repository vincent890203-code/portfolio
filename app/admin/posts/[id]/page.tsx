import Link from "next/link";
import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { getById } from "@/lib/posts/repository";
import { updatePost } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string };
}) {
  const post = await getById(params.id);
  if (!post) notFound();

  return (
    <div>
      <Link
        href="/admin/posts"
        className="font-mono text-xs text-dim transition-colors hover:text-cool"
      >
        ← 返回文章管理
      </Link>
      <h1 className="mb-8 mt-4 text-3xl font-bold text-text">編輯文章</h1>
      <PostForm
        post={post}
        action={updatePost.bind(null, post.id)}
        error={searchParams.error}
      />
    </div>
  );
}
