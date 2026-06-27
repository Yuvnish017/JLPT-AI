export type ProgressBarProps = {
  current: number;
  total: number;
  className?: string;
};

export default function ProgressBar({ current, total, className = "" }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold tracking-wider text-slate-400 uppercase">
        <span>Reading progress</span>
        <span className="tabular-nums text-cyan-300">
          {current + 1} / {total}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-400 transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={current + 1}
          aria-valuemin={1}
          aria-valuemax={total}
        />
      </div>
    </div>
  );
}
