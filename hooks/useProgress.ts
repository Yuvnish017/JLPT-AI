"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  getProgress,
  getProgressStats,
  getChapterProgress,
  getComicProgress,
  markChapterComplete,
  recordQuizResult,
  resetProgress,
  subscribeProgress,
  updateLessonProgress,
  updateComicPanelProgress,
  completeComic,
  getServerSnapshot,
} from "@/lib/progress";
import type {
  CompleteComicInput,
  RecordQuizInput,
  UpdateComicPanelInput,
  UpdateLessonInput,
} from "@/lib/progress";

export function useProgress() {
  const progress = useSyncExternalStore(subscribeProgress, getProgress, getServerSnapshot);
  const stats = useMemo(() => getProgressStats(progress), [progress]);

  const saveLessonProgress = useCallback((input: UpdateLessonInput) => {
    return updateLessonProgress(input);
  }, []);

  const saveQuizResult = useCallback((input: RecordQuizInput) => {
    return recordQuizResult(input);
  }, []);

  const completeChapter = useCallback((level: string, slug: string, hasQuiz: boolean) => {
    return markChapterComplete(level, slug, hasQuiz);
  }, []);

  const getChapter = useCallback(
    (level: string, slug: string) => getChapterProgress(level, slug),
    [progress],
  );

  const getComic = useCallback(
    (level: string, storyId: string) => getComicProgress(level, storyId),
    [progress],
  );

  const saveComicPanel = useCallback((input: UpdateComicPanelInput) => {
    return updateComicPanelProgress(input);
  }, []);

  const finishComic = useCallback((input: CompleteComicInput) => {
    return completeComic(input);
  }, []);

  const clearProgress = useCallback(() => resetProgress(), []);

  return {
    progress,
    stats,
    saveLessonProgress,
    saveQuizResult,
    completeChapter,
    getChapter,
    getComic,
    saveComicPanel,
    finishComic,
    clearProgress,
  };
}
