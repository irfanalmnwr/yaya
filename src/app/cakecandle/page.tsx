"use client";

import { useRouter } from "next/navigation";
import CakeCandle from "@/components/scenes/CakeCandle";

export default function CakeCandlePage() {
  const router = useRouter();
  return <CakeCandle onProceed={() => router.push("/loveletter")} />;
}
