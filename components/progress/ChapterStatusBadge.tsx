"use client";

import type { ChapterProgress } from "@/lib/progress";

type ChapterStatusBadgeProps = {
  chapterProgress: ChapterProgress | null;
  hasQuiz?: boolean;
};

export default function ChapterStatusBadge({
  chapterProgress,
  hasQuiz = true,
}: ChapterStatusBadgeProps) {
  if (!chapterProgress) return null;

  const { completed, quizCompleted, lessonProgress, quizBestScore, quizBestTotal } =
    chapterProgress;

  if (completed) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold tracking-wide text-emerald-200">
        <span aria-hidden>✓</span> Complete
      </span>
    );
  }

  if (quizCompleted && quizBestTotal > 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-fuchsia-400/35 bg-fuchsia-500/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-fuchsia-200 tabular-nums">
        Quiz {quizBestScore}/{quizBestTotal}
      </span>
    );
  }

  if (lessonProgress > 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/35 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-cyan-200 tabular-nums">
        {lessonProgress}%{hasQuiz ? " · In progress" : ""}
      </span>
    );
  }

  return null;
}
