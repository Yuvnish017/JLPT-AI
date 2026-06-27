import { notFound, redirect } from "next/navigation";
import { ComicReaderPage } from "@/components/comic/ComicReaderPage";
import { discoverComicStoryIds } from "@/lib/content/loadComic";
import { isValidContentLevel } from "@/lib/content/loadChapter";

const OTHER_LEVELS = ["n1", "n2", "n3", "n4"] as const;

type Props = {
  params: Promise<{ level: string; storyId: string }>;
};

export async function generateStaticParams() {
  const out: { level: string; storyId: string }[] = [];
  for (const level of OTHER_LEVELS) {
    for (const storyId of discoverComicStoryIds(level)) {
      out.push({ level, storyId });
    }
  }
  return out;
}

export const dynamicParams = true;

export default async function LevelComicReaderPage({ params }: Props) {
  const { level, storyId } = await params;
  const slug = level.toLowerCase();

  if (!isValidContentLevel(slug)) {
    notFound();
  }

  if (slug === "n5") {
    redirect(`/n5/comics/${storyId}`);
  }

  return ComicReaderPage({ level: slug, params: Promise.resolve({ storyId }) });
}
