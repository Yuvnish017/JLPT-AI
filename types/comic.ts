import type { Grammar, Vocabulary } from "@/types/lesson";

export type ComicPanel = {
  panelNumber: number;
  sceneDescription: string;
  japanese: string;
  furigana: string;
  english: string;
  image: string;
};

export type ComicStory = {
  id: string;
  title: string;
  difficulty: string;
  estimatedReadingTime: string;
  coverImage: string;
  vocabularyUsed: Vocabulary[];
  grammarUsed: Grammar[];
  pages: ComicPanel[];
};

export type ComicListItem = {
  storyId: string;
  title: string;
  difficulty: string;
  estimatedReadingTime: string;
  coverImage: string;
  pageCount: number;
  vocabularyCount: number;
  grammarCount: number;
  vocabularyTerms: string[];
  grammarPatterns: string[];
};

export type ReadingMode = "japanese" | "study" | "challenge";

export type ComicFilters = {
  difficulty: string;
  vocabulary: string;
  grammar: string;
  readingLength: "all" | "short" | "medium" | "long";
};
