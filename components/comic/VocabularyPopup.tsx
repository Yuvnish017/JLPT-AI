"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Vocabulary } from "@/types/lesson";

export type VocabularyPopupProps = {
  vocab: Vocabulary | null;
  onClose: () => void;
  onAddToReview: (vocab: Vocabulary) => void;
  added: boolean;
};

export default function VocabularyPopup({
  vocab,
  onClose,
  onAddToReview,
  added,
}: VocabularyPopupProps) {
  return (
    <AnimatePresence>
      {vocab ? (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm"
            aria-label="Close vocabulary popup"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="vocab-popup-title"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 rounded-t-3xl border border-cyan-400/30 bg-slate-900 p-6 shadow-2xl shadow-cyan-500/20 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:rounded-3xl"
          >
            <p className="text-[10px] font-bold tracking-[0.25em] text-cyan-300 uppercase">
              Vocabulary
            </p>
            <h3 id="vocab-popup-title" className="mt-2 text-3xl font-black text-white">
              {vocab.word}
            </h3>
            <p className="mt-1 text-lg text-fuchsia-200">{vocab.reading}</p>
            <p className="mt-3 text-base text-slate-200">{vocab.meaning}</p>
            {vocab.example ? (
              <p className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
                <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  Example
                </span>
                <br />
                {vocab.example}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                disabled
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-400"
                title="Audio coming soon"
              >
                🔊 Play (soon)
              </button>
              <button
                type="button"
                onClick={() => onAddToReview(vocab)}
                disabled={added}
                className="flex-1 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-4 py-2.5 text-sm font-black text-slate-950 disabled:opacity-60"
              >
                {added ? "Added to review ✓" : "Add to review"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-bold text-slate-300"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
