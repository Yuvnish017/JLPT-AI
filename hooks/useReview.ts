"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  addReviewItem,
  getDueCountsFromStore,
  getDueReviewItemsFromStore,
  getReviewSummaryFromStore,
  readReviewStore,
  recordReviewAnswer,
  registerQuizMistake,
  subscribeReview,
  updateReviewItem,
  getReviewServerSnapshot,
} from "@/lib/review";
import type { AddReviewItemInput, UpdateReviewItemInput } from "@/types/review";
import type { Lesson } from "@/types/lesson";

export function useReview() {
  const store = useSyncExternalStore(subscribeReview, readReviewStore, getReviewServerSnapshot);

  const items = useMemo(() => Object.values(store.items), [store]);
  const dueItems = useMemo(() => getDueReviewItemsFromStore(store), [store]);
  const dueCounts = useMemo(() => getDueCountsFromStore(store), [store]);
  const summary = useMemo(() => getReviewSummaryFromStore(store), [store]);

  const addItem = useCallback((input: AddReviewItemInput) => addReviewItem(input), []);

  const updateItem = useCallback(
    (itemId: string, updates: UpdateReviewItemInput) => updateReviewItem(itemId, updates),
    [],
  );

  const answerItem = useCallback(
    (itemId: string, wasCorrect: boolean) => recordReviewAnswer(itemId, wasCorrect),
    [],
  );

  const registerMistake = useCallback(
    (level: string, slug: string, lesson: Lesson, question: string, answer: string) =>
      registerQuizMistake(level, slug, lesson, question, answer),
    [],
  );

  return {
    items,
    dueItems,
    dueCounts,
    summary,
    addItem,
    updateItem,
    answerItem,
    registerMistake,
  };
}

export function useDueCounts() {
  const store = useSyncExternalStore(subscribeReview, readReviewStore, getReviewServerSnapshot);
  return useMemo(() => getDueCountsFromStore(store), [store]);
}
