"use client";

import type { ReadingMode } from "@/types/comic";

export type ReaderControlsProps = {
  mode: ReadingMode;
  onModeChange: (mode: ReadingMode) => void;
  showFurigana: boolean;
  showEnglish: boolean;
  onToggleFurigana: () => void;
  onToggleEnglish: () => void;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  challengeReveals?: {
    furigana: boolean;
    translation: boolean;
    vocabulary: boolean;
  };
  onChallengeReveal?: (key: "furigana" | "translation" | "vocabulary") => void;
};

const MODES: { id: ReadingMode; label: string }[] = [
  { id: "japanese", label: "Japanese" },
  { id: "study", label: "Study" },
  { id: "challenge", label: "Challenge" },
];

export default function ReaderControls({
  mode,
  onModeChange,
  showFurigana,
  showEnglish,
  onToggleFurigana,
  onToggleEnglish,
  onPrev,
  onNext,
  canPrev,
  canNext,
  isFullscreen,
  onToggleFullscreen,
  challengeReveals,
  onChallengeReveal,
}: ReaderControlsProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onModeChange(m.id)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
              mode === m.id
                ? "bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950"
                : "border border-white/15 bg-white/5 text-slate-300 hover:border-cyan-400/30"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === "study" ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onToggleFurigana}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
              showFurigana
                ? "border border-cyan-400/40 bg-cyan-500/15 text-cyan-200"
                : "border border-white/10 text-slate-400"
            }`}
          >
            Furigana {showFurigana ? "ON" : "OFF"}
          </button>
          <button
            type="button"
            onClick={onToggleEnglish}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
              showEnglish
                ? "border border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-200"
                : "border border-white/10 text-slate-400"
            }`}
          >
            English {showEnglish ? "ON" : "OFF"}
          </button>
        </div>
      ) : null}

      {mode === "challenge" && challengeReveals && onChallengeReveal ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onChallengeReveal("furigana")}
            disabled={challengeReveals.furigana}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold text-slate-300 disabled:opacity-50"
          >
            {challengeReveals.furigana ? "Furigana revealed" : "Reveal furigana"}
          </button>
          <button
            type="button"
            onClick={() => onChallengeReveal("translation")}
            disabled={challengeReveals.translation}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold text-slate-300 disabled:opacity-50"
          >
            {challengeReveals.translation ? "Translation revealed" : "Reveal translation"}
          </button>
          <button
            type="button"
            onClick={() => onChallengeReveal("vocabulary")}
            disabled={challengeReveals.vocabulary}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold text-slate-300 disabled:opacity-50"
          >
            {challengeReveals.vocabulary ? "Hints shown" : "Vocabulary hints"}
          </button>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canPrev}
          className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-bold text-slate-200 disabled:opacity-30"
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={onToggleFullscreen}
          className="rounded-xl border border-white/15 px-3 py-2.5 text-sm"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? "⤢" : "⤢"}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className="rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-2.5 text-sm font-black text-slate-950 disabled:opacity-30"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
