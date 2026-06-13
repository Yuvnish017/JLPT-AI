export type ReviewItemType = "vocabulary" | "kanji" | "grammar";

export type ReviewItemPayload = {
  prompt: string;
  answer: string;
  hint?: string;
  detail?: string;
};

export type ReviewItem = {
  itemId: string;
  itemType: ReviewItemType;
  lessonId: string;
  mistakes: number;
  timesCorrect: number;
  lastReviewed: string;
  nextReviewDate: string;
  payload: ReviewItemPayload;
};

export type ReviewStore = {
  version: 1;
  items: Record<string, ReviewItem>;
};

export type AddReviewItemInput = {
  itemId: string;
  itemType: ReviewItemType;
  lessonId: string;
  payload: ReviewItemPayload;
  mistakes?: number;
};

export type UpdateReviewItemInput = Partial<
  Pick<ReviewItem, "mistakes" | "timesCorrect" | "lastReviewed" | "nextReviewDate" | "payload">
>;

export type ReviewDueCounts = {
  total: number;
  vocabulary: number;
  kanji: number;
  grammar: number;
};

export type ReviewSessionResult = {
  reviewed: number;
  correct: number;
  incorrect: number;
};
