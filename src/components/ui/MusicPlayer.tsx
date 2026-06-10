"use client";

import { useEffect, useRef, useState } from "react";
import { Music, Volume2, VolumeX } from "lucide-react";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playListenerRef = useRef<(() => void) | null>(null);
  const pauseListenerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
      if (audioRef.current) {
        const audio = audioRef.current;
        audio.pause();
        if (playListenerRef.current) {
          audio.removeEventListener("play", playListenerRef.current);
        }
        if (pauseListenerRef.current) {
          audio.removeEventListener("pause", pauseListenerRef.current);
        }
      }
    };
  }, []);

  const initAudio = () => {
    if (audioRef.current) return audioRef.current;

    const audio = new Audio("/assets/music/hbd.mp3");
    audio.autoplay = false;
    audio.loop = true;
    audio.volume = 0.55; // Set cozy ambient volume
    audio.muted = isMuted;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    playListenerRef.current = onPlay;
    pauseListenerRef.current = onPause;

    audioRef.current = audio;
    return audio;
  };

  const togglePlayback = () => {
    const audio = initAudio();

    if (!audio.paused) {
      audio.pause();
    } else {
      audio.play().catch((err) => {
        console.error("Failed to play audio:", err);
      });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
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
