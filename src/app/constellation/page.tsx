"use client";

import { useRouter } from "next/navigation";
import MemoryMatchGame from "@/components/scenes/MemoryMatchGame";

export default function ConstellationMapPage() {
  const router = useRouter();
  return <MemoryMatchGame onProceed={() => router.push("/wishingwell")} />;
}
