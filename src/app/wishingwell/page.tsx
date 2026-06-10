"use client";

import { useRouter } from "next/navigation";
import WishingWell from "@/components/scenes/WishingWell";

export default function WishingWellPage() {
  const router = useRouter();
  return <WishingWell onProceed={() => router.push("/endingcredits")} />;
}
