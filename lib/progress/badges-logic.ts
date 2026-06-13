import { countCompletedQuizzes } from "./helpers";
import type { UserProgress } from "./types";

function awardBadge(progress: UserProgress, id: string) {
  if (!progress.badges.includes(id)) {
    progress.badges.push(id);
  }
}

export function evaluateBadges(progress: UserProgress): void {
  const visitedChapters = Object.keys(progress.chapters).length;
  const completedChapters = Object.values(progress.chapters).filter((c) => c.completed).length;
  const quizCount = countCompletedQuizzes(progress);
  const hasPerfect = Object.values(progress.chapters).some((c) => c.lastQuiz?.perfect);

  if (visitedChapters >= 1) awardBadge(progress, "first-visit");
  if (quizCount >= 1) awardBadge(progress, "quiz-rookie");
  if (quizCount >= 5) awardBadge(progress, "quiz-veteran");
  if (hasPerfect) awardBadge(progress, "perfect-run");
  if (progress.streakDays >= 3) awardBadge(progress, "streak-3");
  if (progress.streakDays >= 7) awardBadge(progress, "streak-7");
  if (progress.streakDays >= 30) awardBadge(progress, "streak-30");
  if (progress.totalXp >= 100) awardBadge(progress, "xp-100");
  if (progress.totalXp >= 500) awardBadge(progress, "xp-500");
  if (progress.totalXp >= 1000) awardBadge(progress, "xp-1000");
  if (completedChapters >= 1) awardBadge(progress, "chapter-master");
}

export function updateStreak(progress: UserProgress, dateKey: string): void {
  if (!progress.lastActiveDate) {
    progress.streakDays = 1;
    progress.lastActiveDate = dateKey;
    return;
  }

  if (progress.lastActiveDate === dateKey) return;

  const yesterday = (() => {
    const [y, m, d] = dateKey.split("-").map(Number);
    const dt = new Date(y!, m! - 1, d!);
    dt.setDate(dt.getDate() - 1);
    const yy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    return `${yy}-${mm}-${dd}`;
  })();

  if (progress.lastActiveDate === yesterday) {
    progress.streakDays += 1;
  } else {
    progress.streakDays = 1;
  }
  progress.lastActiveDate = dateKey;
}

export function addXpToProgress(progress: UserProgress, amount: number, dateKey: string): void {
  if (amount <= 0) return;
  progress.totalXp += amount;
  progress.dailyXp[dateKey] = (progress.dailyXp[dateKey] ?? 0) + amount;
  updateStreak(progress, dateKey);
}
