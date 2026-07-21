// 文章的 Repository:公開讀用 anon,後台讀寫用登入 session(RLS 守著)。
import { anonClient } from "@/lib/supabase/client";
import { createSupabaseServer } from "@/lib/supabase/server";
import type { Post, PostInput, PostStatus } from "./types";

const COLS = "id,slug,title,date,summary,tags,body,status";

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapRow(r: any): Post {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    date: String(r.date).slice(0, 10),
    summary: r.summary ?? "",
    tags: r.tags ?? [],
    body: r.body ?? "",
    status: r.status,
  };
}

// ── 公開(anon,只拿得到 published)──────────────────────
export async function listPublished(): Promise<Post[]> {
  const s = anonClient();
  if (!s) return [];
  const { data } = await s
    .from("posts")
    .select(COLS)
    .eq("status", "published")
    .order("date", { ascending: false });
  return (data ?? []).map(mapRow);
}

export async function getPublishedBySlug(slug: string): Promise<Post | null> {
  const s = anonClient();
  if (!s) return null;
  const { data } = await s
    .from("posts")
    .select(COLS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data ? mapRow(data) : null;
}

// ── 後台(登入 session,可讀草稿 + 寫入)────────────────
export async function listAll(): Promise<Post[]> {
  const s = createSupabaseServer();
  if (!s) return [];
  const { data } = await s
    .from("posts")
    .select(COLS)
    .order("date", { ascending: false });
  return (data ?? []).map(mapRow);
}

export async function getById(id: string): Promise<Post | null> {
  const s = createSupabaseServer();
  if (!s) return null;
  const { data } = await s.from("posts").select(COLS).eq("id", id).maybeSingle();
  return data ? mapRow(data) : null;
}

export async function create(input: PostInput): Promise<{ error?: string }> {
  const s = createSupabaseServer();
  if (!s) return { error: "no supabase" };
  const { error } = await s.from("posts").insert(input);
  return error ? { error: error.message } : {};
}

export async function update(
  id: string,
  input: PostInput
): Promise<{ error?: string }> {
  const s = createSupabaseServer();
  if (!s) return { error: "no supabase" };
  const { error } = await s
    .from("posts")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);
  return error ? { error: error.message } : {};
}

export async function setStatus(id: string, status: PostStatus): Promise<void> {
  const s = createSupabaseServer();
  if (!s) return;
  await s.from("posts").update({ status }).eq("id", id);
}

export async function remove(id: string): Promise<void> {
  const s = createSupabaseServer();
  if (!s) return;
  await s.from("posts").delete().eq("id", id);
}
