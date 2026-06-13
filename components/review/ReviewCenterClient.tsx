"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ProgressHud from "@/components/progress/ProgressHud";
import { useReview } from "@/hooks/useReview";

const TYPE_ROWS = [
  { key: "vocabulary" as const, label: "Vocabulary", short: "語彙", emoji: "📖", tone: "cyan" },
  { key: "kanji" as const, label: "Kanji", short: "漢字", emoji: "㊗", tone: "amber" },
  { key: "grammar" as const, label: "Grammar", short: "文法", emoji: "✍", tone: "fuchsia" },
];

const TONE_CLASSES = {
  cyan: "border-cyan-400/30 bg-cyan-500/10 text-cyan-200",
  amber: "border-amber-400/30 bg-amber-500/10 text-amber-200",
  fuchsia: "border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-200",
};

export default function ReviewCenterClient() {
  const { dueCounts, summary } = useReview();
  const hasDue = dueCounts.total > 0;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute left-1/4 top-0 h-80 w-80 rounded-full bg-violet-600/20 blur-[110px]" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-[100px]" />
      </div>

      <header className="border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
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
        <p className="text-[10px] font-bold tracking-[0.3em] text-fuchsia-300/90 uppercase">
          Spaced repetition
        </p>
        <h1 className="mt-2 text-balance text-3xl font-black sm:text-4xl">
          <span className="bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-violet-200 bg-clip-text text-transparent">
            Review Center
          </span>
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
          Items you miss in quizzes are scheduled here. Review them on time to lock in long-term
          memory.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-3xl border border-white/12 bg-gradient-to-br from-slate-900/80 to-slate-950/60 p-6 shadow-xl sm:p-8"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.22em] text-slate-500 uppercase">
                Due today
              </p>
              <p className="mt-2 text-5xl font-black tabular-nums text-white sm:text-6xl">
                {dueCounts.total}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {summary.totalItems} items tracked · {summary.mastered} nearing mastery
              </p>
            </div>
            {hasDue ? (
              <Link
                href="/review/session"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-8 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-fuchsia-500/30 transition hover:scale-[1.02]"
              >
                Start Review Session →
              </Link>
            ) : (
              <span className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-bold text-slate-400">
                All caught up
              </span>
            )}
          </div>
        </motion.div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {TYPE_ROWS.map((row, i) => (
            <motion.div
              key={row.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-2xl border p-5 ${TONE_CLASSES[row.tone as keyof typeof TONE_CLASSES]}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl" aria-hidden>
                  {row.emoji}
                </span>
                <span className="text-3xl font-black tabular-nums text-white">
                  {dueCounts[row.key]}
                </span>
              </div>
              <p className="mt-3 text-sm font-bold text-white">{row.label}</p>
              <p className="text-[10px] tracking-[0.18em] uppercase opacity-70">{row.short}</p>
            </motion.div>
          ))}
        </div>

        {!hasDue ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 rounded-2xl border border-dashed border-emerald-400/25 bg-emerald-500/5 px-6 py-12 text-center"
          >
            <p className="text-4xl" aria-hidden>
              🎉
            </p>
            <h2 className="mt-4 text-xl font-bold text-emerald-100">No reviews due today</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
              You&apos;re all caught up! Miss a quiz question and it will appear here automatically,
              scheduled with spaced repetition.
            </p>
            <Link
              href="/n5"
              className="mt-8 inline-flex rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-slate-200 transition hover:border-cyan-400/40"
            >
              Continue learning →
            </Link>
          </motion.div>
        ) : (
          <section className="mt-10">
            <h2 className="text-lg font-bold text-white">How it works</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <span className="font-bold text-cyan-200">1 mistake</span> → review in 1 day
              </li>
              <li className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <span className="font-bold text-fuchsia-200">2 mistakes</span> → review in 3 days
              </li>
              <li className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <span className="font-bold text-violet-200">3+ mistakes</span> → review in 7 days
              </li>
              <li className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                Answer correctly during review to push the next date further out.
              </li>
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
