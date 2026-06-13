"use client";

import { motion } from "framer-motion";
import type { ReviewItem, ReviewItemType } from "@/types/review";

type ReviewCardProps = {
  item: ReviewItem;
  revealed: boolean;
  onReveal: () => void;
};

const TYPE_STYLES: Record<
  ReviewItemType,
  { label: string; accent: string; glow: string; short: string }
> = {
  vocabulary: {
    label: "Vocabulary",
    short: "語彙",
    accent: "border-cyan-400/35 bg-cyan-500/10 text-cyan-200",
    glow: "from-cyan-500/20 via-fuchsia-500/10 to-violet-500/15",
  },
  kanji: {
    label: "Kanji",
    short: "漢字",
    accent: "border-amber-400/35 bg-amber-500/10 text-amber-200",
    glow: "from-amber-500/20 via-orange-500/10 to-yellow-500/10",
  },
  grammar: {
    label: "Grammar",
    short: "文法",
    accent: "border-fuchsia-400/35 bg-fuchsia-500/10 text-fuchsia-200",
    glow: "from-fuchsia-500/20 via-violet-500/10 to-cyan-500/10",
  },
};

export default function ReviewCard({ item, revealed, onReveal }: ReviewCardProps) {
  const style = TYPE_STYLES[item.itemType];

  return (
    <motion.article
      layout
      className="relative w-full max-w-lg"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className={`pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br ${style.glow} opacity-80 blur-2xl motion-reduce:opacity-40`}
        aria-hidden
      />

      <div className="rounded-3xl border border-white/12 bg-slate-900/75 p-6 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`rounded-full border px-3 py-1 text-[10px] font-bold tracking-[0.18em] uppercase ${style.accent}`}
          >
            {style.short} · {style.label}
          </span>
          <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
            {item.lessonId.replace("/", " · ")}
          </span>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-bold tracking-[0.25em] text-slate-500 uppercase">
            Recall this
          </p>
          <h2
            className={`mt-3 font-black text-white ${
              item.itemType === "kanji" ? "text-5xl sm:text-6xl" : "text-2xl sm:text-3xl"
            }`}
          >
            {item.payload.prompt}
          </h2>
          {item.payload.hint ? (
            <p className="mt-3 font-mono text-lg text-violet-200/90">{item.payload.hint}</p>
          ) : null}
        </div>

        {revealed ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-8 overflow-hidden rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-4 text-center"
          >
            <p className="text-[10px] font-bold tracking-[0.2em] text-emerald-300 uppercase">
              Answer
            </p>
            <p className="mt-2 text-xl font-bold text-emerald-50 sm:text-2xl">{item.payload.answer}</p>
            {item.payload.detail ? (
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.payload.detail}</p>
            ) : null}
          </motion.div>
        ) : (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={onReveal}
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-8 py-3 text-sm font-black text-slate-950 shadow-lg shadow-fuchsia-500/25 transition hover:scale-[1.02]"
            >
              Reveal Answer
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-center gap-4 text-[10px] text-slate-500 tabular-nums">
          <span>Mistakes · {item.mistakes}</span>
          <span>Correct streak · {item.timesCorrect}</span>
        </div>
      </div>
    </motion.article>
  );
}

export function ReviewTypeIcon({ type }: { type: ReviewItemType }) {
  const icons = { vocabulary: "語", kanji: "漢", grammar: "文" };
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-sm font-black text-cyan-200">
      {icons[type]}
    </span>
  );
}
