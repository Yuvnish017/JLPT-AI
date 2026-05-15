"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { chapterIncludes, includedArray } from "@/lib/chapterIncludes";
import type { Kanji, Lesson, ReadingExercise, Vocabulary } from "@/types/lesson";

const CONTENT_KEYS = ["kanji", "vocabulary", "grammar", "reading"] as const;
const VOCAB_PAGE_SIZE = 40;
const KANJI_PAGE_SIZE = 12;

export type ChapterLessonClientProps = {
  level: string;
  slug: string;
  rawLesson: Record<string, unknown>;
  lesson: Lesson;
};

function BookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8M8 11h6" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l1.2 4.2L17 7l-3.8 1.8L12 13l-1.2-4.2L7 7l3.8-1.8L12 2zM5 14l.8 2.8L8.5 18l-2.7 1.3L5 22l-.8-2.7L1.5 18l2.7-1.3L5 14zM19 12l.5 1.8L21 15l-1.5.7L19 17.5l-.5-1.8L17 15l1.5-.7L19 12z" />
    </svg>
  );
}

function PenIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function KanjiBrushIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M3 21h18M6 4h12M8 4v17M16 4v17M6 9h12M5 14h14" />
    </svg>
  );
}

function ScrollIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}

function formatReadings(label: string, values: string[]) {
  if (!values.length) return null;
  return (
    <p className="text-sm text-slate-400">
      <span className="font-semibold text-slate-500">{label}</span>{" "}
      <span className="font-mono text-violet-200/95">{values.join(" · ")}</span>
    </p>
  );
}

