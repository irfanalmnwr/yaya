"use client";

import { useEffect, useRef, useState } from "react";
import { Music, Volume2, VolumeX } from "lucide-react";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize native Audio object with hbd.mp3 served from public folder
    const audio = new Audio("/assets/music/hbd.mp3");
    audio.loop = true;
    audio.volume = 0.55; // Set cozy ambient volume
    audioRef.current = audio;

    // Synchronize play state if audio plays/pauses from outside or device interruptions
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.pause();
    };
  }, []);

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.error("Failed to play audio:", err);
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
        {isPlaying && (
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
