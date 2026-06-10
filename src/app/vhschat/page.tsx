"use client";

import { useRouter } from "next/navigation";
import VHSChat from "@/components/scenes/VHSChat";

export default function VHSChatPage() {
  const router = useRouter();
  return <VHSChat onProceed={() => router.push("/lovetimeline")} />;
}
