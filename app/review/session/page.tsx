import ReviewSessionClient from "@/components/review/ReviewSessionClient";

export const metadata = {
  title: "Review Session · JLPT AI",
  description: "Practice due review items with spaced repetition.",
};

export default function ReviewSessionPage() {
  return <ReviewSessionClient />;
}
