"use client";

import { useEffect, useRef } from "react";

export default function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      phase: number;
      phaseSpeed: number;
    }> = [];
    
    let shootingStars: Array<{
      x: number;
      y: number;
      dx: number;
      dy: number;
      len: number;
      speed: number;
      opacity: number;
    }> = [];

    let petals: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      angle: number;
      spin: number;
      opacity: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      if (stars.length === 0) {
        initStars();
      } else {
        // Adjust existing stars to stay in bounds instead of resetting
        stars.forEach((star) => {
          if (star.x > canvas.width) star.x = Math.random() * canvas.width;
          if (star.y > canvas.height) star.y = Math.random() * canvas.height;
        });
      }

      if (petals.length === 0) {
        initPetals();
      } else {
        // Adjust existing petals
        petals.forEach((p) => {
          if (p.x > canvas.width) p.x = Math.random() * canvas.width;
          if (p.y > canvas.height) p.y = Math.random() * canvas.height;
        });
      }
    };

    const initStars = () => {
      stars = [];
      // Cap the max number of stars to 150 to save CPU/GPU cycles
      const numStars = Math.min(150, Math.floor((canvas.width * canvas.height) / 12000));
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.8 + 0.3,
          speed: Math.random() * 0.05 + 0.01,
          opacity: Math.random() * 0.7 + 0.2,
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: Math.random() * 0.02 + 0.005,
        });
      }
    };

    const initPetals = () => {
      petals = [];
      const numPetals = 12;
      for (let i = 0; i < numPetals; i++) {
        petals.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 5 + 3,
          speedY: Math.random() * 0.4 + 0.25,
          speedX: Math.random() * 0.2 - 0.1,
          angle: Math.random() * Math.PI * 2,
          spin: Math.random() * 0.012 - 0.006,
          opacity: Math.random() * 0.55 + 0.3,
        });
      }
    };

    const spawnShootingStar = () => {
      if (Math.random() > 0.0007 && shootingStars.length > 0) return;
      if (shootingStars.length >= 3) return;

      const side = Math.random() > 0.5; // Top or Right side
      shootingStars.push({
        x: side ? Math.random() * canvas.width * 0.8 : canvas.width,
        y: side ? 0 : Math.random() * canvas.height * 0.5,
        dx: -Math.random() * 8 - 4,
        dy: Math.random() * 6 + 3,
        len: Math.random() * 80 + 40,
        speed: Math.random() * 6 + 4,
        opacity: 1,
      });
    };

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw normal stars (twinkling)
      stars.forEach((star) => {
        star.phase += star.phaseSpeed;
        const currentOpacity = star.opacity + Math.sin(star.phase) * 0.22;
        
        ctx.fillStyle = `rgba(248, 245, 242, ${Math.max(0.12, Math.min(1, currentOpacity))})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Slow horizontal drifting
        star.x += star.speed;
        if (star.x > canvas.width) {
          star.x = 0;
          star.y = Math.random() * canvas.height;
        }
      });

      // Draw drifting flower petals
      petals.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        
        // Draw a simple cute petal shape in soft blush pink
        ctx.fillStyle = `rgba(255, 194, 209, ${p.opacity})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw a soft rose gold accent vein on the petal
        ctx.strokeStyle = `rgba(184, 141, 159, ${p.opacity * 0.55})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-p.size * 0.8, 0);
        ctx.quadraticCurveTo(0, -p.size * 0.2, p.size * 0.8, 0);
        ctx.stroke();

        ctx.restore();

        // Animate drift
        p.y += p.speedY;
        p.x += p.speedX;
        p.angle += p.spin;

        // Wrap around limits
        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width) {
          p.x = 0;
        } else if (p.x < 0) {
          p.x = canvas.width;
        }
      });

      // Spawn & Draw shooting stars
      spawnShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        
        ctx.strokeStyle = `rgba(255, 229, 236, ${ss.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x + ss.dx, ss.y + ss.dy);
        ctx.stroke();

        ss.x += ss.dx;
        ss.y += ss.dy;
        ss.opacity -= 0.015;

        if (ss.opacity <= 0 || ss.x < 0 || ss.y > canvas.height) {
          shootingStars.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="particle-canvas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}
