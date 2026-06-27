import { LESSON_COMPLETE_THRESHOLD } from "./constants";
import type { ChapterProgress, ComicProgress, UserProgress } from "./types";

export function createDefaultProgress(): UserProgress {
  return {
    version: 1,
    totalXp: 0,
    streakDays: 0,
    lastActiveDate: "",
    chapters: {},
    comics: {},
    badges: [],
    dailyXp: {},
  };
}

export function chapterKey(level: string, slug: string): string {
  return `${level.toLowerCase()}/${slug}`;
}

export function comicKey(level: string, storyId: string): string {
  return `${level.toLowerCase()}/comics/${storyId}`;
}

export function createEmptyComicProgress(): ComicProgress {
  return {
    currentPanel: 0,
    completed: false,
    xpEarned: 0,
    readingSeconds: 0,
    lastVisitedAt: new Date().toISOString(),
  };
}

export function getOrCreateComic(progress: UserProgress, key: string): ComicProgress {
  return progress.comics[key] ?? createEmptyComicProgress();
}

export function todayDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function yesterdayDateKey(date = new Date()): string {
  const prev = new Date(date);
  prev.setDate(prev.getDate() - 1);
  return todayDateKey(prev);
}

export function createEmptyChapterProgress(): ChapterProgress {
  return {
    lessonProgress: 0,
    tabsVisited: [],
    quizCompleted: false,
    quizBestScore: 0,
    quizBestTotal: 0,
    quizAttempts: 0,
    xpEarned: 0,
    completed: false,
    lastVisitedAt: new Date().toISOString(),
  };
}

export function getOrCreateChapter(progress: UserProgress, key: string): ChapterProgress {
  return progress.chapters[key] ?? createEmptyChapterProgress();
}

export function isChapterFullyComplete(chapter: ChapterProgress, hasQuiz: boolean): boolean {
  const lessonDone = chapter.lessonProgress >= LESSON_COMPLETE_THRESHOLD;
  if (!hasQuiz) return lessonDone;
  return lessonDone && chapter.quizCompleted;
}

export function countCompletedQuizzes(progress: UserProgress): number {
  return Object.values(progress.chapters).filter((c) => c.quizCompleted).length;
}

export function getTodayXp(progress: UserProgress, dateKey = todayDateKey()): number {
  return progress.dailyXp[dateKey] ?? 0;
}

export function getCompletedChapterCount(progress: UserProgress): number {
  return Object.values(progress.chapters).filter((c) => c.completed).length;
}

export function getLevelProgressSummary(
  progress: UserProgress,
  level: string,
): { completed: number; inProgress: number; totalXp: number } {
  const prefix = `${level.toLowerCase()}/`;
  let completed = 0;
  let inProgress = 0;
  let totalXp = 0;

  for (const [key, ch] of Object.entries(progress.chapters)) {
    if (!key.startsWith(prefix)) continue;
    totalXp += ch.xpEarned;
    if (ch.completed) completed += 1;
    else if (ch.lessonProgress > 0 || ch.quizCompleted) inProgress += 1;
  }

  return { completed, inProgress, totalXp };
}

export type LevelComicSummary = {
  completed: number;
  inProgress: number;
  currentStoryId: string | null;
  currentStoryTitle: string | null;
  readingStreak: number;
};

export function getLevelComicSummary(
  progress: UserProgress,
  level: string,
  storyTitles: Record<string, string> = {},
): LevelComicSummary {
  const prefix = `${level.toLowerCase()}/comics/`;
  let completed = 0;
  let inProgress = 0;
  let currentStoryId: string | null = null;
  let latestVisit = "";

  for (const [key, comic] of Object.entries(progress.comics)) {
    if (!key.startsWith(prefix)) continue;
    if (comic.completed) {
      completed += 1;
    } else if (comic.currentPanel > 0) {
      inProgress += 1;
      if (comic.lastVisitedAt > latestVisit) {
        latestVisit = comic.lastVisitedAt;
        currentStoryId = key.slice(prefix.length);
      }
    }
  }

  return {
    completed,
    inProgress,
    currentStoryId,
    currentStoryTitle: currentStoryId ? (storyTitles[currentStoryId] ?? currentStoryId) : null,
    readingStreak: progress.streakDays,
  };
}
