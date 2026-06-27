import { listComicsForLevel } from "@/lib/content/loadComic";
import ComicHomeClient from "@/components/comic/ComicHomeClient";

export default function ComicHome({ level }: { level: string }) {
  const lv = level.toLowerCase();
  const comics = listComicsForLevel(lv);
  return <ComicHomeClient level={lv} comics={comics} />;
}
