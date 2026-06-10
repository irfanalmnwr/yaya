"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Download, RotateCcw, Sparkles, AlertCircle, Heart, Smile } from "lucide-react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";

interface KoreanPhotoboothProps {
  onProceed: () => void;
}

interface Sticker {
  id: number;
  emoji: string;
  x: number; // percentage left
  y: number; // percentage top
  size: number; // em scale, e.g. 1.5 = 1.5em
}

export default function KoreanPhotobooth({ onProceed }: KoreanPhotoboothProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImages, setCapturedImages] = useState<Array<string | null>>([null, null, null, null]);
  const [isTakingPhotos, setIsTakingPhotos] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  
  // Set default frame color to Blush Pink
  const [selectedFrame, setSelectedFrame] = useState("pink");
  const [selectedPattern, setSelectedPattern] = useState("plain");
  const [selectedFilter, setSelectedFilter] = useState("normal");
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const getPatternStyle = (pattern: string, frameColor: string) => {
    const isDark = frameColor === "black";
    const opacity = isDark ? "0.15" : "0.38";
    const primaryColor = isDark ? "%23ffffff" : "%23ffb3c6";
    const accentColor = isDark ? "%23ffd700" : "%23ffb3c6";

    switch (pattern) {
      case "hearts":
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 24 24'%3E%3Cpath fill='${primaryColor}' fill-opacity='${opacity}' d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")`,
          backgroundSize: "36px 36px"
        };
      case "stars":
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24'%3E%3Cpath fill='${accentColor}' fill-opacity='${opacity}' d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'/%3E%3C/svg%3E")`,
          backgroundSize: "28px 28px"
        };
      case "polka":
        const dotColor = isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 179, 198, 0.4)";
        return {
          backgroundImage: `radial-gradient(${dotColor} 15%, transparent 16%), radial-gradient(${dotColor} 15%, transparent 16%)`,
          backgroundSize: "16px 16px",
          backgroundPosition: "0 0, 8px 8px"
        };
      case "confetti":
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'%3E%3Ccircle cx='5' cy='10' r='2' fill='${primaryColor}' opacity='${opacity}'/%3E%3Crect x='25' y='5' width='3' height='3' transform='rotate(45 26.5 6.5)' fill='${accentColor}' opacity='${opacity}'/%3E%3Ccircle cx='15' cy='30' r='1.5' fill='%2388c0d0' opacity='${opacity}'/%3E%3Crect x='32' y='25' width='2' height='4' transform='rotate(15 33 27)' fill='%23b48ead' opacity='${opacity}'/%3E%3Cpath d='M8,25 Q10,23 12,25 T16,25' fill='none' stroke='${primaryColor}' stroke-width='1' opacity='${opacity}'/%3E%3C/svg%3E")`,
          backgroundSize: "44px 44px"
        };
      case "roses":
        const flowerColor = isDark ? "%23ffccd5" : "%23ff85a1";
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 24 24'%3E%3Cpath fill='${flowerColor}' fill-opacity='${opacity}' d='M12 2a4 4 0 0 0-4 4c0 4 4 8 4 8s4-4 4-8a4 4 0 0 0-4-4zm0 10a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z'/%3E%3C/svg%3E")`,
          backgroundSize: "36px 36px"
        };
      default:
        return {};
    }
  };

  const getPatternSvgDataUrl = (pattern: string, frameColor: string) => {
    const isDark = frameColor === "black";
    const opacity = isDark ? "0.15" : "0.38";
    const primaryColor = isDark ? "%23ffffff" : "%23ffb3c6";
    const accentColor = isDark ? "%23ffd700" : "%23ffb3c6";

    switch (pattern) {
      case "hearts":
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 24 24'%3E%3Cpath fill='${primaryColor}' fill-opacity='${opacity}' d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E`;
      case "stars":
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24'%3E%3Cpath fill='${accentColor}' fill-opacity='${opacity}' d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'/%3E%3C/svg%3E`;
      case "polka":
        const fillDot = isDark ? "%23ffffff" : "%23ffb3c6";
        const fillOpacity = isDark ? "0.15" : "0.4";
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Ccircle cx='4' cy='4' r='2' fill='${fillDot}' fill-opacity='${fillOpacity}'/%3E%3Ccircle cx='12' cy='12' r='2' fill='${fillDot}' fill-opacity='${fillOpacity}'/%3E%3C/svg%3E`;
      case "confetti":
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'%3E%3Ccircle cx='5' cy='10' r='2' fill='${primaryColor}' opacity='${opacity}'/%3E%3Crect x='25' y='5' width='3' height='3' transform='rotate(45 26.5 6.5)' fill='${accentColor}' opacity='${opacity}'/%3E%3Ccircle cx='15' cy='30' r='1.5' fill='%2388c0d0' opacity='${opacity}'/%3E%3Crect x='32' y='25' width='2' height='4' transform='rotate(15 33 27)' fill='%23b48ead' opacity='${opacity}'/%3E%3Cpath d='M8,25 Q10,23 12,25 T16,25' fill='none' stroke='${primaryColor}' stroke-width='1' opacity='${opacity}'/%3E%3C/svg%3E`;
      case "roses":
        const flowerColor = isDark ? "%23ffccd5" : "%23ff85a1";
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 24 24'%3E%3Cpath fill='${flowerColor}' fill-opacity='${opacity}' d='M12 2a4 4 0 0 0-4 4c0 4 4 8 4 8s4-4 4-8a4 4 0 0 0-4-4zm0 10a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z'/%3E%3C/svg%3E`;
      default:
        return "";
    }
  };
  const [selectedStickerId, setSelectedStickerId] = useState<number | null>(null);
  const [cameraStatus, setCameraStatus] = useState("Menghubungkan kamera...");
  const [cameraDotColor, setCameraDotColor] = useState("#ffb3c6");
  const [isSimulationMode, setIsSimulationMode] = useState(false);

  const [shutterActive, setShutterActive] = useState(false);
  const [flashActive, setFlashActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const stripPreviewRef = useRef<HTMLDivElement>(null);

  const frameColorsHex: Record<string, string> = {
    pink:     "#ffd8e1",   // Premium soft rose blush
    peach:    "#ffe5cc",   // Soft warm peach
    lavender: "#e8dcf5",   // Dreamy lavender
    mint:     "#e0f2e9",   // Elegant soft sage mint
    blue:     "#daebf7",   // Fine royal sky blue
    lemon:    "#fffde0",   // Sunny lemon cream
    gold:     "#fdf3d0",   // Warm rose gold cream
    black:    "#0b0813",   // Cinematic onyx black
    white:    "#faf9f6"    // Warm archival linen white
  };

  const canvasFilterStrings: Record<string, string> = {
    normal: "contrast(1.04) saturate(1.05)",
    vintage: "sepia(0.35) contrast(1.08) saturate(1.1) brightness(0.98)",
    bw: "grayscale(1) contrast(1.25) brightness(1.03)",
    dreamy: "brightness(1.03) saturate(1.3) contrast(0.95)",
    retro: "contrast(1.22) saturate(1.45) hue-rotate(10deg)"
  };

  // 1. Initialize Camera Stream
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn("Camera API not supported or disabled in this context (e.g. non-secure connection).");
      setCameraStatus("Mode Simulasi (Akses HTTP Terbatas)");
      setCameraDotColor("#eab308");
      setIsSimulationMode(true);
      return;
    }

    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 640 },
        height: { ideal: 480 }
      },
      audio: false
    })
    .then((mediaStream) => {
      activeStream = mediaStream;
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraStatus("Kamera Aktif • Siap Beraksi");
      setCameraDotColor("#ffb3c6");
    })
    .catch((err) => {
      console.error("Camera fail:", err);
      setCameraStatus("Kamera Gagal / Mode Simulasi Aktif");
      setCameraDotColor("#eab308");
      setIsSimulationMode(true);
    });

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const playInterfaceBeep = (freq = 400) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const actx = new AudioCtx();
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, actx.currentTime);
      gain.gain.setValueAtTime(0.03, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start(actx.currentTime);
      osc.stop(actx.currentTime + 0.1);
    } catch (e) {}
  };

  const playShutterSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const actx = new AudioCtx();
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1200, actx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, actx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.12, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start(actx.currentTime);
      osc.stop(actx.currentTime + 0.25);
    } catch (e) {}
  };

  // 2. Start Automatic Photo Shooting Loop
  const handleStartShooting = () => {
    if (!stream && !isSimulationMode) {
      alert("Kamera belum aktif.");
      return;
    }
    
    setIsTakingPhotos(true);
    setCapturedImages([null, null, null, null]);
    setStickers([]);
    setPhotoCount(0);
    
    shootPhoto(0);
  };

  const shootPhoto = (index: number) => {
    if (index >= 4) {
      setIsTakingPhotos(false);
      setCameraStatus("Selesai! Seret stiker untuk hiasan!");
      setCameraDotColor("#ffb3c6");
      playInterfaceBeep(650);
      return;
    }

    setPhotoCount(index + 1);
    setCameraStatus(`Mengambil Foto ${index + 1}/4...`);
    setCameraDotColor("#b88d9f");

    let sec = 3;
    setCountdown(sec);
    setIsCountdownActive(true);
    playInterfaceBeep(800);

    const timer = setInterval(() => {
      sec--;
      if (sec <= 0) {
        clearInterval(timer);
        setIsCountdownActive(false);
        
        // Flash + Shutter
        setShutterActive(true);
        playShutterSound();

        setTimeout(() => {
          setShutterActive(false);
          setFlashActive(true);
          
          captureSnapshot(index);
          
          setTimeout(() => {
            setFlashActive(false);
            // Move to next photo after 2.0s delay for posing
            setTimeout(() => {
              shootPhoto(index + 1);
            }, 2000);
          }, 250);
        }, 100);

      } else {
        setCountdown(sec);
        playInterfaceBeep(800);
      }
    }, 1000);
  };

  const captureSnapshot = (index: number) => {
    const video = videoRef.current;
    if (stream && video) {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = video.videoWidth || 640;
      tempCanvas.height = video.videoHeight || 480;
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;

      // Draw video mirrored for natural layout
      tempCtx.translate(tempCanvas.width, 0);
      tempCtx.scale(-1, 1);
      tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);

      const dataUrl = tempCanvas.toDataURL("image/png");
      setCapturedImages((prev) => {
        const next = [...prev];
        next[index] = dataUrl;
        return next;
      });
    } else {
      // Simulation Mode: Draw a cute illustrated card
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = 640;
      tempCanvas.height = 480;
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;

      // Soft cute gradient backgrounds
      const gradients = [
        ["#ffe5ec", "#ffc2d1"],
        ["#e0f2e9", "#c3e6d6"],
        ["#e8dcf0", "#d1c2e0"],
        ["#fffbe0", "#fff5c2"]
      ];
      const colors = gradients[index % 4];
      const grad = tempCtx.createLinearGradient(0, 0, 640, 480);
      grad.addColorStop(0, colors[0]);
      grad.addColorStop(1, colors[1]);
      
      tempCtx.fillStyle = grad;
      tempCtx.fillRect(0, 0, 640, 480);

      // Draw mini background sparkles/hearts
      tempCtx.fillStyle = "rgba(255, 255, 255, 0.4)";
      for (let i = 0; i < 12; i++) {
        tempCtx.font = "20px sans-serif";
        const rx = 40 + Math.random() * 560;
        const ry = 40 + Math.random() * 400;
        tempCtx.fillText("♥", rx, ry);
      }

      // Draw center circle frame
      tempCtx.shadowBlur = 10;
      tempCtx.shadowColor = "rgba(0, 0, 0, 0.12)";
      tempCtx.fillStyle = "#ffffff";
      tempCtx.beginPath();
      tempCtx.arc(320, 210, 80, 0, Math.PI * 2);
      tempCtx.fill();
      tempCtx.shadowBlur = 0;

      // Draw emoji
      const emojis = ["🌸", "🧸", "🌷", "🎂"];
      tempCtx.font = "80px sans-serif";
      tempCtx.textAlign = "center";
      tempCtx.textBaseline = "middle";
      tempCtx.fillText(emojis[index % 4], 320, 210);

      // Draw text
      tempCtx.fillStyle = "#4a3541";
      tempCtx.font = 'bold 24px serif';
      const captions = [
        "Blooming Bright!",
        "Double the Warmth!",
        "Petals of Love!",
        "Happy 23rd, Sabrina!"
      ];
      tempCtx.fillText(captions[index % 4], 320, 340);

      tempCtx.fillStyle = "#8c6b7e";
      tempCtx.font = '900 11px sans-serif';
      tempCtx.fillText("SIMULASI BIDIKAN SZT", 320, 385);

      const dataUrl = tempCanvas.toDataURL("image/png");
      setCapturedImages((prev) => {
        const next = [...prev];
        next[index] = dataUrl;
        return next;
      });
    }
  };

  // 3. Spawns an emoji inside the preview strip bounding box
  const handleSpawnSticker = (emoji: string) => {
    if (capturedImages.includes(null)) {
      alert("Silakan ambil 4 foto terlebih dahulu!");
      return;
    }
    playInterfaceBeep(600);
    const newId = Date.now() + Math.random();
    setStickers((prev) => [
      ...prev,
      {
        id: newId,
        emoji,
        x: 35 + Math.random() * 30,
        y: 30 + Math.random() * 40,
        size: 2.0,
      }
    ]);
    setSelectedStickerId(newId);
  };

  // 4. Drag & resize system — immediate select on touch, drag to reposition
  const handleStickerPointerDown = (e: React.PointerEvent<HTMLDivElement>, stickerId: number) => {
    e.stopPropagation();
    
    // Select immediately on pointer down for crisp user feedback
    setSelectedStickerId(stickerId);
    
    const rect = stripPreviewRef.current?.getBoundingClientRect();
    if (!rect) return;

    let hasMoved = false;
    const startX = e.clientX;
    const startY = e.clientY;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      if (!hasMoved && Math.hypot(dx, dy) > 4) hasMoved = true;

      const relativeX = moveEvent.clientX - rect.left;
      const relativeY = moveEvent.clientY - rect.top;
      const pctX = Math.max(4, Math.min(96, (relativeX / rect.width) * 100));
      const pctY = Math.max(2, Math.min(98, (relativeY / rect.height) * 100));

      setStickers((prev) =>
        prev.map((s) => (s.id === stickerId ? { ...s, x: pctX, y: pctY } : s))
      );
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const resizeSticker = (id: number, delta: number) => {
    setStickers((prev) =>
      prev.map((s) => s.id === id ? { ...s, size: Math.max(0.8, Math.min(6, s.size + delta)) } : s)
    );
  };

  const deleteSticker = (id: number) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
    setSelectedStickerId(null);
  };

  // 5. High-Resolution Offline Canvas Renderer & Exporter
  const handleDownloadStrip = () => {
    if (capturedImages.includes(null)) return;
    setCameraStatus("Merakit berkas strip foto premium...");

    const offscreenCanvas = document.createElement("canvas");
    const ctx = offscreenCanvas.getContext("2d");
    if (!ctx) return;

    // Premium high-resolution print bounds
    const width = 800;
    const height = 1840;
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;

    // Photo grid geometry parameters
    const photoWidth = 690;
    const photoHeight = 350;
    const paddingX = 55;
    const paddingTop = 60;
    const spacingY = 40;

    let loadedCount = 0;
    const imagesToDraw: HTMLImageElement[] = [];
    let patternImg: HTMLImageElement | null = null;
    const totalToLoad = selectedPattern === "plain" ? 4 : 5;

    const checkAllLoaded = () => {
      if (loadedCount === totalToLoad) {
        drawAllElements();
      }
    };

    capturedImages.forEach((src, idx) => {
      const img = new Image();
      img.src = src!;
      img.onload = () => {
        imagesToDraw[idx] = img;
        loadedCount++;
        checkAllLoaded();
      };
    });

    if (selectedPattern !== "plain") {
      patternImg = new Image();
      patternImg.src = getPatternSvgDataUrl(selectedPattern, selectedFrame);
      patternImg.onload = () => {
        loadedCount++;
        checkAllLoaded();
      };
    }

    const drawAllElements = () => {
      // A. Draw background frame color
      ctx.fillStyle = frameColorsHex[selectedFrame];
      ctx.fillRect(0, 0, width, height);

      // Draw repeating pattern
      if (patternImg) {
        try {
          const pattern = ctx.createPattern(patternImg, 'repeat');
          if (pattern) {
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, width, height);
          }
        } catch (e) {
          console.error("Pattern draw error:", e);
        }
      }

      // Subtle premium card noise overlay
      ctx.fillStyle = "rgba(255, 255, 255, 0.035)";
      for (let i = 0; i < 4000; i++) {
        const rx = Math.random() * width;
        const ry = Math.random() * height;
        ctx.fillRect(rx, ry, 1.5, 1.5);
      }
      // Loop over and draw photos
      for (let i = 0; i < 4; i++) {
        const img = imagesToDraw[i];
        const posY = paddingTop + i * (photoHeight + spacingY);

        // Draw double gold-foil frames around each photo
        ctx.save();
        ctx.strokeStyle = "#ffb3c6"; // pink borders
        ctx.lineWidth = 3;
        ctx.strokeRect(paddingX - 4, posY - 4, photoWidth + 8, photoHeight + 8);
        ctx.strokeStyle = "rgba(255, 179, 198, 0.4)";
        ctx.lineWidth = 1;
        ctx.strokeRect(paddingX - 8, posY - 8, photoWidth + 16, photoHeight + 16);
        ctx.restore();

        // Draw the photo
        ctx.save();
        ctx.beginPath();
        ctx.rect(paddingX, posY, photoWidth, photoHeight);
        ctx.clip();

        // Apply native canvas filters
        ctx.filter = canvasFilterStrings[selectedFilter];

        // Crop centered
        const sWidth = img.width;
        const sHeight = img.height;
        const sAspectRatio = sWidth / sHeight;
        const dAspectRatio = photoWidth / photoHeight;

        let sx = 0, sy = 0, sw = sWidth, sh = sHeight;
        if (sAspectRatio > dAspectRatio) {
          sw = sHeight * dAspectRatio;
          sx = (sWidth - sw) / 2;
        } else {
          sh = sWidth / dAspectRatio;
          sy = (sHeight - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, paddingX, posY, photoWidth, photoHeight);
        ctx.restore();
      }

      // B. Draw high-resolution sticker emoticons directly from state percentage bounds
      stickers.forEach((sticker) => {
        const canvasX = (sticker.x / 100) * width;
        const canvasY = (sticker.y / 100) * height;

        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = '64px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
        ctx.shadowBlur = 12;
        ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
        ctx.fillText(sticker.emoji, canvasX, canvasY);
        ctx.restore();
      });

      // C. Bottom high-end signature area
      const bottomAreaY = paddingTop + 4 * (photoHeight + spacingY) + 15;
      const textColor = selectedFrame === "black" ? "#f8f5f2" : "#0c0914";
      const secondaryColor = selectedFrame === "black" ? "#a098b5" : "#6b627a";

      // Golden foil stamps on bottom corners
      ctx.fillStyle = "rgba(255, 179, 198, 0.35)";
      ctx.font = '24px "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
      ctx.fillText("❀", paddingX + 30, bottomAreaY + 50);
      ctx.fillText("❀", width - paddingX - 30, bottomAreaY + 50);

      // Title Lettering
      ctx.textAlign = "center";
      ctx.fillStyle = textColor;
      ctx.font = 'italic bold 38px "Cormorant Garamond", serif';
      ctx.fillText("Yaya Birthday", width / 2, bottomAreaY + 45);

      // Metainfo subheadings
      ctx.fillStyle = secondaryColor;
      ctx.font = '900 16px "Montserrat", sans-serif';
      ctx.letterSpacing = "3px";
      ctx.fillText("16 JUNE 2026 • FLOWERIS BLOOMING \u25cf SZT", width / 2, bottomAreaY + 85);

      // Rose gold decorative floral ribbon divider
      ctx.strokeStyle = "#ffb3c6";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 100, bottomAreaY + 110);
      ctx.lineTo(width / 2 + 100, bottomAreaY + 110);
      ctx.stroke();

      // D. Generate high quality blob download link
      try {
        const finalDataUrl = offscreenCanvas.toDataURL("image/png");
        const tempLink = document.createElement("a");
        tempLink.href = finalDataUrl;
        tempLink.download = `sabrina_booth_${Date.now()}.png`;
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);

        setCameraStatus("Unduhan berhasil! Bersiap untuk Kuis...");
        
        // Auto Proceed after beautiful delay
        setTimeout(() => {
          onProceed();
        }, 1800);

      } catch (err) {
        console.error("Canvas export fail:", err);
        setCameraStatus("Ekspor Gagal - Hubungi Dev");
      }
    };
  };

  return (
    <section id="virtual-photobooth" className="relative flex flex-col justify-center items-center min-h-screen text-center px-6 md:px-12 overflow-hidden py-28 md:py-36 select-none w-full">
      <div className="star-aurora-bg" />

      <div className="z-10 flex flex-col items-center w-full max-w-5xl gap-y-16 md:gap-y-22">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center gap-y-2 md:gap-y-3 select-none text-center"
        >
          <div className="flex items-center gap-2 border border-[#ffb3c6]/30 bg-[#ffb3c6]/10 rounded-full px-4 py-1 mb-2">
            <Sparkles size={14} className="text-[#ffb3c6] animate-spin" />
            <span className="font-mono text-xs text-[#ffb3c6] tracking-widest uppercase">Photobooth Yaya</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif text-[#F8F5F2] font-semibold tracking-wide neon-text-rose flex items-center justify-center gap-3">
            <span>Fotobooth dulu yuuuuuu berdua</span>
            <Camera className="text-[#ffb3c6] animate-pulse" size={32} />
          </h2>
          
          <p className="text-sm md:text-base text-zinc-400 font-sans max-w-md leading-relaxed mt-1">
            Biar ada kenang kenangannya
          </p>
        </motion.div>

        {/* Photobooth Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 w-full justify-center items-center lg:items-stretch w-full">
          
          {/* CAMERA LENS FEED SIDE - Physical Arcade Bezel Cabinet */}
          <div className="w-full max-w-[490px] bg-gradient-to-b from-[#1b0f1a] via-[#0a060d] to-[#181121] border border-pink-900/30 rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between items-center relative overflow-hidden backdrop-blur-md">
            
            {/* Glossy terminal reflections overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent z-10" />

            {/* Cabinet gold header */}
            <div className="w-full flex justify-between items-center pb-3 border-b border-zinc-800/80 mb-4 select-none">
              <span className="text-[10px] font-mono text-[#ffb3c6] tracking-[0.2em] uppercase">Photobooth by irfan.almnr</span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Ver 1.4</span>
            </div>

            {/* Mechanical feedback overlays */}
            <div className={`shutter-overlay ${shutterActive ? "active" : ""}`} />
            <div className={`flash-overlay ${flashActive ? "active" : ""}`} />

            {/* Status bar label bar */}
            <div className="flex items-center gap-2 border border-zinc-800/80 bg-black/40 rounded-full px-4 py-1.5 self-start mb-4 text-[10px] font-mono">
              <div 
                className="w-2 h-2 rounded-full animate-pulse" 
                style={{ backgroundColor: cameraDotColor, transition: "background-color 0.4s" }} 
              />
              <span className="text-zinc-400">{cameraStatus}</span>
            </div>

            {/* Camera Viewfinder Glass Container with CRT Bezel Curvature */}
            <div className="relative w-full aspect-[4/3] bg-black rounded-2xl overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] border-4 border-zinc-900 mb-5 flex items-center justify-center group">
              
              {/* Scanline and vignette layers */}
              <div className="absolute inset-0 pointer-events-none bg-scanline opacity-15 z-20" />
              <div className="absolute inset-0 pointer-events-none rounded-2xl z-20 shadow-[inset_0_0_40px_rgba(0,0,0,0.95)]" />

              {stream ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className={`w-full h-full object-cover scale-x-[-1] filter-${selectedFilter} transition-all duration-300`} 
                />
              ) : isSimulationMode ? (
                <div className="flex flex-col items-center gap-3 p-6 text-center select-none">
                  <Sparkles size={28} className="text-amber-300 animate-spin" />
                  <span className="text-xs text-[#ffb3c6] font-mono font-bold uppercase tracking-wider">
                    Virtual Lens Engaged 📸
                  </span>
                  <span className="text-[10px] text-zinc-400 max-w-[200px] leading-relaxed">
                    Kamera fisik dinonaktifkan (koneksi HTTP). Gunakan tombol di bawah untuk mengambil foto kustom bermotif dari kami!
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <AlertCircle size={24} className="text-zinc-700 animate-pulse" />
                  <span className="text-xs text-zinc-600 font-mono italic animate-pulse">
                    Mempersiapkan optik lensa...
                  </span>
                </div>
              )}

              {/* Realtime flashing shutter state overlay */}
              <div className={`absolute inset-0 bg-white z-40 transition-opacity duration-150 pointer-events-none ${flashActive ? "opacity-100" : "opacity-0"}`} />

              {/* Countdown overlay numbers */}
              <AnimatePresence>
                {isCountdownActive && (
                  <motion.div
                    key={countdown}
                    initial={{ opacity: 0, scale: 0.4, rotate: -15 }}
                    animate={{ opacity: 1, scale: 1.4, rotate: 0 }}
                    exit={{ opacity: 0, scale: 2.2, rotate: 15 }}
                    className="absolute font-serif font-black text-8xl text-[#ffb3c6] drop-shadow-[0_0_30px_rgba(255,179,198,0.9)] select-none pointer-events-none z-30"
                  >
                    {countdown}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-full flex flex-col gap-3.5 mb-8 select-none text-left">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#ffb3c6]/80 font-bold">
                Laras Filter Estetik
              </span>
              <div className="flex flex-wrap gap-2 w-full">
                {[
                  { name: "normal", label: "Normal" },
                  { name: "vintage", label: "Vintage Sepia" },
                  { name: "bw", label: "Onyx B&W" },
                  { name: "dreamy", label: "Sweet Glow" },
                  { name: "retro", label: "Retro Chrome" },
                ].map((f) => (
                  <button
                    key={f.name}
                    onClick={() => {
                      setSelectedFilter(f.name);
                      playInterfaceBeep(550);
                    }}
                    className={`text-[11px] px-3.5 py-1.5 rounded-full border transition-all duration-300 font-sans tracking-wide ${
                      selectedFilter === f.name 
                        ? "bg-[#ffb3c6] border-[#ffb3c6] text-[#0a060d] shadow-[0_4px_12px_rgba(255,179,198,0.35)]" 
                        : "bg-pink-950/20 border-pink-900/40 text-[#ffb3c6] hover:border-[#ffb3c6]/60 hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full flex flex-col gap-2 mb-6 select-none text-left">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#ffb3c6]/80 font-bold">
                Stiker — Pilih dari Semua Emoji
              </span>

              {/* Trigger button */}
              <button
                onClick={() => {
                  if (capturedImages.includes(null)) {
                    alert("Silakan ambil 4 foto terlebih dahulu!");
                    return;
                  }
                  setShowEmojiPicker((prev) => !prev);
                }}
                className="flex items-center gap-2 w-full py-2.5 px-4 rounded-xl border border-zinc-800/80 bg-black/30 hover:bg-[#ffb3c6]/10 hover:border-[#ffb3c6]/40 text-[#ffb3c6] transition-all duration-200 cursor-pointer text-xs font-mono mb-1"
              >
                <Smile size={16} />
                <span>Buka Library Stiker Lengkap 😊</span>
                <span className="ml-auto text-zinc-600">{showEmojiPicker ? "▲ Tutup" : "▼ Buka"}</span>
              </button>

              {/* Helper guide tips */}
              <p className="text-[10px] text-zinc-500 leading-relaxed font-sans mb-2">
                💡 <strong>Tips:</strong> Geser stiker ke posisi mana saja. Klik stiker untuk mengubah ukuran atau menghapusnya.
              </p>

              {/* Active Sticker Control Panel */}
              {selectedStickerId !== null && (
                <div className="w-full border border-pink-500/30 bg-[#251320] rounded-xl p-3 flex items-center justify-between animate-fade-in shadow-[0_4px_12px_rgba(255,179,198,0.15)] mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl animate-bounce duration-1000">
                      {stickers.find((s) => s.id === selectedStickerId)?.emoji}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-[#ffb3c6] uppercase tracking-wider font-bold">Stiker Terpilih</span>
                      <span className="text-[9px] text-zinc-400 font-sans">Atur ukuran / Hapus</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => resizeSticker(selectedStickerId, -0.3)}
                      className="w-7 h-7 rounded-lg bg-zinc-950 border border-zinc-800 text-white hover:bg-pink-900 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                      title="Kecilkan"
                    >
                      −
                    </button>
                    <button
                      onClick={() => resizeSticker(selectedStickerId, 0.3)}
                      className="w-7 h-7 rounded-lg bg-zinc-950 border border-zinc-800 text-white hover:bg-pink-900 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                      title="Besarkan"
                    >
                      +
                    </button>
                    <button
                      onClick={() => deleteSticker(selectedStickerId)}
                      className="w-7 h-7 rounded-lg bg-red-950/85 border border-red-850 text-red-200 hover:bg-red-700 flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                      title="Hapus"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Emoji Picker Full-screen Fixed Overlay ── */}
            {showEmojiPicker && (
              <div
                className="fixed inset-0 z-[500] flex items-center justify-center"
                onClick={() => setShowEmojiPicker(false)}
              >
                {/* Dark backdrop */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                {/* Picker card — stop propagation so clicks inside don't close */}
                <div
                  className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-zinc-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close button */}
                  <button
                    onClick={() => setShowEmojiPicker(false)}
                    className="absolute top-2 right-2 z-20 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-full w-7 h-7 flex items-center justify-center text-xs transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                  <EmojiPicker
                    theme={Theme.DARK}
                    onEmojiClick={(emojiData: EmojiClickData) => {
                      handleSpawnSticker(emojiData.emoji);
                      setShowEmojiPicker(false);
                    }}
                    width={380}
                    height={420}
                    searchPlaceholder="Cari emoji..."
                    lazyLoadEmojis
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleStartShooting}
              disabled={isTakingPhotos}
              className="mt-8 md:mt-10 w-full bg-gradient-to-r from-[#ffb3c6] to-[#8c5a6b] disabled:from-zinc-900 disabled:to-zinc-900 disabled:text-zinc-600 disabled:border-zinc-800 disabled:cursor-not-allowed border border-[#ffb3c6]/30 text-[#0a060d] font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(255,179,198,0.25)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              {isTakingPhotos ? (
                <>
                  <RotateCcw size={16} className="animate-spin" />
                  <span>Sesi Jepret Berjalan (Foto {photoCount}/4)...</span>
                </>
              ) : (
                <>
                  <Camera size={16} />
                  <span>{capturedImages.includes(null) ? "Mulai Sesi Foto (4x Bidikan)" : "Foto Ulang Sesi Baru"}</span>
                </>
              )}
            </button>
          </div>

          {/* POLAROID PREVIEW PAPER STRIP SIDE */}
          <div className="w-full max-w-[310px] flex flex-col items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 mb-3 select-none">
              Pratinjau Kertas Cetak
            </span>

            {/* Fine Physical Canvas Strip Box */}
            <div 
              ref={stripPreviewRef}
              id="paper-strip-preview"
              className={`photo-strip-preview strip-frame-${selectedFrame} relative w-full aspect-[9/20.7] rounded-xl shadow-[0_25px_55px_rgba(0,0,0,0.7)] flex flex-col justify-between overflow-hidden border border-white/5`}
              style={{ 
                backgroundColor: frameColorsHex[selectedFrame],
                ...getPatternStyle(selectedPattern, selectedFrame),
                transition: "background-color 0.4s ease"
              }}
            >
              {/* Grain Texture overlay */}
              <div className="absolute inset-0 pointer-events-none bg-noise opacity-[0.035] mix-blend-overlay z-20" />

              {/* Draggable + resizable stickers layer */}
              <div
                className="absolute inset-0 z-40 pointer-events-auto overflow-hidden"
                onClick={() => setSelectedStickerId(null)}
              >
                {stickers.map((sticker) => (
                  <div
                    key={sticker.id}
                    onPointerDown={(e) => handleStickerPointerDown(e, sticker.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute cursor-grab active:cursor-grabbing select-none z-50"
                    style={{
                      left: `${sticker.x}%`,
                      top: `${sticker.y}%`,
                      transform: "translate(-50%, -50%)",
                      touchAction: "none",
                      fontSize: `${sticker.size}em`,
                      filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.4))",
                      outline: selectedStickerId === sticker.id ? "2px dashed #ffb3c6" : "none",
                      outlineOffset: "4px",
                      borderRadius: "4px",
                      padding: "2px",
                    }}
                  >
                    {sticker.emoji}

                    {/* Resize / delete controls - appear when sticker is selected */}
                    {selectedStickerId === sticker.id && (
                      <div
                        className="absolute -bottom-7 left-1/2 flex items-center gap-1 z-[60] pointer-events-auto"
                        style={{ transform: "translateX(-50%)", whiteSpace: "nowrap" }}
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={(e) => { e.stopPropagation(); resizeSticker(sticker.id, -0.3); }}
                          className="w-5 h-5 rounded-full bg-zinc-900/90 border border-zinc-700 text-white text-[10px] flex items-center justify-center hover:bg-pink-900 cursor-pointer"
                          title="Kecilkan"
                        >−</button>
                        <button
                          onClick={(e) => { e.stopPropagation(); resizeSticker(sticker.id, 0.3); }}
                          className="w-5 h-5 rounded-full bg-zinc-900/90 border border-zinc-700 text-white text-[10px] flex items-center justify-center hover:bg-pink-900 cursor-pointer"
                          title="Besarkan"
                        >+</button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteSticker(sticker.id); }}
                          className="w-5 h-5 rounded-full bg-red-900/80 border border-red-700 text-white text-[9px] flex items-center justify-center hover:bg-red-700 cursor-pointer"
                          title="Hapus"
                        >✕</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 4 photo slots */}
              <div className="flex-1 flex flex-col justify-start items-center gap-3 pt-6 px-6 relative z-10 w-full">
                {[0, 1, 2, 3].map((idx) => (
                  <div 
                    key={idx}
                    id={`preview-slot-${idx + 1}`}
                    className="strip-item-preview relative w-full aspect-[16/8.1] bg-black rounded overflow-hidden flex items-center justify-center border border-[#ffb3c6]/30 transition-all duration-300"
                    style={{
                      boxShadow: "inset 0 4px 10px rgba(0,0,0,0.4)"
                    }}
                  >
                    {capturedImages[idx] ? (
                      <img 
                        src={capturedImages[idx]!} 
                        alt={`Bidikan ${idx + 1}`} 
                        className={`w-full h-full object-cover scale-x-[-1] filter-${selectedFilter} transition-all duration-300`} 
                      />
                    ) : (
                      <span className="text-[10px] text-zinc-500/80 font-mono select-none tracking-widest">
                        FRAME {idx + 1}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* bottom signature branding footer */}
              <div className="w-full flex flex-col items-center pb-5 select-none z-10 pt-1">
                <span 
                  className="font-serif text-base italic font-bold truncate tracking-wide"
                  style={{ color: selectedFrame === "black" ? "#f8f5f2" : "#0c0914" }}
                >
                  Sabrina's Garden Booth
                </span>
                <span 
                  className="font-mono text-[7px] font-bold tracking-widest mt-0.5 flex items-center justify-center gap-1"
                  style={{ color: selectedFrame === "black" ? "#a098b5" : "#6b627a" }}
                >
                  <span>16 JUNE 2026 • FLOWERIS BLOOMING</span>
                  <Heart size={8} className="text-[#ffb3c6] fill-[#ffb3c6] animate-pulse" />
                </span>
              </div>
            </div>

            <div className="w-full flex flex-col gap-3 mt-8 select-none text-left">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#ffb3c6]/80 font-bold">
                Bahan Kertas Cetak
              </span>
              <div className="grid grid-cols-5 gap-2 w-full">
                {[
                  { name: "pink",     hex: "#ffd8e1", label: "Blush" },
                  { name: "peach",    hex: "#ffe5cc", label: "Peach" },
                  { name: "lavender", hex: "#e8dcf5", label: "Lilac" },
                  { name: "mint",     hex: "#e0f2e9", label: "Mint" },
                  { name: "blue",     hex: "#daebf7", label: "Sky" },
                  { name: "lemon",    hex: "#fffde0", label: "Lemon" },
                  { name: "gold",     hex: "#fdf3d0", label: "Gold" },
                  { name: "white",    hex: "#faf9f6", label: "Ivory" },
                  { name: "black",    hex: "#0b0813", label: "Onyx" },
                ].map((f) => (
                  <button
                    key={f.name}
                    onClick={() => {
                      setSelectedFrame(f.name);
                      playInterfaceBeep(450);
                    }}
                    className={`text-[8px] font-mono py-2 rounded-lg border shadow-inner transition-all duration-300 flex flex-col items-center gap-1 ${
                      selectedFrame === f.name
                        ? "border-[#ffb3c6] ring-2 ring-[#ffb3c6]/30 scale-105"
                        : "border-zinc-800 text-zinc-500 hover:border-zinc-600"
                    }`}
                    style={{ backgroundColor: f.hex }}
                    title={`Bingkai ${f.label}`}
                  >
                    <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: f.hex }} />
                    <span style={{ color: f.name === "black" ? "#fff" : "#333" }}>{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full flex flex-col gap-3 mt-6 select-none text-left">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#ffb3c6]/80 font-bold">
                Corak Kertas Cetak (Ultah & Romantis)
              </span>
              <div className="grid grid-cols-3 gap-2 w-full">
                {[
                  { name: "plain",    label: "Polos ✨" },
                  { name: "hearts",   label: "Hearts 💕" },
                  { name: "roses",    label: "Rose Garden 🌹" },
                  { name: "stars",    label: "Stars ⭐" },
                  { name: "confetti", label: "Confetti 🎉" },
                  { name: "polka",    label: "Polka 🌸" },
                ].map((p) => (
                  <button
                    key={p.name}
                    onClick={() => {
                      setSelectedPattern(p.name);
                      playInterfaceBeep(480);
                    }}
                    className={`text-[10px] font-sans py-2.5 px-1 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center gap-1 cursor-pointer text-center ${
                      selectedPattern === p.name
                        ? "bg-[#ffb3c6] border-[#ffb3c6] text-[#0a060d] font-bold shadow-[0_4px_12px_rgba(255,179,198,0.35)] scale-105"
                        : "bg-pink-950/20 border-pink-900/40 text-[#ffb3c6] hover:border-[#ffb3c6]/60 hover:text-white"
                    }`}
                  >
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleDownloadStrip}
              disabled={capturedImages.includes(null)}
              className="mt-8 md:mt-10 w-full bg-gradient-to-r from-[#ffb3c6] to-[#ffe5ec] hover:from-[#ffe5ec] hover:to-[#ffb3c6] text-[#0a060d] font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(255,179,198,0.15)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Download size={16} />
              <span>Unduh Cetakan Strip (PNG)</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
