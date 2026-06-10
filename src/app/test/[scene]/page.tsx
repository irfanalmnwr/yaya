"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import LockScreen from "@/components/scenes/LockScreen";
import CakeCandle from "@/components/scenes/CakeCandle";
import LoveLetter from "@/components/scenes/LoveLetter";
import VHSChat from "@/components/scenes/VHSChat";
import LoveTimeline from "@/components/scenes/LoveTimeline";
import CassetteTapeWall from "@/components/scenes/CassetteTapeWall";
import KoreanPhotobooth from "@/components/scenes/KoreanPhotobooth";
import SweetQuiz from "@/components/scenes/SweetQuiz";
import WishingWell from "@/components/scenes/WishingWell";
import EndingCredits from "@/components/scenes/EndingCredits";
import MemoryMatchGame from "@/components/scenes/MemoryMatchGame";

interface PageParams {
  scene: string;
}

export default function SceneTestPage({ params }: { params: Promise<PageParams> }) {
  const resolvedParams = use(params);
  const rawScene = resolvedParams.scene.toLowerCase();

  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] ${message}`,
      ...prev.slice(0, 4),
    ]);
  };

  const handleProceed = () => addLog("onProceed / onUnlock triggered!");

  let TargetComponent: React.ComponentType<any> | null = null;
  let componentName = "";

  switch (rawScene) {
    case "lock": case "lockscreen":
      TargetComponent = LockScreen; componentName = "LockScreen"; break;
    case "cake": case "candle": case "cakecandle":
      TargetComponent = CakeCandle; componentName = "CakeCandle"; break;
    case "letter": case "loveletter":
      TargetComponent = LoveLetter; componentName = "LoveLetter"; break;
    case "vhs": case "vhschat":
      TargetComponent = VHSChat; componentName = "VHSChat"; break;
    case "timeline": case "lovetime": case "lovetimeline":
      TargetComponent = LoveTimeline; componentName = "LoveTimeline"; break;
    case "cassette": case "cassettetape":
      TargetComponent = CassetteTapeWall; componentName = "CassetteTapeWall"; break;
    case "booth": case "photobooth":
      TargetComponent = KoreanPhotobooth; componentName = "KoreanPhotobooth"; break;
    case "quiz": case "sweetquiz":
      TargetComponent = SweetQuiz; componentName = "SweetQuiz"; break;
    case "star": case "constellation": case "constellationmap": case "game": case "match": case "matchgames": case "memorymatch":
      TargetComponent = MemoryMatchGame; componentName = "MemoryMatchGame"; break;
    case "well": case "wishingwell":
      TargetComponent = WishingWell; componentName = "WishingWell"; break;
    case "credits": case "ending": case "endingcredits":
      TargetComponent = EndingCredits; componentName = "EndingCredits"; break;
    default:
      TargetComponent = null;
  }

  if (!TargetComponent) {
    return (
      <div className="relative z-10 min-h-screen w-full flex flex-col items-center justify-center p-6 text-white">
        <div className="bg-zinc-900/80 border border-zinc-800 p-8 rounded-2xl max-w-md text-center backdrop-blur-md shadow-2xl">
          <h1 className="text-2xl font-serif text-pink-300 font-semibold mb-4">Scene Not Found</h1>
          <p className="text-zinc-400 text-sm mb-6">
            Komponen dengan slug &ldquo;<span className="text-white font-mono">{resolvedParams.scene}</span>&rdquo; tidak ditemukan.
          </p>
          <Link href="/test" className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-[#A64D79] text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg transition-transform hover:scale-105">
            <ArrowLeft size={16} />
            <span>Kembali ke Playground</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full min-h-screen">
      {/* Floating nav + callback logger */}
      <div className="fixed top-4 left-4 z-[9999] flex flex-col gap-2">
        <Link href="/test" className="flex items-center gap-2 bg-black/60 hover:bg-black/90 text-white text-xs font-semibold py-2 px-4 rounded-xl border border-zinc-800 backdrop-blur-md shadow-lg transition-colors cursor-pointer">
          <ArrowLeft size={12} className="text-pink-400" />
          <span>Kembali ke Menu Test</span>
        </Link>

        <div className="bg-black/80 border border-zinc-800/80 p-3 rounded-xl backdrop-blur-md shadow-lg flex flex-col max-w-[260px] pointer-events-none select-none text-[10px] font-mono">
          <span className="text-[9px] uppercase font-bold text-pink-400/80 tracking-wider mb-1">
            Status ({componentName})
          </span>
          {logs.length === 0 ? (
            <span className="text-zinc-600 italic">No events triggered...</span>
          ) : (
            logs.map((log, idx) => (
              <span key={idx} className={`${idx === 0 ? "text-pink-300" : "text-zinc-500"} break-words`}>
                {log}
              </span>
            ))
          )}
        </div>
      </div>

      <TargetComponent onProceed={handleProceed} onUnlock={handleProceed} />
    </div>
  );
}
