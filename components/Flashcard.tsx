"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useCallback, useRef } from "react";

export interface FlashcardProps {
  word: string;
  reading: string;
  meaning: string;
  example?: string;
  flipped: boolean;
  onFlip: () => void;
  onSwipeNext: () => void;
  onSwipePrev: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

const SWIPE_THRESHOLD = 72;
const VELOCITY_THRESHOLD = 420;

export default function Flashcard({
  word,
  reading,
  meaning,
  example,
  flipped,
  onFlip,
  onSwipeNext,
  onSwipePrev,
  onDragStart,
  onDragEnd,
}: FlashcardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const rotateZ = useTransform(x, [-160, 160], [-6, 6]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onFlip();
      }
    },
    [onFlip],
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-md"
      style={{ perspective: 1200 }}
    >
      <div
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-cyan-500/35 via-fuchsia-500/25 to-violet-600/35 opacity-70 blur-2xl motion-reduce:opacity-40"
        aria-hidden
      />

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.65}
        style={{ x, rotateZ }}
        onDragStart={() => onDragStart?.()}
        onDragEnd={(_, info) => {
          onDragEnd?.();
          const { offset, velocity } = info;
          if (offset.x < -SWIPE_THRESHOLD || velocity.x < -VELOCITY_THRESHOLD) {
            onSwipeNext();
          } else if (offset.x > SWIPE_THRESHOLD || velocity.x > VELOCITY_THRESHOLD) {
            onSwipePrev();
          }
        }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
        className="touch-pan-y"
      >
        <motion.button
          type="button"
          layout
          onClick={() => onFlip()}
          onKeyDown={handleKeyDown}
          aria-pressed={flipped}
          aria-label={flipped ? "Show front of card" : "Show back of card"}
          className="relative w-full cursor-pointer rounded-[1.35rem] border border-white/15 bg-slate-950/40 p-[1px] text-left shadow-2xl shadow-fuchsia-900/20 outline-none transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-cyan-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <span
            className="pointer-events-none absolute inset-0 rounded-[1.35rem] bg-gradient-to-br from-cyan-400/25 via-fuchsia-500/20 to-violet-500/25 opacity-60 motion-reduce:opacity-35"
            aria-hidden
          />

          <motion.div
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 26,
              mass: 0.8,
            }}
            className="relative h-[min(22rem,70vw)] w-full [transform-style:preserve-3d]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[1.3rem] border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-950/95 px-6 py-8 text-center shadow-inner shadow-cyan-500/5"
              style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
            >
              <p className="text-[0.65rem] font-bold tracking-[0.35em] text-cyan-300/90 uppercase">
                Front
              </p>
              <p className="text-5xl font-black tracking-tight text-white drop-shadow-[0_0_28px_rgba(34,211,238,0.35)] sm:text-6xl">
                {word}
              </p>
              <p className="font-mono text-lg text-fuchsia-200/90 sm:text-xl">{reading}</p>
              <p className="mt-4 text-[11px] text-slate-500">
                Space to flip · swipe to change card
              </p>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[1.3rem] border border-fuchsia-400/25 bg-gradient-to-br from-slate-900 via-violet-950/80 to-slate-950 px-6 py-8 text-center shadow-inner shadow-fuchsia-500/10"
              style={{
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <p className="text-[0.65rem] font-bold tracking-[0.35em] text-fuchsia-300/90 uppercase">
                Meaning
              </p>
              <p className="bg-gradient-to-r from-cyan-200 via-white to-fuchsia-200 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                {meaning}
              </p>
              {example ? (
                <p className="max-w-[95%] rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm leading-relaxed text-slate-300 italic">
                  {example}
                </p>
              ) : null}
            </div>
          </motion.div>
        </motion.button>
      </motion.div>
    </div>
  );
}
