"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Grammar } from "@/types/lesson";

export type GrammarPopupProps = {
  grammar: Grammar | null;
  jlptLevel: string;
  onClose: () => void;
};

export default function GrammarPopup({ grammar, jlptLevel, onClose }: GrammarPopupProps) {
  return (
    <AnimatePresence>
      {grammar ? (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm"
            aria-label="Close grammar popup"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="grammar-popup-title"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 rounded-t-3xl border border-violet-400/30 bg-slate-900 p-6 shadow-2xl shadow-violet-500/20 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:rounded-3xl"
          >
            <p className="text-[10px] font-bold tracking-[0.25em] text-violet-300 uppercase">
              Grammar · {jlptLevel}
            </p>
            <h3 id="grammar-popup-title" className="mt-2 text-2xl font-black text-white">
              {grammar.pattern}
            </h3>
            <p className="mt-3 text-base text-slate-200">{grammar.meaning}</p>
            <p className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
              <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                Example
              </span>
              <br />
              {grammar.example}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-xl border border-white/15 px-4 py-2.5 text-sm font-bold text-slate-300"
            >
              Close
            </button>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
