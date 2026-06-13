"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getProgress,
  getProgressStats,
  getChapterProgress,
  markChapterComplete,
  recordQuizResult,
  resetProgress,
  subscribeProgress,
  updateLessonProgress,
  getServerSnapshot,
} from "@/lib/progress";
import type { RecordQuizInput, UpdateLessonInput } from "@/lib/progress";

export function useProgress() {
  const progress = useSyncExternalStore(subscribeProgress, getProgress, getServerSnapshot);
  const stats = getProgressStats();

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

  const clearProgress = useCallback(() => resetProgress(), []);

  return {
    progress,
    stats,
    saveLessonProgress,
    saveQuizResult,
    completeChapter,
    getChapter,
    clearProgress,
  };
}
