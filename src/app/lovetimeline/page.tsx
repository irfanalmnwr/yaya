"use client";

import { useRouter } from "next/navigation";
import LoveTimeline from "@/components/scenes/LoveTimeline";

export default function LoveTimelinePage() {
  const router = useRouter();
  return <LoveTimeline onProceed={() => router.push("/cassettetape")} />;
}
