import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ProjectCard from "@/components/ProjectCard";
import { getAllProjects } from "@/content/loader";

export const metadata: Metadata = {
  title: "作品集 · 郭原辰",
  description: "從分子醫學研究到 AI 工程的專案：DeepTox、Ares、以及公司 AI 應用交付。",
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-4 flex items-center gap-4">
          <h1 className="text-3xl font-bold text-text">作品集</h1>
          <span className="font-mono text-xs text-dim">/projects</span>
        </div>
        <p className="mb-12 max-w-xl leading-relaxed text-dim">
          顏色沿用轉職敘事——暖色是生醫研究的底子,冷色是現在的 AI 工程,中間是把兩者接起來的橋樑。
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.meta.slug} meta={p.meta} />
          ))}
        </div>
      </main>
    </>
  );
}
