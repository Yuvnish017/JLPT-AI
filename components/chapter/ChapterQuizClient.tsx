"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { chapterIncludes, includedArray } from "@/lib/chapterIncludes";
import type { Lesson, QuizQuestion } from "@/types/lesson";

export type ChapterQuizClientProps = {
  rawLesson: Record<string, unknown>;
  lesson: Lesson;
  chapterBase: string;
  levelHubPath: string;
};

const XP_PER_CORRECT = 18;
const PERFECT_BONUS_XP = 40;
const REVEAL_MS = 1100;

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const questionVariantsFull = {
  enter: { x: 56, opacity: 0, scale: 0.96, filter: "blur(6px)" },
  center: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { x: -56, opacity: 0, scale: 0.96, filter: "blur(6px)" },
};

const questionVariantsReduced = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function ChapterQuizClient({
  rawLesson,
  lesson,
  chapterBase,
  levelHubPath,
}: ChapterQuizClientProps) {
  const reduceMotion = useReducedMotion();
  const quiz: QuizQuestion[] = includedArray(rawLesson, "quiz", lesson, (l) => l.quiz);
  const total = quiz.length;

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [finished, setFinished] = useState(false);
  const [xpBurst, setXpBurst] = useState<{ id: number; amount: number; label: string } | null>(
    null,
  );
  const timerRef = useRef<number | null>(null);
  const confettiFired = useRef(false);

  const question = quiz[index];
  const progressPct =
    total === 0 ? 0 : Math.min(100, Math.round(((index + (revealed ? 0.35 : 0)) / total) * 100));

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const showXpPopup = useCallback((amount: number, label: string) => {
    const id = Date.now();
    setXpBurst({ id, amount, label });
    window.setTimeout(() => setXpBurst((b) => (b?.id === id ? null : b)), 2400);
  }, []);

  const advance = useCallback(() => {
    clearTimer();
    setSelected(null);
    setRevealed(false);
    setIndex((i) => {
      if (i + 1 >= total) {
        setFinished(true);
        return i;
      }
      return i + 1;
    });
  }, [clearTimer, total]);

  const handlePick = useCallback(
    (option: string) => {
      if (revealed || !question || finished) return;
      setSelected(option);
      setRevealed(true);
      const correct = option === question.answer;
      if (correct) {
        setScore((s) => s + 1);
        setTotalXp((x) => x + XP_PER_CORRECT);
        showXpPopup(XP_PER_CORRECT, "Nice!");
      }

      timerRef.current = window.setTimeout(() => {
        if (correct && index + 1 >= total && score + 1 === total) {
          setTotalXp((x) => x + PERFECT_BONUS_XP);
          showXpPopup(PERFECT_BONUS_XP, "Perfect bonus!");
        }
        advance();
      }, REVEAL_MS);
    },
    [advance, finished, index, question, revealed, showXpPopup, score, total],
  );

  useEffect(() => () => clearTimer(), [clearTimer]);

  useEffect(() => {
    if (!finished || confettiFired.current) return;
    if (score !== total || total === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    confettiFired.current = true;
    let canceled = false;
    import("canvas-confetti").then((mod) => {
      if (canceled) return;
      const confetti = mod.default;
      const burst = () =>
        confetti({
          particleCount: 110,
          spread: 76,
          startVelocity: 38,
          ticks: 200,
          gravity: 0.95,
          origin: { x: 0.5, y: 0.65 },
          colors: ["#22d3ee", "#e879f9", "#a78bfa", "#fbbf24", "#34d399"],
        });
      burst();
      window.setTimeout(() => {
        if (!canceled) burst();
      }, 220);
    });
    return () => {
      canceled = true;
    };
  }, [finished, score, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (finished || !question || revealed) return;
      const t = e.target;
      if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement) return;

      const opts = question.options;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= opts.length) {
        e.preventDefault();
        handlePick(opts[n - 1]!);
        return;
      }
      const idx = opts.findIndex((o) => o.toLowerCase().startsWith(e.key.toLowerCase()));
      if (idx >= 0 && opts.length <= 4) {
        e.preventDefault();
        handlePick(opts[idx]!);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finished, handlePick, question, revealed]);

  const qVariants = reduceMotion ? questionVariantsReduced : questionVariantsFull;

  if (total === 0) {
    const noQuizBlock = !chapterIncludes(rawLesson, "quiz");
    return (
      <div className="relative min-h-screen bg-slate-950 px-6 py-16 text-center text-slate-300">
        <p className="text-lg font-semibold text-white">No quiz</p>
        <p className="mt-2 text-sm">
          {noQuizBlock
            ? "This chapter does not include a quiz. Add a quiz array to the chapter JSON to enable the quiz."
            : "This chapter has no quiz questions yet."}
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

  if (finished) {
    const perfect = score === total;
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
        <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
          <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-fuchsia-600/25 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-[100px]" />
        </div>

        <motion.main
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-12 text-center sm:px-6"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className={`rounded-3xl border px-6 py-10 sm:px-10 ${
              perfect
                ? "border-fuchsia-400/40 bg-gradient-to-br from-fuchsia-500/15 via-slate-900/80 to-cyan-500/15 shadow-2xl shadow-fuchsia-500/20"
                : "border-white/15 bg-slate-900/70"
            }`}
          >
            {perfect ? (
              <p className="text-[10px] font-black tracking-[0.35em] text-fuchsia-200 uppercase">
                Perfect run
              </p>
            ) : (
              <p className="text-[10px] font-bold tracking-[0.25em] text-slate-400 uppercase">
                Quiz clear
              </p>
            )}
            <h1 className="mt-3 text-3xl font-black sm:text-4xl">
              <span className="bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-violet-200 bg-clip-text text-transparent">
                {perfect ? "満点！" : "お疲れ様！"}
              </span>
            </h1>
            <p className="mt-4 text-4xl font-black tabular-nums text-white sm:text-5xl">
              {score}
              <span className="text-xl font-bold text-slate-500 sm:text-2xl"> / {total}</span>
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Total XP this run:{" "}
              <span className="font-bold text-cyan-300 tabular-nums">{totalXp}</span>
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => {
                  confettiFired.current = false;
                  window.location.assign(`${chapterBase}/quiz`);
                }}
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-slate-100 transition hover:border-cyan-400/40 hover:bg-cyan-500/10"
              >
                Retry quiz
              </button>
              <Link
                href={`${chapterBase}/flashcards`}
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-slate-100 transition hover:border-fuchsia-400/40 hover:bg-fuchsia-500/10"
              >
                Flashcards
              </Link>
              <Link
                href={chapterBase}
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-fuchsia-500/25"
              >
                Back to lesson
              </Link>
            </div>
          </motion.div>
        </motion.main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-500/15 blur-[100px]" />
        <div className="absolute bottom-1/4 left-0 h-80 w-80 rounded-full bg-fuchsia-600/15 blur-[100px]" />
      </div>

      <AnimatePresence>
        {xpBurst ? (
          <motion.div
            key={xpBurst.id}
            role="status"
            initial={{ opacity: 0, y: 28, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
            className="pointer-events-none fixed bottom-24 left-1/2 z-50 -translate-x-1/2 sm:bottom-28"
          >
            <div className="relative overflow-hidden rounded-2xl border border-cyan-400/40 bg-slate-950/95 px-6 py-3 shadow-2xl shadow-cyan-500/30 backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-fuchsia-500/15 to-violet-500/20" />
              <p className="relative text-center text-[10px] font-bold tracking-[0.2em] text-cyan-200 uppercase">
                {xpBurst.label}
              </p>
              <p className="relative text-center text-2xl font-black tabular-nums text-white">
                +{xpBurst.amount} XP
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl flex-col gap-3 px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <Link
                href="/"
                className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-[10px] font-bold tracking-widest text-cyan-200 uppercase transition hover:border-fuchsia-400/40"
              >
                Home
              </Link>
              <Link
                href={levelHubPath}
                className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-[10px] font-bold tracking-widest text-slate-300 uppercase transition hover:border-white/25"
              >
                {lesson.jlpt}
              </Link>
              <Link
                href={chapterBase}
                className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-[10px] font-bold tracking-widest text-slate-300 uppercase transition hover:border-white/25"
              >
                Lesson
              </Link>
              <Link
                href={`${chapterBase}/flashcards`}
                className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-[10px] font-bold tracking-widest text-slate-300 uppercase transition hover:border-white/25"
              >
                Cards
              </Link>
            </div>
            <span className="text-[10px] font-semibold tracking-[0.2em] text-fuchsia-300/90 uppercase">
              Quiz arc
            </span>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              <span>Progress</span>
              <span className="tabular-nums text-cyan-300">
                {index + 1} / {total}
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-white/10 shadow-inner"
              role="progressbar"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Quiz progress"
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-400 shadow-[0_0_18px_rgba(217,70,239,0.45)]"
                initial={false}
                animate={{ width: `${progressPct}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 28 }}
              />
            </div>
          </div>
          <p className="text-[10px] text-slate-500">
            Keys 1–{question.options.length} · tap an answer
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-28 pt-8 sm:px-6 sm:pb-32 sm:pt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            variants={qVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 32,
              mass: 0.9,
            }}
            className="relative"
          >
            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-cyan-500/20 via-fuchsia-500/15 to-violet-600/20 opacity-80 blur-2xl motion-reduce:opacity-40" />

            <div className="rounded-3xl border border-white/12 bg-slate-900/70 p-5 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-8">
              <p className="text-[10px] font-bold tracking-[0.25em] text-fuchsia-300/90 uppercase">
                Question
              </p>
              <h2 className="mt-3 text-pretty text-xl font-bold leading-snug text-white sm:text-2xl">
                {question.question}
              </h2>

              <ul className="mt-8 flex flex-col gap-3">
                {question.options.map((option, i) => {
                  const isCorrect = option === question.answer;
                  const isPicked = option === selected;
                  let tone =
                    "border-white/10 bg-slate-950/50 text-slate-100 hover:border-cyan-400/35 hover:bg-cyan-500/5";
                  if (revealed) {
                    if (isCorrect) {
                      tone =
                        "border-emerald-400/50 bg-emerald-500/15 text-emerald-50 shadow-[0_0_24px_rgba(52,211,153,0.2)]";
                    } else if (isPicked) {
                      tone =
                        "border-rose-500/55 bg-rose-500/15 text-rose-50 shadow-[0_0_20px_rgba(244,63,94,0.18)]";
                    } else {
                      tone = "border-white/5 bg-slate-950/30 text-slate-500";
                    }
                  }

                  return (
                    <li key={`${option}-${i}`}>
                      <motion.button
                        type="button"
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: reduceMotion ? 0 : i * 0.05, duration: 0.25 }}
                        onClick={() => handlePick(option)}
                        disabled={revealed}
                        className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm font-semibold transition disabled:cursor-default sm:py-4 sm:text-base ${tone} ${
                          revealed && isPicked && !isCorrect ? "motion-safe:animate-quiz-shake" : ""
                        }`}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-xs font-black text-cyan-200 tabular-nums sm:h-10 sm:w-10">
                          {i + 1}
                        </span>
                        <span className="flex-1">{option}</span>
                        {revealed && isCorrect ? (
                          <CheckIcon className="h-6 w-6 shrink-0 text-emerald-300" />
                        ) : null}
                        {revealed && isPicked && !isCorrect ? (
                          <XIcon className="h-6 w-6 shrink-0 text-rose-300" />
                        ) : null}
                      </motion.button>
                    </li>
                  );
                })}
              </ul>

              <AnimatePresence>
                {revealed && selected && selected !== question.answer ? (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0 }}
                    className="mt-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
                  >
                    <span className="font-bold text-emerald-300">Answer: </span>
                    {question.answer}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
