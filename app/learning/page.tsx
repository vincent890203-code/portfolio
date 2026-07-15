import type { Metadata } from "next";
import Nav from "@/components/Nav";
import CourseCard from "@/components/CourseCard";
import { getAllCourses } from "@/content/loader";
import { CREDENTIALS } from "@/content/profile";

export const metadata: Metadata = {
  title: "學習軌跡 · 郭原辰",
  description:
    "系統性自學紀錄:完整修畢 University of Alberta 軟體設計與架構專項,以及 IBM、Google 課程與專業證照。",
};

const SPECIALIZATION = "Software Design and Architecture";

export default function LearningPage() {
  const courses = getAllCourses();
  const specCourses = courses.filter(
    (c) => c.meta.specialization === SPECIALIZATION
  );
  const otherCourses = courses.filter(
    (c) => c.meta.specialization !== SPECIALIZATION
  );

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-4 flex items-center gap-4">
          <h1 className="text-3xl font-bold text-text">學習軌跡</h1>
          <span className="font-mono text-xs text-dim">/learning</span>
        </div>
        <p className="mb-12 max-w-xl leading-relaxed text-dim">
          轉職不是空談。這裡是我系統性打底的證明——每一張證書都可點擊驗證。
        </p>

        {/* Alberta 專項:完整修畢徽章 */}
        {specCourses.length > 0 && (
          <section className="mb-12 rounded-2xl border border-cool/40 bg-surface p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-cool/15 px-3 py-1 font-mono text-xs text-cool">
                ✓ 完整修畢專項
              </span>
              <h2 className="text-lg font-medium text-text">
                {SPECIALIZATION} · University of Alberta
              </h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-dim">
              不是零散選修,而是完成整個 {specCourses.length}{" "}
              門課的軟體設計與架構專項——這正是我朝 Software Architect 前進的骨幹。
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {specCourses.map((c) => (
                <CourseCard key={c.meta.slug} meta={c.meta} />
              ))}
            </div>
          </section>
        )}

        {/* 其他課程 */}
        {otherCourses.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-5 text-lg font-medium text-text">其他課程</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {otherCourses.map((c) => (
                <CourseCard key={c.meta.slug} meta={c.meta} />
              ))}
            </div>
          </section>
        )}

        {/* 證照與語言 */}
        <section>
          <h2 className="mb-5 text-lg font-medium text-text">證照與語言</h2>
          <ul className="flex flex-wrap gap-3">
            {CREDENTIALS.map((c) => (
              <li
                key={c}
                className="rounded-full border border-line bg-surface px-4 py-2 font-mono text-xs text-dim"
              >
                {c}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
