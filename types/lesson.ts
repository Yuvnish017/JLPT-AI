export interface KanjiExample {
    word: string;
    reading: string;
    meaning: string;
}

export interface Kanji {
    character: string;
    onyomi: string[];
    kunyomi: string[];
    meaning: string;
    stroke_count?: number;
    examples: KanjiExample[];
}

export interface Vocabulary {
    word: string;
    meaning: string;
    reading: string;
    example?: string;
}

export interface Grammar {
    pattern: string;
    meaning: string;
    example: string;
}

/** Short reading passage or dialogue for the chapter (optional). */
export interface ReadingExercise {
    title: string;
    passage: string;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    answer: string;
}

/**
 * One chapter of content. Include only the blocks this chapter teaches.
 * Omitted keys mean that track is not part of this chapter (UI hides them).
 */
export interface Lesson {
    title: string;
    jlpt: string;
    chapter: number;
    kanji?: Kanji[];
    vocabulary?: Vocabulary[];
    grammar?: Grammar[];
    reading?: ReadingExercise[];
    quiz?: QuizQuestion[];
}
