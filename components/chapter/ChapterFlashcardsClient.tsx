"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Flashcard from "@/components/Flashcard";
import { chapterIncludes, includedArray } from "@/lib/chapterIncludes";
import type { Lesson } from "@/types/lesson";

export type ChapterFlashcardsClientProps = {
  rawLesson: Record<string, unknown>;
  lesson: Lesson;
  chapterBase: string;
  levelHubPath: string;
};

const CHEERS = [
  "Level up that memory! ✨",
  "Your brain is glowing today.",
  "One more step on the JLPT arc.",
  "That recall? Chef's kiss.",
  "Keep the streak alive!",
  "You're in the zone — stay there.",
];

const FLIP_NUDGES = [
  "Peek the meaning when you're ready.",
  "Flip when the kanji feels familiar.",
  "Trust the process — flip away.",
];

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

const slideVariantsFull = {
  enter: (dir: number) => ({
    x: dir > 0 ? 110 : -110,
    opacity: 0,
    scale: 0.94,
    filter: "blur(4px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -110 : 110,
    opacity: 0,
    scale: 0.94,
    filter: "blur(4px)",
  }),
};

const slideVariantsReduced = {
  enter: () => ({ opacity: 0 }),
  center: { opacity: 1 },
  exit: () => ({ opacity: 0 }),
};

