"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

export default function EndingCredits() {
  // stages: "wipe-in" (petals falling to cover screen), "opaque" (full cover), "credits" (credits scrolling)
  const [wipeStage, setWipeStage] = useState<"wipe-in" | "opaque" | "credits">("wipe-in");
  const [isMounted, setIsMounted] = useState(false);
  const [petalsList, setPetalsList] = useState<any[]>([]);

  useEffect(() => {
    setIsMounted(true);
    setPetalsList(
      Array.from({ length: 45 }).map((_, i) => ({
        id: i,
        delay: Math.random() * 1.5,
        duration: 1.2 + Math.random() * 1.5,
        left: Math.random() * 100,
        scale: 0.5 + Math.random() * 1,
      }))
    );

    // Stage 1: Petals falling to cover screen for 0.8s
    const t1 = setTimeout(() => {
      setWipeStage("opaque");
    }, 800);

    // Stage 2: Screen remains opaque with full petals carpet for 0.7s
    const t2 = setTimeout(() => {
      setWipeStage("credits");
    }, 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <section id="ending-credits" className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden bg-[#0f0b15] select-none w-full">
      
      {/* Shuffled projector film grain overlay */}
      <div className="film-grain" />

      {/* Cinematic vignette edges */}
      <div className="absolute inset-0 pointer-events-none z-20" style={{
        background: "radial-gradient(ellipse at center, transparent 35%, rgba(15,11,21,0.95) 100%)"
      }} />

      {/* Vertical fading mask to fade credits out at top and bottom limits */}
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#0f0b15] to-transparent z-15 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0f0b15] to-transparent z-15 pointer-events-none" />

      {/* 🌸 FLOWER WIPE TRANSITION OVERLAY 🌸 */}
      <AnimatePresence>
        {(wipeStage === "wipe-in" || wipeStage === "opaque") && (
          <motion.div
            key="flower-wipe-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(15px)" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-[#1b0f1a] flex flex-col justify-center items-center overflow-hidden"
          >
            {/* Dense Falling Rose Petals Storm */}
            <div className="absolute inset-0 pointer-events-none">
              {isMounted && petalsList.map((petal) => (
                <motion.div
                  key={petal.id}
                  initial={{ y: "-10vh", x: `${petal.left}vw`, rotate: 0, opacity: 0 }}
                  animate={{ 
                    y: "110vh", 
                    rotate: 360,
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{
                    duration: petal.duration,
                    delay: petal.delay,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute"
                  style={{ scale: petal.scale }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffb3c6">
                    <path d="M12,2 C10,5 6,7 6,12 C6,16 9,19 12,22 C15,19 18,16 18,12 C18,7 13,5 12,2 Z" />
                  </svg>
                </motion.div>
              ))}
            </div>

            {/* Transitional Quote */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-center px-6 relative z-10"
            >
              <h2 className="text-2xl md:text-3xl font-serif text-[#fefbf6] italic mb-3 max-w-lg leading-relaxed">
                &ldquo;Setiap mawar yang mekar hari ini membawa satu doa: semoga kita terus bertumbuh dan berjalan bersama.&rdquo;
              </h2>
              <p className="text-xs font-mono text-[#ffb3c6] tracking-[0.25em] uppercase">
                Menutup Kisah Indah Sabrina
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎬 ROLLING CREDITS SCENE 🎬 */}
      {wipeStage === "credits" && (
        <div className="relative z-10 w-full max-w-xl overflow-hidden h-screen flex items-end justify-center">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "-145%" }}
            transition={{ 
              duration: 68, // slow, cinematic scroll rate
              ease: "linear",
              delay: 0.3
            }}
            className="w-full flex flex-col items-center gap-16 pb-36 px-12"
          >
            {/* Studio Intro Logo */}
            <div className="mt-[100vh] mb-20 flex flex-col items-center gap-4">
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-20 bg-[#ffb3c6]/30" />
                <Heart size={14} className="text-[#ffb3c6] fill-[#ffb3c6] animate-pulse" />
                <div className="h-px w-20 bg-[#ffb3c6]/30" />
              </div>
              <p className="font-serif italic text-[#ffe5ec]/70 text-xs tracking-[0.25em] uppercase">
                Dipersembahkan dengan Sepenuh Hati
              </p>
            </div>

            {/* Film Title Card */}
            <div className="flex flex-col items-center gap-3 mb-14">
              <h1 className="text-5xl md:text-6xl font-serif text-[#fefbf6] font-bold tracking-wide leading-none drop-shadow-[0_0_20px_rgba(255,179,198,0.25)] text-center">
                Blooming Memories
              </h1>
              <p className="font-mono text-[#ffb3c6]/80 text-[10px] uppercase tracking-[0.35em] mt-2 text-center">
                23 Tahun Menjadi Mawar Terindah
              </p>
              <p className="font-mono text-zinc-500 text-[10px] uppercase tracking-widest mt-1">
                — 16 June 2026 —
              </p>
            </div>

            <div className="h-px w-48 bg-[#ffb3c6]/40 my-2" />

            {/* Bintang Utama Lead Cast Credit */}
            <div className="flex flex-col gap-4 items-center">
              <span className="text-[10px] uppercase font-mono tracking-[0.4em] text-zinc-500 font-bold">
                Tokoh Utama dalam Ceritaku
              </span>
              <span className="text-3xl md:text-4xl font-serif text-[#fefbf6] font-semibold tracking-wide drop-shadow-[0_0_15px_rgba(255,255,255,0.08)]">
                Sabrina Zahra Tudinia
              </span>
            </div>

            <div className="h-px w-32 bg-zinc-900 my-2" />

            {/* Core Crew Cast columns */}
            <div className="flex flex-col gap-10 w-full max-w-sm">
              <div className="flex justify-between items-center text-left">
                <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-500 w-1/2">Yang Selalu Mengagumimu</span>
                <span className="text-sm font-serif text-[#ffb3c6] w-1/2 text-right">Muhammad Irfan</span>
              </div>

              <div className="flex justify-between items-center text-left">
                <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-500 w-1/2">Penata Musik & Latar</span>
                <span className="text-sm font-serif text-zinc-400 italic w-1/2 text-right">Canon in D Piano Synth</span>
              </div>

              <div className="flex justify-between items-center text-left">
                <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-500 w-1/2">Teknologi Rekayasa</span>
                <span className="text-sm font-serif text-zinc-400 italic w-1/2 text-right">Next.js • React • TS</span>
              </div>

              <div className="flex justify-between items-center text-left">
                <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-500 w-1/2">Lokasi Kisah Ini Berlangsung</span>
                <span className="text-sm font-serif text-zinc-400 italic w-1/2 text-right">Di setiap kenangan yang kita ciptakan</span>
              </div>
            </div>

            <div className="h-px w-48 bg-[#ffb3c6]/40 my-8" />

            {/* Special Thanks Block */}
            <div className="flex flex-col gap-6 items-center max-w-sm">
              <span className="text-[10px] uppercase font-mono tracking-[0.4em] text-zinc-500 font-bold">
                Terima Kasih Spesial
              </span>
              <p className="font-serif italic text-zinc-400 text-xs md:text-sm leading-relaxed text-center px-4">
                Terima kasih telah hadir dan menjadi bagian terindah dalam hidupku. Terima kasih untuk setiap tawa, cerita, pelukan, perhatian kecil, dan semua kenangan yang berhasil membuat hari-hariku terasa lebih hangat. Semoga apa yang kita miliki hari ini terus tumbuh seindah mawar yang mekar dari waktu ke waktu.
              </p>
            </div>

            <div className="h-px w-32 bg-zinc-900 my-6" />

            {/* Romantic Final Title Message */}
            <div className="flex flex-col gap-8 items-center">
              <p className="font-serif text-[#fefbf6] text-2xl md:text-3xl leading-relaxed max-w-sm font-semibold italic drop-shadow-[0_0_15px_rgba(255,255,255,0.06)] text-center">
                &ldquo;Selamat Ulang Tahun yang ke-23, Sayang.&rdquo;
              </p>
              <p className="font-serif italic text-[#ffb3c6] text-sm md:text-base leading-relaxed max-w-xs text-center">
                Semoga di usiamu yang ke-23, kebahagiaan selalu menemukan jalan menuju hatimu. Dan semoga seperti mawar yang terus mekar, kita juga terus bertumbuh, saling menjaga, dan tetap bersama dalam setiap musim kehidupan. 🌹
              </p>
            </div>

            {/* Initial Monogram Closer */}
            <div className="flex flex-col items-center gap-6 mt-12 mb-44">
              <div className="flex items-center gap-4">
                <div className="h-px w-20 bg-[#ffb3c6]/20" />
                <motion.span 
                  animate={{ opacity: [0.35, 1, 0.35] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                  className="font-mono text-[#ffb3c6] text-xs md:text-sm tracking-[0.45em] font-bold"
                >
                  S · Z · T
                </motion.span>
                <div className="h-px w-20 bg-[#ffb3c6]/20" />
              </div>
              <p className="text-[9px] font-mono text-zinc-650 uppercase tracking-widest text-center">
                Untuk mawar favoritku, hari ini, esok, dan seterusnya.
              </p>
            </div>

            {/* Final Cinematic End Card */}
            <div className="flex flex-col items-center gap-3 pb-32">
              <div className="flex items-center gap-3 select-none max-w-md text-center px-4">
                <span className="font-serif italic text-zinc-400 text-sm leading-relaxed">
                  &ldquo;Saat kelopak mawar terakhir jatuh malam ini, satu doaku tetap sama: semoga tahun-tahun berikutnya masih bisa aku rayakan bersamamu.&rdquo; 🌹✨
                </span>
              </div>
              <Heart size={22} className="text-[#ffb3c6] fill-[#ffb3c6] animate-pulse mt-6 shadow-[0_0_15px_rgba(255,179,198,0.5)]" />
            </div>

          </motion.div>
        </div>
      )}
    </section>
  );
}
