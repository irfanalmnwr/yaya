"use client";

import { useEffect, useRef, useState } from "react";
import { Music, Volume2, VolumeX } from "lucide-react";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasClickedPlayRef = useRef(false);

  useEffect(() => {
    // Initialize native Audio object with hbd.mp3 served from public folder
    const audio = new Audio("/assets/music/hbd.mp3");
    audio.autoplay = false;
    audio.loop = true;
    audio.volume = 0.55; // Set cozy ambient volume
    audio.pause(); // Force pause to prevent browser auto-resume on load
    audioRef.current = audio;

    // Synchronize play state and intercept autoplay
    const onPlay = () => {
      if (!hasClickedPlayRef.current) {
        audio.pause();
        setIsPlaying(false);
      } else {
        setIsPlaying(true);
      }
    };
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      window.removeEventListener("resize", checkMobile);
      audio.pause();
    };
  }, []);

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (!audioRef.current.paused) {
      hasClickedPlayRef.current = false;
      audioRef.current.pause();
    } else {
      hasClickedPlayRef.current = true;
      audioRef.current.play().catch((err) => {
        console.error("Failed to play audio:", err);
        hasClickedPlayRef.current = false;
      });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <div className="music-player-floating select-none">
      <div 
        className={`vinyl-player-outer ${isPlaying ? "playing" : ""}`}
        onClick={togglePlayback}
        title={isPlaying ? "Klik untuk menjeda musik" : "Klik untuk memutar musik"}
      >
        {isPlaying && !isMobile && (
          <>
            <div className="vinyl-pulse-ring delay-0" />
            <div className="vinyl-pulse-ring delay-1000" />
            <div className="vinyl-pulse-ring delay-2000" />
          </>
        )}

        <div className="vinyl-disc-body">
          <div className="vinyl-groove"></div>
          <div className="vinyl-center-label">
            <Music size={14} className="vinyl-music-icon" />
          </div>
        </div>

        {isPlaying && (
          <button 
            className="vinyl-mute-btn" 
            onClick={toggleMute}
            title={isMuted ? "Aktifkan suara" : "Senyapkan suara"}
          >
            {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
          </button>
        )}
      </div>

      <div className="music-status-bubble">
        {isPlaying ? (
          <span className="flex items-center gap-1.5 justify-center">
            <Volume2 size={12} className="text-[#ffb3c6] animate-pulse" />
            <span>BGM: Happy Birthday 🎂</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5 justify-center">
            <Music size={12} className="text-zinc-500 animate-bounce" />
            <span>Klik piringan untuk musik</span>
          </span>
        )}
      </div>
    </div>
  );
}
