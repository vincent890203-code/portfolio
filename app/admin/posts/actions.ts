"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import * as repo from "@/lib/posts/repository";
import type { PostInput, PostStatus } from "@/lib/posts/types";

// 每個 action 都先驗身分(middleware + RLS 之外再一層)。
async function requireUser() {
  const s = createSupabaseServer();
  const user = s ? (await s.auth.getUser()).data.user : null;
  if (!user) redirect("/login?next=/admin/posts");
}

function parse(fd: FormData): PostInput {
  const status: PostStatus =
    String(fd.get("status")) === "published" ? "published" : "draft";
  return {
    slug: String(fd.get("slug") ?? "").trim(),
    title: String(fd.get("title") ?? "").trim(),
    date: String(fd.get("date") ?? "") || new Date().toISOString().slice(0, 10),
    summary: String(fd.get("summary") ?? ""),
    tags: String(fd.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    body: String(fd.get("body") ?? ""),
    status,
  };
}

function revalidate() {
  revalidatePath("/admin/posts");
  revalidatePath("/blog");
}

export async function createPost(fd: FormData) {
  await requireUser();
  const { error } = await repo.create(parse(fd));
  if (error) redirect(`/admin/posts/new?error=${encodeURIComponent(error)}`);
  revalidate();
  redirect("/admin/posts");
}

export async function updatePost(id: string, fd: FormData) {
  await requireUser();
  const { error } = await repo.update(id, parse(fd));
  if (error) redirect(`/admin/posts/${id}?error=${encodeURIComponent(error)}`);
  revalidate();
  redirect("/admin/posts");
}

export async function toggleStatus(id: string, next: PostStatus) {
  await requireUser();
  await repo.setStatus(id, next);
  revalidate();
}

export async function deletePost(id: string) {
  await requireUser();
  await repo.remove(id);
  revalidate();
}
