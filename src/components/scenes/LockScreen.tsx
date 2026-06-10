"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Sparkles, Key, AlertCircle, Check, Heart } from "lucide-react";
import confetti from "canvas-confetti";

interface LockScreenProps {
  onUnlock: () => void;
}

// 🌸 HIGH-FIDELITY FLOWER SVG COMPONENTS 🌸

function LuxuryRose({ size = 120, className = "", style = {} }: { size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} style={style}>
      <g>
        {/* Leaves */}
        <path d="M22,48 C12,32 28,18 42,38 C32,43 22,48 22,48" fill="#4a2e35" opacity="0.65" />
        <path d="M78,48 C88,64 72,78 58,58 C68,53 78,48 78,48" fill="#4a2e35" opacity="0.65" />
        {/* Outer Petals */}
        <circle cx="50" cy="50" r="45" fill="#8c5a6b" opacity="0.45" />
        <path d="M50,10 C65,10 80,25 80,40 C80,55 65,70 50,70 C35,70 20,55 20,40 C20,25 35,10 50,10" fill="#b88d9f" opacity="0.6" />
        <path d="M28,32 C38,15 62,15 72,32 C82,48 68,75 50,75 C32,75 18,48 28,32 Z" fill="#ffb3c6" opacity="0.75" />
        <path d="M33,40 C38,26 62,26 67,40 C72,55 58,68 50,68 C42,68 28,55 33,40 Z" fill="#ffe5ec" opacity="0.85" />
        <path d="M40,46 C44,38 56,38 60,46 C62,55 56,60 50,60 C44,60 38,55 40,46 Z" fill="#fefbf6" opacity="0.95" />
        {/* Center Core */}
        <path d="M48,48 C49,45 51,45 52,48 C53,50 51,52 50,52 C49,52 47,50 48,48" fill="#ffb3c6" />
      </g>
    </svg>
  );
}

function LuxuryPeony({ size = 110, className = "", style = {} }: { size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} style={style}>
      <g>
        <circle cx="50" cy="50" r="42" fill="#8c5a6b" opacity="0.3" />
        {/* Layer 1 ruffle petals */}
        <path d="M50,13 C70,8 88,23 83,45 C78,67 55,82 50,87 C45,82 22,67 17,45 C12,23 30,8 50,13 Z" fill="#b88d9f" opacity="0.5" />
        <path d="M50,20 C66,15 80,28 76,46 C72,64 54,76 50,80 C46,80 28,64 24,46 C20,28 34,15 50,20 Z" fill="#ffb3c6" opacity="0.75" />
        {/* Layer 2 soft inner ruffles */}
        <path d="M50,28 C60,25 70,33 68,45 C66,57 54,67 50,70 C46,70 34,57 32,45 C30,33 40,25 50,28 Z" fill="#ffe5ec" opacity="0.88" />
        <path d="M50,36 C55,34 62,38 61,46 C60,54 52,60 50,62 C48,62 40,54 39,46 C38,38 45,34 50,36 Z" fill="#fefbf6" opacity="0.97" />
        <circle cx="50" cy="47" r="4.5" fill="#fbcfe8" />
      </g>
    </svg>
  );
}

