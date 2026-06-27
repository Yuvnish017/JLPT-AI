import { notFound, redirect } from "next/navigation";
import ComicHome from "@/components/comic/ComicHome";
import { isValidContentLevel } from "@/lib/content/loadChapter";

type Props = {
  params: Promise<{ level: string }>;
};

export default async function LevelComicsPage({ params }: Props) {
  const { level } = await params;
  const slug = level.toLowerCase();

  if (!isValidContentLevel(slug)) {
    notFound();
  }

  if (slug === "n5") {
    redirect("/n5/comics");
  }

  return <ComicHome level={slug} />;
}
