"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Camera, Sparkles, Headphones } from "lucide-react";

interface Cassette {
  id: string;
  title: string;
  sub: string;
  bgHex: string;
  labelHex: string;
  chords: number[];
  voiceNote: string;
}

interface CassetteTapeWallProps {
  onProceed: () => void;
}

export default function CassetteTapeWall({ onProceed }: CassetteTapeWallProps) {
  const [activeTapeId, setActiveTapeId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [visualizerHeights, setVisualizerHeights] = useState<number[]>(new Array(18).fill(8));

  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<Array<{ osc: OscillatorNode; gain: GainNode }>>([]);
  const animIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const soundIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const cassettesList: Cassette[] = [
    {
      id: "pink-rose",
      title: "Ucapan - Mama",
      sub: "Voice No. 1 • Mawar Merah Muda",
      bgHex: "linear-gradient(135deg, #8c5a6b 0%, #181121 100%)",
      labelHex: "#ffb3c6",
      chords: [261.63, 329.63, 392.00, 523.25], // C Major Sweet Harmony
      voiceNote: "Setiap kelopak mawar merah muda ini membisikkan janji kesetiaan. Di taman hatiku, namamu terukir indah sebagai cinta sejati yang mekar abadi..."
    },
    {
      id: "soft-peony",
      title: "Ucapan - Annida",
      sub: "Voice No. 2 • Bunga Peony Lembut",
      bgHex: "linear-gradient(135deg, #422030 0%, #0a060d 100%)",
      labelHex: "#ffe5ec",
      chords: [349.23, 440.00, 523.25, 698.46], // F Major Warmth
      voiceNote: "Rasa syukurku tak terbatas karena memilikimu di sisiku. Bagaikan peony yang mengembang anggun, kehadiranmu melengkapi keindahan hidupku..."
    },
    {
      id: "sweet-lily",
      title: "Ucapan - Najwa",
      sub: "Voice No. 3 • Bunga Lili Manis",
      bgHex: "linear-gradient(135deg, #b88d9f 0%, #181121 100%)",
      labelHex: "#fefbf6",
      chords: [293.66, 349.23, 440.00, 587.33], // G Major Bliss
      voiceNote: "Di setiap embusan nafas, detak jantungku menyanyikan namamu. Cinta kita semurni lili putih, membawa kedamaian dan kebahagiaan abadi..."
    }
  ];

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtxClass();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const stopActiveSynth = () => {
    activeNodesRef.current.forEach(({ osc, gain }) => {
      try {
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      } catch (e) {}
    });
    activeNodesRef.current = [];
  };

  const playSynthesizedMelody = (chord: number[]) => {
    const actx = getAudioContext();
    if (!actx) return;

    stopActiveSynth();

    const now = actx.currentTime;
    
    // Simulate sweet arpeggiated music box chime tones
    chord.forEach((freq, idx) => {
      const osc = actx.createOscillator();
      const gain = actx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.2);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.05, now + idx * 0.2 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.2 + 1.4);

      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start(now + idx * 0.2);
      osc.stop(now + idx * 0.2 + 1.5);

      activeNodesRef.current.push({ osc, gain });
    });
  };

  const startVisualizerAnimation = () => {
    if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    animIntervalRef.current = setInterval(() => {
      setVisualizerHeights(
        new Array(18).fill(0).map(() => Math.floor(Math.random() * 70) + 15)
      );
    }, 110);
  };

  const stopVisualizerAnimation = () => {
    if (animIntervalRef.current) {
      clearInterval(animIntervalRef.current);
      animIntervalRef.current = null;
    }
    setVisualizerHeights(new Array(18).fill(8));
  };

  const handleCassetteClick = (tape: Cassette) => {
    if (activeTapeId === tape.id) {
      if (isPlaying) {
        setIsPlaying(false);
        stopActiveSynth();
        stopVisualizerAnimation();
        if (soundIntervalRef.current) clearInterval(soundIntervalRef.current);
      } else {
        setIsPlaying(true);
        startVisualizerAnimation();
        playSynthesizedMelody(tape.chords);
        
        if (soundIntervalRef.current) clearInterval(soundIntervalRef.current);
        soundIntervalRef.current = setInterval(() => {
          playSynthesizedMelody(tape.chords);
        }, 2500);
      }
    } else {
      setActiveTapeId(tape.id);
      setIsPlaying(true);
      startVisualizerAnimation();
      playSynthesizedMelody(tape.chords);

      if (soundIntervalRef.current) clearInterval(soundIntervalRef.current);
      soundIntervalRef.current = setInterval(() => {
        playSynthesizedMelody(tape.chords);
      }, 2500);
    }
  };

  useEffect(() => {
    return () => {
      stopActiveSynth();
      stopVisualizerAnimation();
      if (soundIntervalRef.current) clearInterval(soundIntervalRef.current);
    };
  }, []);

  const activeTape = cassettesList.find((c) => c.id === activeTapeId);

  return (
    <section id="cassette-memories" className="relative flex flex-col justify-center items-center min-h-screen text-center py-28 md:py-36 px-6 md:px-12 overflow-hidden select-none w-full">
      
      <div className="absolute inset-0 bg-radial-[circle_at_center,_#1b0f1a_0%,_#0a060d_100%] z-0" />
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-[#ffb3c6]/5 rounded-full filter blur-[110px] pointer-events-none" />

      <div className="z-10 flex flex-col items-center w-full max-w-4xl gap-y-16 md:gap-y-22">
        
        {/* Header Text */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="flex flex-col items-center gap-y-2 md:gap-y-3 select-none text-center"
        >
          <span className="text-xs uppercase font-mono tracking-[0.3em] text-[#ffb3c6] font-bold">
            ✦ Ada ucapan ni buat kamu ✦
          </span>

          <h2 className="text-4xl md:text-5xl font-serif text-[#F8F5F2] font-semibold tracking-wide neon-text-rose leading-tight flex items-center justify-center gap-3">
            <span>Audio Voice Note Wall</span>
            <Headphones size={28} className="text-[#ffb3c6] animate-pulse" />
          </h2>
          
          <p className="text-sm md:text-base text-zinc-400 font-sans max-w-md leading-relaxed mt-1">
            Pilihlah salah satu melodi kaset bunga di bawah ini untuk dimasukkan ke Kotak Musik Kaca, lalu dengarkan bisikan ucapan sayang kita...
          </p>
        </motion.div>

        {/* Walkman Player & Tape Selection Wrapper */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 w-full justify-center px-2">
          
          {/* Glassmorphic Luxury Rose Gold Glass Music Box Player */}
          <div className="relative w-full max-w-[350px] aspect-[15/10.5] rounded-3xl p-6 border border-[#ffb3c6]/20 bg-[#ffb3c6]/10 backdrop-blur-xl shadow-[0_30px_70px_rgba(255,179,198,0.2)] flex flex-col justify-between overflow-hidden">
            
            {/* Glass music box flower corner emblems */}
            <div className="absolute top-3 left-3 text-[10px] text-[#ffb3c6]/60 font-sans select-none">❀</div>
            <div className="absolute top-3 right-3 text-[10px] text-[#ffb3c6]/60 font-sans select-none">❀</div>
            <div className="absolute bottom-3 left-3 text-[10px] text-[#ffb3c6]/60 font-sans select-none">❀</div>
            <div className="absolute bottom-3 right-3 text-[10px] text-[#ffb3c6]/60 font-sans select-none">❀</div>

            {/* Music Box Screen Frame Overlay Header */}
            <div className="flex items-center justify-between font-mono text-[8px] text-[#ffe5ec] uppercase tracking-[0.25em] border-b border-[#ffb3c6]/20 pb-3">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb3c6] shadow-[0_0_8px_rgba(255,179,198,0.8)]" />
                <span>VOICE BOX</span>
              </span>
              <span className={`font-bold transition-all duration-300 ${isPlaying ? "text-[#ffb3c6]" : "text-zinc-500"}`}>
                {isPlaying ? "VOICE ON ♫" : "VOICE OFF ❀"}
              </span>
            </div>

            {/* Inner Transparent Deck showing Cassette details */}
            <div className="flex-1 flex items-center justify-center relative my-4 overflow-hidden rounded-2xl border border-zinc-950/80 bg-black/40 p-2 shadow-[inset_0_4px_15px_rgba(0,0,0,0.8)]">
              {activeTapeId ? (
                <div 
                  className="w-full h-full rounded-xl flex flex-col justify-between p-3 relative shadow-inner overflow-hidden border border-white/5"
                  style={{ background: activeTape?.bgHex }}
                >
                  {/* Cassette Title & side indicator */}
                  <div className="flex justify-between items-start select-none">
                    <span className="font-serif text-[11px] font-bold text-[#ffe5ec] truncate max-w-[70%]">
                      {activeTape?.title}
                    </span>
                    <span className="font-mono text-[8px] border border-[#ffb3c6]/25 px-1 rounded text-[#ffb3c6] opacity-80">
                      C-90
                    </span>
                  </div>

                  {/* Mechanical Spools in Action */}
                  <div className="flex justify-around items-center my-1 select-none relative z-10">
                    
                    {/* Left Spool - Spinning Pink Flower Petals */}
                    <motion.div 
                      animate={isPlaying ? { rotate: -360 } : {}}
                      transition={isPlaying ? { repeat: Infinity, duration: 5, ease: "linear" } : {}}
                      className="w-12 h-12 flex items-center justify-center relative select-none"
                    >
                      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,179,198,0.5)]">
                        <path d="M 50 15 C 38 15, 38 35, 50 35 C 62 35, 62 15, 50 15 Z" fill="#ffb3c6" opacity="0.85" />
                        <path d="M 50 85 C 38 85, 38 65, 50 65 C 62 65, 62 85, 50 85 Z" fill="#ffb3c6" opacity="0.85" />
                        <path d="M 15 50 C 15 38, 35 38, 35 50 C 35 62, 15 62, 15 50 Z" fill="#ffb3c6" opacity="0.85" />
                        <path d="M 85 50 C 85 38, 65 38, 65 50 C 65 62, 85 62, 85 50 Z" fill="#ffb3c6" opacity="0.85" />
                        <circle cx="50" cy="50" r="14" fill="#181121" stroke="#ffb3c6" strokeWidth="3" />
                        <circle cx="50" cy="50" r="5" fill="#ffb3c6" />
                      </svg>
                    </motion.div>

                    {/* Bridge graphic - Botanical leafy stem */}
                    <div className="w-10 h-0.5 bg-[#ffb3c6]/40 relative flex items-center justify-center">
                      <span className="text-[6px] text-[#ffb3c6]/60 absolute -top-1">🌸</span>
                    </div>

                    {/* Right Spool - Spinning Pink Flower Petals */}
                    <motion.div 
                      animate={isPlaying ? { rotate: -360 } : {}}
                      transition={isPlaying ? { repeat: Infinity, duration: 5, ease: "linear" } : {}}
                      className="w-12 h-12 flex items-center justify-center relative select-none"
                    >
                      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,179,198,0.5)]">
                        <path d="M 50 15 C 38 15, 38 35, 50 35 C 62 35, 62 15, 50 15 Z" fill="#ffb3c6" opacity="0.85" />
                        <path d="M 50 85 C 38 85, 38 65, 50 65 C 62 65, 62 85, 50 85 Z" fill="#ffb3c6" opacity="0.85" />
                        <path d="M 15 50 C 15 38, 35 38, 35 50 C 35 62, 15 62, 15 50 Z" fill="#ffb3c6" opacity="0.85" />
                        <path d="M 85 50 C 85 38, 65 38, 65 50 C 65 62, 85 62, 85 50 Z" fill="#ffb3c6" opacity="0.85" />
                        <circle cx="50" cy="50" r="14" fill="#181121" stroke="#ffb3c6" strokeWidth="3" />
                        <circle cx="50" cy="50" r="5" fill="#ffb3c6" />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Tape Subtitle */}
                  <div className="text-center font-mono text-[8px] uppercase tracking-widest text-zinc-400 select-none truncate">
                    {activeTape?.sub}
                  </div>

                  {/* Transparent Glass reflection line inside the deck */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-zinc-500 italic select-none">
                  <span className="text-xs">Silakan pilih melodi kaset bunga...</span>
                </div>
              )}
            </div>

            {/* Glowing Equalizer Waveform bars */}
            <div className="h-9 w-full flex items-end justify-between px-1 select-none pointer-events-none">
              {visualizerHeights.map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: `${h}%` }}
                  transition={{ type: "spring", stiffness: 160, damping: 14 }}
                  className="w-1.5 rounded-t bg-gradient-to-t from-[#8c5a6b] via-[#ffb3c6] to-white shadow-[0_0_8px_rgba(255,179,198,0.35)]"
                />
              ))}
            </div>
          </div>

          {/* Cassette Selector Columns */}
          <div className="flex flex-col gap-4 w-full max-w-sm">
            {cassettesList.map((tape) => {
              const isCurrent = activeTapeId === tape.id;
              return (
                <div 
                  key={tape.id}
                  onClick={() => handleCassetteClick(tape)}
                  className={`cursor-pointer rounded-2xl p-5 text-left border flex items-center justify-between transition-all duration-300 ${
                    isCurrent 
                      ? "bg-[#ffb3c6]/10 border-[#ffb3c6] shadow-[0_10px_25px_rgba(255,179,198,0.25)] scale-102" 
                      : "bg-[#181121]/10 border-pink-900/30 hover:border-[#ffb3c6]/40 hover:bg-[#ffb3c6]/5"
                  }`}
                >
                  <div className="flex flex-col pr-4 overflow-hidden">
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#ffb3c6] font-bold">
                      {tape.sub.split(" • ")[0]}
                    </span>
                    <h3 className="text-[15px] font-serif font-bold text-[#F8F5F2] mt-1 select-none">
                      {tape.title}
                    </h3>
                  </div>

                  <button className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 pointer-events-none ${
                    isCurrent && isPlaying 
                      ? "bg-[#ffb3c6] text-[#0a060d] shadow-[0_0_15px_rgba(255,179,198,0.4)]" 
                      : "bg-[#8c5a6b] text-white border border-[#ffb3c6]/30"
                  }`}>
                    {isCurrent && isPlaying ? <Pause size={14} className="stroke-[2.5]" /> : <Play size={14} className="ml-0.5 stroke-[2.5]" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Voice Note Text Display Panel */}
        <AnimatePresence>
          {activeTape && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-2xl bg-[#181121]/20 border border-[#ffb3c6]/40 rounded-2xl p-8 md:p-10 backdrop-blur-sm text-center relative overflow-hidden mt-6"
            >
              <div className="absolute top-0 left-0 w-2 h-2 rounded-br bg-[#ffb3c6]/30" />
              <div className="absolute top-0 right-0 w-2 h-2 rounded-bl bg-[#ffb3c6]/30" />
              <div className="absolute bottom-0 left-0 w-2 h-2 rounded-tr bg-[#ffb3c6]/30" />
              <div className="absolute bottom-0 right-0 w-2 h-2 rounded-tl bg-[#ffb3c6]/30" />
              
              <blockquote className="text-zinc-300 italic text-xs md:text-sm font-serif leading-relaxed px-4">
                &ldquo;{activeTape.voiceNote}&rdquo;
              </blockquote>
            </motion.div>
          )}
        </AnimatePresence>
 
        {/* Proceed Action Trigger */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-md mt-8 md:mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onProceed}
            className="bg-gradient-to-r from-[#ffb3c6] to-[#8c5a6b] hover:from-[#ffe5ec] hover:to-[#ffb3c6] text-[#0a060d] font-bold font-sans tracking-widest text-xs uppercase py-4 px-8 rounded-xl shadow-[0_12px_28px_rgba(255,179,198,0.3)] border border-[#ffb3c6]/20 transition-all duration-300 w-full cursor-pointer flex items-center justify-center gap-2"
          >
            <Camera size={14} className="text-[#0a060d]" />
            <span>Kita Photobooth Yuk</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
