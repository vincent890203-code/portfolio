import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// ── 型別 ──────────────────────────────────────────────
// 專案類別決定訊號轉換配色:research=暖(過去)、bridge=中間、ai=冷(現在)。
export type ProjectKind = "research" | "bridge" | "ai";

export type ProjectMeta = {
  slug: string;
  title: string;
  summary: string;
  role: string;
  period: string;
  kind: ProjectKind;
  order: number; // 由舊到新排序
  stack: string[]; // 顯示用技術標籤(自由字串)
  skills: string[]; // taxonomy key,供圖譜/RAG 用
  links: { repo?: string; demo?: string };
  featured: boolean;
  confidential: boolean;
};

export type CourseMeta = {
  slug: string;
  title: string;
  provider: string; // University of Alberta / IBM / Google
  credentialId?: string;
  verifyUrl?: string;
  completedAt: string; // YYYY/MM
  order: number;
  skills: string[];
  specialization?: string; // 屬於哪個專項(用於分組徽章)
  appliedIn: string[]; // 對應的專案 slug(Phase 3 圖譜的邊)
};

// 部落格文章
export type PostMeta = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  summary: string;
  tags: string[];
  published?: boolean; // false = 草稿,不會出現在列表
};

export type Doc<M> = { meta: M; content: string };

// ── 讀取工具 ──────────────────────────────────────────
const CONTENT_DIR = path.join(process.cwd(), "content");

function readDir(sub: string): string[] {
  const dir = path.join(CONTENT_DIR, sub);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
}

function readDoc<M>(sub: string, file: string): Doc<M & { slug: string }> {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, sub, file), "utf8");
  const { data, content } = matter(raw);
  const slug = file.replace(/\.mdx$/, "");
  return { meta: { slug, ...(data as M) }, content: content.trim() };
}

// ── 通用內容集合(模組化核心)──────────────────────────
// 每種內容(專案/課程/文章)都是一個「集合」;新增類型只要 createCollection 一行。
export function createCollection<M>(
  sub: string,
  sort?: (a: Doc<M & { slug: string }>, b: Doc<M & { slug: string }>) => number
) {
  return {
    all(): Doc<M & { slug: string }>[] {
      const docs = readDir(sub).map((f) => readDoc<M>(sub, f));
      return sort ? docs.sort(sort) : docs;
    },
    get(slug: string): Doc<M & { slug: string }> | null {
      const file = `${slug}.mdx`;
      if (!fs.existsSync(path.join(CONTENT_DIR, sub, file))) return null;
      return readDoc<M>(sub, file);
    },
  };
}

// ── 專案 ──────────────────────────────────────────────
export function getAllProjects(): Doc<ProjectMeta>[] {
  return readDir("projects")
    .map((f) => readDoc<Omit<ProjectMeta, "slug">>("projects", f))
    .sort((a, b) => a.meta.order - b.meta.order);
}

export function getProject(slug: string): Doc<ProjectMeta> | null {
  const file = `${slug}.mdx`;
  const full = path.join(CONTENT_DIR, "projects", file);
  if (!fs.existsSync(full)) return null;
  return readDoc<Omit<ProjectMeta, "slug">>("projects", file);
}

export function getFeaturedProjects(): Doc<ProjectMeta>[] {
  return getAllProjects().filter((p) => p.meta.featured);
}

// ── 課程 ──────────────────────────────────────────────
export function getAllCourses(): Doc<CourseMeta>[] {
  return readDir("courses")
    .map((f) => readDoc<Omit<CourseMeta, "slug">>("courses", f))
    .sort((a, b) => a.meta.order - b.meta.order);
}

export function getCourse(slug: string): Doc<CourseMeta> | null {
  const file = `${slug}.mdx`;
  const full = path.join(CONTENT_DIR, "courses", file);
  if (!fs.existsSync(full)) return null;
  return readDoc<Omit<CourseMeta, "slug">>("courses", file);
}

// ── 部落格(用通用集合,依日期新到舊)──────────────────
// YAML 會把未加引號的日期解析成 Date 物件,統一轉成 YYYY-MM-DD 字串。
function normalizeDate(doc: Doc<PostMeta>): Doc<PostMeta> {
  const d = doc.meta.date as unknown;
  const date =
    d instanceof Date ? d.toISOString().slice(0, 10) : String(d ?? "");
  return { ...doc, meta: { ...doc.meta, date } };
}

const posts = createCollection<Omit<PostMeta, "slug">>("posts", (a, b) =>
  String(a.meta.date) < String(b.meta.date) ? 1 : -1
);

export function getAllPosts(): Doc<PostMeta>[] {
  return posts
    .all()
    .filter((p) => p.meta.published !== false)
    .map(normalizeDate);
}

export function getPost(slug: string): Doc<PostMeta> | null {
  const doc = posts.get(slug);
  return doc ? normalizeDate(doc) : null;
}
