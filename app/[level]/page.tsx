import Link from "next/link";
import { notFound } from "next/navigation";
import LevelChapterHub from "@/components/chapter/LevelChapterHub";
import { isValidContentLevel, listChaptersForLevel } from "@/lib/content/loadChapter";

const PLACEHOLDER_LEVELS = new Set(["n1", "n2", "n3", "n4"]);

type Props = {
  params: Promise<{ level: string }>;
};

export default async function LevelLandingPage({ params }: Props) {
  const { level } = await params;
  const slug = level.toLowerCase();

  if (!isValidContentLevel(slug)) {
    notFound();
  }

  if (slug === "n5") {
    const { redirect } = await import("next/navigation");
    redirect("/n5");
  }

  const chapters = listChaptersForLevel(slug);
  if (chapters.length > 0) {
    return <LevelChapterHub level={slug} />;
  }

  if (!PLACEHOLDER_LEVELS.has(slug)) {
    notFound();
  }

  const label = slug.toUpperCase();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute right-0 top-1/4 h-72 w-72 rounded-full bg-violet-600/20 blur-[100px]" />
      </div>

      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-bold tracking-widest text-cyan-200 uppercase transition hover:border-fuchsia-400/40"
          >
            ← Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <p className="text-[10px] font-bold tracking-[0.3em] text-fuchsia-300/90 uppercase">
          {label}
        </p>
        <h1 className="mt-3 text-3xl font-black sm:text-4xl">
          <span className="bg-gradient-to-r from-cyan-200 to-fuchsia-200 bg-clip-text text-transparent">
            Coming soon
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
          Add chapter JSON files under{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-cyan-200/90">
            content/{slug}/
          </code>{" "}
          (for example <code className="text-cyan-200/90">chapter-1.json</code>) and this page will
          list them automatically.
        </p>
        <Link
          href="/n5"
          className="mt-10 inline-flex rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-8 py-3 text-sm font-black text-slate-950 shadow-lg shadow-fuchsia-500/25 transition hover:shadow-fuchsia-500/40"
        >
          Go to N5
        </Link>
      </main>
    </div>
  );
}
