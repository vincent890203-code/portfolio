// 公開部落格的資料來源:合併 DB(已發布)+ repo 內的 MDX 檔(fallback),
// 依 slug 去重(DB 優先)。這樣舊的 MDX 文章不會消失,新的後台文章也會出現。
import { getAllPosts as getMdxPosts, getPost as getMdxPost } from "@/content/loader";
import { listPublished, getPublishedBySlug } from "./repository";

export type BlogListItem = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
};

export type BlogPost = BlogListItem & { content: string };

export async function getBlogPosts(): Promise<BlogListItem[]> {
  const db = await listPublished();
  const mdx = getMdxPosts();
  const bySlug = new Map<string, BlogListItem>();

  for (const m of mdx) {
    bySlug.set(m.meta.slug, {
      slug: m.meta.slug,
      title: m.meta.title,
      date: m.meta.date,
      summary: m.meta.summary,
      tags: m.meta.tags ?? [],
    });
  }
  for (const p of db) {
    bySlug.set(p.slug, {
      slug: p.slug,
      title: p.title,
      date: p.date,
      summary: p.summary,
      tags: p.tags,
    });
  }
  return Array.from(bySlug.values()).sort((a, b) =>
    a.date < b.date ? 1 : -1
  );
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const p = await getPublishedBySlug(slug);
  if (p) {
    return {
      slug: p.slug,
      title: p.title,
      date: p.date,
      summary: p.summary,
      tags: p.tags,
      content: p.body,
    };
  }
  const m = getMdxPost(slug);
  if (m && m.meta.published !== false) {
    return {
      slug: m.meta.slug,
      title: m.meta.title,
      date: m.meta.date,
      summary: m.meta.summary,
      tags: m.meta.tags ?? [],
      content: m.content,
    };
  }
  return null;
}
