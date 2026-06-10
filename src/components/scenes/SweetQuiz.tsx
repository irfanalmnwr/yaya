"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ChevronRight, Trophy, Sparkles, Heart } from "lucide-react";

interface Question {
  text: string;
  options: string[];
  correctIdx: number;
}

interface SweetQuizProps {
  onProceed: () => void;
}

interface SakuraParticle {
  id: number;
  x: number; // percentage offset
  y: number;
  size: number;
  duration: number;
  angle: number;
}

export default function SweetQuiz({ onProceed }: SweetQuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [sakuraParticles, setSakuraParticles] = useState<SakuraParticle[]>([]);

  const questions: Question[] = [
    {
      text: "Di manakah lokasi liburan impian yang paling ingin kita kunjungi bersama?",
      options: [
        "A. Bromo",
        "B. Banda Neira",
        "C. Karimun Jawa"
      ],
      correctIdx: 2 // Pantai Sunset
    },
    {
      text: "Jujur ya, siapakah di antara kita yang paling sering ngambek manja dalam hubungan?",
      options: [
        "A. Yaya",
        "B. Irfan",
        "C. Yaya"
      ],
      correctIdx: 0 // Sabrina
    },
    {
      text: "Tanggal jadian kita berapa wkwkwkwkwkk",
      options: [
        "A. 27 Agustus 2025",
        "B. 25 Agustus 20205",
        "C. 26 Agustus 2025"
      ],
      correctIdx: 0 
    }
  ];

  const playAnswerSound = (correct: boolean) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const actx = new AudioCtx();
      const now = actx.currentTime;
      
      if (correct) {
        // High pleasant arpeggio (C Major chord sweep)
        const freqs = [523.25, 659.25, 783.99, 1046.5];
        freqs.forEach((f, idx) => {
          const osc = actx.createOscillator();
          const gain = actx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, now + idx * 0.06);
          gain.gain.setValueAtTime(0.04, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.4);
          osc.connect(gain);
          gain.connect(actx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.45);
        });
      } else {
        // Low cozy buzzer warning
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(110, now);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.linearRampToValueAtTime(0.0001, now + 0.35);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch (e) {}
  };

  const triggerSakuraBurst = () => {
    const particles: SakuraParticle[] = [];
    // Spawn 16 sakura petals flying outward
    for (let i = 0; i < 16; i++) {
      particles.push({
        id: Date.now() + i + Math.random(),
        x: 40 + Math.random() * 20, // origin near center
        y: 45 + Math.random() * 10,
        size: 14 + Math.random() * 16,
        duration: 0.8 + Math.random() * 0.6,
        angle: -30 - Math.random() * 120 // upwards arc
      });
    }
    setSakuraParticles(particles);

    // Clear after animation runs
    setTimeout(() => {
      setSakuraParticles([]);
    }, 1500);
  };

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    const correct = idx === questions[currentIdx].correctIdx;
    setIsCorrect(correct);
    playAnswerSound(correct);

    if (correct) {
      triggerSakuraBurst();
    }
  };

  const handleNextClick = () => {
    setSelectedOpt(null);
    setIsAnswered(false);
    setIsCorrect(false);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const currentQuestion = questions[currentIdx];

  // 3D Flip Card transition configuration
  const cardFlipVariants = {
    initial: { rotateY: 95, opacity: 0, scale: 0.94 },
    animate: { rotateY: 0, opacity: 1, scale: 1 },
    exit: { rotateY: -95, opacity: 0, scale: 0.94 }
  };

  return (
    <section id="sweet-popup-quiz" className="relative flex flex-col justify-center items-center min-h-screen text-center px-6 md:px-12 overflow-hidden py-28 md:py-36 w-full">
      <div className="star-aurora-bg" />

      {/* Floating Cherry Blossom Flower Particles Overlay */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        <AnimatePresence>
          {sakuraParticles.map((p) => {
            const rad = (p.angle * Math.PI) / 180;
            const distance = 160 + Math.random() * 100;
            const tx = Math.cos(rad) * distance;
            const ty = Math.sin(rad) * distance;

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: `${p.x}%`, y: `${p.y}%`, scale: 0.4 }}
                animate={{ 
                  opacity: [0, 1, 0.8, 0],
                  x: [`${p.x}%`, `${p.x + (tx / window.innerWidth) * 100}%`],
                  y: [`${p.y}%`, `${p.y + (ty / window.innerHeight) * 100}%`],
                  scale: [0.4, 1.2, 1, 0.6]
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: p.duration, ease: "easeOut" }}
                className="absolute text-pink-300 drop-shadow-[0_0_8px_rgba(255,179,198,0.6)] flex items-center justify-center select-none"
                style={{ width: p.size, height: p.size }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full fill-pink-200/90 stroke-pink-300 stroke-[4]">
                  {/* Sakura Petal Shape SVG */}
                  <path d="M 50 15 C 30 15 25 45 50 85 C 75 45 70 15 50 15 Z" />
                  <circle cx="50" cy="45" r="8" fill="#fff" opacity="0.8" />
                </svg>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-xl gap-y-16 md:gap-y-22">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center gap-y-2 md:gap-y-3 select-none text-center"
        >
          <div className="flex items-center gap-2 border border-[#ffb3c6]/20 bg-[#ffb3c6]/10 rounded-full px-4 py-1 mb-2">
            <Sparkles size={14} className="text-[#ffb3c6] animate-pulse" />
            <span className="font-mono text-xs text-[#ffb3c6] tracking-widest uppercase">Uji Hubungan Kita</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif text-[#F8F5F2] font-semibold tracking-wide neon-text-rose flex items-center justify-center gap-3">
            <span>Quiz yang salah Kiss Aku</span>
            <Sparkles className="text-[#ffb3c6] animate-pulse" size={32} />
          </h2>
        </motion.div>

        {/* 3D Perspective Card Container */}
        <div 
          className="relative w-full min-h-[480px] flex items-center justify-center"
          style={{ perspective: "1500px" }}
        >
          <AnimatePresence mode="wait">
            {!quizCompleted ? (
              <motion.div
                key={currentIdx}
                variants={cardFlipVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.7, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
                className="w-full bg-[#181121]/20 border border-[#ffb3c6]/30 rounded-3xl p-10 md:p-14 backdrop-blur-md shadow-[0_25px_60px_rgba(7,13,30,0.7)] flex flex-col justify-between"
              >
                {/* Question index header */}
                <div className="flex justify-between items-center mb-6 font-mono text-[10px] uppercase tracking-widest text-[#ffe5ec] font-bold border-b border-[#ffb3c6]/40 pb-3 select-none">
                  <span>Lembar Pertanyaan</span>
                  <span>{currentIdx + 1} dari {questions.length}</span>
                </div>

                {/* Question text box */}
                <h3 className="text-lg md:text-xl font-serif font-bold text-[#F8F5F2] leading-relaxed mb-6 text-left drop-shadow-sm select-none">
                  {currentQuestion.text}
                </h3>

                {/* Options grid with staggered delay entries */}
                <div className="flex flex-col gap-5 mb-8">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOpt === idx;
                    const isCorrectOption = idx === currentQuestion.correctIdx;
                    
                    let btnStyle = "bg-zinc-950/30 border-zinc-800/80 text-zinc-300 hover:border-[#ffb3c6]/50 hover:bg-zinc-950/60";
                    if (isAnswered) {
                      if (isSelected) {
                        btnStyle = isCorrect 
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]" 
                          : "bg-rose-500/10 border-rose-500 text-rose-400 shake shadow-[0_0_15px_rgba(244,63,94,0.25)]";
                      } else if (isCorrectOption) {
                        // highlight the correct answer if incorrect chosen
                        btnStyle = "bg-emerald-500/5 border-emerald-500/40 text-emerald-500/70";
                      } else {
                        btnStyle = "bg-zinc-950/15 border-zinc-900/60 text-zinc-650 cursor-not-allowed";
                      }
                    }

                    return (
                      <motion.button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleOptionClick(idx)}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + idx * 0.08, duration: 0.4 }}
                        className={`w-full text-left px-6 py-5 rounded-2xl border text-xs md:text-sm leading-relaxed transition-all duration-300 flex justify-between items-center relative overflow-hidden group ${btnStyle} cursor-pointer`}
                      >
                        {/* Hover subtle shine highlight */}
                        {!isAnswered && (
                          <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[250%] transition-transform duration-1000" />
                        )}

                        <span className="font-sans font-medium">{option}</span>
                        {isAnswered && isSelected && (
                          isCorrect ? (
                            <CheckCircle size={16} className="text-emerald-400 flex-shrink-0 ml-2" />
                          ) : (
                            <XCircle size={16} className="text-rose-400 flex-shrink-0 ml-2" />
                          )
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Progress actions footer */}
                <div className="h-10 flex justify-end">
                  <AnimatePresence>
                    {isAnswered && (
                      <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        onClick={handleNextClick}
                        className="bg-gradient-to-r from-[#ffb3c6] to-[#8c5a6b] hover:from-[#ffe5ec] hover:to-[#ffb3c6] text-[#0a060d] font-bold py-2.5 px-6 rounded-full text-xs flex items-center gap-1.5 shadow-[0_5px_15px_rgba(255,179,198,0.3)] border border-[#ffb3c6]/20 transition-all duration-300 cursor-pointer"
                      >
                        <span>{currentIdx < questions.length - 1 ? "Pertanyaan Berikutnya" : "Buka Hasil"}</span>
                        <ChevronRight size={14} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              // Quiz Completed Glass Achievement screen
              <motion.div
                key="quiz-unlocked"
                initial={{ scale: 0.92, opacity: 0, rotateY: 90 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ type: "spring", stiffness: 90, damping: 15, duration: 0.8 }}
                className="w-full bg-gradient-to-b from-[#1b0f1a] to-[#0a060d] border border-[#ffb3c6]/30 rounded-3xl p-10 md:p-14 shadow-[0_30px_70px_rgba(0,0,0,0.85)] text-center flex flex-col items-center relative overflow-hidden"
              >
                {/* Background lighting flare */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#ffb3c6]/5 rounded-full blur-3xl" />

                {/* Physical floating Trophy with Pink Rose Wreath */}
                <motion.div
                  animate={{ y: [-8, 8, -8] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="w-24 h-24 flex items-center justify-center relative mb-6 group select-none"
                >
                  {/* SVG Pink Rose Wreath in Background */}
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-[#ffb3c6]/60 animate-[spin_20s_linear_infinite]">
                    <path d="M 50 10 A 40 40 0 1 0 50 90 A 40 40 0 1 0 50 10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 8" />
                    {/* Tiny pink rosebuds on wreath */}
                    <circle cx="50" cy="10" r="3" fill="#ffe5ec" />
                    <circle cx="90" cy="50" r="3" fill="#ffe5ec" />
                    <circle cx="50" cy="90" r="3" fill="#ffe5ec" />
                    <circle cx="10" cy="50" r="3" fill="#ffe5ec" />
                    <circle cx="78" cy="22" r="3" fill="#ffe5ec" />
                    <circle cx="78" cy="78" r="3" fill="#ffe5ec" />
                    <circle cx="22" cy="78" r="3" fill="#ffe5ec" />
                    <circle cx="22" cy="22" r="3" fill="#ffe5ec" />
                  </svg>
                  <div className="w-16 h-16 rounded-full bg-[#ffb3c6]/15 flex items-center justify-center text-[#ffb3c6] border border-[#ffb3c6]/30 shadow-[0_0_30px_rgba(255,179,198,0.3)] relative z-10">
                    <Trophy size={28} className="group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </motion.div>

                <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#ffb3c6] font-bold mb-2 flex items-center gap-1.5 justify-center">
                  <Trophy size={12} className="text-[#ffb3c6]" />
                  <span>Penghargaan Terbuka</span>
                </span>

                <h3 className="text-2xl md:text-3xl font-serif text-[#F8F5F2] font-semibold mb-4 leading-snug tracking-wide">
                  Best Couple Ever!
                </h3>
                
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8 max-w-sm font-sans">
                  Aku senang banget karena ternyata setiap momen kecil yang pernah kita lewati masih kamu ingat dengan begitu baik. Terima kasih, Sayang, sudah menjaga semua kenangan indah kita tetap hidup. <Heart size={14} className="inline-block fill-[#ffb3c6] text-[#ffb3c6] animate-pulse ml-1 align-middle" />
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onProceed}
                  className="bg-gradient-to-r from-[#ffb3c6] to-[#8c5a6b] hover:from-[#ffe5ec] hover:to-[#ffb3c6] text-[#0a060d] font-bold py-4 px-8 rounded-full shadow-[0_10px_25px_rgba(255,179,198,0.35)] transition-all duration-300 w-full text-xs md:text-sm tracking-wider uppercase font-mono flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles size={16} />
                  <span>Buka Rangkaian Bunga Memori kita</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
