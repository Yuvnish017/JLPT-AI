"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export type XpGainToastProps = {
  burst: { id: number; amount: number; label: string } | null;
  className?: string;
};

export default function XpGainToast({ burst, className = "" }: XpGainToastProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {burst ? (
        <motion.div
          key={burst.id}
          role="status"
          aria-live="polite"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 32, scale: 0.82 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 420, damping: 26 }}
          className={`pointer-events-none fixed bottom-24 left-1/2 z-50 -translate-x-1/2 sm:bottom-28 ${className}`}
        >
          <div className="relative overflow-hidden rounded-2xl border border-cyan-400/45 bg-slate-950/95 px-7 py-3.5 shadow-2xl shadow-cyan-500/35 backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/25 via-fuchsia-500/20 to-violet-500/25" />
            {!reduceMotion ? (
              <>
                <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-cyan-300 motion-safe:animate-xp-spark" />
                <span className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-fuchsia-300 motion-safe:animate-xp-spark [animation-delay:120ms]" />
              </>
            ) : null}
            <p className="relative text-center text-[10px] font-bold tracking-[0.22em] text-cyan-200 uppercase">
              {burst.label}
            </p>
            <p className="relative text-center text-2xl font-black tabular-nums text-white motion-safe:animate-xp-pop">
              +{burst.amount} XP
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
