"use client";

import Link from "next/link";
import { comicKey, getLevelComicSummary } from "@/lib/progress";
import { useProgress } from "@/hooks/useProgress";
import type { ComicListItem } from "@/types/comic";

export type ComicDashboardWidgetProps = {
  level: string;
  comics: ComicListItem[];
};

export default function ComicDashboardWidget({ level, comics }: ComicDashboardWidgetProps) {
  const lv = level.toLowerCase();
  const { progress } = useProgress();
  const storyTitles = Object.fromEntries(comics.map((c) => [c.storyId, c.title]));
  const summary = getLevelComicSummary(progress, lv, storyTitles);

  if (comics.length === 0) {
    return (
      <section className="mt-12 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6">
        <h2 className="text-lg font-bold text-white">Comic Stories</h2>
        <p className="mt-2 text-sm text-slate-400">
          Manga-style reading practice is coming to this level soon.
        </p>
      </section>
    );
  }

  const continueStory = summary.currentStoryId
    ? comics.find((c) => c.storyId === summary.currentStoryId)
    : comics.find((c) => !progress.comics[comicKey(lv, c.storyId)]?.completed);

  return (
    <section className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-violet-950/30 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] text-fuchsia-300 uppercase">
            Comic Stories
          </p>
          <h2 className="mt-1 text-lg font-bold text-white">Manga reading practice</h2>
        </div>
        <Link
          href={`/${lv}/comics`}
          className="rounded-xl border border-white/15 px-4 py-2 text-xs font-bold text-cyan-200 transition hover:border-cyan-400/40"
        >
          Browse all →
        </Link>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4">
          <p className="text-2xl font-black text-emerald-200">{summary.completed}</p>
          <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Stories completed
          </p>
        </div>
        <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 p-4">
          <p className="truncate text-sm font-bold text-cyan-200">
            {summary.currentStoryTitle ?? continueStory?.title ?? "—"}
          </p>
          <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Current story
          </p>
        </div>
        <div className="rounded-xl border border-fuchsia-400/20 bg-fuchsia-500/10 p-4">
          <p className="text-2xl font-black text-fuchsia-200">{summary.readingStreak}</p>
          <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Reading streak
          </p>
        </div>
      </div>

      {continueStory ? (
        <Link
          href={`/${lv}/comics/${continueStory.storyId}`}
          className="mt-5 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 py-3 text-sm font-black text-slate-950 transition hover:shadow-lg hover:shadow-fuchsia-500/25"
        >
          {summary.currentStoryId ? "Continue reading →" : "Start a comic →"}
        </Link>
      ) : null}
    </section>
  );
}
