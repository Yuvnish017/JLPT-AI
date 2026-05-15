import { notFound } from "next/navigation";
import ChapterFlashcardsClient from "@/components/chapter/ChapterFlashcardsClient";
import { chapterExists, discoverChapterSlugs, loadChapterRecord } from "@/lib/content/loadChapter";
import type { Lesson } from "@/types/lesson";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return discoverChapterSlugs("n5").map((slug) => ({ slug }));
}

export const dynamicParams = true;

export default async function N5ChapterFlashcardsPage({ params }: Props) {
  const { slug } = await params;
  if (!chapterExists("n5", slug)) notFound();

  const rawLesson = loadChapterRecord("n5", slug);
  const lesson = rawLesson as unknown as Lesson;
  const chapterBase = `/n5/${slug}`;
  const levelHubPath = "/n5";

  return (
    <ChapterFlashcardsClient
      rawLesson={rawLesson}
      lesson={lesson}
      chapterBase={chapterBase}
      levelHubPath={levelHubPath}
    />
  );
}
