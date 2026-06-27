"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ComicCard from "@/components/comic/ComicCard";
import ProgressHud from "@/components/progress/ProgressHud";
import { comicKey, getLevelComicSummary } from "@/lib/progress";
import { parseReadingMinutes, readingLengthBucket } from "@/lib/content/comicUtils";
import { useProgress } from "@/hooks/useProgress";
import type { ComicFilters, ComicListItem } from "@/types/comic";

export type ComicHomeClientProps = {
  level: string;
  comics: ComicListItem[];
};

const LENGTH_OPTIONS: { id: ComicFilters["readingLength"]; label: string }[] = [
  { id: "all", label: "Any length" },
  { id: "short", label: "Short (≤3 min)" },
  { id: "medium", label: "Medium (4–7 min)" },
  { id: "long", label: "Long (8+ min)" },
];

export default function ComicHomeClient({ level, comics }: ComicHomeClientProps) {
  const lv = level.toLowerCase();
  const label = lv.toUpperCase();
  const { progress } = useProgress();

  const [filters, setFilters] = useState<ComicFilters>({
    difficulty: "",
    vocabulary: "",
    grammar: "",
    readingLength: "all",
  });

  const storyTitles = useMemo(
    () => Object.fromEntries(comics.map((c) => [c.storyId, c.title])),
    [comics],
  );
  const summary = getLevelComicSummary(progress, lv, storyTitles);

  const filtered = useMemo(() => {
    return comics.filter((comic) => {
      if (
        filters.difficulty &&
        !comic.difficulty.toLowerCase().includes(filters.difficulty.toLowerCase())
      ) {
        return false;
      }
      if (filters.vocabulary.trim()) {
        const q = filters.vocabulary.toLowerCase();
        const vocabMatch = comic.vocabularyTerms.some(
          (w) => w.toLowerCase().includes(q) || q.includes(w.toLowerCase()),
        );
        if (!vocabMatch && !comic.title.toLowerCase().includes(q)) return false;
      }
      if (filters.grammar.trim()) {
        const q = filters.grammar.toLowerCase();
        const grammarMatch = comic.grammarPatterns.some((p) => p.toLowerCase().includes(q));
        if (!grammarMatch) return false;
      }
      if (filters.readingLength !== "all") {
        const bucket = readingLengthBucket(parseReadingMinutes(comic.estimatedReadingTime));
        if (bucket !== filters.readingLength) return false;
      }
      return true;
    });
  }, [comics, filters]);

  const difficulties = useMemo(
    () => [...new Set(comics.map((c) => c.difficulty))].sort(),
    [comics],
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute left-0 top-1/4 h-80 w-80 rounded-full bg-fuchsia-600/15 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-cyan-500/15 blur-[100px]" />
      </div>

      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link
            href={`/${lv}`}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-bold tracking-widest text-cyan-200 uppercase transition hover:border-fuchsia-400/40"
          >
            ← {label}
          </Link>
          <ProgressHud compact />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-[10px] font-semibold tracking-[0.25em] text-fuchsia-300/90 uppercase">
          JLPT {label} · Manga Practice
        </p>
        <h1 className="mt-2 text-balance text-3xl font-black sm:text-4xl">
          <span className="bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-violet-200 bg-clip-text text-transparent">
            Comic Stories
          </span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-400">
          Learn vocabulary and grammar through funny, memorable manga-style situations.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-200">
            {summary.completed} completed
          </span>
          <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-200">
            🔥 {summary.readingStreak} day streak
          </span>
          {summary.currentStoryTitle ? (
            <span className="rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-3 py-1 text-xs font-bold text-fuchsia-200">
              Reading: {summary.currentStoryTitle}
            </span>
          ) : null}
        </div>

        {comics.length > 0 ? (
          <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900/40 p-4 sm:p-5">
            <h2 className="text-sm font-bold text-white">Filter stories</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="block">
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  Difficulty
                </span>
                <select
                  value={filters.difficulty}
                  onChange={(e) => setFilters((f) => ({ ...f, difficulty: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
                >
                  <option value="">All levels</option>
                  {difficulties.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  Vocabulary
                </span>
                <input
                  type="search"
                  placeholder="Search title…"
                  value={filters.vocabulary}
                  onChange={(e) => setFilters((f) => ({ ...f, vocabulary: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-600"
                />
              </label>
              <label className="block">
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  Grammar
                </span>
                <input
                  type="search"
                  placeholder="Filter…"
                  value={filters.grammar}
                  onChange={(e) => setFilters((f) => ({ ...f, grammar: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-600"
                />
              </label>
              <label className="block">
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  Reading length
                </span>
                <select
                  value={filters.readingLength}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      readingLength: e.target.value as ComicFilters["readingLength"],
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
                >
                  {LENGTH_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>
        ) : null}

        {filtered.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] px-6 py-12 text-center">
            <p className="font-semibold text-white">
              {comics.length === 0 ? "No comic stories yet" : "No stories match your filters"}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              {comics.length === 0
                ? `Add JSON files to content/${lv}/comics/ to publish stories.`
                : "Try adjusting your search filters."}
            </p>
          </div>
        ) : (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((comic, i) => (
              <ComicCard
                key={comic.storyId}
                level={lv}
                comic={comic}
                comicProgress={progress.comics[comicKey(lv, comic.storyId)] ?? null}
                index={i}
              />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
