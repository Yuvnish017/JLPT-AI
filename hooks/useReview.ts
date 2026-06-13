"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  addReviewItem,
  getDueCounts,
  getDueReviewItems,
  getReviewItems,
  getReviewSummary,
  recordReviewAnswer,
  registerQuizMistake,
  subscribeReview,
  updateReviewItem,
} from "@/lib/review";
import type { AddReviewItemInput, UpdateReviewItemInput } from "@/types/review";
import type { Lesson } from "@/types/lesson";

function readStoreItems() {
  return getReviewItems();
}

export function useReview() {
  const items = useSyncExternalStore(subscribeReview, readStoreItems, () => []);

  const dueCounts = getDueCounts();
  const dueItems = getDueReviewItems();
  const summary = getReviewSummary();

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

export function useReviewStoreSnapshot() {
  return useSyncExternalStore(subscribeReview, readStoreItems, () => []);
}

export function useDueCounts() {
  return useSyncExternalStore(
    subscribeReview,
    () => getDueCounts(),
    () => ({ total: 0, vocabulary: 0, kanji: 0, grammar: 0 }),
  );
}
