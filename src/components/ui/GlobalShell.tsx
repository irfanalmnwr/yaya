"use client";

import dynamic from "next/dynamic";

const StarCanvas = dynamic(() => import("@/components/ui/StarCanvas"), { ssr: false });
const MusicPlayer = dynamic(() => import("@/components/ui/MusicPlayer"), { ssr: false });

export default function GlobalShell() {
  return (
    <>
      <StarCanvas />
      <div className="ambient-orb orb-rose" />
      <div className="ambient-orb orb-gold" />
      <MusicPlayer />
    </>
  );
}
