import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

const COLORS = ['#C9A14A', '#E9CF8C', '#F6EBCB', '#1F6B3C', '#FFFFFF', '#A8822F'];
const SHELLS = [560, 1120, 1740, 2380, 3100, 3980, 4920];

export default function Fireworks({ originTime }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const fire = confetti.create(canvas, { resize: true, useWorker: true });
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const particleScale = Math.min(2.4, Math.max(1, window.innerWidth / 1100));
    let nextShell = 0;
    let frame;

    const cannon = (x, angle) => {
      void fire({
        particleCount: reducedMotion ? 36 : 110,
        spread: 54,
        startVelocity: 62,
        gravity: 0.85,
        ticks: 190,
        angle,
        origin: { x, y: 0.92 },
        colors: COLORS,
        scalar: particleScale,
      });
    };

    cannon(0.04, 58);
    cannon(0.96, 122);

    const burst = (index) => {
      const x = [0.24, 0.73, 0.48, 0.82, 0.17, 0.61, 0.35][index];
      const y = [0.26, 0.2, 0.34, 0.38, 0.42, 0.24, 0.3][index];
      void fire({
        particleCount: reducedMotion ? 44 : 140,
        spread: 360,
        startVelocity: 32 + (index % 2) * 5,
        gravity: 0.72,
        decay: 0.91,
        ticks: 150,
        origin: { x, y },
        colors: COLORS,
        scalar: particleScale,
      });
    };

    const animate = (time) => {
      const elapsed = time - originTime;
      while (nextShell < SHELLS.length && elapsed >= SHELLS[nextShell]) {
        burst(nextShell);
        nextShell += 1;
      }
      if (nextShell < SHELLS.length) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      fire.reset();
    };
  }, [originTime]);

  return <canvas ref={canvasRef} className="fireworks-canvas" aria-hidden="true" />;
}
