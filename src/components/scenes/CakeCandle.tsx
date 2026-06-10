"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Gift, Heart, Sparkles, Mail } from "lucide-react";

interface CakeCandleProps {
  onProceed: () => void;
}

export default function CakeCandle({ onProceed }: CakeCandleProps) {
  const [isBlown, setIsBlown] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [flameTilt, setFlameTilt] = useState(0);
  const [flameScale, setFlameScale] = useState(1);
  
  // Card 3D tilt coordinates
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const smokeCanvasRef = useRef<HTMLCanvasElement>(null);

  // Mouse move detection near the candle to tilt flame
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isBlown || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cX = rect.left + rect.width / 2;
    const cY = rect.top + 70; // approximate flame position

    const dX = e.clientX - cX;
    const dY = e.clientY - cY;
    const dist = Math.sqrt(dX * dX + dY * dY);

    if (dist < 120) {
      // Tilt away from the cursor
      const tilt = (dX / 120) * -15; // up to 15 degrees tilt
      const compress = 1 - (dist / 120) * 0.15; // flame shrinks slightly as cursor is very close
      setFlameTilt(tilt);
      setFlameScale(compress);
      
      // If cursor gets extremely close (less than 15px), blow it out automatically!
      if (dist < 18) {
        handleBlowOut();
      }
    } else {
      setFlameTilt(0);
      setFlameScale(1);
    }
  };

  const handleMouseLeave = () => {
    setFlameTilt(0);
    setFlameScale(1);
  };

  // 3D Tilt for the Luxury Ticket Card
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left - card.width / 2;
    const y = e.clientY - card.top - card.height / 2;
    setRotateX(-y / 14); // Tilting factor
    setRotateY(x / 14);
  };

  const handleCardMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const triggerConfettiBlast = () => {
    const end = Date.now() + 1500;
    const colors = ["#ffb3c6", "#ffe5ec", "#b88d9f", "#ffffff", "#8c5a6b"];

    const frame = () => {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 65,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 65,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleBlowOut = () => {
    if (isBlown) return;
    setIsBlown(true);
    setFlameTilt(0);
    setFlameScale(0);
    
    // Play synth chime sweep
    playChime();

    // Trigger visual rewards
    setTimeout(() => {
      triggerConfettiBlast();
      setShowPopup(true);
    }, 600);
  };

  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const actx = new AudioCtx();
      const now = actx.currentTime;
      
      const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // Beautiful major chord
      freqs.forEach((f, idx) => {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now + idx * 0.08);
        gain.gain.setValueAtTime(0.06, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.7);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.75);
      });
    } catch (e) {}
  };

  // Smoke Canvas Particle Physics
  useEffect(() => {
    if (!isBlown || !smokeCanvasRef.current) return;
    const canvas = smokeCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      size: number;
      growth: number;
    }> = [];

    // Seed initial rapid smoke particles
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: 100, // centered on the candle wick inside the SVG bounds
        y: 65,  // exact wick height
        vx: (Math.random() - 0.5) * 1.2,
        vy: -Math.random() * 1.8 - 0.8,
        alpha: 0.85,
        size: Math.random() * 4 + 3,
        growth: 0.12 + Math.random() * 0.08,
      });
    }

    let ticks = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Gradually decay smoke emissions
      if (ticks < 55 && ticks % 2 === 0) {
        particles.push({
          x: 100 + (Math.random() - 0.5) * 3,
          y: 65,
          vx: (Math.random() - 0.5) * 0.6,
          vy: -Math.random() * 1.4 - 0.5,
          alpha: 0.7,
          size: Math.random() * 3 + 2,
          growth: 0.08 + Math.random() * 0.06,
        });
      }

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy *= 0.97; // air resistance slowing rising smoke
        p.vx += (Math.random() - 0.5) * 0.12; // light wind gust
        p.size += p.growth;
        p.alpha -= 0.011; // gradual fade

        if (p.alpha <= 0) {
          particles.splice(idx, 1);
          return;
        }

        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        grad.addColorStop(0, `rgba(255, 179, 198, ${p.alpha * 0.25})`);
        grad.addColorStop(0.4, `rgba(254, 251, 246, ${p.alpha * 0.12})`);
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ticks++;
      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isBlown]);

  return (
    <section id="birthday-wish-reveal" className="relative flex flex-col justify-center items-center min-h-screen text-center py-28 md:py-36 px-6 md:px-12 overflow-hidden select-none w-full">
      
      <div className="absolute inset-0 bg-radial-[circle_at_center,_#1b0f1a_0%,_#0a060d_100%] z-0" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ffb3c6]/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ffe5ec]/5 rounded-full filter blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="z-10 flex flex-col items-center max-w-xl w-full gap-y-14 md:gap-y-18"
      >
        {/* Header Group */}
        <div className="flex flex-col items-center gap-y-3 md:gap-y-4 select-none text-center">

          <h2 className="text-4xl md:text-5xl font-serif text-[#F8F5F2] font-semibold tracking-wide neon-text-rose leading-tight flex items-center justify-center gap-3">
            <span>Make A Wish, Sayang</span>
            <Sparkles size={28} className="text-[#ffb3c6] animate-pulse" />
          </h2>
          
          <p className="text-sm md:text-base text-zinc-400 font-sans max-w-md leading-relaxed">
            {isBlown 
              ? "Lilin berhasil dipadamkan! Keinginan indahmu sedang meluncur menuju bintang-bintang..." 
              : "Sentuh, usap layar, atau dekatkan kursor ke arah api untuk meniup lilinnya!"}
          </p>
        </div>

        {/* 3D Interactive Cake Canvas & Container */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleBlowOut}
          className="relative w-[240px] h-[260px] flex flex-col justify-end items-center cursor-pointer group select-none mt-8 md:mt-12 animate-float"
        >
          {/* Smoke particle physics layer */}
          <canvas 
            ref={smokeCanvasRef} 
            width={240} 
            height={260} 
            className="absolute inset-0 pointer-events-none z-20"
          />

          {/* Premium Vector 3D Cake Design */}
          <svg 
            width="220" 
            height="240" 
            viewBox="0 0 200 220" 
            className="z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.65)] overflow-visible transition-transform duration-500 group-hover:scale-105"
          >
            {/* Candle Light Glow (Disappears when blown out) */}
            <AnimatePresence>
              {!isBlown && (
                <motion.g
                  key="candle-glow"
                  initial={{ opacity: 0.8 }}
                  animate={{ 
                    opacity: [0.75, 0.95, 0.75],
                    scale: [1, 1.06, 1]
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  className="pointer-events-none"
                >
                  <circle cx="100" cy="35" r="32" fill="url(#radialGlow)" opacity="0.35" />
                  <circle cx="100" cy="35" r="16" fill="url(#radialGold)" opacity="0.45" />
                </motion.g>
              )}
            </AnimatePresence>

            {/* Candle Flame - Bends in response to mouse movement */}
            <AnimatePresence>
              {!isBlown && (
                <motion.g
                  key="flame"
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ 
                    rotate: flameTilt, 
                    scaleY: flameScale,
                    scaleX: flameScale 
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0, 
                    y: -40,
                    transition: { duration: 0.5, ease: "easeOut" } 
                  }}
                  className="candle-flame"
                  style={{ transformOrigin: "100px 58px" }}
                >
                  {/* Outer vibrant halo */}
                  <ellipse cx="100" cy="35" rx="10" ry="18" fill="#ffd175" opacity="0.55" className="animate-pulse" />
                  {/* Glowing flame core */}
                  <path d="M100,16 C106,28 108,38 100,48 C92,38 94,28 100,16 Z" fill="url(#flameGradient)" />
                  {/* Candle wick */}
                  <line x1="100" y1="46" x2="100" y2="58" stroke="#3d2116" strokeWidth="2.5" strokeLinecap="round" />
                </motion.g>
              )}
            </AnimatePresence>

            {/* Premium Candle Stick */}
            <rect x="97" y="58" width="6" height="28" rx="2" fill="url(#candleGradient)" stroke="rgba(255,179,198,0.4)" strokeWidth="0.5" />
            <path d="M97,63 L103,67 M97,71 L103,75 M97,79 L103,83" stroke="#ffb3c6" strokeWidth="1" opacity="0.6" /> {/* Spiral detail */}

            {/* Cake Top Platform Shadow */}
            <ellipse cx="100" cy="88" rx="42" ry="5" fill="rgba(0,0,0,0.15)" />

            {/* Top Cake Layer 3D Isometric */}
            <g id="top-layer">
              {/* Layer base shape */}
              <path d="M50,110 C50,110 50,135 50,135 C50,145 72,150 100,150 C128,150 150,145 150,135 C150,135 150,110 150,110" fill="url(#roseDeepGradient)" />
              {/* Layer top surface lid */}
              <ellipse cx="100" cy="110" rx="50" ry="18" fill="url(#roseGoldGradient)" />
              
              {/* Luxurious dripping gold frosting */}
              <path d="M50,112 C55,125 60,115 65,128 C70,118 78,135 83,122 C88,118 95,138 100,125 C105,115 112,132 118,120 C123,126 130,115 135,130 C140,116 145,124 150,112 C150,125 128,136 100,136 C72,136 50,125 50,112 Z" fill="#fcfaf7" opacity="0.95" />
              
              {/* Decorative Cream Puffs around top border */}
              <circle cx="58" cy="104" r="3.5" fill="#fbf9f6" opacity="0.9" />
              <circle cx="70" cy="112" r="3.5" fill="#fbf9f6" opacity="0.9" />
              <circle cx="85" cy="118" r="3.5" fill="#fbf9f6" opacity="0.9" />
              <circle cx="100" cy="120" r="4.5" fill="#ffb3c6" /> {/* Pink strawberry/rosebud core */}
              <circle cx="115" cy="118" r="3.5" fill="#fbf9f6" opacity="0.9" />
              <circle cx="130" cy="112" r="3.5" fill="#fbf9f6" opacity="0.9" />
              <circle cx="142" cy="104" r="3.5" fill="#fbf9f6" opacity="0.9" />
            </g>

            {/* Bottom Cake Layer 3D Isometric */}
            <g id="bottom-layer">
              {/* Shadow between layers */}
              <ellipse cx="100" cy="142" rx="72" ry="7" fill="rgba(0,0,0,0.3)" />
              {/* Layer base shape */}
              <path d="M25,145 C25,145 25,178 25,178 C25,192 58,198 100,198 C142,198 175,192 175,178 C175,178 175,145 175,145" fill="url(#chocolateGradient)" />
              {/* Layer top surface lid */}
              <ellipse cx="100" cy="145" rx="75" ry="24" fill="url(#roseDeepGradient)" />
              
              {/* Elegant dripping pink frosting on bottom layer */}
              <path d="M25,148 C35,166 45,152 55,172 C65,156 75,175 85,160 C95,178 105,158 115,175 C125,155 135,172 145,158 C155,174 165,152 175,148 C175,168 142,184 100,184 C58,184 25,168 25,148 Z" fill="#ffe5ec" opacity="0.85" />
            </g>

            {/* Elegant glass serving plate */}
            <g id="plate" transform="translate(0, 10)">
              <ellipse cx="100" cy="190" rx="90" ry="16" fill="none" stroke="url(#goldStrokeGradient)" strokeWidth="1.5" opacity="0.7" />
              <ellipse cx="100" cy="192" rx="92" ry="17" fill="rgba(255, 179, 198, 0.05)" />
              <ellipse cx="100" cy="190" rx="82" ry="12" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.8" />
            </g>

            {/* Gradient and Shader Definitions */}
            <defs>
              <radialGradient id="radialGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffb3c6" stopOpacity="1" />
                <stop offset="60%" stopColor="#ffb3c6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#ffb3c6" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="radialGold" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="40%" stopColor="#ffe5ec" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ffb3c6" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="flameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#ffd175" />
                <stop offset="70%" stopColor="#ff9800" />
                <stop offset="100%" stopColor="#e65100" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="candleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffb3c6" />
                <stop offset="40%" stopColor="#ffffff" />
                <stop offset="70%" stopColor="#ffb3c6" />
                <stop offset="100%" stopColor="#8c5a6b" />
              </linearGradient>
              <linearGradient id="roseGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fefbf6" />
                <stop offset="50%" stopColor="#ffb3c6" />
                <stop offset="100%" stopColor="#b88d9f" />
              </linearGradient>
              <linearGradient id="roseDeepGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8c5a6b" />
                <stop offset="100%" stopColor="#181121" />
              </linearGradient>
              <linearGradient id="chocolateGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#422030" />
                <stop offset="100%" stopColor="#181121" />
              </linearGradient>
              <linearGradient id="goldStrokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8c5a6b" />
                <stop offset="50%" stopColor="#ffe5ec" />
                <stop offset="100%" stopColor="#8c5a6b" />
              </linearGradient>
            </defs>
          </svg>

          {/* Pulsing visual helper prompt */}
          <AnimatePresence>
            {!isBlown && (
              <motion.div
                initial={{ opacity: 0.5, y: 5 }}
                animate={{ opacity: [0.5, 1, 0.5], y: [5, 0, 5] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="mt-6 flex items-center gap-1.5 text-xs text-[#ffb3c6]/90 tracking-wider uppercase font-mono bg-zinc-950/50 px-5 py-2.5 rounded-full border border-zinc-800 backdrop-blur-sm"
              >
                <Heart size={12} className="text-[#ffb3c6] fill-[#ffb3c6] animate-beat" />
                <span>Tiup lilinnya di sini</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* High-End Gold Trimmed 3D Invitation Ticket */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#030714]/92 backdrop-blur-md z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 18 }}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transformStyle: "preserve-3d",
                transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              }}
              className="relative bg-gradient-to-br from-[#1b0f1a] via-[#0a060d] to-[#181121] border-2 border-[#ffb3c6]/30 rounded-3xl p-12 md:p-16 max-w-lg w-full shadow-[0_40px_90px_rgba(0,0,0,0.85)] text-center flex flex-col items-center overflow-hidden transition-shadow duration-300 hover:shadow-[0_45px_100px_rgba(255,179,198,0.25)] gap-8 md:gap-10"
            >
              {/* Luxury corners */}
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#ffe5ec]/40 rounded-tl-md pointer-events-none" />
              <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#ffe5ec]/40 rounded-tr-md pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#ffe5ec]/40 rounded-bl-md pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#ffe5ec]/40 rounded-br-md pointer-events-none" />

              {/* Decorative top pattern */}
              <div className="text-[10px] uppercase font-mono tracking-[0.4em] text-[#ffb3c6] opacity-75 mb-3 flex items-center gap-1.5 justify-center">
                <span>✦</span> Love You <span>✦</span>
              </div>

              {/* Gift Icon Gold Aura */}
              <div 
                style={{ transform: "translateZ(30px)" }}
                className="w-16 h-16 rounded-full bg-[#ffb3c6]/15 border border-[#ffb3c6]/35 flex items-center justify-center text-[#ffe5ec] mb-3 shadow-[0_0_25px_rgba(255,179,198,0.25)] animate-pulse"
              >
                <Gift size={26} className="animate-bounce text-[#ffb3c6]" />
              </div>

              {/* Title typography */}
              <h3 
                style={{ transform: "translateZ(40px)" }}
                className="text-2xl md:text-3xl font-serif text-[#F8F5F2] font-semibold mb-3 leading-snug tracking-wide"
              >
                Happy 23rd Birthday,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffe5ec] via-[#fefbf6] to-[#ffe5ec] drop-shadow-[0_0_12px_rgba(255,179,198,0.25)]">
                  Sabrina Zahra Tudinia!
                </span>
              </h3>
              
              {/* Description letter */}
              <p 
                style={{ transform: "translateZ(25px)" }}
                className="text-zinc-300 text-xs md:text-sm leading-relaxed mb-6 font-sans px-4 select-none animate-fade-in"
              >
                &ldquo;Selamat ulang tahun, sayang. Terima kasih telah hadir dan menjadi bagian terindah dalam hidupku. Semoga setiap langkahmu selalu dipenuhi kebahagiaan, dan semoga aku bisa terus menemanimu menciptakan cerita-cerita indah berikutnya.&rdquo;
              </p>

              {/* Interactive Luxury Proceed Button */}
              <div style={{ transform: "translateZ(50px)" }} className="w-full mt-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    playChime();
                    onProceed();
                  }}
                  className="z-30 bg-gradient-to-r from-[#ffb3c6] to-[#8c5a6b] hover:from-[#ffe5ec] hover:to-[#ffb3c6] text-[#0a060d] font-semibold font-sans tracking-widest text-xs uppercase py-4 px-8 rounded-xl shadow-[0_12px_28px_rgba(255,179,198,0.35)] border border-[#ffb3c6]/40 transition-all duration-300 w-full cursor-pointer flex items-center justify-center gap-2"
                >
                  <Mail size={14} className="text-[#ffe5ec]" />
                  <span>Buka Surat Dariku</span>
                </motion.button>
              </div>

              {/* Little detail */}
              <div className="mt-8 text-[9px] font-mono text-zinc-500 tracking-wider">
                NO. 16062003-SZT • irfan.almnwr
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
