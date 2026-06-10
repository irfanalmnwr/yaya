"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Mail, Crown, Film } from "lucide-react";

interface LoveLetterProps {
  onProceed: () => void;
}

export default function LoveLetter({ onProceed }: LoveLetterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCracked, setIsCracked] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);
  
  const idxRef = useRef(0);
  const letterSheetRef = useRef<HTMLDivElement>(null);

  const fullLetterText = 
   "Sayang...\n\n" +
"Selamat ulang tahun yang ke-23, cintaku. Hari ini adalah hari yang sangat spesial, karena pada hari inilah dunia pertama kali mengenal seseorang yang kelak akan menjadi bagian terindah dalam hidupku.\n\n" +

"Aku tidak tahu bagaimana hidupku akan berjalan jika semesta tidak mempertemukanku denganmu. Yang aku tahu, sejak kamu hadir, banyak hal terasa berbeda. Hari-hari yang biasa menjadi lebih berwarna, tawa terasa lebih hangat, dan setiap momen sederhana terasa jauh lebih berarti ketika aku bisa membaginya bersamamu.\n\n" +

"Terima kasih telah menjadi seseorang yang selalu berusaha memahami, mendengarkan, dan menemani. Terima kasih untuk setiap perhatian kecil yang mungkin tidak pernah kamu sadari begitu berarti bagiku. Terima kasih karena selalu ada, baik di saat aku sedang baik-baik saja maupun saat aku sedang tidak baik-baik saja.\n\n" +

"Di usia yang baru ini, aku berharap kamu selalu diberikan kesehatan, kebahagiaan, ketenangan hati, dan kekuatan untuk menghadapi setiap hal yang datang dalam hidupmu. Semoga semua impian yang selama ini kamu simpan perlahan menemukan jalannya untuk menjadi nyata. Semoga setiap langkah yang kamu ambil selalu membawa kamu lebih dekat kepada kehidupan yang kamu impikan.\n\n" +

"Jangan pernah meragukan dirimu sendiri, ya. Kamu adalah perempuan yang luar biasa. Kamu lebih kuat daripada yang kamu kira, lebih hebat daripada yang kamu sadari, dan lebih berharga daripada yang bisa dijelaskan oleh kata-kata. Aku harap suatu hari nanti kamu bisa melihat dirimu melalui mataku, agar kamu tahu betapa istimewanya dirimu.\n\n" +

"Aku juga ingin mengucapkan terima kasih kepada dirimu yang sudah bertahan sampai sejauh ini. Terima kasih karena tidak menyerah saat keadaan sulit. Terima kasih karena tetap berjuang meskipun lelah. Semua proses yang telah kamu lalui telah membentukmu menjadi pribadi yang aku kagumi hari ini.\n\n" +

"Di hari ulang tahunmu ini, aku tidak hanya merayakan bertambahnya usiamu. Aku merayakan keberadaanmu. Aku merayakan semua kenangan yang telah kita ciptakan bersama, semua tawa yang pernah kita bagi, semua cerita yang pernah kita lalui, dan semua mimpi yang masih ingin kita wujudkan bersama di masa depan.\n\n" +

"Semoga tahun ini membawa lebih banyak alasan untuk tersenyum, lebih banyak momen bahagia untuk dikenang, dan lebih banyak keberanian untuk mengejar apa yang kamu inginkan. Dan semoga, jika kamu mengizinkan, aku masih bisa menjadi bagian dari perjalanan itu, menemanimu melewati hari-hari indah yang masih menunggu di depan sana.\n\n" +

"Selamat ulang tahun, Yayakuu. Terima kasih telah hadir di dunia ini dan menjadi alasan mengapa banyak hari dalam hidupku terasa begitu istimewa. Aku mencintaimu hari ini, esok, lusa, dan selama waktu masih mengizinkan aku untuk mencintaimu.\n\n" +

