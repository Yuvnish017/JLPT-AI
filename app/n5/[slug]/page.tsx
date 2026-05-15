import { notFound } from "next/navigation";
import ChapterLessonClient from "@/components/chapter/ChapterLessonClient";
import { chapterExists, discoverChapterSlugs, loadChapterRecord } from "@/lib/content/loadChapter";
import type { Lesson } from "@/types/lesson";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return discoverChapterSlugs("n5").map((slug) => ({ slug }));
}

export const dynamicParams = true;

export default async function N5ChapterPage({ params }: Props) {
  const { slug } = await params;
  if (!chapterExists("n5", slug)) notFound();

  const rawLesson = loadChapterRecord("n5", slug);
  const lesson = rawLesson as unknown as Lesson;

  return (
    <ChapterLessonClient
      level="n5"
      slug={slug}
      rawLesson={rawLesson}
      lesson={lesson}
    />
  );
}
