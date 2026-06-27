"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import ComicCompletionDialog from "@/components/comic/ComicCompletionDialog";
import ComicPanel from "@/components/comic/ComicPanel";
import GrammarPopup from "@/components/comic/GrammarPopup";
import ProgressBar from "@/components/comic/ProgressBar";
import ReaderControls from "@/components/comic/ReaderControls";
import VocabularyPopup from "@/components/comic/VocabularyPopup";
import ProgressHud from "@/components/progress/ProgressHud";
import XpGainToast from "@/components/progress/XpGainToast";
import { comicKey } from "@/lib/progress";
import { COMIC_COMPLETE_XP } from "@/lib/progress/constants";
import { useProgress } from "@/hooks/useProgress";
import { useReview } from "@/hooks/useReview";
import type { ComicStory, ReadingMode } from "@/types/comic";
import type { Grammar, Vocabulary } from "@/types/lesson";

export type ComicReaderClientProps = {
  level: string;
  storyId: string;
  story: ComicStory;
  levelHubPath: string;
};

type ChallengeReveals = {
  furigana: boolean;
  translation: boolean;
  vocabulary: boolean;
};

export default function ComicReaderClient({
  level,
  storyId,
  story,
  levelHubPath,
}: ComicReaderClientProps) {
  const lv = level.toLowerCase();
  const reduceMotion = useReducedMotion();
  const { progress, saveComicPanel, finishComic } = useProgress();
  const { addItem } = useReview();

  const saved = progress.comics[comicKey(lv, storyId)];
  const totalPanels = story.pages.length;

  const [panelIndex, setPanelIndex] = useState(() =>
    Math.min(saved?.currentPanel ?? 0, Math.max(totalPanels - 1, 0)),
  );
  const [mode, setMode] = useState<ReadingMode>("study");
  const [showFurigana, setShowFurigana] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);
  const [challengeReveals, setChallengeReveals] = useState<ChallengeReveals>({
    furigana: false,
    translation: false,
    vocabulary: false,
  });
  const [selectedVocab, setSelectedVocab] = useState<Vocabulary | null>(null);
  const [selectedGrammar, setSelectedGrammar] = useState<Grammar | null>(null);
  const [addedReviewIds, setAddedReviewIds] = useState<Set<string>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completionXp, setCompletionXp] = useState(0);
  const [xpBurst, setXpBurst] = useState<{ id: number; amount: number; label: string } | null>(
    null,
  );

  const readerRef = useRef<HTMLDivElement>(null);
  const readingSecondsRef = useRef(saved?.readingSeconds ?? 0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const panel = story.pages[panelIndex]!;
  const bubblePosition =
    panelIndex % 3 === 0 ? "left" : panelIndex % 3 === 1 ? "right" : "center";

  const effectiveShowFurigana =
    mode === "study" ? showFurigana : mode === "challenge" ? challengeReveals.furigana : false;
  const effectiveShowEnglish =
    mode === "study" ? showEnglish : mode === "challenge" ? challengeReveals.translation : false;
  const effectiveShowVocabHints = mode === "challenge" && challengeReveals.vocabulary;

  const panelVariants = reduceMotion
    ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        enter: { opacity: 0, x: 40, scale: 0.98 },
        center: { opacity: 1, x: 0, scale: 1 },
        exit: { opacity: 0, x: -40, scale: 0.98 },
      };

  useEffect(() => {
    tickRef.current = setInterval(() => {
      readingSecondsRef.current += 1;
    }, 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  useEffect(() => {
    saveComicPanel({
      level: lv,
      storyId,
      panelIndex,
      readingSecondsDelta: 0,
    });
  }, [panelIndex, lv, storyId, saveComicPanel]);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const handleFinish = useCallback(() => {
    const result = finishComic({
      level: lv,
      storyId,
      readingSeconds: readingSecondsRef.current,
    });
    if (result.xpAdded > 0) {
      setCompletionXp(result.xpAdded);
      setXpBurst({ id: Date.now(), amount: result.xpAdded, label: "Story complete!" });
      setTimeout(() => setXpBurst(null), 2800);
    }
    setShowCompletion(true);
  }, [finishComic, lv, storyId]);

  const goNext = useCallback(() => {
    if (panelIndex < totalPanels - 1) {
      setPanelIndex((i) => i + 1);
      setChallengeReveals({ furigana: false, translation: false, vocabulary: false });
    } else if (!saved?.completed) {
      handleFinish();
    } else {
      setShowCompletion(true);
    }
  }, [panelIndex, totalPanels, saved?.completed, handleFinish]);

  const goPrev = useCallback(() => {
    if (panelIndex > 0) {
      setPanelIndex((i) => i - 1);
      setChallengeReveals({ furigana: false, translation: false, vocabulary: false });
    }
  }, [panelIndex]);

  const toggleFullscreen = useCallback(async () => {
    if (!readerRef.current) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await readerRef.current.requestFullscreen();
    }
  }, []);

  const handleAddToReview = useCallback(
    (vocab: Vocabulary) => {
      const itemId = `comic-${story.id}-vocab-${vocab.word}`;
      addItem({
        itemId,
        itemType: "vocabulary",
        lessonId: `comics/${story.id}`,
        payload: {
          prompt: vocab.word,
          answer: vocab.meaning,
          hint: vocab.reading,
          detail: vocab.example,
        },
      });
      setAddedReviewIds((prev) => new Set(prev).add(itemId));
    },
    [addItem, story.id],
  );

  const handleChallengeReveal = useCallback((key: keyof ChallengeReveals) => {
    setChallengeReveals((prev) => ({ ...prev, [key]: true }));
  }, []);

  const handleModeChange = useCallback((next: ReadingMode) => {
    setMode(next);
    setChallengeReveals({ furigana: false, translation: false, vocabulary: false });
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-slate-950 to-slate-950" />
      </div>

      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link
            href={`/${lv}/comics`}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-bold tracking-widest text-cyan-200 uppercase"
          >
            ← Comics
          </Link>
          <ProgressHud compact />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        <div ref={readerRef} className="rounded-3xl border border-white/10 bg-slate-900/50 p-4 sm:p-6">
          <div className="mb-6">
            <p className="text-[10px] font-bold tracking-[0.2em] text-fuchsia-300 uppercase">
              {story.difficulty} · {story.estimatedReadingTime}
            </p>
            <h1 className="mt-1 text-xl font-black text-white sm:text-2xl">{story.title}</h1>
            <ProgressBar current={panelIndex} total={totalPanels} className="mt-4" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={panel.panelNumber}
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reduceMotion ? 0.15 : 0.35, ease: "easeOut" }}
            >
              <ComicPanel
                panel={panel}
                showFurigana={effectiveShowFurigana}
                showEnglish={effectiveShowEnglish}
                showVocabHints={effectiveShowVocabHints}
                vocabulary={story.vocabularyUsed}
                grammar={story.grammarUsed}
                onVocabClick={setSelectedVocab}
                onGrammarClick={setSelectedGrammar}
                bubblePosition={bubblePosition}
              />
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 border-t border-white/10 pt-6">
            <ReaderControls
              mode={mode}
              onModeChange={handleModeChange}
              showFurigana={showFurigana}
              showEnglish={showEnglish}
              onToggleFurigana={() => setShowFurigana((v) => !v)}
              onToggleEnglish={() => setShowEnglish((v) => !v)}
              onPrev={goPrev}
              onNext={goNext}
              canPrev={panelIndex > 0}
              canNext
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
              challengeReveals={challengeReveals}
              onChallengeReveal={handleChallengeReveal}
            />
          </div>
        </div>
      </main>

      <VocabularyPopup
        vocab={selectedVocab}
        onClose={() => setSelectedVocab(null)}
        onAddToReview={handleAddToReview}
        added={selectedVocab ? addedReviewIds.has(`comic-${story.id}-vocab-${selectedVocab.word}`) : false}
      />
      <GrammarPopup
        grammar={selectedGrammar}
        jlptLevel={story.difficulty}
        onClose={() => setSelectedGrammar(null)}
      />
      <ComicCompletionDialog
        open={showCompletion}
        title={story.title}
        vocabulary={story.vocabularyUsed}
        grammar={story.grammarUsed}
        readingSeconds={readingSecondsRef.current}
        xpEarned={completionXp || (saved?.completed ? saved.xpEarned : COMIC_COMPLETE_XP)}
        levelHubPath={levelHubPath}
        levelLabel={lv.toUpperCase()}
        comicsPath={`/${lv}/comics`}
        onClose={() => setShowCompletion(false)}
      />
      <XpGainToast burst={xpBurst} />
    </div>
  );
}