function LuxuryLily({ size = 120, className = "", style = {} }: { size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} style={style}>
      <g transform="translate(50, 50)">
        {/* Lily Petals (Radiating angles) */}
        <path d="M0,0 Q-16,-46 0,-46 Q16,-46 0,0" fill="#fefbf6" opacity="0.95" stroke="#ffe5ec" strokeWidth="0.8" />
        <path d="M0,0 Q-16,46 0,46 Q16,46 0,0" fill="#fefbf6" opacity="0.95" stroke="#ffe5ec" strokeWidth="0.8" transform="rotate(180)" />
        <path d="M0,0 Q-16,-46 0,-46 Q16,-46 0,0" fill="#ffb3c6" opacity="0.88" stroke="#ffe5ec" strokeWidth="0.8" transform="rotate(60)" />
        <path d="M0,0 Q-16,-46 0,-46 Q16,-46 0,0" fill="#ffb3c6" opacity="0.88" stroke="#ffe5ec" strokeWidth="0.8" transform="rotate(120)" />
        <path d="M0,0 Q-16,-46 0,-46 Q16,-46 0,0" fill="#ffb3c6" opacity="0.88" stroke="#ffe5ec" strokeWidth="0.8" transform="rotate(240)" />
        <path d="M0,0 Q-16,-46 0,-46 Q16,-46 0,0" fill="#ffb3c6" opacity="0.88" stroke="#ffe5ec" strokeWidth="0.8" transform="rotate(300)" />
        {/* Filament & Anther center */}
        <circle cx="0" cy="0" r="5" fill="#fefbf6" />
        <line x1="0" y1="0" x2="-6" y2="-14" stroke="#d97706" strokeWidth="1" />
        <line x1="0" y1="0" x2="6" y2="-14" stroke="#d97706" strokeWidth="1" />
        <line x1="0" y1="0" x2="-12" y2="6" stroke="#d97706" strokeWidth="1" />
        <line x1="0" y1="0" x2="12" y2="6" stroke="#d97706" strokeWidth="1" />
        <line x1="0" y1="0" x2="0" y2="14" stroke="#d97706" strokeWidth="1" />
        <circle cx="-6" cy="-14" r="2" fill="#b45309" />
        <circle cx="6" cy="-14" r="2" fill="#b45309" />
        <circle cx="-12" cy="6" r="2" fill="#b45309" />
        <circle cx="12" cy="6" r="2" fill="#b45309" />
        <circle cx="0" cy="14" r="2" fill="#b45309" />
      </g>
    </svg>
  );
}

function BabysBreath({ size = 95, className = "", style = {} }: { size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} style={style}>
      <g>
        <path d="M50,90 Q40,63 50,42 T30,18" stroke="#8c5a6b" strokeWidth="1.4" fill="none" opacity="0.5" />
        <path d="M50,68 Q60,48 45,28 T65,12" stroke="#8c5a6b" strokeWidth="1.2" fill="none" opacity="0.5" />
        <path d="M50,52 Q35,38 25,32" stroke="#8c5a6b" strokeWidth="1.0" fill="none" opacity="0.5" />
        <path d="M50,42 Q65,32 75,28" stroke="#8c5a6b" strokeWidth="1.0" fill="none" opacity="0.5" />
        {[
          { cx: 30, cy: 18 },
          { cx: 25, cy: 32 },
          { cx: 65, cy: 12 },
          { cx: 75, cy: 28 },
          { cx: 45, cy: 28 },
          { cx: 50, cy: 42 },
          { cx: 35, cy: 48 },
          { cx: 60, cy: 38 }
        ].map((pt, i) => (
          <g key={i} transform={`translate(${pt.cx}, ${pt.cy})`}>
            <circle cx="0" cy="0" r="5" fill="#fefbf6" opacity="0.9" />
            <circle cx="0" cy="0" r="2.8" fill="#ffb3c6" />
            <circle cx="-3.5" cy="-3.5" r="1.5" fill="#fefbf6" />
            <circle cx="3.5" cy="-3.5" r="1.5" fill="#fefbf6" />
            <circle cx="-3.5" cy="3.5" r="1.5" fill="#fefbf6" />
            <circle cx="3.5" cy="3.5" r="1.5" fill="#fefbf6" />
          </g>
        ))}
      </g>
    </svg>
  );
}

// 🌸 DENSE ORGANIC COORDINATES FOR BOTH PANEL FLOWER CURTAINS 🌸

