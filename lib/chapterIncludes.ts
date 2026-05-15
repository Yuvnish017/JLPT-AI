import type { Lesson } from "@/types/lesson";

/** Keys that can be present on chapter JSON; omit a key if that track is not part of the chapter. */
export type ChapterContentKey =
  | "kanji"
  | "vocabulary"
  | "grammar"
  | "reading"
  | "quiz";

export function chapterIncludes(json: object, key: ChapterContentKey): boolean {
  return Object.prototype.hasOwnProperty.call(json, key);
}

/** Returns items for this block only when the chapter JSON includes that key. */
export function includedArray<T>(
  json: object,
  key: ChapterContentKey,
  lesson: Lesson,
  getter: (l: Lesson) => T[] | undefined,
): T[] {
  return chapterIncludes(json, key) ? getter(lesson) ?? [] : [];
}
