import fs from "node:fs";
import path from "node:path";
import type { ComicListItem, ComicStory } from "@/types/comic";
import { isValidContentLevel } from "./loadChapter";

export function isValidComicStoryId(storyId: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(storyId) && storyId.length > 0 && storyId.length <= 128;
}

export function getComicsContentDir(level: string): string {
  return path.join(process.cwd(), "content", level.toLowerCase(), "comics");
}

export function discoverComicStoryIds(level: string): string[] {
  if (!isValidContentLevel(level)) return [];
  const dir = getComicsContentDir(level);
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
    .map((f) => f.slice(0, -5))
    .filter(isValidComicStoryId)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

export function loadComicStory(level: string, storyId: string): ComicStory {
  if (!isValidContentLevel(level) || !isValidComicStoryId(storyId)) {
    throw new Error("Invalid comic path");
  }
  const dir = getComicsContentDir(level);
  const safeDir = path.resolve(dir);
  const resolved = path.resolve(path.join(safeDir, `${storyId}.json`));
  const rel = path.relative(safeDir, resolved);
  if (rel.startsWith("..") || path.isAbsolute(rel) || rel.includes("..")) {
    throw new Error("Invalid comic path");
  }
  const raw = fs.readFileSync(resolved, "utf8");
  return JSON.parse(raw) as ComicStory;
}

export function comicExists(level: string, storyId: string): boolean {
  if (!isValidContentLevel(level) || !isValidComicStoryId(storyId)) return false;
  return fs.existsSync(path.join(getComicsContentDir(level), `${storyId}.json`));
}

export function listComicsForLevel(level: string): ComicListItem[] {
  return discoverComicStoryIds(level).map((storyId) => {
    const story = loadComicStory(level, storyId);
    return {
      storyId,
      title: story.title,
      difficulty: story.difficulty,
      estimatedReadingTime: story.estimatedReadingTime,
      coverImage: story.coverImage,
      pageCount: story.pages.length,
      vocabularyCount: story.vocabularyUsed.length,
      grammarCount: story.grammarUsed.length,
      vocabularyTerms: story.vocabularyUsed.map((v) => v.word),
      grammarPatterns: story.grammarUsed.map((g) => g.pattern),
    };
  });
}

export { parseReadingMinutes, readingLengthBucket } from "./comicUtils";
