export const PROGRESS_STORAGE_KEY = "jlpt-ai:progress:v1";

export type QuizScoreRecord = {
  score: number;
  total: number;
  xpEarned: number;
  perfect: boolean;
  completedAt: string;
};

export type ChapterProgress = {
  lessonProgress: number;
  tabsVisited: string[];
  quizCompleted: boolean;
  quizBestScore: number;
  quizBestTotal: number;
  quizAttempts: number;
  lastQuiz?: QuizScoreRecord;
  xpEarned: number;
  completed: boolean;
  lastVisitedAt: string;
  completedAt?: string;
};

export type UserProgress = {
  version: 1;
  totalXp: number;
  streakDays: number;
  lastActiveDate: string;
  chapters: Record<string, ChapterProgress>;
  badges: string[];
  dailyXp: Record<string, number>;
};

export type BadgeDefinition = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  tier: "bronze" | "silver" | "gold" | "legend";
};

export type RecordQuizInput = {
  level: string;
  slug: string;
  score: number;
  total: number;
  xpEarned: number;
  perfect: boolean;
};

export type UpdateLessonInput = {
  level: string;
  slug: string;
  lessonProgress: number;
  tabId?: string;
};
