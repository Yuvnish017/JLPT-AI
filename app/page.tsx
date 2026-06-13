import Link from "next/link";
import HomeProgressDashboard from "@/components/progress/HomeProgressDashboard";
import ProgressHud from "@/components/progress/ProgressHud";

const levels = [
  {
    level: "N5",
    href: "/n5",
    title: "Foundation Builder",
    description: "Master hiragana, katakana, and essential beginner grammar.",
    accent: "from-cyan-400/40 to-blue-500/30",
  },
  {
    level: "N4",
    href: "/n4",
    title: "Daily Japanese",
    description: "Strengthen practical grammar and vocabulary for daily life.",
    accent: "from-fuchsia-400/40 to-violet-500/30",
  },
  {
    level: "N3",
    href: "/n3",
    title: "Bridge to Fluency",
    description: "Tackle intermediate reading and nuanced listening patterns.",
    accent: "from-rose-400/40 to-orange-400/30",
  },
  {
    level: "N2",
    href: "/n2",
    title: "Advanced Mastery",
    description: "Understand complex grammar, long passages, and formal language.",
    accent: "from-emerald-400/40 to-teal-500/30",
  },
  {
    level: "N1",
    href: "/n1",
    title: "Elite Challenge",
    description: "Train for native-level speed, accuracy, and deep comprehension.",
    accent: "from-amber-400/40 to-red-500/30",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-fuchsia-600/25 blur-3xl" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-purple-700/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col px-6 pb-16 pt-14 sm:px-10 lg:px-16">
        <header className="mb-14 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-cyan-200 uppercase">
            JLPT AI
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ProgressHud compact />
            <Link
              href="/review"
              className="rounded-lg border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-[10px] font-bold tracking-widest text-violet-200 uppercase transition hover:border-violet-400/50"
            >
              Review
            </Link>
            <span className="text-xs tracking-[0.14em] text-slate-300/80 uppercase">
              Anime Inspired Learning
            </span>
          </div>
        </header>

        <section className="grid items-center gap-12 pb-14 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-fuchsia-300/30 bg-fuchsia-500/10 px-4 py-1 text-xs font-semibold tracking-[0.16em] text-fuchsia-200 uppercase">
              Your Journey to JLPT Success
            </p>
            <h1 className="text-balance text-4xl leading-tight font-black sm:text-5xl lg:text-6xl">
              Learn Japanese with{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-violet-300 bg-clip-text text-transparent">
                AI-powered practice
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Personalized quizzes, anime-style motivation, and adaptive review
              paths designed for every JLPT level from N5 to N1.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/n5"
                className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-8 py-3 text-sm font-bold tracking-wide text-slate-950 transition duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-fuchsia-500/30 sm:text-base"
              >
                Start Learning
              </Link>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                50k+ learners leveling up daily
              </div>
            </div>
          </div>

          <HomeProgressDashboard />
        </section>

        <section className="pt-6">
          <h2 className="text-2xl font-bold text-slate-100 sm:text-3xl">
            Choose your level
          </h2>
          <p className="mt-2 text-sm text-slate-300 sm:text-base">
            Structured learning paths tailored for every JLPT tier.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
            {levels.map((item) => (
              <Link
                key={item.level}
                href={item.href}
                className="group relative block overflow-hidden rounded-2xl border border-white/15 bg-slate-900/70 p-5 transition duration-300 hover:-translate-y-1 hover:border-fuchsia-300/50"
              >
                <div
                  className={`absolute inset-0 -z-0 bg-gradient-to-br ${item.accent} opacity-0 transition duration-300 group-hover:opacity-100`}
                />
                <div className="relative z-10">
                  <p className="text-xs font-semibold tracking-[0.14em] text-cyan-200 uppercase">
                    {item.level}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-slate-100">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    {item.description}
                  </p>
                  <p className="mt-4 text-xs font-bold tracking-wide text-fuchsia-300/90">
                    Open path →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}