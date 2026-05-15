import fs from "node:fs";
import path from "node:path";

const RESERVED_JSON = new Set(["chapters.json"]);

export function isValidContentLevel(level: string): boolean {
  return /^n[1-5]$/i.test(level.trim());
}

export function isValidChapterSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug) && slug.length > 0 && slug.length <= 128;
}

export function getLevelContentDir(level: string): string {
  return path.join(process.cwd(), "content", level.toLowerCase());
}

/**
 * All chapter JSON filenames in `content/{level}/` (excluding reserved names).
 * Add `content/n4/chapter-1.json` and it appears automatically after rebuild / on demand.
 */
export function discoverChapterSlugs(level: string): string[] {
  if (!isValidContentLevel(level)) return [];
  const dir = getLevelContentDir(level);
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => {
      if (!f.endsWith(".json")) return false;
      if (f.startsWith("_")) return false;
      const lower = f.toLowerCase();
      if (RESERVED_JSON.has(lower)) return false;
      const slug = f.slice(0, -5);
      return isValidChapterSlug(slug);
    })
    .map((f) => f.slice(0, -5))
    .sort((a, b) => {
      const na = chapterSortKey(a);
      const nb = chapterSortKey(b);
      if (na !== nb) return na - nb;
      return a.localeCompare(b);
    });
}

function chapterSortKey(slug: string): number {
  const m = /^chapter-(\d+)$/i.exec(slug);
  return m ? parseInt(m[1]!, 10) : Number.MAX_SAFE_INTEGER;
}

export function loadChapterRecord(
  level: string,
  slug: string,
): Record<string, unknown> {
  if (!isValidContentLevel(level) || !isValidChapterSlug(slug)) {
    throw new Error("Invalid chapter path");
  }
  const dir = getLevelContentDir(level);
  const safeDir = path.resolve(dir);
  const resolved = path.resolve(path.join(safeDir, `${slug}.json`));
  const rel = path.relative(safeDir, resolved);
  if (rel.startsWith("..") || path.isAbsolute(rel) || rel.includes("..")) {
    throw new Error("Invalid chapter path");
  }
  const raw = fs.readFileSync(resolved, "utf8");
  return JSON.parse(raw) as Record<string, unknown>;
}

export type ChapterListItem = {
  slug: string;
  title: string;
  chapter: number;
};

export function listChaptersForLevel(level: string): ChapterListItem[] {
  return discoverChapterSlugs(level).map((slug) => {
    const rec = loadChapterRecord(level, slug);
    return {
      slug,
      title: typeof rec.title === "string" ? rec.title : slug,
      chapter: typeof rec.chapter === "number" ? rec.chapter : 0,
    };
  });
}

export function chapterExists(level: string, slug: string): boolean {
  if (!isValidContentLevel(level) || !isValidChapterSlug(slug)) return false;
  const file = path.join(getLevelContentDir(level), `${slug}.json`);
  return fs.existsSync(file);
}
