"use client";

import { useRouter } from "next/navigation";
import LoveLetter from "@/components/scenes/LoveLetter";

export default function LoveLetterPage() {
  const router = useRouter();
  return <LoveLetter onProceed={() => router.push("/vhschat")} />;
}
