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
