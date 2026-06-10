"use client";

import { useRouter } from "next/navigation";
import KoreanPhotobooth from "@/components/scenes/KoreanPhotobooth";

export default function KoreanPhotoboothPage() {
  const router = useRouter();
  return <KoreanPhotobooth onProceed={() => router.push("/sweetquiz")} />;
}