export default function ChapterFlashcardsClient({
  rawLesson,
  lesson,
  chapterBase,
  levelHubPath,
}: ChapterFlashcardsClientProps) {
  const reduceMotion = useReducedMotion();
  const vocabulary = includedArray(rawLesson, "vocabulary", lesson, (l) => l.vocabulary);
  const total = vocabulary.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const indexRef = useRef(0);

  useLayoutEffect(() => {
    indexRef.current = currentIndex;
  }, [currentIndex]);
  const [direction, setDirection] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [cheer, setCheer] = useState<string | null>(null);
  const [flipNudge, setFlipNudge] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const slideVariants = reduceMotion ? slideVariantsReduced : slideVariantsFull;

  const currentWord = vocabulary[currentIndex];
  const progressPct = total > 0 ? Math.round(((currentIndex + 1) / total) * 100) : 0;

  const showCheer = useCallback(() => {
    setCheer(randomPick(CHEERS));
    window.setTimeout(() => setCheer(null), 2200);
  }, []);

  const showFlipNudge = useCallback(() => {
    setFlipNudge(randomPick(FLIP_NUDGES));
    window.setTimeout(() => setFlipNudge(null), 2000);
  }, []);

  const goNext = useCallback(() => {
    const i = indexRef.current;
    if (i >= total - 1) return;
    indexRef.current = i + 1;
    setDirection(1);
    setFlipped(false);
    setCurrentIndex(i + 1);
    showCheer();
  }, [total, showCheer]);

  const goPrev = useCallback(() => {
    const i = indexRef.current;
    if (i <= 0) return;
    indexRef.current = i - 1;
    setDirection(-1);
    setFlipped(false);
    setCurrentIndex(i - 1);
    showCheer();
  }, [showCheer]);

  const toggleFlip = useCallback(() => {
    setFlipped((f) => !f);
    showFlipNudge();
  }, [showFlipNudge]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target;
      if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement) return;

      if (e.code === "Space") {
        e.preventDefault();
        toggleFlip();
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goNext();
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, toggleFlip]);

  const canNext = currentIndex < total - 1;
  const canPrev = currentIndex > 0;

  const hintLine = useMemo(() => {
    if (total === 0) return "Add vocabulary to start.";
    return "Space flip · ← → cards · swipe";
  }, [total]);

  if (total === 0 || !currentWord) {
    const noBlock = !chapterIncludes(rawLesson, "vocabulary");
    return (
      <div className="relative min-h-screen bg-slate-950 px-6 py-16 text-center text-slate-300">
        <p className="text-lg font-semibold text-white">No flashcards</p>
        <p className="mt-2 text-sm">
          {noBlock
            ? "This chapter does not include a vocabulary list. Add a vocabulary array to the chapter JSON to enable flashcards."
            : "This chapter has no vocabulary entries yet."}
        </p>
        <Link
          href={chapterBase}
          className="mt-8 inline-block rounded-xl border border-white/15 px-5 py-2 text-sm text-cyan-200 transition hover:bg-white/10"
        >
          Back to lesson
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute left-1/4 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-600/20 blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 h-80 w-80 rounded-full bg-cyan-500/15 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-violet-600/20 blur-[90px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg flex-col gap-3 px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <Link
                href={levelHubPath}
                className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-[10px] font-bold tracking-widest text-slate-300 uppercase transition hover:border-white/25"
              >
                {lesson.jlpt}
              </Link>
              <Link
                href={chapterBase}
                className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-[10px] font-bold tracking-widest text-cyan-200 uppercase transition hover:border-fuchsia-400/40"
              >
                ← Lesson
              </Link>
              <Link
                href={`${chapterBase}/quiz`}
                className="rounded-lg border border-fuchsia-400/30 bg-fuchsia-500/10 px-2.5 py-1.5 text-[10px] font-bold tracking-widest text-fuchsia-200 uppercase transition hover:border-fuchsia-400/50"
              >
                Quiz →
              </Link>
            </div>
            <span className="text-right text-[10px] font-semibold tracking-[0.2em] text-fuchsia-300/90 uppercase">
              Flash arc
            </span>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              <span>Progress</span>
              <span className="tabular-nums text-cyan-300">
                {currentIndex + 1} / {total}
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-white/10 shadow-inner shadow-black/40"
              role="progressbar"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Flashcard deck progress"
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-400 shadow-[0_0_20px_rgba(217,70,239,0.45)]"
                initial={false}
                animate={{ width: `${progressPct}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 28 }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-lg flex-col items-center px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
        <motion.h1
          className="text-center text-2xl font-black sm:text-3xl"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <span className="bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-violet-200 bg-clip-text text-transparent">
            {lesson.title}
          </span>
        </motion.h1>
        <p className="mt-2 text-center text-xs text-slate-500 sm:text-sm">{hintLine}</p>

        <div className="relative mt-8 min-h-[4.5rem] w-full">
          <AnimatePresence mode="wait">
            {cheer ? (
              <motion.p
                key={cheer}
                role="status"
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ type: "spring", stiffness: 380, damping: 24 }}
                className="text-center text-sm font-semibold text-fuchsia-200/95"
              >
                {cheer}
              </motion.p>
            ) : flipNudge ? (
              <motion.p
                key={flipNudge}
                role="status"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-xs text-cyan-200/90 sm:text-sm"
              >
                {flipNudge}
              </motion.p>
            ) : (
              <p className="text-center text-xs text-slate-600 sm:text-sm">
                {dragging ? "Release to snap or change card…" : "\u00a0"}
              </p>
            )}
          </AnimatePresence>
        </div>

        <div className="relative mt-4 w-full">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 30,
                mass: 0.85,
              }}
              className="flex justify-center"
            >
              <Flashcard
                word={currentWord.word}
                reading={currentWord.reading}
                meaning={currentWord.meaning}
                example={currentWord.example != null ? String(currentWord.example) : undefined}
                flipped={flipped}
                onFlip={toggleFlip}
                onSwipeNext={() => {
                  if (canNext) goNext();
                }}
                onSwipePrev={() => {
                  if (canPrev) goPrev();
                }}
                onDragStart={() => setDragging(true)}
                onDragEnd={() => setDragging(false)}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex w-full max-w-md flex-wrap items-center justify-center gap-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            onClick={goPrev}
            disabled={!canPrev}
            className="min-w-[7rem] rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-slate-200 transition enabled:hover:border-cyan-400/40 enabled:hover:bg-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-35"
          >
            ← Prev
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            onClick={toggleFlip}
            className="min-w-[7rem] rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-fuchsia-500/25 transition hover:shadow-fuchsia-500/40"
          >
            Flip
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            onClick={goNext}
            disabled={!canNext}
            className="min-w-[7rem] rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-slate-200 transition enabled:hover:border-fuchsia-400/40 enabled:hover:bg-fuchsia-500/10 disabled:cursor-not-allowed disabled:opacity-35"
          >
            Next →
          </motion.button>
        </div>
      </main>
    </div>
  );
}
