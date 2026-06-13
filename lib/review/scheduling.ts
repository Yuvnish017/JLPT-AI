export function todayDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/**
 * Spaced repetition scheduling.
 * Wrong: mistake 1 → 1 day, 2 → 3 days, 3+ → 7 days.
 * Correct: scales with consecutive correct answers.
 */
export function calculateNextReviewDate(
  mistakes: number,
  timesCorrect: number,
  wasCorrect: boolean,
  fromDate = new Date(),
): string {
  let daysToAdd: number;

  if (wasCorrect) {
    if (timesCorrect <= 1) daysToAdd = 3;
    else if (timesCorrect === 2) daysToAdd = 7;
    else if (timesCorrect === 3) daysToAdd = 14;
    else daysToAdd = 30;
  } else if (mistakes <= 1) {
    daysToAdd = 1;
  } else if (mistakes === 2) {
    daysToAdd = 3;
  } else {
    daysToAdd = 7;
  }

  return todayDateKey(addDays(fromDate, daysToAdd));
}

export function isDue(nextReviewDate: string, dateKey = todayDateKey()): boolean {
  return nextReviewDate <= dateKey;
}