function KanjiCard({ item }: { item: Kanji }) {
  const examples = item.examples ?? [];
  return (
    <details className="group rounded-2xl border border-white/10 bg-slate-900/60 shadow-lg shadow-black/20 open:border-amber-400/35 open:shadow-amber-500/10">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 marker:content-none [&::-webkit-details-marker]:hidden sm:px-5">
        <div className="flex min-w-0 items-center gap-4">
          <p className="text-4xl font-black text-white sm:text-5xl">{item.character}</p>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-200">{item.meaning}</p>
            {item.stroke_count != null ? (
              <p className="text-xs text-slate-500">Strokes · {item.stroke_count}</p>
            ) : null}
          </div>
        </div>
        <span className="shrink-0 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-bold tracking-wider text-amber-200/90 uppercase">
          Details
        </span>
      </summary>
      <div className="border-t border-white/10 px-4 pb-4 pt-2 sm:px-5">
        {formatReadings("音", item.onyomi ?? [])}
        {formatReadings("訓", item.kunyomi ?? [])}
        {examples.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {examples.map((ex, i) => (
              <li
                key={`${ex.word}-${i}`}
                className="rounded-xl border border-white/5 bg-black/25 px-3 py-2 text-sm"
              >
                <span className="font-semibold text-amber-100/90">{ex.word}</span>
                <span className="mx-2 text-slate-500">·</span>
                <span className="font-mono text-cyan-300/90">{ex.reading}</span>
                <span className="mt-1 block text-slate-400">{ex.meaning}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </details>
  );
}

function ReadingCard({ item }: { item: ReadingExercise }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-lg shadow-black/20">
      <h4 className="text-lg font-bold text-emerald-100">{item.title}</h4>
      <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-300 sm:text-base">
        {item.passage}
      </p>
    </article>
  );
}

type TabId = "overview" | "kanji" | "vocabulary" | "grammar" | "reading";

export default function ChapterLessonClient({
  level,
  slug,
  rawLesson,
  lesson,
}: ChapterLessonClientProps) {
  const base = `/${level.toLowerCase()}/${slug}`;
  const hub = `/${level.toLowerCase()}`;

  const kanji = includedArray(rawLesson, "kanji", lesson, (l) => l.kanji);
  const vocabulary = includedArray(rawLesson, "vocabulary", lesson, (l) => l.vocabulary);
  const grammar = includedArray(rawLesson, "grammar", lesson, (l) => l.grammar);
  const reading = includedArray(rawLesson, "reading", lesson, (l) => l.reading);

  const showKanji = chapterIncludes(rawLesson, "kanji");
  const showVocabulary = chapterIncludes(rawLesson, "vocabulary");
  const showGrammar = chapterIncludes(rawLesson, "grammar");
  const showReading = chapterIncludes(rawLesson, "reading");

  const hasQuiz = chapterIncludes(rawLesson, "quiz") && (lesson.quiz?.length ?? 0) > 0;
  const canFlashcards = vocabulary.length > 0;

  const includedContentKeys = useMemo(
    () => CONTENT_KEYS.filter((k) => chapterIncludes(rawLesson, k)),
    [rawLesson],
  );

  const filledContentSlots = useMemo(() => {
    return includedContentKeys.filter((k) => {
      if (k === "kanji") return kanji.length > 0;
      if (k === "vocabulary") return vocabulary.length > 0;
      if (k === "grammar") return grammar.length > 0;
      return reading.length > 0;
    }).length;
  }, [includedContentKeys, kanji.length, vocabulary.length, grammar.length, reading.length]);

  const sectionProgress =
    includedContentKeys.length === 0
      ? 100
      : Math.round((filledContentSlots / includedContentKeys.length) * 100);

  const [scrollPct, setScrollPct] = useState(0);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [vocabQuery, setVocabQuery] = useState("");
  const [vocabPage, setVocabPage] = useState(0);
  const [kanjiPage, setKanjiPage] = useState(0);

  const tabs = useMemo(() => {
    const t: { id: TabId; label: string; short: string; count: number }[] = [
      { id: "overview", label: "Overview", short: "概要", count: 0 },
    ];
    if (showKanji) t.push({ id: "kanji", label: "Kanji", short: "漢字", count: kanji.length });
    if (showVocabulary) {
      t.push({ id: "vocabulary", label: "Vocabulary", short: "語彙", count: vocabulary.length });
    }
    if (showGrammar) t.push({ id: "grammar", label: "Grammar", short: "文法", count: grammar.length });
    if (showReading) t.push({ id: "reading", label: "Reading", short: "読解", count: reading.length });
    return t;
  }, [
    showKanji,
    showVocabulary,
    showGrammar,
    showReading,
    kanji.length,
    vocabulary.length,
    grammar.length,
    reading.length,
  ]);

  const updateScroll = useCallback(() => {
    const el = document.documentElement;
    const scrollTop = el.scrollTop || document.body.scrollTop;
    const height = el.scrollHeight - el.clientHeight;
    if (height <= 0) {
      setScrollPct(100);
      return;
    }
    setScrollPct(Math.min(100, Math.round((scrollTop / height) * 100)));
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => updateScroll());
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, [updateScroll, activeTab]);

  const combinedProgress = Math.round((scrollPct + sectionProgress) / 2);

  const filteredVocab = useMemo(() => {
    const q = vocabQuery.trim().toLowerCase();
    if (!q) return vocabulary;
    return vocabulary.filter((w: Vocabulary) => {
      return (
        w.word.toLowerCase().includes(q) ||
        w.reading.toLowerCase().includes(q) ||
        w.meaning.toLowerCase().includes(q)
      );
    });
  }, [vocabulary, vocabQuery]);

  const vocabPageCount = Math.max(1, Math.ceil(filteredVocab.length / VOCAB_PAGE_SIZE));
  const effectiveVocabPage = Math.min(vocabPage, vocabPageCount - 1);

  const vocabSlice = useMemo(() => {
    const start = effectiveVocabPage * VOCAB_PAGE_SIZE;
    return filteredVocab.slice(start, start + VOCAB_PAGE_SIZE);
  }, [filteredVocab, effectiveVocabPage]);

  const kanjiPageCount = Math.max(1, Math.ceil(kanji.length / KANJI_PAGE_SIZE));
  const effectiveKanjiPage = Math.min(kanjiPage, kanjiPageCount - 1);
  const kanjiSlice = useMemo(() => {
    const start = effectiveKanjiPage * KANJI_PAGE_SIZE;
    return kanji.slice(start, start + KANJI_PAGE_SIZE);
  }, [kanji, effectiveKanjiPage]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        aria-hidden
      >
        <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-[100px]" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-cyan-500/15 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-violet-600/15 blur-[110px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:gap-3">
              <Link
                href={hub}
                className="shrink-0 rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-[10px] font-bold tracking-widest text-fuchsia-200 uppercase transition hover:border-fuchsia-400/40"
              >
                {level.toUpperCase()} hub
              </Link>
              <Link
                href="/"
                className="shrink-0 rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-[10px] font-bold tracking-widest text-cyan-200 uppercase transition hover:border-fuchsia-400/40"
              >
                ← Home
              </Link>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold tracking-[0.12em] text-fuchsia-300/90 uppercase">
                  {lesson.jlpt} · Ch.{lesson.chapter}
                </p>
                <h1 className="truncate text-sm font-bold text-white sm:text-base">
                  {lesson.title}
                </h1>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[180px] sm:max-w-xs">
              <div className="flex items-center justify-between gap-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                <span>Progress</span>
                <span className="tabular-nums text-cyan-300">{combinedProgress}%</span>
              </div>
              <div
                className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
                role="progressbar"
                aria-valuenow={combinedProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Lesson progress"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-400 transition-[width] duration-500 ease-out motion-reduce:transition-none"
                  style={{ width: `${combinedProgress}%` }}
                />
              </div>
            </div>
          </div>

          <nav
            className="mt-3 flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Chapter sections"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 rounded-lg px-3 py-2 text-left text-xs font-bold transition sm:text-sm ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-cyan-500/30 to-fuchsia-500/30 text-white ring-1 ring-fuchsia-400/40"
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                }`}
              >
                <span className="block tracking-wide">{tab.short}</span>
                <span className="mt-0.5 block text-[10px] font-normal text-slate-500">
                  {tab.id === "overview"
                    ? "Start here"
                    : `${tab.count} ${tab.count === 1 ? "item" : "items"}`}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="relative mx-auto max-w-4xl px-4 pb-24 pt-6 sm:px-6 sm:pt-8">
        {activeTab === "overview" && (
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/25 bg-fuchsia-500/10 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-fuchsia-200 uppercase">
              <SparklesIcon className="h-3.5 w-3.5 text-fuchsia-300" />
              Study path
            </p>
            <p className="text-sm leading-relaxed text-slate-400 sm:text-base">
              Use the tabs above to focus on one topic at a time. Large lists are paginated and
              vocabulary is searchable.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { k: "kanji", n: kanji.length, on: showKanji },
                { k: "vocab", n: vocabulary.length, on: showVocabulary },
                { k: "grammar", n: grammar.length, on: showGrammar },
                { k: "reading", n: reading.length, on: showReading },
              ].map((s) => (
                <button
                  key={s.k}
                  type="button"
                  disabled={!s.on}
                  onClick={() => {
                    if (!s.on) return;
                    if (s.k === "kanji") setActiveTab("kanji");
                    if (s.k === "vocab") setActiveTab("vocabulary");
                    if (s.k === "grammar") setActiveTab("grammar");
                    if (s.k === "reading") setActiveTab("reading");
                  }}
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    s.on
                      ? "border-white/15 bg-white/[0.06] hover:border-cyan-400/30"
                      : "cursor-not-allowed border-white/5 opacity-40"
                  }`}
                >
                  <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    {s.k}
                  </p>
                  <p className="mt-1 text-2xl font-black tabular-nums text-white">{s.on ? s.n : "—"}</p>
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {canFlashcards ? (
                <Link
                  href={`${base}/flashcards`}
                  className="flex flex-col items-center justify-center rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/15 to-transparent px-4 py-5 text-center transition hover:-translate-y-0.5 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/15"
                >
                  <span className="text-[10px] font-bold tracking-[0.2em] text-cyan-200 uppercase">
                    Study
                  </span>
                  <span className="mt-1 text-lg font-black text-white">Flashcards</span>
                  <span className="mt-1 text-xs text-slate-500">Deck from this chapter</span>
                </Link>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-5 text-center text-slate-600">
                  <span className="text-lg font-bold">Flashcards</span>
                  <span className="mt-1 text-xs">Needs vocabulary</span>
                </div>
              )}
              {hasQuiz ? (
                <Link
                  href={`${base}/quiz`}
                  className="flex flex-col items-center justify-center rounded-2xl border border-fuchsia-400/30 bg-gradient-to-br from-fuchsia-500/15 to-transparent px-4 py-5 text-center transition hover:-translate-y-0.5 hover:border-fuchsia-400/50 hover:shadow-lg hover:shadow-fuchsia-500/15"
                >
                  <span className="text-[10px] font-bold tracking-[0.2em] text-fuchsia-200 uppercase">
                    Challenge
                  </span>
                  <span className="mt-1 text-lg font-black text-white">Quiz</span>
                  <span className="mt-1 text-xs text-slate-500">Check recall</span>
                </Link>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-5 text-center text-slate-600">
                  <span className="text-lg font-bold">Quiz</span>
                  <span className="mt-1 text-xs">No quiz in JSON</span>
                </div>
              )}
              <Link
                href={hub}
                className="flex flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-5 text-center transition hover:-translate-y-0.5 hover:border-white/25"
              >
                <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                  Navigate
                </span>
                <span className="mt-1 text-lg font-black text-white">All chapters</span>
                <span className="mt-1 text-xs text-slate-500">Level index</span>
              </Link>
            </div>
          </div>
        )}

        {activeTab === "kanji" && showKanji && (
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-400/35 bg-gradient-to-br from-amber-500/20 to-transparent text-amber-200">
                <KanjiBrushIcon className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-white sm:text-2xl">Kanji</h2>
                <p className="text-sm text-slate-500">
                  Page {effectiveKanjiPage + 1} of {kanjiPageCount} · {kanji.length} total
                </p>
              </div>
            </div>
            {kanji.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-amber-400/25 bg-amber-500/5 px-4 py-8 text-center text-sm text-slate-400">
                No kanji entries yet. Remove the <code className="text-amber-200/90">kanji</code>{" "}
                key if this chapter does not cover kanji.
              </p>
            ) : (
              <>
                <div className="grid gap-3">
                  {kanjiSlice.map((k, index) => (
                    <KanjiCard key={`${k.character}-${effectiveKanjiPage}-${index}`} item={k} />
                  ))}
                </div>
                {kanjiPageCount > 1 ? (
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      disabled={effectiveKanjiPage <= 0}
                      onClick={() => setKanjiPage((p) => Math.max(0, p - 1))}
                      className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-slate-200 disabled:opacity-35"
                    >
                      ← Prev
                    </button>
                    <button
                      type="button"
                      disabled={effectiveKanjiPage >= kanjiPageCount - 1}
                      onClick={() => setKanjiPage((p) => Math.min(kanjiPageCount - 1, p + 1))}
                      className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-slate-200 disabled:opacity-35"
                    >
                      Next →
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        )}

        {activeTab === "vocabulary" && showVocabulary && (
          <div>
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/20 to-transparent text-cyan-300">
                  <BookIcon className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-white sm:text-2xl">Vocabulary</h2>
                  <p className="text-sm text-slate-500">
                    {filteredVocab.length} match{filteredVocab.length === 1 ? "" : "es"} · page{" "}
                    {effectiveVocabPage + 1}/{vocabPageCount}
                  </p>
                </div>
              </div>
              <label className="block w-full sm:max-w-xs">
                <span className="sr-only">Search vocabulary</span>
                <input
                  type="search"
                  value={vocabQuery}
                  onChange={(e) => {
                    setVocabQuery(e.target.value);
                    setVocabPage(0);
                  }}
                  placeholder="Search word, reading, meaning…"
                  className="w-full rounded-xl border border-white/15 bg-slate-900/80 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none ring-cyan-400/40 focus:ring-2"
                />
              </label>
            </div>
            {vocabulary.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-8 text-center text-sm text-slate-400">
                No vocabulary yet.
              </p>
            ) : (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  {vocabSlice.map((word, index) => (
                    <article
                      key={`${word.word}-${effectiveVocabPage}-${index}`}
                      className="rounded-xl border border-white/10 bg-slate-900/50 p-4 shadow-md transition hover:border-cyan-400/25"
                    >
                      <p className="text-2xl font-bold text-white">{word.word}</p>
                      <p className="mt-0.5 font-mono text-sm text-cyan-300/90">{word.reading}</p>
                      <p className="mt-2 text-sm text-slate-300">{word.meaning}</p>
                      {word.example ? (
                        <p className="mt-2 rounded-lg border border-white/5 bg-black/30 px-2 py-1.5 text-xs text-slate-400 italic">
                          {word.example}
                        </p>
                      ) : null}
                    </article>
                  ))}
                </div>
                {vocabPageCount > 1 ? (
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      disabled={effectiveVocabPage <= 0}
                      onClick={() => setVocabPage((p) => Math.max(0, p - 1))}
                      className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-slate-200 disabled:opacity-35"
                    >
                      ← Prev
                    </button>
                    <button
                      type="button"
                      disabled={effectiveVocabPage >= vocabPageCount - 1}
                      onClick={() => setVocabPage((p) => Math.min(vocabPageCount - 1, p + 1))}
                      className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-slate-200 disabled:opacity-35"
                    >
                      Next →
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        )}

        {activeTab === "grammar" && showGrammar && (
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-fuchsia-400/30 bg-gradient-to-br from-fuchsia-500/20 to-transparent text-fuchsia-300">
                <PenIcon className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-white sm:text-2xl">Grammar</h2>
                <p className="text-sm text-slate-500">{grammar.length} patterns</p>
              </div>
            </div>
            <div className="grid gap-3">
              {grammar.map((item, index) => (
                <article
                  key={`${item.pattern}-${index}`}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
                >
                  <p className="text-lg font-bold text-fuchsia-100">{item.pattern}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.meaning}</p>
                  <p className="mt-3 rounded-xl border border-white/5 bg-black/30 px-3 py-2 text-sm text-slate-400">
                    {item.example}
                  </p>
                </article>
              ))}
            </div>
            {grammar.length === 0 ? (
              <p className="mt-4 rounded-2xl border border-dashed border-violet-400/25 px-4 py-8 text-center text-sm text-slate-400">
                No grammar patterns yet.
              </p>
            ) : null}
          </div>
        )}

        {activeTab === "reading" && showReading && (
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/20 to-transparent text-emerald-300">
                <ScrollIcon className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-white sm:text-2xl">Reading</h2>
                <p className="text-sm text-slate-500">{reading.length} passage(s)</p>
              </div>
            </div>
            <div className="grid gap-4">
              {reading.map((item, index) => (
                <ReadingCard key={`${item.title}-${index}`} item={item} />
              ))}
            </div>
            {reading.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-emerald-400/25 px-4 py-8 text-center text-sm text-slate-400">
                No reading passages yet.
              </p>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
}
