"use client";

import { useRouter } from "next/navigation";
import SweetQuiz from "@/components/scenes/SweetQuiz";

export default function SweetQuizPage() {
  const router = useRouter();
  return <SweetQuiz onProceed={() => router.push("/constellation")} />;
}
