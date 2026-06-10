"use client";

import { useRouter } from "next/navigation";
import LockScreen from "@/components/scenes/LockScreen";

export default function LockScreenPage() {
  const router = useRouter();
  return <LockScreen onUnlock={() => router.push("/cakecandle")} />;
}
