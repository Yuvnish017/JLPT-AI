"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import type { Grammar, Vocabulary } from "@/types/lesson";

export type ComicCompletionDialogProps = {
  open: boolean;
  title: string;
  vocabulary: Vocabulary[];
  grammar: Grammar[];
  readingSeconds: number;
  xpEarned: number;
  levelHubPath: string;
  levelLabel: string;
  comicsPath: string;
  onClose: () => void;
};

function formatReadingTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

export default function ComicCompletionDialog({
  open,
  title,
  vocabulary,
  grammar,
  readingSeconds,
  xpEarned,
  levelHubPath,
  levelLabel,
  comicsPath,
  onClose,
}: ComicCompletionDialogProps) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-emerald-400/30 bg-slate-900 p-6 shadow-2xl shadow-emerald-500/20 sm:p-8"
          >
            <p className="text-[10px] font-bold tracking-[0.3em] text-emerald-300 uppercase">
              Story complete!
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">{title}</h2>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-cyan-400/25 bg-cyan-500/10 p-3 text-center">
                <p className="text-2xl font-black text-cyan-200">{vocabulary.length}</p>
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Vocabulary
                </p>
              </div>
              <div className="rounded-xl border border-violet-400/25 bg-violet-500/10 p-3 text-center">
                <p className="text-2xl font-black text-violet-200">{grammar.length}</p>
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Grammar
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                <p className="text-lg font-black text-white">{formatReadingTime(readingSeconds)}</p>
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Reading time
                </p>
              </div>
              <div className="rounded-xl border border-fuchsia-400/25 bg-fuchsia-500/10 p-3 text-center">
                <p className="text-2xl font-black text-fuchsia-200">+{xpEarned}</p>
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  XP earned
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Link
                href={comicsPath}
                className="flex-1 rounded-xl border border-white/15 py-2.5 text-center text-sm font-bold text-slate-200"
              >
                More comics
              </Link>
              <Link
                href={levelHubPath}
                className="flex-1 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 py-2.5 text-center text-sm font-black text-slate-950"
              >
                Back to {levelLabel}
              </Link>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
