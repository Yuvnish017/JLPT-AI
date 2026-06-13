import { buildReviewItemFromQuizMistake } from "./review/matching";
import { calculateNextReviewDate, isDue, todayDateKey } from "./review/scheduling";
import {
  getReviewServerSnapshot,
  readReviewStore,
  subscribeReview,
  writeReviewStore,
} from "./review/storage";
import type {
  AddReviewItemInput,
  ReviewDueCounts,
  ReviewItem,
  ReviewStore,
  UpdateReviewItemInput,
} from "@/types/review";
import type { Lesson } from "@/types/lesson";

export { calculateNextReviewDate } from "./review/scheduling";
export { buildReviewItemFromQuizMistake } from "./review/matching";
export type {
  AddReviewItemInput,
  ReviewDueCounts,
  ReviewItem,
  ReviewItemPayload,
  ReviewItemType,
  ReviewSessionResult,
  ReviewStore,
  UpdateReviewItemInput,
} from "@/types/review";

export { subscribeReview, getReviewServerSnapshot };

export function getReviewItems(): ReviewItem[] {
  const store = readReviewStore();
  return Object.values(store.items);
}

export function getReviewItem(itemId: string): ReviewItem | null {
  return readReviewStore().items[itemId] ?? null;
}

export function addReviewItem(input: AddReviewItemInput): ReviewItem {
  const store = structuredClone(readReviewStore());
  const now = new Date().toISOString();
  const existing = store.items[input.itemId];

  if (existing) {
    const mistakes = existing.mistakes + 1;
    const updated: ReviewItem = {
      ...existing,
      mistakes,
      lastReviewed: now,
      nextReviewDate: calculateNextReviewDate(mistakes, existing.timesCorrect, false),
      payload: input.payload,
    };
    store.items[input.itemId] = updated;
    writeReviewStore(store);
    return updated;
  }

  const mistakes = input.mistakes ?? 1;
  const item: ReviewItem = {
    itemId: input.itemId,
    itemType: input.itemType,
    lessonId: input.lessonId,
    mistakes,
    timesCorrect: 0,
    lastReviewed: now,
    nextReviewDate: calculateNextReviewDate(mistakes, 0, false),
    payload: input.payload,
  };
  store.items[input.itemId] = item;
  writeReviewStore(store);
  return item;
}

export function updateReviewItem(itemId: string, updates: UpdateReviewItemInput): ReviewItem | null {
  const store = structuredClone(readReviewStore());
  const existing = store.items[itemId];
  if (!existing) return null;

  const updated: ReviewItem = { ...existing, ...updates };
  store.items[itemId] = updated;
  writeReviewStore(store);
  return updated;
}

export function getDueReviewItems(dateKey = todayDateKey()): ReviewItem[] {
  return getReviewItems()
    .filter((item) => isDue(item.nextReviewDate, dateKey))
    .sort((a, b) => {
      if (a.nextReviewDate !== b.nextReviewDate) {
        return a.nextReviewDate.localeCompare(b.nextReviewDate);
      }
      return b.mistakes - a.mistakes;
    });
}

export function getDueCounts(dateKey = todayDateKey()): ReviewDueCounts {
  const due = getDueReviewItems(dateKey);
  return {
    total: due.length,
    vocabulary: due.filter((i) => i.itemType === "vocabulary").length,
    kanji: due.filter((i) => i.itemType === "kanji").length,
    grammar: due.filter((i) => i.itemType === "grammar").length,
  };
}

export function recordReviewAnswer(itemId: string, wasCorrect: boolean): ReviewItem | null {
  const store = structuredClone(readReviewStore());
  const existing = store.items[itemId];
  if (!existing) return null;

  const now = new Date().toISOString();
  const mistakes = wasCorrect ? existing.mistakes : existing.mistakes + 1;
  const timesCorrect = wasCorrect ? existing.timesCorrect + 1 : existing.timesCorrect;

  const updated: ReviewItem = {
    ...existing,
    mistakes,
    timesCorrect,
    lastReviewed: now,
    nextReviewDate: calculateNextReviewDate(mistakes, timesCorrect, wasCorrect),
  };

  store.items[itemId] = updated;
  writeReviewStore(store);
  return updated;
}

export function registerQuizMistake(
  level: string,
  slug: string,
  lesson: Lesson,
  questionText: string,
  correctAnswer: string,
): ReviewItem {
  const input = buildReviewItemFromQuizMistake(level, slug, lesson, correctAnswer, questionText);
  return addReviewItem(input);
}

export function getReviewSummary() {
  const items = getReviewItems();
  const due = getDueCounts();
  return {
    totalItems: items.length,
    due,
    mastered: items.filter((i) => i.timesCorrect >= 3 && i.mistakes <= 1).length,
  };
}
