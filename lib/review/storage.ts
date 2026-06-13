import type { ReviewStore } from "@/types/review";

export const REVIEW_STORAGE_KEY = "jlpt-ai:review:v1";

const listeners = new Set<() => void>();

let cached: ReviewStore | null = null;

const SERVER_SNAPSHOT: ReviewStore = { version: 1, items: {} };

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function createDefaultReviewStore(): ReviewStore {
  return { version: 1, items: {} };
}

function parseStore(raw: string | null): ReviewStore {
  if (!raw) return createDefaultReviewStore();
  try {
    const data = JSON.parse(raw) as Partial<ReviewStore>;
    if (data.version !== 1) return createDefaultReviewStore();
    return {
      version: 1,
      items: data.items && typeof data.items === "object" ? data.items : {},
    };
  } catch {
    return createDefaultReviewStore();
  }
}

export function subscribeReview(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function notifyListeners() {
  for (const fn of listeners) fn();
}

export function readReviewStore(): ReviewStore {
  if (!isBrowser()) return SERVER_SNAPSHOT;
  if (cached) return cached;
  cached = parseStore(window.localStorage.getItem(REVIEW_STORAGE_KEY));
  return cached;
}

export function writeReviewStore(store: ReviewStore): ReviewStore {
  if (!isBrowser()) return store;
  cached = store;
  window.localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(store));
  notifyListeners();
  return store;
}

export function getReviewServerSnapshot(): ReviewStore {
  return SERVER_SNAPSHOT;
}
