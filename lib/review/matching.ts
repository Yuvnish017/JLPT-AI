import type { AddReviewItemInput, ReviewItemType } from "@/types/review";
import type { Grammar, Kanji, Lesson, Vocabulary } from "@/types/lesson";

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function lessonId(level: string, slug: string): string {
  return `${level.toLowerCase()}/${slug}`;
}

function buildItemId(type: ReviewItemType, lesson: string, key: string): string {
  return `${type}:${lesson}:${key}`;
}

function matchVocabulary(
  answer: string,
  vocabulary: Vocabulary[],
  lesson: string,
): AddReviewItemInput | null {
  const target = normalize(answer);
  for (const item of vocabulary) {
    if (
      normalize(item.word) === target ||
      normalize(item.meaning) === target ||
      normalize(item.reading) === target
    ) {
      return {
        itemId: buildItemId("vocabulary", lesson, item.word),
        itemType: "vocabulary",
        lessonId: lesson,
        payload: {
          prompt: item.word,
          hint: item.reading,
          answer: item.meaning,
          detail: item.example,
        },
      };
    }
  }
  return null;
}

function matchKanji(answer: string, kanji: Kanji[], lesson: string): AddReviewItemInput | null {
  const target = normalize(answer);
  for (const item of kanji) {
    if (normalize(item.character) === target || normalize(item.meaning) === target) {
      const readings = [...(item.onyomi ?? []), ...(item.kunyomi ?? [])].join(" · ");
      return {
        itemId: buildItemId("kanji", lesson, item.character),
        itemType: "kanji",
        lessonId: lesson,
        payload: {
          prompt: item.character,
          hint: readings || undefined,
          answer: item.meaning,
          detail: item.examples?.[0]?.word,
        },
      };
    }
  }
  return null;
}

function matchGrammar(answer: string, grammar: Grammar[], lesson: string): AddReviewItemInput | null {
  const target = normalize(answer);
  for (const item of grammar) {
    if (normalize(item.pattern) === target || normalize(item.meaning) === target) {
      return {
        itemId: buildItemId("grammar", lesson, item.pattern),
        itemType: "grammar",
        lessonId: lesson,
        payload: {
          prompt: item.pattern,
          answer: item.meaning,
          detail: item.example,
        },
      };
    }
  }
  return null;
}

export function buildReviewItemFromQuizMistake(
  level: string,
  slug: string,
  lesson: Lesson,
  correctAnswer: string,
  questionText: string,
): AddReviewItemInput {
  const id = lessonId(level, slug);
  const vocab = lesson.vocabulary ?? [];
  const kanji = lesson.kanji ?? [];
  const grammar = lesson.grammar ?? [];

  return (
    matchVocabulary(correctAnswer, vocab, id) ??
    matchKanji(correctAnswer, kanji, id) ??
    matchGrammar(correctAnswer, grammar, id) ?? {
      itemId: buildItemId("vocabulary", id, normalize(correctAnswer).replace(/\s+/g, "-")),
      itemType: "vocabulary",
      lessonId: id,
      payload: {
        prompt: questionText,
        answer: correctAnswer,
      },
    }
  );
}
