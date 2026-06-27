import { notFound } from "next/navigation";
import ComicReaderClient from "@/components/comic/ComicReaderClient";
import { comicExists, loadComicStory } from "@/lib/content/loadComic";

type Props = {
  params: Promise<{ storyId: string }>;
};

export async function ComicReaderPage({
  level,
  params,
}: {
  level: string;
  params: Promise<{ storyId: string }>;
}) {
  const { storyId } = await params;
  const lv = level.toLowerCase();

  if (!comicExists(lv, storyId)) {
    notFound();
  }

  const story = loadComicStory(lv, storyId);
  const levelHubPath = `/${lv}`;

  return (
    <ComicReaderClient
      level={lv}
      storyId={storyId}
      story={story}
      levelHubPath={levelHubPath}
    />
  );
}
