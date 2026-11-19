import type { Metadata } from "next";
import { QuizClient } from "@/components/QuizClient";
import { QUIZ_TYPES, type QuizType } from "@/lib/heraldry/quiz";

export const metadata: Metadata = {
  title: "Quiz d'héraldique",
  description: "Quel blason est de qui ? Des centaines de questions pour apprendre à reconnaître les armoiries.",
};

export default async function QuizPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const initial = QUIZ_TYPES.find((t) => t.id === type)?.id as QuizType | undefined;
  return <QuizClient initialType={initial} />;
}
