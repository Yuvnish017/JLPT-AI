import { createDefaultProgress } from "./helpers";
import { PROGRESS_STORAGE_KEY } from "./types";
import type { UserProgress } from "./types";

const listeners = new Set<() => void>();

let cached: UserProgress | null = null;

const SERVER_SNAPSHOT: UserProgress = createDefaultProgress();

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function parseProgress(raw: string | null): UserProgress {
  if (!raw) return createDefaultProgress();
  try {
    const data = JSON.parse(raw) as Partial<UserProgress>;
    if (data.version !== 1) return createDefaultProgress();
    return {
      version: 1,
      totalXp: typeof data.totalXp === "number" ? data.totalXp : 0,
      streakDays: typeof data.streakDays === "number" ? data.streakDays : 0,
      lastActiveDate: typeof data.lastActiveDate === "string" ? data.lastActiveDate : "",
      chapters: data.chapters && typeof data.chapters === "object" ? data.chapters : {},
      badges: Array.isArray(data.badges) ? data.badges : [],
      dailyXp: data.dailyXp && typeof data.dailyXp === "object" ? data.dailyXp : {},
    };
  } catch {
    return createDefaultProgress();
  }
}

export function subscribeProgress(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function notifyListeners() {
  for (const fn of listeners) fn();
}

export function readProgress(): UserProgress {
  if (!isBrowser()) return SERVER_SNAPSHOT;
  if (cached) return cached;
  cached = parseProgress(window.localStorage.getItem(PROGRESS_STORAGE_KEY));
  return cached;
}

export function writeProgress(progress: UserProgress): UserProgress {
  if (!isBrowser()) return progress;
  cached = progress;
  window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  notifyListeners();
  return progress;
}

export function invalidateProgressCache(): void {
  cached = null;
}

export function getServerSnapshot(): UserProgress {
  return SERVER_SNAPSHOT;
}
