/** Client-safe comic helpers (no filesystem imports). */

export function parseReadingMinutes(estimatedReadingTime: string): number {
  const m = /(\d+)/.exec(estimatedReadingTime);
  return m ? parseInt(m[1]!, 10) : 5;
}

export function readingLengthBucket(minutes: number): "short" | "medium" | "long" {
  if (minutes <= 3) return "short";
  if (minutes <= 7) return "medium";
  return "long";
}
