import { listChaptersForLevel } from "@/lib/content/loadChapter";
import LevelChapterHubClient from "./LevelChapterHubClient";

export default function LevelChapterHub({ level }: { level: string }) {
  const lv = level.toLowerCase();
  const chapters = listChaptersForLevel(lv);

  return <LevelChapterHubClient level={lv} chapters={chapters} />;
}
