import { evaluateBadges, addXpToProgress, updateStreak } from "./badges-logic";
import { COMIC_COMPLETE_XP } from "./constants";
import {
  comicKey,
  createEmptyComicProgress,
  getOrCreateComic,
  todayDateKey,
} from "./helpers";
import { readProgress, writeProgress } from "./storage";
import type { ComicProgress, CompleteComicInput, UpdateComicPanelInput, UserProgress } from "./types";

export function getComicProgress(level: string, storyId: string): ComicProgress {
  const key = comicKey(level, storyId);
  return getOrCreateComic(readProgress(), key);
}

export function updateComicPanelProgress(input: UpdateComicPanelInput): UserProgress {
  const progress = structuredClone(readProgress());
  const key = comicKey(input.level, input.storyId);
  const comic = getOrCreateComic(progress, key);

  comic.currentPanel = Math.max(comic.currentPanel, input.panelIndex);
  comic.lastVisitedAt = new Date().toISOString();
  if (input.readingSecondsDelta && input.readingSecondsDelta > 0) {
    comic.readingSeconds += input.readingSecondsDelta;
  }

  const dateKey = todayDateKey();
  updateStreak(progress, dateKey);

  progress.comics[key] = comic;
  evaluateBadges(progress);
  return writeProgress(progress);
}

export function completeComic(input: CompleteComicInput): {
  progress: UserProgress;
  xpAdded: number;
  alreadyCompleted: boolean;
} {
  const before = readProgress();
  const progress = structuredClone(before);
  const key = comicKey(input.level, input.storyId);
  const comic = getOrCreateComic(progress, key);
  const dateKey = todayDateKey();

  if (comic.completed) {
    comic.readingSeconds = Math.max(comic.readingSeconds, input.readingSeconds);
    comic.lastVisitedAt = new Date().toISOString();
    progress.comics[key] = comic;
    return { progress: writeProgress(progress), xpAdded: 0, alreadyCompleted: true };
  }

  const xpAdded = COMIC_COMPLETE_XP;
  comic.completed = true;
  comic.completedAt = new Date().toISOString();
  comic.lastVisitedAt = comic.completedAt;
  comic.readingSeconds = Math.max(comic.readingSeconds, input.readingSeconds);
  comic.xpEarned += xpAdded;

  addXpToProgress(progress, xpAdded, dateKey);
  updateStreak(progress, dateKey);

  progress.comics[key] = comic;
  evaluateBadges(progress);

  return { progress: writeProgress(progress), xpAdded, alreadyCompleted: false };
}

export function resetComicProgress(level: string, storyId: string): UserProgress {
  const progress = structuredClone(readProgress());
  const key = comicKey(level, storyId);
  progress.comics[key] = createEmptyComicProgress();
  return writeProgress(progress);
}
