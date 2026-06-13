"use client";

import { motion } from "framer-motion";
import { useProgress } from "@/hooks/useProgress";

type ProgressHudProps = {
  compact?: boolean;
  className?: string;
};

export default function ProgressHud({ compact = false, className = "" }: ProgressHudProps) {
  const { stats } = useProgress();

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-bold text-cyan-200 tabular-nums">
          <span aria-hidden>⚡</span>
          {stats.totalXp} XP
        </span>
        {stats.streakDays > 0 ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-orange-400/35 bg-orange-500/10 px-2.5 py-1 text-[10px] font-bold text-orange-200 tabular-nums">
            <span aria-hidden>🔥</span>
            {stats.streakDays}d
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 ${className}`}
    >
      <StatPill label="Total XP" value={stats.totalXp} accent="cyan" icon="⚡" />
      <StatPill label="Today" value={stats.todayXp} accent="emerald" icon="✦" suffix=" XP" />
      <StatPill label="Streak" value={stats.streakDays} accent="orange" icon="🔥" suffix=" days" />
      <StatPill label="Badges" value={stats.badgeCount} accent="fuchsia" icon="🏅" />
    </motion.div>
  );
}

function StatPill({
  label,
  value,
  accent,
  icon,
  suffix = "",
}: {
  label: string;
  value: number;
  accent: "cyan" | "emerald" | "orange" | "fuchsia";
  icon: string;
  suffix?: string;
}) {
  const tones = {
    cyan: "border-cyan-400/30 bg-cyan-500/10 text-cyan-200",
    emerald: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
    orange: "border-orange-400/35 bg-orange-500/10 text-orange-200",
    fuchsia: "border-fuchsia-400/35 bg-fuchsia-500/10 text-fuchsia-200",
  };

  return (
    <div className={`rounded-xl border px-3 py-2.5 ${tones[accent]}`}>
      <p className="text-[9px] font-bold tracking-[0.18em] uppercase opacity-80">{label}</p>
      <p className="mt-0.5 text-lg font-black tabular-nums text-white">
        <span className="mr-1" aria-hidden>
          {icon}
        </span>
        {value}
        {suffix ? <span className="text-xs font-bold opacity-70">{suffix}</span> : null}
      </p>
    </div>
  );
}
