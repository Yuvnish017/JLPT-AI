"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import BadgeGallery from "@/components/progress/BadgeGallery";
import ProgressHud from "@/components/progress/ProgressHud";
import { chapterKey } from "@/lib/progress";
import { useProgress } from "@/hooks/useProgress";

export default function HomeProgressDashboard() {
  const { progress } = useProgress();

  const recentActivity = useMemo(() => {
    const items = Object.entries(progress.chapters)
      .map(([key, ch]) => {
        const [level, ...slugParts] = key.split("/");
        const slug = slugParts.join("/");
        const lastAt = ch.lastQuiz?.completedAt ?? ch.lastVisitedAt;
        return {
          key,
          level: level ?? "",
          slug,
          label: `${(level ?? "").toUpperCase()} · ${slug.replace(/-/g, " ")}`,
          score: ch.lastQuiz ? `${ch.lastQuiz.score}/${ch.lastQuiz.total}` : null,
          xp: ch.xpEarned,
          completed: ch.completed,
          quizDone: ch.quizCompleted,
          lastAt,
        };
      })
      .sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime())
      .slice(0, 4);

    return items;
  }, [progress.chapters]);

  return (
    <div className="relative rounded-3xl border border-white/15 bg-gradient-to-br from-slate-900/85 to-slate-800/40 p-5 shadow-2xl shadow-fuchsia-900/30 backdrop-blur sm:p-6">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-fuchsia-500/20 blur-3xl" aria-hidden />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-slate-300 uppercase">
            Your Training Arc
          </p>
          <p className="mt-1 text-sm text-slate-400">Progress saved on this device</p>
        </div>
        <motion.span
          key={progress.totalXp}
          initial={{ scale: 1.15, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-full border border-emerald-400/35 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-200 tabular-nums"
        >
          {progress.totalXp} XP total
        </motion.span>
      </div>

      <ProgressHud className="mb-5" />

      <div className="space-y-2">
        <p className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
          Recent activity
        </p>
        {recentActivity.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-5 text-sm text-slate-400">
            Start an N5 chapter to begin earning XP and badges.
          </div>
        ) : (
          recentActivity.map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold capitalize text-slate-100">
                  {item.label}
                </p>
                <p className="text-xs text-slate-500">
                  {item.completed
                    ? "Chapter complete"
                    : item.quizDone && item.score
                      ? `Quiz score ${item.score}`
                      : "Lesson in progress"}
                </p>
              </div>
              <span className="shrink-0 text-xs font-bold text-cyan-300 tabular-nums">
                +{item.xp} XP
              </span>
            </motion.div>
          ))
        )}
      </div>

      <div className="mt-6">
        <p className="mb-3 text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
          Badge collection
        </p>
        <BadgeGallery limit={6} showLocked={false} />
        {progress.badges.length === 0 ? (
          <p className="mt-2 text-xs text-slate-500">No badges yet — finish a quiz to unlock your first!</p>
        ) : null}
      </div>
    </div>
  );
}

export function useChapterProgressKey(level: string, slug: string) {
  const { progress } = useProgress();
  return progress.chapters[chapterKey(level, slug)] ?? null;
}
