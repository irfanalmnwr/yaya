"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, RefreshCw, Trophy, ArrowRight, HelpCircle, Gamepad2 } from "lucide-react";
import confetti from "canvas-confetti";

interface MemoryMatchGameProps {
  onProceed: () => void;
}

interface Card {
  id: number;
  pairId: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const memoryPairs = [
  { pairId: 1, symbol: "/assets/games/Gambar 1.jpg" },
  { pairId: 2, symbol: "/assets/games/Gambar 2.jpg" },
  { pairId: 3, symbol: "/assets/games/Gambar 3.jpg" },
  { pairId: 4, symbol: "/assets/games/Gambar 4.jpg" },
  { pairId: 5, symbol: "/assets/games/Gambar 5.jpg" },
  { pairId: 6, symbol: "/assets/games/Gambar 6.jpg" },
  { pairId: 7, symbol: "/assets/games/Gambar 7.jpg" },
  { pairId: 8, symbol: "/assets/games/Gambar 8.jpg" }
];

export default function MemoryMatchGame({ onProceed }: MemoryMatchGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [matchesCount, setMatchesCount] = useState(0);
  const [movesCount, setMovesCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Sound generator
  const playSound = (type: "flip" | "match" | "fail" | "finish") => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const actx = new AudioCtx();
      const now = actx.currentTime;

      if (type === "flip") {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(650, now + 0.12);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (type === "match") {
        // Beautiful romantic major third harmony chord
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = actx.createOscillator();
          const gain = actx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);
          gain.gain.setValueAtTime(0.04, now + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.5);
          osc.connect(gain);
          gain.connect(actx.destination);
          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.55);
        });
      } else if (type === "fail") {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(170, now + 0.1);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.linearRampToValueAtTime(0.0001, now + 0.22);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start(now);
        osc.stop(now + 0.23);
      } else if (type === "finish") {
        // Grand arpeggio scale fanfare
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = actx.createOscillator();
          const gain = actx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.05, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.0);
          osc.connect(gain);
          gain.connect(actx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 1.1);
        });
      }
    } catch (e) {}
  };

  const initGame = () => {
    // Duplicate memory pairs to make 16 cards
    const deck: Card[] = [];
    memoryPairs.forEach((p) => {
      deck.push({ ...p, id: Math.random(), isFlipped: false, isMatched: false });
      deck.push({ ...p, id: Math.random(), isFlipped: false, isMatched: false });
    });

    // Shuffle using Fisher-Yates
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedIndices([]);
    setIsBusy(false);
    setMatchesCount(0);
    setMovesCount(0);
    setIsFinished(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (isBusy || cards[index].isFlipped || cards[index].isMatched) return;

    playSound("flip");
    
    // Flip card visually
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMovesCount((prev) => prev + 1);
      const firstIdx = newFlipped[0];
      const secondIdx = newFlipped[1];

      if (cards[firstIdx].pairId === cards[secondIdx].pairId) {
        // MATCH!
        setIsBusy(true);
        setTimeout(() => {
          playSound("match");
          
          const updatedCards = [...newCards];
          updatedCards[firstIdx].isMatched = true;
          updatedCards[secondIdx].isMatched = true;
          setCards(updatedCards);

          setMatchesCount((prev) => {
            const nextCount = prev + 1;
            if (nextCount === 8) {
              handleGameFinish();
            }
            return nextCount;
          });
          
          // Little match confetti
          confetti({
            particleCount: 25,
            spread: 40,
            origin: { y: 0.8 },
            colors: ["#ffb3c6", "#ffe5ec", "#b88d9f"]
          });

          setFlippedIndices([]);
          setIsBusy(false);
        }, 300);
      } else {
        // NO MATCH!
        setIsBusy(true);
        setTimeout(() => {
          playSound("fail");
          const updatedCards = [...newCards];
          updatedCards[firstIdx].isFlipped = false;
          updatedCards[secondIdx].isFlipped = false;
          setCards(updatedCards);
          setFlippedIndices([]);
          setIsBusy(false);
        }, 900);
      }
    }
  };

  const handleGameFinish = () => {
    setTimeout(() => {
      playSound("finish");
      setIsFinished(true);

      // Massive confetti spray
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#ffb3c6", "#ffe5ec", "#b88d9f"]
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#ffb3c6", "#ffe5ec", "#b88d9f"]
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }, 400);
  };

  return (
    <section id="memory-match-scene" className="relative flex flex-col justify-center items-center min-h-screen text-center px-4 md:px-12 py-24 md:py-32 overflow-hidden w-full select-none">
      
      {/* Deep luxury ambient backgrounds */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,_#1b0f1a_0%,_#0a060d_100%] z-0" />
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-[#ffb3c6]/5 rounded-full filter blur-[110px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#8c5a6b]/5 rounded-full filter blur-[130px] pointer-events-none" />

      <div className="z-10 flex flex-col items-center w-full max-w-2xl gap-y-8 md:gap-y-10">
        
        {/* Header Title Component */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-y-2 select-none text-center"
        >
          <div className="flex items-center gap-2 border border-[#ffb3c6]/20 bg-[#ffb3c6]/5 rounded-full px-4 py-1.5 mb-1 select-none">
            <Gamepad2 size={13} className="text-[#ffb3c6] animate-pulse" />
            <span className="font-mono text-[10px] text-[#ffb3c6] tracking-widest uppercase">Memory Match Game</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif text-[#F8F5F2] font-semibold tracking-wide neon-text-rose flex items-center justify-center gap-3">
            <span>Awas kalau ga dimainin susah ini bikinnya banyak bug terus</span>
            <Sparkles className="text-[#ffb3c6] animate-pulse" size={28} />
          </h2>
          
          <p className="text-xs md:text-sm text-zinc-400 font-sans max-w-md leading-relaxed mt-1">
            {isFinished 
              ? "Hebat! Kamu berhasil menemukan semua kecocokan memori indah kita! ❤️"
              : `Temukan pasangan kartu yang sama untuk membuka kilas balik kenangan manis kita berdua (${matchesCount}/8)`}
          </p>
        </motion.div>

        {/* Stats Panel & Reset */}
        <div className="flex items-center justify-between w-full max-w-md px-3 py-2 bg-white/[0.02] border border-white/5 rounded-2xl text-xs font-mono text-[#ffe5ec]/70">
          <div>Langkah: <span className="text-white font-bold">{movesCount}</span></div>
          <div>Kecocokan: <span className="text-[#ffb3c6] font-bold">{matchesCount}/8</span></div>
          <button 
            onClick={initGame}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-pink-500/20 bg-pink-950/10 hover:bg-[#ffb3c6]/20 hover:border-[#ffb3c6]/40 text-[#ffb3c6] transition-all duration-300 cursor-pointer"
          >
            <RefreshCw size={11} />
            <span>Reset</span>
          </button>
        </div>

        {/* Card Match Grid */}
        <div className="grid grid-cols-4 gap-3 md:gap-4.5 w-full max-w-[440px] aspect-square p-2 bg-gradient-to-b from-[#1b0f1a] to-[#0a060d] rounded-[24px] border border-pink-500/20 shadow-[0_20px_50px_rgba(255,179,198,0.15)] relative">
          
          {cards.map((card, idx) => {
            const isShown = card.isFlipped || card.isMatched;
            return (
              <div 
                key={idx}
                onClick={() => handleCardClick(idx)}
                className="relative aspect-square w-full rounded-xl cursor-pointer perspective-1000 select-none group"
              >
                {/* 3D card wrapper */}
                <motion.div
                  className="w-full h-full relative preserve-3d"
                  animate={{ rotateY: isShown ? 180 : 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  {/* Card Back Face (Hidden Face) */}
                  <div className="absolute inset-0 backface-hidden rounded-xl bg-gradient-to-br from-[#2a1727] to-[#120810] border border-white/5 shadow-inner flex items-center justify-center group-hover:border-[#ffb3c6]/30 group-hover:shadow-[0_0_15px_rgba(255,179,198,0.2)] transition-all">
                    <HelpCircle size={22} className="text-[#ffb3c6]/35 group-hover:scale-110 group-hover:text-[#ffb3c6]/70 transition-all duration-300" />
                  </div>

                  {/* Card Front Face (Revealed Emojis/Symbols) */}
                  <div 
                    className={`absolute inset-0 backface-hidden rounded-xl border flex items-center justify-center rotate-y-180 shadow-md overflow-hidden ${
                      card.isMatched 
                        ? "border-[#ffb3c6]/50 text-[#ffb3c6]" 
                        : "border-pink-500/20 text-[#fefbf6]"
                    }`}
                  >
                    {card.isMatched && (
                      <div className="absolute inset-0 bg-radial-[circle,rgba(255,179,198,0.12)_0%,transparent_70%] animate-pulse z-20 pointer-events-none" />
                    )}
                    <img 
                      src={card.symbol} 
                      alt="Memory" 
                      className={`w-full h-full object-cover rounded-xl relative z-10 transition-all duration-300 ${
                        card.isMatched ? "opacity-75 grayscale-[20%]" : "opacity-100"
                      }`} 
                    />
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Game Completion Trophy Display */}
        <div className="w-full max-w-md min-h-[90px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isFinished ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full bg-gradient-to-b from-[#2d1829] to-[#120810] border border-[#ffb3c6]/40 rounded-2xl p-6 shadow-[0_15px_35px_rgba(255,179,198,0.1)] flex flex-col items-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-[#ffb3c6]/15 flex items-center justify-center text-[#ffb3c6] border border-[#ffb3c6]/30">
                  <Trophy size={20} className="animate-bounce" />
                </div>
                <h3 className="text-md font-serif text-white font-semibold">Game Selesai! 🌟</h3>
                <p className="text-[10px] text-zinc-400 font-sans max-w-[280px]">Semua kartu sudah cocok. Sekarang, mari lanjutkan perjalanan kita ke Danau Harapan.</p>
              </motion.div>
            ) : (
              <p className="text-[9px] font-mono tracking-widest text-zinc-600 uppercase select-none">
                Pencet dua kartu untuk mencari pasangan yang cocok
              </p>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button to Proceed */}
        <AnimatePresence>
          {isFinished && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 70 }}
              className="mt-2"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onProceed}
                className="bg-gradient-to-r from-[#ffb3c6] to-[#8c5a6b] hover:from-[#ffe5ec] hover:to-[#ffb3c6] text-[#0a060d] font-bold py-4 px-10 rounded-full shadow-[0_10px_30px_rgba(255,179,198,0.35)] border border-[#ffb3c6]/20 flex items-center gap-2 transition-all duration-300 text-xs tracking-wider uppercase font-mono cursor-pointer"
              >
                <span>Kunjungi Danau Harapan</span>
                <ArrowRight size={14} className="animate-pulse" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
