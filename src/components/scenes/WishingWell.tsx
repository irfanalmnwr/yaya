"use client";

import { useState, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Sparkles, Flame, Heart } from "lucide-react";

interface WishingWellProps {
  onProceed: () => void;
}

interface Lantern {
  id: number;
  text: string;
  x: number; // percentage horizontal
}

interface SecretFlower {
  id: number;
  name: string;
  type: "rose" | "lily" | "peony";
  flowerColor: string;
  secret: string;
}

interface WishFormProps {
  onLaunch: (text: string) => void;
}

const WishForm = memo(function WishForm({ onLaunch }: WishFormProps) {
  const [wishText, setWishText] = useState("");

  const handleLaunch = () => {
    if (!wishText.trim()) return;
    onLaunch(wishText.trim());
    setWishText("");
  };

  return (
    <>
      {/* Form Input Area */}
      <div className="flex flex-col text-left w-full">
        <textarea
          value={wishText}
          onChange={(e) => setWishText(e.target.value)}
          placeholder="Tuliskan doa manis dan harapan terindahmu untuk Sabrina di sini... ✨"
          className="w-full bg-zinc-950/40 border border-zinc-800/80 focus:border-[#ffb3c6] focus:ring-1 focus:ring-[#ffb3c6]/30 rounded-2xl px-5 py-4 text-[#F8F5F2] font-sans text-xs md:text-sm leading-relaxed resize-none outline-none transition-all duration-300 placeholder-zinc-600 min-h-[110px]"
          maxLength={160}
        />
      </div>

      <div className="flex justify-between items-center select-none w-full">
        <span className="text-[10px] font-mono text-zinc-500">
          {wishText.length} / 160 karakter
        </span>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLaunch}
          disabled={!wishText.trim()}
          className="bg-gradient-to-r from-[#ffb3c6] to-[#8c5a6b] hover:from-[#ffe5ec] hover:to-[#ffb3c6] disabled:from-zinc-900 disabled:to-zinc-900 disabled:text-zinc-650 disabled:cursor-not-allowed border border-[#ffb3c6]/20 text-[#0a060d] font-bold py-3 px-6 rounded-full flex items-center gap-2 text-xs shadow-[0_6px_20px_rgba(255,179,198,0.25)] transition-all duration-300 uppercase tracking-wider font-mono cursor-pointer"
        >
          <Flame size={13} />
          <span>Luncurkan Doa</span>
        </motion.button>
      </div>
    </>
  );
});

