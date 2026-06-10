"use client";

import { useRouter } from "next/navigation";
import CassetteTapeWall from "@/components/scenes/CassetteTapeWall";

export default function CassetteTapeWallPage() {
  const router = useRouter();
  return <CassetteTapeWall onProceed={() => router.push("/photobooth")} />;
}
