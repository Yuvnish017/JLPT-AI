import { evaluateBadges, addXpToProgress, updateStreak } from "./badges-logic";
import { LESSON_COMPLETE_THRESHOLD } from "./constants";
import {
  chapterKey,
  createDefaultProgress,
  getOrCreateChapter,
  getTodayXp,
  isChapterFullyComplete,
  todayDateKey,
} from "./helpers";
import { readProgress, writeProgress } from "./storage";
import type {
  RecordQuizInput,
  UpdateLessonInput,
  UserProgress,
  ChapterProgress,
} from "./types";

export { createDefaultProgress } from "./helpers";
export * from "./types";
export * from "./constants";
export * from "./badges";
export * from "./helpers";
export { readProgress, subscribeProgress, getServerSnapshot } from "./storage";

export function getProgress(): UserProgress {
  return readProgress();
}

export function getChapterProgress(level: string, slug: string): ChapterProgress {
  const key = chapterKey(level, slug);
  return getOrCreateChapter(readProgress(), key);
}

export function updateLessonProgress(input: UpdateLessonInput): UserProgress {
  const progress = structuredClone(readProgress());
  const key = chapterKey(input.level, input.slug);
  const chapter = getOrCreateChapter(progress, key);

  chapter.lessonProgress = Math.max(chapter.lessonProgress, Math.min(100, input.lessonProgress));
  chapter.lastVisitedAt = new Date().toISOString();

  if (input.tabId && !chapter.tabsVisited.includes(input.tabId)) {
    chapter.tabsVisited.push(input.tabId);
  }

  const dateKey = todayDateKey();
  updateStreak(progress, dateKey);

  if (
    chapter.lessonProgress >= LESSON_COMPLETE_THRESHOLD &&
    !chapter.quizCompleted &&
    !chapter.completed
  ) {
    // Chapters without quizzes can still be marked complete via markChapterComplete.
  }

  progress.chapters[key] = chapter;
  evaluateBadges(progress);
  return writeProgress(progress);
}

export function recordQuizResult(input: RecordQuizInput): {
  progress: UserProgress;
  xpAdded: number;
  newBadges: string[];
} {
  const before = readProgress();
  const progress = structuredClone(before);
  const key = chapterKey(input.level, input.slug);
  const chapter = getOrCreateChapter(progress, key);
  const dateKey = todayDateKey();

  const record = {
    score: input.score,
    total: input.total,
    xpEarned: input.xpEarned,
    perfect: input.perfect,
    completedAt: new Date().toISOString(),
  };

  chapter.quizAttempts += 1;
  chapter.quizCompleted = true;
  chapter.lastQuiz = record;
  chapter.lastVisitedAt = record.completedAt;

  if (input.score > chapter.quizBestScore || chapter.quizBestTotal !== input.total) {
    chapter.quizBestScore = input.score;
    chapter.quizBestTotal = input.total;
  }

  addXpToProgress(progress, input.xpEarned, dateKey);
  chapter.xpEarned += input.xpEarned;

  if (chapter.lessonProgress >= LESSON_COMPLETE_THRESHOLD && !chapter.completed) {
    chapter.completed = true;
    chapter.completedAt = record.completedAt;
  }

  progress.chapters[key] = chapter;
  evaluateBadges(progress);

  const after = writeProgress(progress);
  const newBadges = after.badges.filter((id) => !before.badges.includes(id));

  return { progress: after, xpAdded: input.xpEarned, newBadges };
}

export function markChapterComplete(
  level: string,
  slug: string,
  hasQuiz: boolean,
): UserProgress {
  const progress = structuredClone(readProgress());
  const key = chapterKey(level, slug);
  const chapter = getOrCreateChapter(progress, key);

  if (isChapterFullyComplete(chapter, hasQuiz) && !chapter.completed) {
    chapter.completed = true;
    chapter.completedAt = new Date().toISOString();
  }

  progress.chapters[key] = chapter;
  evaluateBadges(progress);
  return writeProgress(progress);
}

export function getProgressStats() {
  const progress = readProgress();
  return {
    totalXp: progress.totalXp,
    streakDays: progress.streakDays,
    todayXp: getTodayXp(progress),
    badgeCount: progress.badges.length,
    completedChapters: Object.values(progress.chapters).filter((c) => c.completed).length,
  };
}

export function resetProgress(): UserProgress {
  return writeProgress(createDefaultProgress());
}