export default function WishingWell({ onProceed }: WishingWellProps) {
  const [lanterns, setLanterns] = useState<Lantern[]>([]);
  const [hasWished, setHasWished] = useState(false);
  const [activeFlowerId, setActiveFlowerId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const secretFlowers: SecretFlower[] = [
    {
      id: 1,
      name: "Mawar Kebahagiaan",
      type: "rose",
      flowerColor: "#ff85a1",
      secret: "Semoga seperti mawar yang terus mekar dan tumbuh dengan indah, hubungan kita juga selalu diberi kekuatan untuk bertahan, berkembang, dan melewati setiap musim bersama. Semoga Allah senantiasa menjaga langkah kita, melimpahkan kebahagiaan, serta mengizinkan kita terus berjalan berdampingan dalam setiap cerita yang akan datang."
    },
    {
      id: 2,
      name: "Lili Putih Kejernihan",
      type: "lily",
      flowerColor: "#fefbf6",
      secret: "Semoga kedamaian hati, kejernihan pikiran, dan ketenangan jiwa selalu menyertai setiap impian dan keputusan hebatmu, semurni keindahan kelopak bunga lili putih... 🤍"
    },
    {
      id: 3,
      name: "Peony Keberuntungan",
      type: "peony",
      flowerColor: "#fbcfe8",
      secret: "Semoga kelimpahan cinta kasih yang tulus, kesehatan yang prima, dan keberuntungan terbaik di semesta selalu mekar menyelimuti seluruh hari-harimu di masa depan... ✨"
    }
  ];

  const playWishSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const actx = new AudioCtx();
      const now = actx.currentTime;
      
      // Beautiful celestial ascending harp arpeggio
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((f, idx) => {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now + idx * 0.08);
        gain.gain.setValueAtTime(0.04, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.9);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.95);
      });
    } catch (e) {}
  };

  const handleLaunchWish = (text: string) => {
    playWishSound();
    
    const newLantern: Lantern = {
      id: Date.now(),
      text,
      x: 15 + Math.random() * 70, // percentage horizontal placement across viewport
    };

    setLanterns((prev) => [...prev, newLantern]);
    setHasWished(true);

    // Remove lantern after it floats out of bounds (6.5 seconds)
    setTimeout(() => {
      setLanterns((prev) => prev.filter((l) => l.id !== newLantern.id));
    }, 6500);
  };

  return (
    <section id="wishing-well" className="relative flex flex-col justify-center items-center min-h-screen text-center px-6 md:px-12 overflow-hidden py-28 md:py-36 select-none w-full">
      <div className="star-aurora-bg" />

      {/* DREAMY FLOATING PINK LOTUS LANTERNS LAYER */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        <AnimatePresence>
          {lanterns.map((lantern) => (
            <motion.div
              key={lantern.id}
              initial={{ 
                opacity: 0, 
                y: "95vh", 
                x: `${lantern.x}vw`,
                scale: 0.65
              }}
              animate={{ 
                opacity: [0, 0.95, 0.95, 0],
                y: ["95vh", "50vh", "20vh", "-15vh"],
                x: [
                  `${lantern.x}vw`,
                  `${lantern.x + (Math.random() > 0.5 ? 5 : -5)}vw`,
                  `${lantern.x + (Math.random() > 0.5 ? -4 : 4)}vw`,
                  `${lantern.x}vw`,
                ],
                scale: [0.65, 1.05, 0.9, 0.6],
              }}
              transition={{ duration: 6.5, ease: "easeOut" }}
              className="absolute flex flex-col items-center gap-2"
              style={{ willChange: "transform, opacity" }}
            >
              {/* Beautiful glowing floating water lily / lotus blossom in soft pink */}
              <div 
                className="relative w-16 h-16 flex flex-col items-center justify-center"
                style={{
                  filter: isMobile ? "none" : "drop-shadow(0 0 12px rgba(255,179,198,0.65))"
                }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Outer Lotus petals */}
                  <path d="M 50 15 C 30 45, 15 65, 50 85 C 85 65, 70 45, 50 15 Z" fill="#ffb3c6" opacity="0.85" />
                  <path d="M 50 30 C 35 55, 25 70, 50 85 C 75 70, 65 55, 50 30 Z" fill="#ffe5ec" opacity="0.9" />
                  <path d="M 50 45 C 40 65, 35 75, 50 85 C 65 75, 60 65, 50 45 Z" fill="#fefbf6" />
                  {/* Lotus pad leaves at bottom */}
                  <path d="M 15 80 C 30 90, 70 90, 85 80 C 70 95, 30 95, 15 80 Z" fill="#8c5a6b" opacity="0.6" />
                  {/* Center warm glowing candle flame */}
                  <circle cx="50" cy="72" r="8" fill="#fef08a" style={isMobile ? {} : { filter: "drop-shadow(0 0 6px #eab308)" }} />
                  <path d="M 50 60 C 47 66, 47 70, 50 72 C 53 70, 53 66, 50 60 Z" fill="#f97316" />
                </svg>
              </div>

              {/* Handwriting floating wish text bubble */}
              <div className="bg-[#181121]/90 border border-[#ffb3c6]/30 rounded-2xl px-4 py-2 text-[10px] text-[#ffe5ec] font-serif italic max-w-[140px] text-center leading-relaxed shadow-[0_8px_20px_rgba(255,179,198,0.15)] backdrop-blur-md">
                &ldquo;{lantern.text}&rdquo;
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-xl gap-y-12 md:gap-y-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center gap-y-2 md:gap-y-3 select-none text-center"
        >
          <div className="flex items-center gap-2 border border-[#ffb3c6]/20 bg-[#ffb3c6]/10 rounded-full px-4 py-1 mb-2 select-none">
            <Sparkles size={14} className="text-[#ffb3c6] animate-pulse" />
            <span className="font-mono text-xs text-[#ffb3c6] tracking-widest uppercase">Danau Doa & Taman Harapan</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif text-[#F8F5F2] font-semibold tracking-wide neon-text-rose flex items-center justify-center gap-3">
            <span>Virtual Flower Pond</span>
            <Sparkles className="text-[#ffb3c6] animate-pulse" size={32} />
          </h2>
          <p className="text-sm md:text-base text-zinc-400 font-sans max-w-md leading-relaxed mt-1">
            Lontarkan doa tulusmu ke danau bintang, dan sentuh kuncup bunga di danau untuk mekar mengungkap pesan rahasia tersembunyi...
          </p>
        </motion.div>

        {/* 🌸 INTERACTIVE VIRTUAL FLOWER GARDEN ON POND 🌸 */}
        <div className="w-full flex flex-col items-center gap-6 mt-4">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#ffb3c6]/80 font-bold mb-2">
            Taman Bunga Danau (Sentuh Untuk Membuka Doa Rahasia)
          </span>
          <div className="flex justify-around items-center w-full max-w-sm px-4">
            {secretFlowers.map((flower) => {
              const isActive = activeFlowerId === flower.id;
              return (
                <div
                  key={flower.id}
                  onClick={() => {
                    playWishSound();
                    setActiveFlowerId(activeFlowerId === flower.id ? null : flower.id);
                  }}
                  className="flex flex-col items-center gap-2.5 cursor-pointer group"
                >
                  {/* Glowing Flower Container */}
                  <motion.div
                    animate={isActive ? { scale: [1, 1.15, 1.1] } : { scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 relative"
                    style={{
                      backgroundColor: isActive ? "rgba(24, 17, 33, 0.85)" : "rgba(254, 251, 246, 0.04)",
                      border: isActive ? `1.5px solid ${flower.flowerColor}` : "1px solid rgba(255, 255, 255, 0.08)",
                      boxShadow: isActive ? `0 0 30px ${flower.flowerColor}66, inset 0 0 15px ${flower.flowerColor}33` : "none"
                    }}
                  >
                    {/* Glowing Halo Aura behind active flower */}
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
                        animate={{ opacity: 0.6, scale: 1.25, rotate: 360 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{
                          background: `radial-gradient(circle, ${flower.flowerColor}55 0%, transparent 70%)`,
                          willChange: "transform"
                        }}
                      />
                    )}

                    {/* SVG Blooming Flower Vector */}
                    <svg viewBox="0 0 100 100" className="w-14 h-14 overflow-visible z-10">
                      {/* Leaf underlay */}
                      <motion.path 
                        d="M 50 85 C 38 72, 38 60, 50 48 C 62 60, 62 72, 50 85 Z" 
                        fill="#5b3b44" 
                        opacity={isActive ? 0.65 : 0.3} 
                        animate={isActive ? { rotate: [0, 5, -5, 0], scale: 1.1 } : { scale: 1 }}
                        transition={{ duration: 4, repeat: Infinity }}
                      />
                      <motion.path 
                        d="M 35 75 C 25 65, 28 52, 45 48 C 42 62, 35 70, 35 75 Z" 
                        fill="#4a2e35" 
                        opacity={isActive ? 0.55 : 0.2}
                        animate={isActive ? { rotate: [0, -4, 4, 0], scale: 1.05 } : { scale: 1 }}
                        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                      />

                      {/* Species-Specific Multi-Layer Flower Structure */}
                      {flower.type === "rose" && (
                        <g transform="translate(50, 48)">
                          {/* Outer Petals Layer */}
                          <motion.path
                            d="M-22,-22 C-38,-6 0,26 22,22 C38,6 0,-26 -22,-22 Z"
                            fill={flower.flowerColor}
                            opacity={isActive ? 0.8 : 0.45}
                            animate={isActive ? { scale: 1.15, rotate: 12 } : { scale: 0.9, rotate: 0 }}
                            transition={{ duration: 0.5 }}
                          />
                          <motion.path
                            d="M22,-22 C38,-6 0,26 -22,22 C-38,6 0,-26 22,-22 Z"
                            fill={flower.flowerColor}
                            opacity={isActive ? 0.85 : 0.5}
                            animate={isActive ? { scale: 1.12, rotate: -12 } : { scale: 0.9, rotate: 0 }}
                            transition={{ duration: 0.5, delay: 0.05 }}
                          />
                          {/* Inner Petals Layer */}
                          <motion.path
                            d="M-15,-15 C-25,-3 0,16 15,15 C25,3 0,-16 -15,-15 Z"
                            fill="#ffe5ec"
                            opacity={isActive ? 0.9 : 0.65}
                            animate={isActive ? { scale: 1.2, rotate: 25 } : { scale: 0.85, rotate: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                          />
                          {/* Core */}
                          <motion.circle 
                            cx="0" 
                            cy="0" 
                            r="4.5" 
                            fill="#fefbf6" 
                            animate={isActive ? { scale: 1.1 } : { scale: 0.9 }}
                          />
                        </g>
                      )}

                      {flower.type === "peony" && (
                        <g transform="translate(50, 48)">
                          {/* Ruffled Peony Layer 1 */}
                          <motion.path
                            d="M 0,-24 C 18,-24 24,-12 18,12 C 12,24 -12,24 -18,12 C -24,-12 -18,-24 0,-24 Z"
                            fill={flower.flowerColor}
                            opacity={isActive ? 0.8 : 0.45}
                            animate={isActive ? { scale: 1.2, rotate: 15 } : { scale: 0.85, rotate: 0 }}
                            transition={{ duration: 0.5 }}
                          />
                          {/* Ruffled Peony Layer 2 */}
                          <motion.path
                            d="M -18,-18 C -3,-24 24,-15 15,10 C 6,22 -24,9 -18,-18 Z"
                            fill="#fbcfe8"
                            opacity={isActive ? 0.85 : 0.55}
                            animate={isActive ? { scale: 1.15, rotate: -20 } : { scale: 0.85, rotate: 0 }}
                            transition={{ duration: 0.5, delay: 0.05 }}
                          />
                          {/* Ruffled Peony Layer 3 */}
                          <motion.path
                            d="M 12,-12 C 22,0 3,18 -10,12 C -22,6 -10,-18 12,-12 Z"
                            fill="#ffe5ec"
                            opacity={isActive ? 0.92 : 0.65}
                            animate={isActive ? { scale: 1.18, rotate: 30 } : { scale: 0.8, rotate: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                          />
                          <motion.circle 
                            cx="0" 
                            cy="0" 
                            r="4.5" 
                            fill="#fefbf6"
                            animate={isActive ? { scale: 1.1 } : { scale: 0.9 }}
                          />
                        </g>
                      )}

                      {flower.type === "lily" && (
                        <g transform="translate(50, 48)">
                          {/* Lily Petals (starlike radiating outward) */}
                          <g>
                            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                              <motion.path
                                key={i}
                                d="M 0,0 Q -6,-22 0,-22 Q 6,-22 0,0"
                                fill={i % 2 === 0 ? "#fefbf6" : flower.flowerColor}
                                opacity={isActive ? 0.95 : 0.6}
                                stroke="#ffe5ec"
                                strokeWidth="0.5"
                                transform={`rotate(${angle})`}
                                animate={isActive ? { scale: 1.25, rotate: angle + 8 } : { scale: 0.85, rotate: angle }}
                                transition={{ duration: 0.5, delay: i * 0.02 }}
                              />
                            ))}
                          </g>
                          {/* Golden Stamens */}
                          <motion.g 
                            animate={isActive ? { scale: 1.15 } : { scale: 0.85 }}
                            opacity={isActive ? 1 : 0.35}
                          >
                            <circle cx="0" cy="0" r="3.5" fill="#fefbf6" />
                            <line x1="0" y1="0" x2="-3" y2="-7" stroke="#d97706" strokeWidth="0.6" />
                            <line x1="0" y1="0" x2="3" y2="-7" stroke="#d97706" strokeWidth="0.6" />
                            <line x1="0" y1="0" x2="-6" y2="3" stroke="#d97706" strokeWidth="0.6" />
                            <line x1="0" y1="0" x2="6" y2="3" stroke="#d97706" strokeWidth="0.6" />
                            <circle cx="-3" cy="-7" r="1" fill="#b45309" />
                            <circle cx="3" cy="-7" r="1" fill="#b45309" />
                            <circle cx="-6" cy="3" r="1" fill="#b45309" />
                            <circle cx="6" cy="3" r="1" fill="#b45309" />
                          </motion.g>
                        </g>
                      )}
                    </svg>
                  </motion.div>

                  <span className="text-[10px] font-mono text-zinc-400 group-hover:text-[#ffb3c6] transition-colors uppercase tracking-wider font-semibold">
                    {flower.name.split(" ")[0]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Secret Wish Description Box */}
          <div className="w-full max-w-md h-24 relative flex items-center justify-center">
            <AnimatePresence mode="wait">
              {activeFlowerId ? (
                <motion.div
                  key={activeFlowerId}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="w-full bg-[#181121]/95 border border-[#ffb3c6]/40 rounded-2xl px-6 py-4 shadow-lg backdrop-blur-md"
                >
                  <p className="text-xs text-[#ffe5ec] font-serif leading-relaxed italic">
                    &ldquo;{secretFlowers.find(f => f.id === activeFlowerId)?.secret}&rdquo;
                  </p>
                </motion.div>
              ) : (
                <p className="text-[9px] font-mono text-zinc-600 tracking-wider">
                  KUMPULAN DOA KHUSUS MENANTIMU...
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* SWIRLING COSMIC POND DECORATIVE CABINET */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full bg-[#181121]/20 border border-[#ffb3c6]/30 rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-[0_30px_70px_rgba(7,13,30,0.85)] flex flex-col gap-6 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#ffb3c6]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col items-center select-none my-4">
            <div className="relative w-28 h-28 rounded-full border-4 border-zinc-900 shadow-[inset_0_0_20px_rgba(0,0,0,0.9),0_0_25px_rgba(255,179,198,0.25)] flex items-center justify-center overflow-hidden bg-black">
              {/* Rotating conic gradient stardust swirl */}
              <div 
                className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,#ffb3c6,#ffe5ec,transparent)] opacity-40 animate-spin" 
                style={{ 
                  animationDuration: "14s", 
                  filter: isMobile ? "none" : "blur(6px)",
                  willChange: "transform"
                }} 
              />
              <div className="absolute inset-4 rounded-full bg-black/40 border border-zinc-800 flex items-center justify-center">
                <Sparkles 
                  className="w-10 h-10 text-[#ffb3c6] animate-spin" 
                  style={{ 
                    animationDuration: "8s",
                    willChange: "transform"
                  }} 
                />
              </div>
            </div>

            <p className="font-serif italic text-[#ffe5ec]/80 text-xs md:text-sm mt-4 tracking-wide max-w-xs">
              &ldquo;Setiap doa tulus adalah pelita yang akan selalu menuntun jalan hidup kita.&rdquo;
            </p>
          </div>

          <WishForm onLaunch={handleLaunchWish} />
        </motion.div>

        {/* Reveal ending credit path */}
        <AnimatePresence>
          {hasWished && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 85 }}
              className="mt-6 md:mt-10 animate-fade-in"
            >
              <p className="text-zinc-500 text-xs font-sans italic mb-5 select-none">
                Doamu telah mengalir tenang bersama teratai air indah... ✨
              </p>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onProceed}
                className="bg-gradient-to-r from-[#ffb3c6] to-[#8c5a6b] hover:from-[#ffe5ec] hover:to-[#ffb3c6] text-[#0a060d] font-bold py-3.5 px-10 rounded-full shadow-[0_10px_25px_rgba(255,179,198,0.35)] flex items-center gap-2.5 transition-all duration-300 text-xs tracking-wider uppercase font-mono cursor-pointer"
              >
                <Compass size={14} className="animate-spin" style={{ animationDuration: "6s" }} />
                <span>Tonton Kredit Sinematik</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
