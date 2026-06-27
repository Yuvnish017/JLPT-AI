import { ComicReaderPage } from "@/components/comic/ComicReaderPage";
import { discoverComicStoryIds } from "@/lib/content/loadComic";

type Props = {
  params: Promise<{ storyId: string }>;
};

export function generateStaticParams() {
  return discoverComicStoryIds("n5").map((storyId) => ({ storyId }));
}

export const dynamicParams = true;

export default function N5ComicReaderPage({ params }: Props) {
  return ComicReaderPage({ level: "n5", params });
}
