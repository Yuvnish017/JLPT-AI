"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useReview } from "@/hooks/useReview";

export default function ReviewDashboardWidget() {
  const { dueCounts, summary } = useReview();
  const hasDue = dueCounts.total > 0;

  return (
    <div className="rounded-2xl border border-violet-400/25 bg-gradient-to-br from-violet-500/10 via-slate-900/40 to-cyan-500/10 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-violet-200 uppercase">
            Review Center
          </p>
          <p className="mt-1 text-2xl font-black tabular-nums text-white">{dueCounts.total}</p>
          <p className="text-xs text-slate-400">reviews due today</p>
        </div>
        {hasDue ? (
          <motion.span
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
            className="rounded-full border border-orange-400/40 bg-orange-500/15 px-2.5 py-1 text-[10px] font-bold text-orange-200"
          >
            Due now
          </motion.span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-bold tabular-nums">
        <span className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-2 py-0.5 text-cyan-200">
          語 {dueCounts.vocabulary}
        </span>
        <span className="rounded-full border border-amber-400/25 bg-amber-500/10 px-2 py-0.5 text-amber-200">
          漢 {dueCounts.kanji}
        </span>
        <span className="rounded-full border border-fuchsia-400/25 bg-fuchsia-500/10 px-2 py-0.5 text-fuchsia-200">
          文 {dueCounts.grammar}
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-slate-400">
          {summary.totalItems} tracked
        </span>
      </div>

      <Link
        href={hasDue ? "/review/session" : "/review"}
        className={`mt-4 inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold transition ${
          hasDue
            ? "bg-gradient-to-r from-violet-400 to-fuchsia-500 text-slate-950 shadow-md shadow-fuchsia-500/20 hover:scale-[1.01]"
            : "border border-white/15 bg-white/5 text-slate-300 hover:border-white/25"
        }`}
      >
        {hasDue ? "Start Review →" : "Open Review Center"}
      </Link>
    </div>
  );
}
