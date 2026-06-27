"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ChapterStatusBadge from "@/components/progress/ChapterStatusBadge";
import ProgressHud from "@/components/progress/ProgressHud";
import BadgeGallery from "@/components/progress/BadgeGallery";
import { chapterKey, getLevelProgressSummary } from "@/lib/progress";
import { useProgress } from "@/hooks/useProgress";
import type { ChapterListItem } from "@/lib/content/loadChapter";
import type { ComicListItem } from "@/types/comic";
import ComicDashboardWidget from "@/components/comic/ComicDashboardWidget";

type LevelChapterHubClientProps = {
  level: string;
  chapters: ChapterListItem[];
  comics: ComicListItem[];
};

export default function LevelChapterHubClient({ level, chapters, comics }: LevelChapterHubClientProps) {
  const lv = level.toLowerCase();
  const label = lv.toUpperCase();
  const { progress } = useProgress();
  const summary = getLevelProgressSummary(progress, lv);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute left-1/3 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-[100px]" />
      </div>

      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-bold tracking-widest text-cyan-200 uppercase transition hover:border-fuchsia-400/40"
          >
            ← Home
          </Link>
          <ProgressHud compact />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-[10px] font-semibold tracking-[0.25em] text-fuchsia-300/90 uppercase">
          JLPT {label}
        </p>
        <h1 className="mt-2 text-balance text-3xl font-black sm:text-4xl">
          <span className="bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-violet-200 bg-clip-text text-transparent">
            {label} · Chapters
          </span>
        </h1>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-200 tabular-nums">
            {summary.completed} completed
          </span>
          <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-200 tabular-nums">
            {summary.inProgress} in progress
          </span>
          <span className="rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-3 py-1 text-xs font-bold text-fuchsia-200 tabular-nums">
            {summary.totalXp} XP earned
          </span>
        </div>

        {chapters.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] px-6 py-12 text-center">
            <p className="font-semibold text-white">No chapters yet</p>
            <p className="mt-2 text-sm text-slate-400">
              Create <code className="text-cyan-200/90">content/{lv}/chapter-1.json</code> to get
              started.
            </p>
          </div>
        ) : (
          <ul className="mt-10 flex flex-col gap-4">
            {chapters.map((ch, i) => {
              const chProgress = progress.chapters[chapterKey(lv, ch.slug)] ?? null;
              return (
                <motion.li
                  key={ch.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/${lv}/${ch.slug}`}
                    className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/50 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/35 hover:shadow-lg hover:shadow-cyan-500/10 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[10px] font-bold tracking-[0.2em] text-cyan-300/90 uppercase">
                          {ch.chapter > 0 ? `Chapter ${ch.chapter}` : ch.slug}
                        </p>
                        <ChapterStatusBadge chapterProgress={chProgress} />
                      </div>
                      <h2 className="mt-1 text-balance text-lg font-bold text-white sm:text-xl">
                        {ch.title}
                      </h2>
                      {chProgress && chProgress.lessonProgress > 0 && !chProgress.completed ? (
                        <div className="mt-3 h-1.5 max-w-xs overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-400 transition-[width] duration-500"
                            style={{ width: `${chProgress.lessonProgress}%` }}
                          />
                        </div>
                      ) : null}
                    </div>
                    <span className="inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-2.5 text-sm font-black text-slate-950 transition group-hover:shadow-md group-hover:shadow-fuchsia-500/30">
                      {chProgress?.completed ? "Review →" : "Enter →"}
                    </span>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        )}

        {progress.badges.length > 0 ? (
          <section className="mt-14">
            <h2 className="text-lg font-bold text-white">Your badges</h2>
            <p className="mt-1 text-sm text-slate-400">Earned across all JLPT levels on this device.</p>
            <BadgeGallery className="mt-4" showLocked={false} />
          </section>
        ) : null}

        <ComicDashboardWidget level={lv} comics={comics} />
      </main>
    </div>
  );
}
