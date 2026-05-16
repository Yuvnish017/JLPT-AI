import Link from "next/link";
import { listChaptersForLevel } from "@/lib/content/loadChapter";

export default function LevelChapterHub({ level }: { level: string }) {
  const lv = level.toLowerCase();
  const chapters = listChaptersForLevel(lv);
  const label = lv.toUpperCase();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute left-1/3 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-[100px]" />
      </div>

      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-bold tracking-widest text-cyan-200 uppercase transition hover:border-fuchsia-400/40"
          >
            ← Home
          </Link>
          <p className="text-[10px] font-semibold tracking-[0.25em] text-fuchsia-300/90 uppercase">
            JLPT {label}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-balance text-3xl font-black sm:text-4xl">
          <span className="bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-violet-200 bg-clip-text text-transparent">
            {label} · Chapters
          </span>
        </h1>

        {chapters.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] px-6 py-12 text-center">
            <p className="font-semibold text-white">No chapters yet</p>
            <p className="mt-2 text-sm text-slate-400">
              Create <code className="text-cyan-200/90">content/{lv}/chapter-1.json</code> to
              get started.
            </p>
          </div>
        ) : (
          <ul className="mt-10 flex flex-col gap-4">
            {chapters.map((ch) => (
              <li key={ch.slug}>
                <Link
                  href={`/${lv}/${ch.slug}`}
                  className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/50 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/35 hover:shadow-lg hover:shadow-cyan-500/10 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-cyan-300/90 uppercase">
                      {ch.chapter > 0 ? `Chapter ${ch.chapter}` : ch.slug}
                    </p>
                    <h2 className="mt-1 text-balance text-lg font-bold text-white sm:text-xl">
                      {ch.title}
                    </h2>
                  </div>
                  <span className="inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-2.5 text-sm font-black text-slate-950 transition group-hover:shadow-md group-hover:shadow-fuchsia-500/30">
                    Enter →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