const leftCurtainFlowers = [
  // Corners
  { type: "rose", left: "6%", top: "6%", scale: 1.3, rotate: 12 },
  { type: "peony", left: "18%", top: "12%", scale: 1.1, rotate: -22 },
  { type: "lily", left: "10%", top: "18%", scale: 1.05, rotate: 38 },
  
  { type: "rose", left: "6%", top: "94%", scale: 1.3, rotate: -15 },
  { type: "peony", left: "18%", top: "88%", scale: 1.1, rotate: 28 },
  { type: "lily", left: "10%", top: "82%", scale: 1.05, rotate: -10 },

  // Left Border Line
  { type: "breath", left: "8%", top: "30%", scale: 1.0, rotate: 5 },
  { type: "rose", left: "7%", top: "42%", scale: 1.25, rotate: 45 },
  { type: "peony", left: "9%", top: "54%", scale: 1.15, rotate: -30 },
  { type: "lily", left: "6%", top: "68%", scale: 1.1, rotate: 15 },

  // Top Border Line
  { type: "breath", left: "32%", top: "8%", scale: 0.95, rotate: 18 },
  { type: "rose", left: "46%", top: "7%", scale: 1.2, rotate: -8 },
  { type: "lily", left: "60%", top: "9%", scale: 1.1, rotate: 25 },
  { type: "peony", left: "74%", top: "6%", scale: 1.15, rotate: -12 },
  { type: "breath", left: "86%", top: "8%", scale: 0.95, rotate: 40 },

  // Bottom Border Line
  { type: "breath", left: "32%", top: "92%", scale: 0.95, rotate: -18 },
  { type: "rose", left: "46%", top: "93%", scale: 1.2, rotate: 14 },
  { type: "lily", left: "60%", top: "91%", scale: 1.1, rotate: -35 },
  { type: "peony", left: "74%", top: "94%", scale: 1.15, rotate: 8 },
  { type: "breath", left: "86%", top: "92%", scale: 0.95, rotate: -20 },

  // Seam/Split Border (Right side of left curtain)
  { type: "rose", left: "94%", top: "22%", scale: 1.2, rotate: 15 },
  { type: "lily", left: "92%", top: "38%", scale: 1.1, rotate: -25 },
  { type: "peony", left: "95%", top: "52%", scale: 1.15, rotate: 30 },
  { type: "rose", left: "93%", top: "70%", scale: 1.2, rotate: -10 },
  
  // Extra dense filler duplicates for lush overlap
  { type: "breath", left: "14%", top: "28%", scale: 0.85, rotate: 10 },
  { type: "rose", left: "16%", top: "64%", scale: 0.95, rotate: -15 },
  { type: "lily", left: "86%", top: "20%", scale: 0.9, rotate: 45 },
  { type: "peony", left: "88%", top: "80%", scale: 0.95, rotate: -30 }
];

