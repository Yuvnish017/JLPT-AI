import { notFound } from "next/navigation";
import ChapterLessonClient from "@/components/chapter/ChapterLessonClient";
import {
  chapterExists,
  discoverChapterSlugs,
  isValidContentLevel,
  loadChapterRecord,
} from "@/lib/content/loadChapter";
import type { Lesson } from "@/types/lesson";

const OTHER_LEVELS = ["n1", "n2", "n3", "n4"] as const;

type Props = { params: Promise<{ level: string; slug: string }> };

export async function generateStaticParams() {
  const out: { level: string; slug: string }[] = [];
  for (const level of OTHER_LEVELS) {
    for (const slug of discoverChapterSlugs(level)) {
      out.push({ level, slug });
    }
  }
  return out;
}

export const dynamicParams = true;

export default async function DynamicLevelChapterPage({ params }: Props) {
  const { level, slug } = await params;
  const lv = level.toLowerCase();

  if (!isValidContentLevel(lv) || lv === "n5") {
    notFound();
  }
  if (!chapterExists(lv, slug)) notFound();

  const rawLesson = loadChapterRecord(lv, slug);
  const lesson = rawLesson as unknown as Lesson;

  return (
    <ChapterLessonClient level={lv} slug={slug} rawLesson={rawLesson} lesson={lesson} />
  );
}
