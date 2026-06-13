"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import ReviewCard from "@/components/review/ReviewCard";
import ProgressHud from "@/components/progress/ProgressHud";
import { getDueReviewItems, recordReviewAnswer } from "@/lib/review";
import type { ReviewItem } from "@/types/review";

const cardVariantsFull = {
  enter: { x: 48, opacity: 0, scale: 0.96 },
  center: { x: 0, opacity: 1, scale: 1 },
  exit: { x: -48, opacity: 0, scale: 0.96 },
};

const cardVariantsReduced = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function ReviewSessionClient() {
  const reduceMotion = useReducedMotion();
  const [sessionItems, setSessionItems] = useState<ReviewItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setSessionItems(getDueReviewItems());
    setLoaded(true);
  }, []);

  const current = sessionItems[index];
  const total = sessionItems.length;
  const progressPct = total === 0 ? 100 : Math.round((index / total) * 100);

  const advance = useCallback(() => {
    setRevealed(false);
    if (index + 1 >= total) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
  }, [index, total]);

  const handleAnswer = useCallback(
    (wasCorrect: boolean) => {
      if (!current || !revealed) return;
      recordReviewAnswer(current.itemId, wasCorrect);
      if (wasCorrect) setCorrectCount((c) => c + 1);
      else setIncorrectCount((c) => c + 1);
      advance();
    },
    [advance, current, revealed],
  );

  const variants = reduceMotion ? cardVariantsReduced : cardVariantsFull;

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading review session…
      </div>
    );
  }

  if (sessionItems.length === 0 && !finished) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-slate-100">
        <p className="text-4xl" aria-hidden>
          ✨
        </p>
        <h1 className="mt-4 text-2xl font-black text-white">Nothing due right now</h1>
        <p className="mt-2 max-w-sm text-sm text-slate-400">
          Check back tomorrow or keep studying chapters to build your review queue.
        </p>
        <Link
          href="/review"
          className="mt-8 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-6 py-3 text-sm font-black text-slate-950"
        >
          Back to Review Center
        </Link>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
        <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
          <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-600/20 blur-[120px]" />
        </div>
        <motion.main
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-12 text-center"
        >
          <div className="rounded-3xl border border-emerald-400/35 bg-gradient-to-br from-emerald-500/15 via-slate-900/80 to-cyan-500/10 px-8 py-10 shadow-2xl">
            <p className="text-[10px] font-black tracking-[0.35em] text-emerald-200 uppercase">
              Session complete
            </p>
            <h1 className="mt-3 text-3xl font-black sm:text-4xl">
              <span className="bg-gradient-to-r from-cyan-200 to-emerald-200 bg-clip-text text-transparent">
                復習完了！
              </span>
            </h1>
            <p className="mt-4 text-sm text-slate-400">You reviewed {total} item{total === 1 ? "" : "s"} today.</p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3">
                <p className="text-2xl font-black text-emerald-200 tabular-nums">{correctCount}</p>
                <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Correct</p>
              </div>
              <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3">
                <p className="text-2xl font-black text-rose-200 tabular-nums">{incorrectCount}</p>
                <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Wrong</p>
              </div>
            </div>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/review"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold transition hover:border-cyan-400/40"
              >
                Review Center
              </Link>
              <Link
                href="/"
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-fuchsia-500/25"
              >
                Home
              </Link>
            </div>
          </div>
        </motion.main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-fuchsia-600/15 blur-[100px]" />
        <div className="absolute bottom-1/4 left-0 h-80 w-80 rounded-full bg-cyan-500/15 blur-[100px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link
              href="/review"
              className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-[10px] font-bold tracking-widest text-cyan-200 uppercase transition hover:border-fuchsia-400/40"
            >
              ← Review
            </Link>
            <ProgressHud compact />
          </div>
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              <span>Session progress</span>
              <span className="tabular-nums text-cyan-300">
                {index + 1} / {total}
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-white/10"
              role="progressbar"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-400"
                initial={false}
                animate={{ width: `${progressPct}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 28 }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col items-center px-4 pb-32 pt-10 sm:px-6">
        <AnimatePresence mode="wait">
          {current ? (
            <motion.div
              key={current.itemId}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="w-full"
            >
              <ReviewCard item={current} revealed={revealed} onReveal={() => setRevealed(true)} />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {revealed ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex w-full max-w-lg flex-col gap-3 sm:flex-row"
          >
            <button
              type="button"
              onClick={() => handleAnswer(false)}
              className="flex-1 rounded-xl border border-rose-500/45 bg-rose-500/15 px-4 py-3.5 text-sm font-bold text-rose-100 transition hover:border-rose-400/60 hover:bg-rose-500/25"
            >
              I Got It Wrong
            </button>
            <button
              type="button"
              onClick={() => handleAnswer(true)}
              className="flex-1 rounded-xl border border-emerald-500/45 bg-emerald-500/15 px-4 py-3.5 text-sm font-bold text-emerald-100 transition hover:border-emerald-400/60 hover:bg-emerald-500/25"
            >
              I Got It Correct
            </button>
          </motion.div>
        ) : null}
      </main>
    </div>
  );
}
