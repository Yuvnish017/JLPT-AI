"use client";

import { motion } from "framer-motion";
import { BADGE_BY_ID, BADGE_DEFINITIONS, getBadgeTierStyles } from "@/lib/progress/badges";
import { useProgress } from "@/hooks/useProgress";

type BadgeGalleryProps = {
  limit?: number;
  showLocked?: boolean;
  className?: string;
};

export default function BadgeGallery({
  limit,
  showLocked = true,
  className = "",
}: BadgeGalleryProps) {
  const { progress } = useProgress();
  const earned = new Set(progress.badges);

  const badges = showLocked
    ? BADGE_DEFINITIONS
    : BADGE_DEFINITIONS.filter((b) => earned.has(b.id));

  const visible = limit ? badges.slice(0, limit) : badges;

  if (visible.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-white/15 px-4 py-6 text-center text-sm text-slate-500">
        Complete lessons and quizzes to earn badges.
      </p>
    );
  }

  return (
    <ul className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {visible.map((badge, i) => {
        const unlocked = earned.has(badge.id);
        const def = BADGE_BY_ID[badge.id] ?? badge;
        return (
          <motion.li
            key={badge.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`relative overflow-hidden rounded-2xl border p-4 transition ${
              unlocked
                ? getBadgeTierStyles(def.tier)
                : "border-white/8 bg-slate-900/40 opacity-55 grayscale"
            }`}
          >
            {unlocked ? (
              <span className="absolute right-3 top-3 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold tracking-wider text-emerald-200 uppercase">
                Earned
              </span>
            ) : (
              <span className="absolute right-3 top-3 rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-bold tracking-wider text-slate-500 uppercase">
                Locked
              </span>
            )}
            <span className="text-3xl" aria-hidden>
              {def.emoji}
            </span>
            <p className="mt-2 text-sm font-bold text-white">{def.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">{def.description}</p>
          </motion.li>
        );
      })}
    </ul>
  );
}
