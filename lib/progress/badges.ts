import type { BadgeDefinition, UserProgress } from "./types";

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: "first-visit",
    title: "First Steps",
    description: "Open your first chapter",
    emoji: "🌱",
    tier: "bronze",
  },
  {
    id: "quiz-rookie",
    title: "Quiz Rookie",
    description: "Complete your first quiz",
    emoji: "📝",
    tier: "bronze",
  },
  {
    id: "perfect-run",
    title: "Perfect Run",
    description: "Score 100% on any quiz",
    emoji: "⭐",
    tier: "gold",
  },
  {
    id: "streak-3",
    title: "3-Day Streak",
    description: "Study 3 days in a row",
    emoji: "🔥",
    tier: "silver",
  },
  {
    id: "streak-7",
    title: "Week Warrior",
    description: "Study 7 days in a row",
    emoji: "💪",
    tier: "gold",
  },
  {
    id: "streak-30",
    title: "Monthly Master",
    description: "Study 30 days in a row",
    emoji: "👑",
    tier: "legend",
  },
  {
    id: "xp-100",
    title: "Rising Star",
    description: "Earn 100 total XP",
    emoji: "✨",
    tier: "bronze",
  },
  {
    id: "xp-500",
    title: "Power Surge",
    description: "Earn 500 total XP",
    emoji: "⚡",
    tier: "silver",
  },
  {
    id: "xp-1000",
    title: "XP Legend",
    description: "Earn 1,000 total XP",
    emoji: "🌟",
    tier: "gold",
  },
  {
    id: "chapter-master",
    title: "Chapter Master",
    description: "Fully complete a chapter",
    emoji: "🏆",
    tier: "gold",
  },
  {
    id: "quiz-veteran",
    title: "Quiz Veteran",
    description: "Complete 5 quizzes",
    emoji: "🎯",
    tier: "silver",
  },
];

export const BADGE_BY_ID = Object.fromEntries(
  BADGE_DEFINITIONS.map((b) => [b.id, b]),
) as Record<string, BadgeDefinition>;

export function getNewlyEarnedBadges(before: UserProgress, after: UserProgress): string[] {
  const prev = new Set(before.badges);
  return after.badges.filter((id) => !prev.has(id));
}

export function getBadgeTierStyles(tier: BadgeDefinition["tier"]) {
  switch (tier) {
    case "bronze":
      return "border-amber-500/40 bg-gradient-to-br from-amber-500/20 to-orange-600/10";
    case "silver":
      return "border-slate-300/40 bg-gradient-to-br from-slate-300/15 to-slate-500/10";
    case "gold":
      return "border-yellow-400/45 bg-gradient-to-br from-yellow-400/20 to-amber-500/10";
    case "legend":
      return "border-fuchsia-400/50 bg-gradient-to-br from-fuchsia-500/25 via-violet-500/15 to-cyan-500/15";
  }
}
