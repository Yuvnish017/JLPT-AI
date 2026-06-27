import { listChaptersForLevel } from "@/lib/content/loadChapter";
import { listComicsForLevel } from "@/lib/content/loadComic";
import LevelChapterHubClient from "./LevelChapterHubClient";

export default function LevelChapterHub({ level }: { level: string }) {
  const lv = level.toLowerCase();
  const chapters = listChaptersForLevel(lv);
  const comics = listComicsForLevel(lv);

  return <LevelChapterHubClient level={lv} chapters={chapters} comics={comics} />;
}