"Dengan seluruh rasa sayang yang kumiliki,\nIrfan ❤️";

  const handleOpenEnvelope = () => {
    if (isCracked) return;
    setIsCracked(true);
    
    // Crack sound
    playCrackSound();

    // Envelope Flap opening and letter slide-out sequence
    setTimeout(() => {
      setIsOpen(true);
      playEnvelopeSound();
    }, 600);

    // Start typewriter effect after slide-out completes
    setTimeout(() => {
      startTypewriter();
    }, 1800);
  };

  const playCrackSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const actx = new AudioCtx();
      const now = actx.currentTime;
      
      // Cracking wood/wax crisp click
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(2200, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  };

  const playEnvelopeSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const actx = new AudioCtx();
      const now = actx.currentTime;
      
      // Warm sliding synth sweep
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.5);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.55);
      
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start(now);
      osc.stop(now + 0.55);
    } catch (e) {}
  };

  const playTypewriterTick = (charIdx: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const actx = new AudioCtx();
      const now = actx.currentTime;
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      
      // Cozy wooden vintage tick
      osc.type = "triangle";
      const pitch = charIdx % 5 === 0 ? 1100 : (charIdx % 3 === 0 ? 800 : 950);
      osc.frequency.setValueAtTime(pitch, now);
      gain.gain.setValueAtTime(0.002, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
      
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start(now);
      osc.stop(now + 0.035);
    } catch (e) {}
  };

  const startTypewriter = () => {
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < fullLetterText.length) {
        setTypedText(fullLetterText.substring(0, currentIdx + 1));
        idxRef.current = currentIdx;
        playTypewriterTick(currentIdx);
        currentIdx++;
      } else {
        setIsTypingDone(true);
        clearInterval(interval);
      }
    }, 45); // highly smooth and responsive typing pace
  };

  return (
    <section id="love-letter-reveal" className="relative flex flex-col justify-center items-center min-h-screen text-center py-28 md:py-36 px-6 md:px-12 overflow-hidden w-full">
      
      <div className="absolute inset-0 bg-radial-[circle_at_center,_#1b0f1a_0%,_#0a060d_100%] z-0" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#ffb3c6]/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#ffe5ec]/5 rounded-full filter blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="z-10 flex flex-col items-center w-full max-w-3xl gap-y-14 md:gap-y-18"
      >
        {/* Header Group */}
        <div className="flex flex-col items-center gap-y-3 md:gap-y-4 select-none text-center">
          <span className="text-xs uppercase font-mono tracking-[0.3em] text-[#ffb3c6] font-bold">
            ✦ Siapin tisu dari sekarang ✦
          </span>

          <h2 className="text-4xl md:text-5xl font-serif text-[#F8F5F2] font-semibold tracking-wide neon-text-gold leading-tight flex items-center justify-center gap-3">
            <span>A Letter For You</span>
            <Mail size={28} className="text-[#ffb3c6] animate-pulse" />
          </h2>
          
          <p className="text-sm md:text-base text-zinc-400 font-sans max-w-md leading-relaxed">
            {isOpen 
              ? "Campuraduk Sebenernya Pas Nulis Surat Ini Hehehehehe" 
              : "Ketuk segel lilin mawar logam merah muda di bawah ini untuk melepas segel dan membuka surat."}
          </p>
        </div>

        {/* Envelope Layout / Scroll Content */}
        <div className="relative w-full flex flex-col items-center justify-center min-h-[480px]">
          
          {/* Royal Dusty Mauve Velvet Envelope Body */}
          <AnimatePresence>
            {!isOpen && (
              <motion.div
                key="envelope"
                initial={{ scale: 0.94, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ 
                  scale: 0.85, 
                  y: 160, 
                  opacity: 0,
                  transition: { duration: 0.95, ease: "easeInOut" } 
                }}
                onClick={handleOpenEnvelope}
                className="relative w-[310px] h-[200px] bg-gradient-to-br from-[#422030] via-[#1b0f1a] to-[#0a060d] border border-[#ffb3c6]/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] cursor-pointer group z-20 overflow-visible transition-transform duration-500 hover:scale-103"
              >
                {/* Envelope fold top flap */}
                <motion.div 
                  initial={{ rotateX: 0 }}
                  animate={isCracked ? { rotateX: 180 } : { rotateX: 0 }}
                  transition={{ duration: 0.65, ease: "easeInOut" }}
                  style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
                  className="absolute top-0 left-0 w-0 h-0 border-l-[155px] border-l-transparent border-r-[155px] border-r-transparent border-t-[105px] border-t-[#8c5a6b]/90 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] z-10"
                />

                {/* Left/Right Inner Folds */}
                <div className="absolute inset-0 w-0 h-0 border-l-[155px] border-l-[#181121] border-t-[100px] border-t-transparent border-b-[100px] border-b-transparent z-5" />
                <div className="absolute inset-0 w-0 h-0 border-r-[155px] border-r-[#181121] border-t-[100px] border-t-transparent border-b-[100px] border-b-transparent z-5" />

                {/* Bottom Folds */}
                <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[155px] border-l-transparent border-r-[155px] border-r-transparent border-b-[105px] border-b-[#321c2c] z-5" />

                {/* Inside envelope dark glow */}
                <div className="absolute inset-x-2 bottom-2 top-10 bg-zinc-950/60 rounded-xl filter blur-sm pointer-events-none" />

                {/* Address Tag */}
                <div className="absolute inset-x-0 bottom-4 text-[10px] tracking-[0.25em] font-mono text-[#ffe5ec]/70 select-none pointer-events-none uppercase font-bold text-center flex items-center justify-center gap-1.5">
                  <span>Untuk: Sabrina Sayang</span>
                  <Heart size={10} className="fill-[#ffb3c6] text-[#ffb3c6] animate-beat" />
                </div>

                {/* Interactive Cracking Pink Metallic Wax Seal */}
                <div className="absolute top-[80px] left-[130px] w-[50px] h-[50px] z-30 select-none overflow-visible">
                  <AnimatePresence>
                    {!isCracked ? (
                      <motion.div
                        key="full-seal"
                        whileHover={{ scale: 1.1 }}
                        className="w-full h-full rounded-full bg-gradient-to-br from-[#ffe5ec] via-[#ffb3c6] to-[#8c5a6b] border border-[#ffe5ec]/35 flex items-center justify-center text-[#181121] shadow-[0_4px_12px_rgba(255,179,198,0.4)] relative"
                      >
                        <Heart size={18} className="text-[#181121] fill-[#181121] animate-pulse" />
                        <div className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-spin" style={{ animationDuration: "12s" }} />
                      </motion.div>
                    ) : (
                      <div className="w-full h-full relative overflow-visible">
                        {/* Left Half Seal flying away */}
                        <motion.div
                          initial={{ x: 0, rotate: 0, opacity: 1 }}
                          animate={{ x: -60, y: 35, rotate: -45, opacity: 0 }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="absolute inset-y-0 left-0 w-[25px] rounded-l-full bg-gradient-to-br from-[#ffe5ec] via-[#ffb3c6] to-[#8c5a6b] border-l border-t border-b border-[#ffe5ec]/25 flex items-center justify-end text-[#181121] overflow-hidden pr-1"
                        >
                          <Heart size={18} className="text-[#181121] fill-[#181121] translate-x-2" />
                        </motion.div>

                        {/* Right Half Seal flying away */}
                        <motion.div
                          initial={{ x: 0, rotate: 0, opacity: 1 }}
                          animate={{ x: 60, y: 35, rotate: 45, opacity: 0 }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="absolute inset-y-0 right-0 w-[25px] rounded-r-full bg-gradient-to-br from-[#ffe5ec] via-[#ffb3c6] to-[#8c5a6b] border-r border-t border-b border-[#ffe5ec]/25 flex items-center justify-start text-[#181121] overflow-hidden pl-1"
                        >
                          <Heart size={18} className="text-[#181121] fill-[#181121] -translate-x-2" />
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Antique Parchment Letter Scroll Sheet */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                key="letter-sheet"
                ref={letterSheetRef}
                initial={{ opacity: 0, y: 180, scale: 0.92 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: { delay: 0.45, duration: 1.1, ease: [0.19, 1, 0.22, 1] } 
                }}
                className="relative bg-gradient-to-br from-[#fbf9f6] to-[#f4eee1] border border-[#ffb3c6]/40 rounded-3xl p-10 md:p-14 pb-12 md:pb-16 max-w-[660px] w-full shadow-[0_20px_50px_rgba(0,0,0,0.65),_inset_0_0_40px_rgba(184,141,159,0.06)] text-left flex flex-col overflow-hidden"
              >
                {/* Elegant border ornaments inside card */}
                <div className="absolute top-5 left-5 w-8 h-8 border-t border-l border-[#ffb3c6]/45 pointer-events-none" />
                <div className="absolute top-5 right-5 w-8 h-8 border-t border-r border-[#ffb3c6]/45 pointer-events-none" />
                <div className="absolute bottom-5 left-5 w-8 h-8 border-b border-l border-[#ffb3c6]/45 pointer-events-none" />
                <div className="absolute bottom-5 right-5 w-8 h-8 border-b border-r border-[#ffb3c6]/45 pointer-events-none" />

                {/* Delicate gold-foil inner thin frame line */}
                <div className="absolute inset-6 border border-[#ffe5ec]/25 rounded-[22px] pointer-events-none" />

                {/* Subtle blush parchment watermark lines (Aligned to 32px line-height) */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,179,198,0.045)_1px,transparent_1px)] bg-[size:100%_32px] pointer-events-none rounded-3xl pt-20" />

                {/* Watermark flower (bottom left corner) */}
                <div className="absolute bottom-16 left-6 w-36 h-36 opacity-[0.035] pointer-events-none select-none rotate-12">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-[#ffb3c6] fill-current">
                    <path d="M50,15 C20,15 5,45 50,85 C95,45 80,15 50,15 Z" />
                  </svg>
                </div>

                {/* Vintage Postage Stamp (top right corner) */}
                <div className="absolute top-10 right-10 w-14 h-16 bg-[#ffb3c6]/8 border-2 border-dashed border-[#ffb3c6]/30 p-1.5 flex flex-col justify-between items-center rounded-sm rotate-6 select-none opacity-80 pointer-events-none">
                  <div className="w-full flex justify-between items-center text-[5px] font-mono text-[#ffb3c6] font-bold">
                    <span>16.06</span>
                    <span>2026</span>
                  </div>
                  <Heart className="w-6 h-6 fill-[#ffb3c6]/10 text-[#ffb3c6]" />
                  <span className="text-[6.5px] font-mono text-[#ffb3c6] tracking-widest uppercase font-bold">LOVE MAIL</span>
                </div>

                {/* Stationery Floral Crest Header */}
                <div className="flex flex-col items-center gap-1.5 mb-8 opacity-80 pointer-events-none select-none w-full text-center mt-2">
                  <span className="text-[9px] uppercase font-mono tracking-[0.35em] text-[#8c5a6b] font-bold">Doa Untuk Mu</span>
                  <div className="flex items-center gap-2">
                    <div className="h-[0.5px] bg-gradient-to-r from-transparent to-[#ffb3c6]/50 w-10" />
                    <span className="text-[#ffb3c6] text-xs">❦</span>
                    <div className="h-[0.5px] bg-gradient-to-l from-transparent to-[#ffb3c6]/50 w-10" />
                  </div>
                </div>

                {/* Letter Content Cursive Handwriting (Matching 32px line-height) */}
                <div 
                  style={{ lineHeight: "32px" }}
                  className="letter-text whitespace-pre-wrap select-none font-serif text-[#2c1e21] text-[15px] md:text-[16px] min-h-[220px] font-medium tracking-wide relative z-10 pl-2 pr-4 pt-1"
                >
                  {typedText}
                  {!isTypingDone && (
                    <span className="inline-block w-1.5 h-4.5 bg-[#ffb3c6] animate-pulse ml-0.5" />
                  )}
                </div>

                {/* Romantic Sign-off decor */}
                <AnimatePresence>
                  {isTypingDone && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      transition={{ duration: 1.5 }}
                      className="mt-8 text-right font-cursive text-3xl text-[#8c5a6b] pr-4 animate-fade-in"
                    >
                      ~ Selamanya ~
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Luxury Action Reveal Button */}
                <AnimatePresence>
                  {isTypingDone && (
                    <motion.div
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 100, damping: 14 }}
                      className="mt-14 flex justify-center w-full animate-fade-in"
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onProceed}
                        className="bg-gradient-to-r from-[#ffb3c6] to-[#8c5a6b] hover:from-[#ffe5ec] hover:to-[#ffb3c6] text-[#0a060d] font-semibold font-sans tracking-widest text-xs uppercase py-4 px-8 rounded-xl shadow-[0_12px_28px_rgba(255,179,198,0.3)] border border-[#ffb3c6]/20 transition-all duration-300 w-full cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Film size={14} className="text-[#0a060d]" />
                        <span>Lanjut lagi pelan-pelan</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