const rightCurtainFlowers = [
  // Corners
  { type: "rose", left: "94%", top: "6%", scale: 1.3, rotate: -12 },
  { type: "peony", left: "82%", top: "12%", scale: 1.1, rotate: 22 },
  { type: "lily", left: "90%", top: "18%", scale: 1.05, rotate: -38 },
  
  { type: "rose", left: "94%", top: "94%", scale: 1.3, rotate: 15 },
  { type: "peony", left: "82%", top: "88%", scale: 1.1, rotate: -28 },
  { type: "lily", left: "90%", top: "82%", scale: 1.05, rotate: 10 },

  // Right Border Line
  { type: "breath", left: "92%", top: "30%", scale: 1.0, rotate: -5 },
  { type: "rose", left: "93%", top: "42%", scale: 1.25, rotate: -45 },
  { type: "peony", left: "91%", top: "54%", scale: 1.15, rotate: 30 },
  { type: "lily", left: "94%", top: "68%", scale: 1.1, rotate: -15 },

  // Top Border Line
  { type: "breath", left: "68%", top: "8%", scale: 0.95, rotate: -18 },
  { type: "rose", left: "54%", top: "7%", scale: 1.2, rotate: 8 },
  { type: "lily", left: "40%", top: "9%", scale: 1.1, rotate: -25 },
  { type: "peony", left: "26%", top: "6%", scale: 1.15, rotate: 12 },
  { type: "breath", left: "14%", top: "8%", scale: 0.95, rotate: -40 },

  // Bottom Border Line
  { type: "breath", left: "68%", top: "92%", scale: 0.95, rotate: 18 },
  { type: "rose", left: "54%", top: "93%", scale: 1.2, rotate: -14 },
  { type: "lily", left: "40%", top: "91%", scale: 1.1, rotate: 35 },
  { type: "peony", left: "26%", top: "94%", scale: 1.15, rotate: -8 },
  { type: "breath", left: "14%", top: "92%", scale: 0.95, rotate: 20 },

  // Seam/Split Border (Left side of right curtain)
  { type: "rose", left: "6%", top: "22%", scale: 1.2, rotate: -15 },
  { type: "lily", left: "8%", top: "38%", scale: 1.1, rotate: 25 },
  { type: "peony", left: "5%", top: "52%", scale: 1.15, rotate: -30 },
  { type: "rose", left: "7%", top: "70%", scale: 1.2, rotate: 10 },
  
  // Extra dense filler duplicates for lush overlap
  { type: "breath", left: "86%", top: "28%", scale: 0.85, rotate: -10 },
  { type: "rose", left: "84%", top: "64%", scale: 0.95, rotate: 15 },
  { type: "lily", left: "14%", top: "20%", scale: 0.9, rotate: -45 },
  { type: "peony", left: "12%", top: "80%", scale: 0.95, rotate: 30 }
];

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [petals, setPetals] = useState<any[]>([]);
  const [timeStr, setTimeStr] = useState("00:00:00");
  const [dateStr, setDateStr] = useState("Loading...");
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    setIsMounted(true);
    setPetals(
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: `${5 + Math.random() * 90}%`,
        top: `${-10 - Math.random() * 20}%`,
        scale: 0.4 + Math.random() * 0.7,
        duration: 8 + Math.random() * 10,
        delay: Math.random() * -18,
        sway: 35 + Math.random() * 55,
        rotateSpeed: 180 + Math.random() * 360
      }))
    );
  }, []);
  
  // Curtain opening state
  const [isCurtainOpened, setIsCurtainOpened] = useState(false);
  const [isCurtainFading, setIsCurtainFading] = useState(false);

  // States for interactive unlocking
  const [isBypassed, setIsBypassed] = useState(false);
  const [isUnlockedByDefault, setIsUnlockedByDefault] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState(false);
  
  // Easter Egg Click Counter for Dev Bypass
  const [easterEggClicks, setEasterEggClicks] = useState(0);

  const isUnlocked = isUnlockedByDefault || isBypassed;

  useEffect(() => {
    // 1. Digital Clock ticking
    const updateTime = () => {
      const d = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      setTimeStr(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
      
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      setDateStr(d.toLocaleDateString('id-ID', options));

      // 2. Countdown logic to 16 June 2026
      const targetDate = new Date("June 16, 2026 00:00:00").getTime();
      const difference = targetDate - d.getTime();

      if (difference <= 0) {
        setCountdown({ days: 0, hours: 0, mins: 0, secs: 0 });
        setIsUnlockedByDefault(true);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((difference % (1000 * 60)) / 1000);
        setCountdown({ days, hours, mins, secs });
        setIsUnlockedByDefault(false);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const playChime = (type: "success" | "error" | "click") => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const actx = new AudioCtx();
      const now = actx.currentTime;
      
      if (type === "success") {
        const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        freqs.forEach((f, idx) => {
          const osc = actx.createOscillator();
          const gain = actx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, now + idx * 0.08);
          gain.gain.setValueAtTime(0.06, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.6);
          osc.connect(gain);
          gain.connect(actx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.65);
        });
      } else if (type === "error") {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.setValueAtTime(120, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.0001, now + 0.25);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
      } else {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start(now);
        osc.stop(now + 0.36);
      }
    } catch (e) {}
  };

  const handleUnlockClick = () => {
    playChime("success");
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
      colors: ["#ffb3c6", "#ffe5ec", "#b88d9f", "#fefbf6"]
    });
    
    setTimeout(() => {
      onUnlock();
    }, 450);
  };

  const handleOpenCurtainClick = () => {
    playChime("success");
    confetti({
      particleCount: 80,
      spread: 60,
      colors: ["#ffb3c6", "#ffe5ec", "#fefbf6"]
    });
    
    setIsCurtainFading(true);
    setTimeout(() => {
      setIsCurtainOpened(true);
    }, 1600);
  };

  const triggerEasterEggBypass = () => {
    playChime("success");
    confetti({
      particleCount: 100,
      spread: 70,
      colors: ["#ffb3c6", "#ffe5ec", "#fefbf6"]
    });
    setIsBypassed(true);
  };

  const handleEasterEggClick = () => {
    const nextClicks = easterEggClicks + 1;
    setEasterEggClicks(nextClicks);
    playChime("click");
    
    if (nextClicks >= 3) {
      triggerEasterEggBypass();
      setEasterEggClicks(0);
    }
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passcode.trim().toLowerCase();

    if (cleanPass === "1606" || cleanPass === "sabrina" || cleanPass === "16 juni" || cleanPass === "yayoi") {
      setPassSuccess(true);
      setPassError("");
      playChime("success");
      
      confetti({
        particleCount: 80,
        spread: 60,
        colors: ["#ffb3c6", "#ffe5ec", "#fefbf6"]
      });

      setTimeout(() => {
        setIsBypassed(true);
        setShowKeyModal(false);
        setPassSuccess(false);
        setPasscode("");
        onUnlock();
      }, 1000);
    } else {
      setPassError("Kunci rahasia salah, coba tanyakan pada si pembuat kado... 😉");
      playChime("error");
      setTimeout(() => setPassError("Kunci rahasia salah, coba lagi..."), 2500);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      
      {/* 🌸 CONTINUOUS DRIFTING PETALS OVERLAY 🌸 */}
      {isMounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
          {petals.map((petal) => (
            <motion.div
              key={petal.id}
              initial={{ 
                left: petal.left, 
                top: petal.top, 
                scale: petal.scale, 
                rotate: 0,
                opacity: 0
              }}
              animate={{ 
                top: "105vh",
                x: [0, petal.sway, -petal.sway, 0],
                rotate: petal.rotateSpeed,
                opacity: [0, 0.9, 0.9, 0]
              }}
              transition={{ 
                duration: petal.duration, 
                repeat: Infinity, 
                ease: "linear",
                delay: petal.delay
              }}
              className="absolute w-5 h-5 flex items-center justify-center"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#ffc2d1]/80 fill-current">
                {/* Organic single petal vector */}
                <path d="M 50 15 C 20 15, 5 45, 50 85 C 95 45, 80 15, 50 15 Z" />
              </svg>
            </motion.div>
          ))}
        </div>
      )}

      {/* 🌸 CINEMATIC FLOWER CURTAINS OVERLAY 🌸 */}
      <AnimatePresence>
        {!isCurtainOpened && (
          <motion.div
            key="curtains-overlay"
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex pointer-events-auto"
          >
            {/* Left Curtain */}
            <motion.div
              initial={{ x: "0%" }}
              animate={{ x: isCurtainFading ? "-100%" : "0%" }}
              transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
              className="w-1/2 h-full relative overflow-hidden flex justify-end"
              style={{
                background: "linear-gradient(135deg, #1b0f1a 0%, #0a060d 100%)",
                borderRight: "1px solid rgba(255, 179, 198, 0.15)"
              }}
            >
              {/* Dense Floral Wall Left */}
              <div className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden opacity-90">
                {leftCurtainFlowers.map((flower, idx) => {
                  const size = flower.scale * 105;
                  const Component = 
                    flower.type === "rose" ? LuxuryRose :
                    flower.type === "peony" ? LuxuryPeony :
                    flower.type === "lily" ? LuxuryLily :
                    BabysBreath;
                  return (
                    <Component
                      key={idx}
                      size={size}
                      className="absolute"
                      style={{
                        left: flower.left,
                        top: flower.top,
                        transform: `translate(-50%, -50%) rotate(${flower.rotate}deg)`,
                      }}
                    />
                  );
                })}
              </div>
            </motion.div>

            {/* Right Curtain */}
            <motion.div
              initial={{ x: "0%" }}
              animate={{ x: isCurtainFading ? "100%" : "0%" }}
              transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
              className="w-1/2 h-full relative overflow-hidden flex justify-start"
              style={{
                background: "linear-gradient(225deg, #181121 0%, #0a060d 100%)",
                borderLeft: "1px solid rgba(255, 179, 198, 0.15)"
              }}
            >
              {/* Dense Floral Wall Right */}
              <div className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden opacity-90">
                {rightCurtainFlowers.map((flower, idx) => {
                  const size = flower.scale * 105;
                  const Component = 
                    flower.type === "rose" ? LuxuryRose :
                    flower.type === "peony" ? LuxuryPeony :
                    flower.type === "lily" ? LuxuryLily :
                    BabysBreath;
                  return (
                    <Component
                      key={idx}
                      size={size}
                      className="absolute"
                      style={{
                        left: flower.left,
                        top: flower.top,
                        transform: `translate(-50%, -50%) rotate(${flower.rotate}deg)`,
                      }}
                    />
                  );
                })}
              </div>
            </motion.div>

            {/* Center Curtain Content */}
            <motion.div
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: isCurtainFading ? 0 : 1, scale: isCurtainFading ? 0.8 : 1 }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center text-center p-6 pointer-events-none"
            >
              <div className="glass-card max-w-lg w-full p-10 md:p-14 border border-[#ffb3c6] border-opacity-20 shadow-[0_25px_60px_rgba(0,0,0,0.8)] rounded-[36px] bg-gradient-to-b from-[#1b0f1a]/85 to-[#0a060d]/90 backdrop-blur-md pointer-events-auto flex flex-col items-center">
                {/* Floating premium rose illustration */}
                <motion.img
                  src="/assets/images/premium_flower.png"
                  alt="Premium Rose"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                  className="w-32 h-32 md:w-36 md:h-36 object-contain mb-6 drop-shadow-[0_10px_25px_rgba(255,179,198,0.25)]"
                />

                {/* Subtitle */}
                <span className="text-[10px] md:text-[11px] font-mono tracking-[0.4em] text-[#ffb3c6] uppercase mb-3">
                  A Journey
                </span>

                {/* Main Luxury Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold text-[#fefbf6] leading-tight text-shadow-rose mb-6">
                  Hari Special Kamu
                </h1>

                {/* Script Accent phrase */}
                <p className="text-xl md:text-2xl font-cursive text-[#ffe5ec] mb-8 select-none">
                  untuk yaya kuuuu... 🌸
                </p>

                {/* Floral curtain frame separator */}
                <div className="flex items-center gap-3 w-full justify-center mb-8 opacity-45">
                  <div className="h-[1px] bg-gradient-to-r from-transparent to-[#ffb3c6] w-20" />
                  <span className="text-xs text-[#ffb3c6]">✿</span>
                  <div className="h-[1px] bg-gradient-to-l from-transparent to-[#ffb3c6] w-20" />
                </div>

                {/* Main Enter button */}
                <button
                  onClick={handleOpenCurtainClick}
                  className="btn-primary flex items-center gap-3 shadow-[0_8px_30px_#8c5a6b55] hover:shadow-[0_12px_35px_#ffb3c655]"
                  style={{
                    backgroundColor: "#ffb3c6",
                    color: "#0a060d",
                    borderColor: "#ffe5ec",
                    boxShadow: "0 10px 30px rgba(255, 179, 198, 0.3)"
                  }}
                >
                  <Sparkles size={16} className="animate-spin duration-3000" />
                  <span>Open Your Gift</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔐 ACTUAL LOCK SCREEN CONTENT 🔐 */}
      <section 
        id="midnight-lockscreen" 
        className="relative flex flex-col justify-center items-center min-h-screen text-center px-6 md:px-12 py-28 md:py-36 overflow-hidden w-full"
        style={{
          background: "radial-gradient(circle at center, #1b0f1a 0%, #0a060d 100%)"
        }}
      >
        {/* Background Decorative Watermark Flowers */}
        <LuxuryRose size={220} className="absolute -top-16 -left-16 opacity-10 rotate-12 pointer-events-none" />
        <LuxuryPeony size={200} className="absolute -top-12 -right-12 opacity-10 -rotate-25 pointer-events-none" />
        <LuxuryLily size={210} className="absolute -bottom-16 -left-16 opacity-8 rotate-45 pointer-events-none" />
        <LuxuryRose size={240} className="absolute -bottom-20 -right-20 opacity-8 -rotate-35 pointer-events-none" />

        {/* Background Interactive Ambient Lighting */}
        <div 
          className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[400px] rounded-full pointer-events-none animate-pulse duration-[6000ms]" 
          style={{
            background: "radial-gradient(circle, rgba(255, 179, 198, 0.12) 0%, transparent 70%)",
            willChange: "opacity"
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[45vw] h-[45vw] max-w-[450px] rounded-full pointer-events-none animate-pulse duration-[8000ms]" 
          style={{
            background: "radial-gradient(circle, rgba(255, 229, 236, 0.1) 0%, transparent 70%)",
            willChange: "opacity"
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="z-10 flex flex-col items-center max-w-xl w-full gap-y-14 md:gap-y-18"
        >
          {/* Header Group */}
          <div className="flex flex-col items-center gap-y-3 md:gap-y-4 select-none text-center mb-2">
            {/* Cinematic Header Sparks */}
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#ffb3c6] animate-pulse" />
              <span className="text-[10px] md:text-[11px] font-mono tracking-[0.4em] text-[#ffb3c6]/80 uppercase">
                Hari Ketika Semesta Menghadirkanmu
              </span>
              <Sparkles size={16} className="text-[#ffb3c6] animate-pulse" />
            </div>

            {/* Digital Clock with Premium Serif Font & Rose Gold Glow */}
            <h1 
              onClick={handleEasterEggClick}
              className="text-7xl md:text-8xl font-serif font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#fefbf6] via-[#ffe5ec] to-[#b88d9f] drop-shadow-[0_0_25px_rgba(255,179,198,0.25)] cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300"
            >
              {timeStr}
            </h1>
            
            <p className="text-xs md:text-sm font-mono tracking-[0.25em] text-[#ffe5ec]/85 uppercase">
              {dateStr}
            </p>
          </div>

          {/* Luxury Glassmorphic Poster Panel */}
          <div className="glass-card p-10 md:p-14 max-w-lg w-full flex flex-col items-center relative overflow-hidden border border-white/5 shadow-[0_30px_70px_rgba(0,0,0,0.7)] rounded-[32px] bg-gradient-to-b from-white/[0.04] to-white/[0.01]">
            {/* Subtle pink line accent */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#ffb3c6]/30 to-transparent" />
            
            <button 
              onClick={triggerEasterEggBypass}
              className="text-[9px] uppercase font-mono tracking-[0.35em] text-[#ffb3c6] font-bold mb-8 select-none hover:text-[#ffe5ec] transition-colors duration-300"
            >
              ✦ DEAR MY LOVE ✦
            </button>

            <h2 className="text-3xl md:text-4xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#F8F5F2] via-[#e2d5cb] to-[#F8F5F2] font-semibold mb-10 tracking-wide leading-tight drop-shadow-sm">
              A Day for My Favorite Person
            </h2>
            
            <div className="w-12 h-[1px] bg-[#ffb3c6]/40 mb-10" />

            <blockquote className="text-zinc-300 italic text-sm md:text-[14.5px] mb-12 max-w-md font-serif border-l-2 border-[#ffb3c6]/60 pl-4 py-2 leading-relaxed text-left select-none">
              &ldquo;Hari ini bukan hanya tentang bertambahnya usia. Hari ini adalah pengingat bahwa dunia pernah menghadirkan seseorang yang membuat hariku terasa lebih indah. Selamat ulang tahun, sayang.&rdquo;
            </blockquote>

            {/* Countdown Horizontal Capsule Grid */}
            <div className="grid grid-cols-4 gap-3.5 md:gap-4.5 w-full select-none mt-6">
              {[
                { label: "Hari", value: countdown.days },
                { label: "Jam", value: countdown.hours },
                { label: "Menit", value: countdown.mins },
                { label: "Detik", value: countdown.secs },
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="bg-[#181121]/70 border border-white/5 rounded-2xl py-5 md:py-7 px-2.5 flex flex-col items-center justify-center shadow-inner transition-all duration-500 relative group overflow-hidden"
                  style={{
                    borderColor: "rgba(255, 179, 198, 0.05)"
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <span className="text-2xl md:text-3.5xl font-bold font-serif text-[#ffb3c6] drop-shadow-[0_0_12px_rgba(255,179,198,0.25)] tracking-tight">
                    {item.value.toString().padStart(2, "0")}
                  </span>
                  <span className="text-[8.5px] md:text-[9.5px] text-[#ffe5ec]/60 uppercase tracking-widest mt-1.5 font-mono font-medium">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Lock Actions Controller - Floating Biometric glass bar */}
          <div className="z-20 w-full max-w-md px-2 flex justify-center mt-6 md:mt-10">
            <AnimatePresence mode="wait">
              {isUnlocked ? (
                <motion.button
                  key="btn-unlocked"
                  initial={{ scale: 0.9, opacity: 0, y: 15 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleUnlockClick}
                  className="bg-gradient-to-r from-[#ffb3c6] via-[#ffe5ec] to-[#b88d9f] text-[#0a060d] font-bold py-4 px-10 rounded-full shadow-[0_0_35px_rgba(255,179,198,0.45)] flex items-center gap-3.5 transition-shadow duration-300 font-sans text-sm tracking-widest uppercase cursor-pointer"
                  style={{
                    boxShadow: "0 0 35px rgba(255, 179, 198, 0.45)",
                  }}
                >
                  <Unlock size={16} className="stroke-[3] animate-bounce" />
                  <span>Open Your Gift</span>
                </motion.button>
              ) : (
                <motion.button
                  key="countdown-lock"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    playChime("click");
                    setShowKeyModal(true);
                  }}
                  className="w-full flex items-center justify-between gap-4 border border-white/5 rounded-2xl px-6 py-4 bg-[#181121]/50 backdrop-blur-md cursor-pointer hover:shadow-[0_0_25px_rgba(255,179,198,0.15)] transition-all duration-500 group relative"
                  style={{
                    borderColor: "rgba(255, 179, 198, 0.05)"
                  }}
                >
                  {/* Glowing bar core gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#ffb3c6]/40 to-transparent" />
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#ffb3c6]/20 flex items-center justify-center text-[#ffb3c6] group-hover:scale-110 transition-transform duration-300">
                      <Lock size={14} className="stroke-[2.5]" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] uppercase font-mono tracking-widest text-[#ffe5ec]/50 font-semibold">Status Taman</p>
                      <p className="text-xs font-sans text-[#F8F5F2] font-medium tracking-wide">Terkunci hingga 16 Juni 2026</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-[#ffb3c6]/15 border border-[#ffb3c6]/25 hover:border-[#ffb3c6]/50 rounded-full px-4 py-1.5 text-xs text-[#ffb3c6] font-medium tracking-wide font-sans shadow-sm group-hover:bg-[#ffb3c6]/30 transition-all duration-300">
                    <Key size={11} className="stroke-[2.5]" />
                    <span>Buka Kunci</span>
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Luxury Password Modal Overlay */}
        <AnimatePresence>
          {showKeyModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0a060d]/92 backdrop-blur-lg z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.93, y: 25, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.93, y: 25, opacity: 0 }}
                transition={{ type: "spring", stiffness: 140, damping: 18 }}
                className="bg-[#181121]/90 border border-white/10 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-[0_30px_70px_rgba(0,0,0,0.85)] text-center relative overflow-hidden backdrop-blur-xl"
              >
                {/* Pink light burst aura inside modal */}
                <div className="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-[#ffe5ec]/10 filter blur-xl" />
                <div className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-[#ffb3c6]/10 filter blur-xl" />

                {/* Close Button */}
                <button 
                  onClick={() => {
                    playChime("click");
                    setShowKeyModal(false);
                    setPasscode("");
                    setPassError("");
                  }}
                  className="absolute top-4 right-4 text-zinc-500 hover:text-[#F8F5F2] font-mono text-lg transition-colors cursor-pointer w-7 h-7 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10"
                >
                  ✕
                </button>

                <div className="w-14 h-14 rounded-full bg-[#ffb3c6]/15 flex items-center justify-center text-[#ffb3c6] mx-auto mb-5 shadow-[0_0_20px_rgba(255,179,198,0.25)] border border-[#ffb3c6]/20">
                  {passSuccess ? <Check size={24} className="stroke-[3] animate-pulse" /> : <Key size={24} className="stroke-[2]" />}
                </div>

                <h3 className="text-xl font-serif text-[#F8F5F2] font-semibold mb-2">
                  Masukkan Kunci Taman Bunga
                </h3>
                
                <p className="text-xs text-[#ffe5ec]/60 mb-6 font-sans max-w-[280px] mx-auto leading-relaxed">
                  Masukkan tanggal lahir spesial Sabrina (DDMM) atau nama panggilannya untuk melewati batas waktu countdown.
                </p>

                <form onSubmit={handlePasscodeSubmit} className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Ketik kunci rahasia..."
                    autoFocus
                    className="w-full bg-black/40 border border-white/10 focus:border-[#ffb3c6] focus:ring-1 focus:ring-[#ffb3c6] rounded-xl px-4 py-3 text-center text-[#F8F5F2] font-serif text-lg tracking-widest placeholder-zinc-700 outline-none transition-all duration-300"
                  />

                  {passError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="text-rose-400 text-xs font-sans flex items-center gap-1.5 justify-center mt-1 bg-rose-500/10 border border-rose-500/20 py-2 px-3 rounded-lg"
                    >
                      <AlertCircle size={13} className="stroke-[2.5] flex-shrink-0" />
                      <span className="leading-snug">{passError}</span>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    className="mt-2 bg-gradient-to-r from-[#ffb3c6] to-[#8c5a6b] hover:from-[#ffe5ec] hover:to-[#ffb3c6] text-[#0a060d] font-bold py-3.5 rounded-xl shadow-[0_6px_20px_rgba(255,179,198,0.3)] hover:shadow-[0_6px_25px_rgba(255,179,198,0.5)] transition-all duration-300 cursor-pointer font-sans text-xs tracking-widest uppercase flex items-center justify-center gap-2"
                  >
                    <Sparkles size={14} />
                    <span>Buka Kunci Taman</span>
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
