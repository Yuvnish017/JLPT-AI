import ReviewCenterClient from "@/components/review/ReviewCenterClient";

export const metadata = {
  title: "Review Center · JLPT AI",
  description: "Spaced repetition review for vocabulary, kanji, and grammar.",
};

export default function ReviewPage() {
  return <ReviewCenterClient />;
}
