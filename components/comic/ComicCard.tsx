"use client";

import ComicImage from "@/components/comic/ComicImage";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ComicListItem } from "@/types/comic";
import type { ComicProgress } from "@/lib/progress";

export type ComicCardProps = {
  level: string;
  comic: ComicListItem;
  comicProgress: ComicProgress | null;
  index?: number;
};

export default function ComicCard({ level, comic, comicProgress, index = 0 }: ComicCardProps) {
  const completed = comicProgress?.completed ?? false;
  const inProgress = !completed && (comicProgress?.currentPanel ?? 0) > 0;
  const progressPct = comic.pageCount
    ? Math.round(((comicProgress?.currentPanel ?? 0) / Math.max(comic.pageCount - 1, 1)) * 100)
    : 0;

  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="group"
    >
      <article className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-fuchsia-400/35 hover:shadow-xl hover:shadow-fuchsia-500/10">
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-violet-950">
          <ComicImage
            src={comic.coverImage}
            alt=""
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 320px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
          {completed ? (
            <span className="absolute right-3 top-3 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold tracking-wider text-emerald-200 uppercase backdrop-blur-sm">
              ✓ Complete
            </span>
          ) : inProgress ? (
            <span className="absolute right-3 top-3 rounded-full border border-cyan-400/40 bg-cyan-500/20 px-2.5 py-1 text-[10px] font-bold tracking-wider text-cyan-200 uppercase backdrop-blur-sm">
              {progressPct}%
            </span>
          ) : null}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-[10px] font-bold tracking-[0.2em] text-fuchsia-300/90 uppercase">
              {comic.difficulty}
            </p>
            <h2 className="mt-0.5 text-lg font-black text-white">{comic.title}</h2>
          </div>
        </div>

        <div className="space-y-3 p-4">
          <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-slate-300">
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
              ⏱ {comic.estimatedReadingTime}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
              {comic.pageCount} panels
            </span>
            <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1 text-cyan-200">
              {comic.vocabularyCount} vocab
            </span>
            <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-2.5 py-1 text-violet-200">
              {comic.grammarCount} grammar
            </span>
          </div>

          {inProgress ? (
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-400 transition-[width] duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          ) : null}

          <Link
            href={`/${level}/comics/${comic.storyId}`}
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 py-2.5 text-sm font-black text-slate-950 transition hover:shadow-md hover:shadow-fuchsia-500/30"
          >
            {completed ? "Read again →" : inProgress ? "Continue reading →" : "Start reading →"}
          </Link>
        </div>
      </article>
    </motion.li>
  );
}
