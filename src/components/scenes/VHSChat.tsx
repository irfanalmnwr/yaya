"use client";

import { useEffect, useRef, useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Tv, HelpCircle, Film, MessageCircle, BookOpen } from "lucide-react";

interface Message {
  sender: "pria" | "wanita";
  text: string;
  time: string;
  date?: string;
}

interface VHSChatProps {
  onProceed: () => void;
}

// 🌸 MEMOIZED ROSE GARLAND SVG 🌸
const RoseGarland = memo(function RoseGarland() {
  return (
    <div className="absolute -top-7 -left-7 -right-7 h-20 pointer-events-none z-30 select-none overflow-visible">
      <svg viewBox="0 0 380 80" className="w-full h-full overflow-visible">
        {/* Organic vine path curving across the top and wrapping slightly down the corners */}
        <path 
          d="M -15,70 Q 20,-10 90,15 T 190,10 T 290,15 T 395,70" 
          fill="none" 
          stroke="#4a2e35" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
        />
        <path 
          d="M -15,70 Q 20,-10 90,15 T 190,10 T 290,15 T 395,70" 
          fill="none" 
          stroke="#8c5a6b" 
          strokeWidth="2" 
          strokeLinecap="round" 
        />
        
        {/* Leaves branching off the main vine */}
        <g fill="#4a2e35" opacity="0.8">
          {/* Left side leaves */}
          <path d="M 25,12 Q 10,2 2,15 Q 18,18 25,12 Z" />
          <path d="M 50,15 Q 40,28 58,32 Q 58,18 50,15 Z" />
          <path d="M 78,16 Q 88,4 74,-4 Q 68,10 78,16 Z" />
          {/* Center leaves */}
          <path d="M 120,10 Q 110,25 128,28 Q 128,14 120,10 Z" />
          <path d="M 160,12 Q 170,0 156,-6 Q 150,8 160,12 Z" />
          <path d="M 200,8 Q 190,22 208,24 Q 208,12 200,8 Z" />
          {/* Right side leaves */}
          <path d="M 240,11 Q 250,-1 236,-8 Q 230,6 240,11 Z" />
          <path d="M 280,14 Q 270,26 288,30 Q 288,16 280,14 Z" />
          <path d="M 315,18 Q 325,4 310,-2 Q 305,10 315,18 Z" />
          <path d="M 350,32 Q 338,40 355,48 Q 358,35 350,32 Z" />
        </g>

        {/* Smaller accent leaves in lighter mauve */}
        <g fill="#b88d9f" opacity="0.6">
          <path d="M 15,22 Q 5,18 0,28 Z" />
          <path d="M 98,14 Q 90,5 92,20 Z" />
          <path d="M 175,10 Q 185,25 178,30 Z" />
          <path d="M 260,12 Q 250,0 262,-5 Z" />
          <path d="M 335,22 Q 345,35 338,40 Z" />
        </g>

        {/* Blooming climbing roses nesting on the vines */}
        {[
          { cx: 5, cy: 50, r: 12, color: "#ffb3c6" },
          { cx: 45, cy: 12, r: 10, color: "#ffe5ec" },
          { cx: 100, cy: 14, r: 14, color: "#ffb3c6" },
          { cx: 155, cy: 8, r: 11, color: "#ffe5ec" },
          { cx: 215, cy: 10, r: 13, color: "#ffb3c6" },
          { cx: 275, cy: 14, r: 10, color: "#ffe5ec" },
          { cx: 330, cy: 22, r: 14, color: "#ffb3c6" },
          { cx: 375, cy: 50, r: 12, color: "#ffe5ec" }
        ].map((rose, i) => (
          <g 
            key={i} 
            transform={`translate(${rose.cx}, ${rose.cy})`}
          >
            {/* Outer glowing petals */}
            <circle cx="0" cy="0" r={rose.r} fill={rose.color} opacity="0.95" />
            <circle cx="0" cy="0" r={rose.r * 0.75} fill="#ffb3c6" />
            {/* Overlapping petals detail */}
            <path d={`M -${rose.r*0.6},-${rose.r*0.6} Q 0,-${rose.r} ${rose.r*0.6},-${rose.r*0.6} Q ${rose.r},0 ${rose.r*0.6},${rose.r*0.6} Q 0,${rose.r} -${rose.r*0.6},${rose.r*0.6} Z`} fill="#ffe5ec" opacity="0.8" />
            <circle cx="0" cy="0" r={rose.r * 0.3} fill="#fefbf6" />
          </g>
        ))}
      </svg>
    </div>
  );
});

