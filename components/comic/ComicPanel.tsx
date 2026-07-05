"use client";

import ComicImage from "@/components/comic/ComicImage";
import { useState, type ReactNode } from "react";
import type { ComicPanel as ComicPanelType } from "@/types/comic";
import type { Grammar, Vocabulary } from "@/types/lesson";
import SpeechBubble from "./SpeechBubble";

export type ComicPanelProps = {
  panel: ComicPanelType;
  showFurigana: boolean;
  showEnglish: boolean;
  showVocabHints: boolean;
  vocabulary: Vocabulary[];
  grammar: Grammar[];
  onVocabClick: (vocab: Vocabulary) => void;
  onGrammarClick: (grammar: Grammar) => void;
  bubblePosition?: "left" | "right" | "center";
};

function buildClickableJapanese(
  text: string,
  vocabulary: Vocabulary[],
  onVocabClick: (vocab: Vocabulary) => void,
  showHints: boolean,
): ReactNode[] {
  if (!vocabulary.length) return [text];

  const sorted = [...vocabulary].sort((a, b) => b.word.length - a.word.length);
  const parts: ReactNode[] = [];
  let i = 0;

  while (i < text.length) {
    let matched: Vocabulary | null = null;
    for (const v of sorted) {
      if (text.slice(i, i + v.word.length) === v.word) {
        matched = v;
        break;
      }
    }
    if (matched) {
      parts.push(
        <button
          key={`${i}-${matched.word}`}
          type="button"
          onClick={() => onVocabClick(matched!)}
          className={`mx-0.5 rounded px-0.5 font-bold underline decoration-dotted underline-offset-4 transition hover:bg-cyan-400/20 ${
            showHints ? "text-cyan-700" : "text-slate-900"
          }`}
        >
          {matched.word}
        </button>,
      );
      i += matched.word.length;
    } else {
      const nextIdx = sorted.reduce((min, v) => {
        const pos = text.indexOf(v.word, i);
        return pos >= 0 && pos < min ? pos : min;
      }, text.length);
      parts.push(text.slice(i, nextIdx));
      i = nextIdx;
    }
  }

  return parts;
}

export default function ComicPanel({
  panel,
  showFurigana,
  showEnglish,
  showVocabHints,
  vocabulary,
  grammar,
  onVocabClick,
  onGrammarClick,
  bubblePosition = "center",
}: ComicPanelProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-2xl border-4 border-slate-950 bg-white shadow-2xl shadow-black/40">
        {!imgError ? (
          <ComicImage
            src={panel.image}
            alt={panel.sceneDescription}
            variant="panel"
            onError={() => setImgError(true)}
            priority
          />
        ) : (
          <div className="flex min-h-[200px] flex-col items-center justify-center bg-neutral-100 p-8 text-center">
            <p className="text-[10px] font-bold tracking-[0.3em] text-slate-500 uppercase">
              Scene {panel.panelNumber}
            </p>
            <p className="mt-2 max-w-sm text-sm text-slate-600">{panel.sceneDescription}</p>
          </div>
        )}
      </div>

      {grammar.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {grammar.map((g) => (
            <button
              key={g.pattern}
              type="button"
              onClick={() => onGrammarClick(g)}
              className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-[11px] font-bold text-violet-200 transition hover:bg-violet-500/20"
            >
              {g.pattern}
            </button>
          ))}
        </div>
      ) : null}

      <SpeechBubble position={bubblePosition}>
        <p className="text-xl leading-relaxed font-bold text-slate-900">
          {buildClickableJapanese(panel.japanese, vocabulary, onVocabClick, showVocabHints)}
        </p>
        {showFurigana && panel.furigana ? (
          <p className="mt-2 text-sm text-slate-500">{panel.furigana}</p>
        ) : null}
        {showEnglish && panel.english ? (
          <p className="mt-3 border-t border-slate-200 pt-3 text-sm text-slate-600 italic">
            {panel.english}
          </p>
        ) : null}
      </SpeechBubble>
    </div>
  );
}