export default function VHSChat({ onProceed }: VHSChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingSender, setTypingSender] = useState<"pria" | "wanita">("pria");
  const [isChatDone, setIsChatDone] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = () => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const chatSequence: Message[] = [
    { sender: "wanita", text: "congrats yaa irfan atas gelar S.Komnya", time: "19:02", date: "20 Agustus 2025" },
    { sender: "pria", text: "Makasih banyak yaya", time: "19:02", date: "20 Agustus 2025" },
    { sender: "pria", text: "Mabar lah naik gunung", time: "19:02", date: "25 Agustus 2025" },
    { sender: "wanita", text: "Ayo gass, tapi besok ya baru selesai tadi", time: "19:05", date: "25 Agustus 2025" },
    { sender: "pria", text: "Oke sipp, nicknya sini biar gua add", time: "19:07", date: "25 Agustus 2025" },
    { sender: "wanita", text: "ini yaaaaa 'nick roblox'", time: "19:10", date: "25 Agustus 2025" },
    { sender: "pria", text: "oke wait gua add langsung", time: "19:12", date: "25 Agustus 2025" },
    { sender: "pria", text: "udah tu tinggal accept", time: "19:13", date: "25 Agustus 2025" },
    { sender: "wanita", text: "oke udah", time: "19:15", date: "25 Agustus 2025" }
  ];

  const playPopSound = () => {
    try {
      const actx = getAudioContext();
      if (!actx) return;
      const now = actx.currentTime;
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.08);
      
      gain.gain.setValueAtTime(0.012, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
      
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  };

  const playTypewriterTick = () => {
    try {
      const actx = getAudioContext();
      if (!actx) return;
      const now = actx.currentTime;
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(950, now);
      gain.gain.setValueAtTime(0.0015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
      
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start(now);
      osc.stop(now + 0.025);
    } catch (e) {}
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    let msgIdx = 0;
    
    const showNextMessage = () => {
      if (msgIdx >= chatSequence.length) {
        setIsTyping(false);
        setIsChatDone(true);
        return;
      }

      const nextMsg = chatSequence[msgIdx];
      
      // Start typing state
      setTypingSender(nextMsg.sender);
      setIsTyping(true);

      // Typing simulation tick loop
      const typingTimer = setInterval(() => {
        if (Math.random() > 0.4) playTypewriterTick();
      }, 150);

      // Total typing duration: 1.4s
      setTimeout(() => {
        clearInterval(typingTimer);
        setIsTyping(false);
        setMessages((prev) => [...prev, nextMsg]);
        playPopSound();
        msgIdx++;
        
        // Scroll container to bottom
        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
              top: chatContainerRef.current.scrollHeight,
              behavior: "smooth",
            });
          }
        }, 100);

        // Pause between messages: 2.0s
        setTimeout(showNextMessage, 2000);
      }, 1400);
    };

    // Delay before starting the chat replay: 1.8s
    const startDelay = setTimeout(showNextMessage, 1800);

    return () => {
      clearTimeout(startDelay);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    if (isChatDone) {
      const timer = setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isChatDone]);

  return (
    <section id="vhs-chat-replay" className="relative flex flex-col justify-center items-center min-h-screen text-center py-28 md:py-36 px-6 md:px-12 overflow-hidden w-full">
      
      <div className="absolute inset-0 bg-radial-[circle_at_center,_#1b0f1a_0%,_#0a060d_100%] z-0" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[#ffb3c6]/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#ffe5ec]/5 rounded-full filter blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="z-10 flex flex-col items-center w-full max-w-xl md:max-w-2xl gap-y-14 md:gap-y-18"
      >
        {/* Header Group */}
        <div className="flex flex-col items-center gap-y-3 md:gap-y-4 select-none text-center">
          <span className="text-xs uppercase font-mono tracking-[0.3em] text-[#ffb3c6] font-bold">
            ✦ Chat Pertama Deket ✦
          </span>

          <h2 className="text-4xl md:text-5xl font-serif text-[#F8F5F2] font-semibold tracking-wide neon-text-rose leading-tight flex items-center justify-center gap-3">
            <span>Our First Story</span>
            <MessageCircle size={28} className="text-[#ffb3c6] animate-pulse" />
          </h2>
          
        </div>

        {/* Flower Shop Ivory Wooden Window Frame */}
        <div 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-full aspect-[9/13.5] max-w-[350px] bg-gradient-to-b from-[#efe6db] to-[#d6c7b5] border-[10px] border-[#9c8975] rounded-[36px] overflow-visible shadow-[0_30px_70px_rgba(0,0,0,0.9),_0_0_60px_rgba(255,179,198,0.15)] flex flex-col p-1.5 mt-4"
        >
          {/* Detailed Climbing Leafy Rose Garland SVG */}
          <RoseGarland />

          {/* Actual window glass screen container */}
          <div className="relative flex-1 bg-[#0a0814] rounded-[24px] overflow-hidden flex flex-col border border-zinc-950 shadow-[inset_0_0_40px_rgba(0,0,0,0.95)]">
            
            {/* Curved tube corner mask */}
            <div className="absolute inset-0 bg-radial-[circle_at_center,_transparent_50%,_rgba(0,0,0,0.55)_100%] pointer-events-none z-20" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/4 to-transparent pointer-events-none z-20" />

            {/* Vintage scanlines & soft overlays */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_50%,_rgba(0,0,0,0.3)_50%)] bg-[size:100%_5px] pointer-events-none z-20" />

            {/* Slow Scanning Laser Bar */}
            <div className="absolute left-0 w-full h-[60px] bg-gradient-to-b from-transparent via-[#ffb3c6]/15 to-transparent pointer-events-none z-20 animate-scanline" style={{ top: "-60px" }} />

            {/* VCR Noise Overlay (Dynamic with hover state, hidden on mobile) */}
            <div 
              className={`absolute inset-0 pointer-events-none z-21 bg-transparent transition-opacity duration-300 ${
                isMobile ? "hidden" : isHovered ? "opacity-15" : "opacity-7"
              }`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                willChange: "opacity"
              }}
            />

            {/* Play overlay status bar */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between font-mono text-[9px] tracking-widest text-[#ffb3c6] z-22 select-none opacity-80">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb3c6] animate-ping" />
                <span className="font-bold">Gemini ▶</span>
              </span>
              <span>20.08.25</span>
            </div>

            {/* TIME Overlay bottom */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[8px] tracking-widest text-zinc-500 z-22 select-none opacity-70">
              <span>GARDEN-04</span>
              <span>LIVE MODE</span>
            </div>

            {/* Chat Message Box Container */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto px-4 pt-12 pb-10 flex flex-col gap-4 scrollbar-none z-10"
              style={{ scrollBehavior: "smooth" }}
            >
              <AnimatePresence>
                {messages.map((msg, index) => {
                  const isMe = msg.sender === "pria";
                  const showDateDivider = index === 0 || messages[index - 1].date !== msg.date;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 25, scale: 0.93 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        transition: { type: "spring", stiffness: 130, damping: 16 } 
                      }}
                      className="flex flex-col w-full gap-3"
                    >
                      {showDateDivider && msg.date && (
                        <div className="self-center my-2 bg-[#181121]/90 border border-zinc-800 rounded-full px-4 py-1 text-[9px] font-mono tracking-widest text-[#ffb3c6] uppercase select-none shadow-md">
                          ✦ {msg.date} ✦
                        </div>
                      )}
                      <div className={`flex flex-col max-w-[82%] ${isMe ? "self-end items-end" : "self-start items-start"}`}>
                        {/* Message Bubble with blush/cream floral styles */}
                        <div 
                          className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed font-sans font-medium transition-all shadow-lg border text-left ${
                            isMe 
                              ? "bg-gradient-to-br from-[#ffb3c6]/95 to-[#8c5a6b]/95 border-[#ffb3c6]/40 text-[#fbf9f6] rounded-tr-none drop-shadow-[0_0_6px_rgba(255,179,198,0.25)]" 
                              : "bg-[#181121]/90 border-zinc-800 text-[#fbf9f6] rounded-tl-none drop-shadow-[0_0_6px_rgba(255,179,198,0.06)]"
                          }`}
                          style={{
                            textShadow: isHovered 
                              ? "1px 0 0 rgba(255,179,198,0.5), -1px 0 0 rgba(232,220,240,0.5)" 
                              : "none"
                          }}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[8px] font-mono text-zinc-500 mt-1 px-1 tracking-wide uppercase select-none">
                          {msg.time} • Sent
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Typing Dot Bubble */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`flex max-w-[35%] ${typingSender === "pria" ? "self-end" : "self-start"}`}
                  >
                    <div className="bg-[#181121]/90 border border-zinc-800 rounded-2xl rounded-tl-none px-4 py-3.5 shadow-md flex items-center justify-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ffb3c6] animate-bounce delay-0" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ffb3c6] animate-bounce delay-150" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ffb3c6] animate-bounce delay-300" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Bezel Controls */}
          <div className="h-10 w-full bg-gradient-to-b from-[#d6c7b5] to-[#9c8975] rounded-b-[24px] mt-1.5 px-4 flex items-center justify-between select-none pointer-events-none">
            {/* Cute window dials */}
            <div className="flex gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-[#ffb3c6]/20 border border-[#ffb3c6]/40 shadow-inner flex items-center justify-center">
                <div className="w-1 h-2 bg-[#ffb3c6]/30 rounded-full" />
              </div>
              <div className="w-3.5 h-3.5 rounded-full bg-[#ffb3c6]/20 border border-[#ffb3c6]/40 shadow-inner flex items-center justify-center">
                <div className="w-1 h-2 bg-[#ffb3c6]/30 rounded-full" />
              </div>
            </div>
            
            {/* Aesthetic divider holes */}
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-zinc-950 rounded-full" />
              <div className="w-1 h-1 bg-zinc-950 rounded-full" />
              <div className="w-1 h-1 bg-zinc-950 rounded-full" />
              <div className="w-1 h-1 bg-zinc-950 rounded-full" />
              <div className="w-1 h-1 bg-zinc-950 rounded-full" />
            </div>

            {/* Glowing Rose Power Indicator */}
            <div className="flex items-center gap-1.5">
              <span className="text-[7px] font-mono text-zinc-300 uppercase tracking-widest">Active</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#ffb3c6] shadow-[0_0_8px_#ffb3c6] animate-pulse" />
            </div>
          </div>
        </div>
        {/* Proceed Action Button & Narrator Text */}
        <AnimatePresence>
          {isChatDone && (
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 14 }}
              className="w-full mt-8 flex flex-col items-center gap-y-6"
            >
              <div className="flex flex-col items-center gap-y-4 max-w-md text-center px-4 select-none">
                <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#ffb3c6] font-bold">
                  Berawal dari sini...
                </span>
                
                <p className="text-sm md:text-base text-zinc-300 font-serif italic leading-relaxed">
                  Sebuah ucapan sederhana, sebuah ajakan mabar, dan sebuah perkenalan yang terasa biasa saja.
                </p>
                
                <p className="text-sm md:text-base text-zinc-300 font-serif italic leading-relaxed">
                  Namun ternyata, dari percakapan singkat itulah lahir cerita terindah yang tidak pernah kubayangkan sebelumnya.
                </p>
                
                <p className="text-base font-serif font-extrabold text-[#ffe5ec] drop-shadow-[0_0_8px_rgba(255,179,198,0.5)] flex items-center justify-center gap-1.5 mt-2">
                  <span>Cerita tentang kita. ❤️</span>
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onProceed}
                className="bg-gradient-to-r from-[#ffb3c6] to-[#8c5a6b] hover:from-[#ffe5ec] hover:to-[#ffb3c6] text-[#0a060d] font-semibold font-sans tracking-widest text-xs uppercase py-4 px-8 rounded-xl shadow-[0_12px_28px_rgba(255,179,198,0.3)] border border-[#ffb3c6]/20 transition-all duration-300 w-full cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                <BookOpen size={14} className="text-[#0a060d]" />
                <span>Buka Buku Kenangan Kita</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
