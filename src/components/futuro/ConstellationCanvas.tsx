import { useEffect, useRef } from 'react';

interface ConstellationCanvasProps {
  /** Durata fade-out in ms dopo onSettled (default 800) */
  fadeOutMs?: number;
  /** Callback quando la costellazione è "atterrata" nell'hero */
  onSettled?: () => void;
}

/**
 * Intro leggera a canvas 2D: punti-stella che appaiono e si raccolgono al centro.
 * CWV-safe: niente WebGL, canvas dimensionato sul devicePixelRatio, requestAnimationFrame
 * cancellato on-unmount. Rispetta prefers-reduced-motion (salta l'animazione).
 * Timeout totale < 1.2s.
 */
export function ConstellationCanvas({ fadeOutMs = 600, onSettled }: ConstellationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      onSettled?.();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const STAR_COUNT = 80;
    const DURATION_MS = 900; // settle time
    const start = performance.now();

    interface Star {
      x: number;
      y: number;
      tx: number; // target x (converge verso centro)
      ty: number;
      r: number;
      alpha: number;
    }

    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * Math.max(W, H) * 0.6;
      return {
        x: W / 2 + Math.cos(angle) * dist,
        y: H / 2 + Math.sin(angle) * dist,
        tx: W / 2 + (Math.random() - 0.5) * W * 0.7,
        ty: H / 2 + (Math.random() - 0.5) * H * 0.6,
        r: 0.8 + Math.random() * 1.6,
        alpha: 0.3 + Math.random() * 0.7,
      };
    });

    let settled = false;

    function easeOut(t: number): number {
      return 1 - Math.pow(1 - t, 3);
    }

    function draw(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / DURATION_MS, 1);
      const easedT = easeOut(t);

      ctx.clearRect(0, 0, W, H);

      for (const s of stars) {
        const cx = s.x + (s.tx - s.x) * easedT;
        const cy = s.y + (s.ty - s.y) * easedT;
        // Fade in early, stay bright, fade out at end
        const fadeIn = Math.min(t * 4, 1);
        const fadeOut = t > 0.8 ? 1 - (t - 0.8) * 5 : 1;

        ctx.beginPath();
        ctx.arc(cx, cy, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244, 238, 227, ${s.alpha * fadeIn * fadeOut})`;
        ctx.fill();
      }

      // Connessioni tra stelle vicine (max 20 linee)
      let lineCount = 0;
      for (let i = 0; i < stars.length && lineCount < 20; i++) {
        for (let j = i + 1; j < stars.length && lineCount < 20; j++) {
          const si = stars[i];
          const sj = stars[j];
          const cxi = si.x + (si.tx - si.x) * easedT;
          const cyi = si.y + (si.ty - si.y) * easedT;
          const cxj = sj.x + (sj.tx - sj.x) * easedT;
          const cyj = sj.y + (sj.ty - sj.y) * easedT;
          const dist = Math.hypot(cxi - cxj, cyi - cyj);
          if (dist < 80) {
            const fadeIn = Math.min(t * 4, 1);
            const fadeOut = t > 0.8 ? 1 - (t - 0.8) * 5 : 1;
            ctx.beginPath();
            ctx.moveTo(cxi, cyi);
            ctx.lineTo(cxj, cyj);
            ctx.strokeStyle = `rgba(255, 91, 46, ${0.15 * (1 - dist / 80) * fadeIn * fadeOut})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            lineCount++;
          }
        }
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(draw);
      } else if (!settled) {
        settled = true;
        setTimeout(() => onSettled?.(), fadeOutMs);
      }
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [fadeOutMs, onSettled]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
      style={{ display: 'block' }}
    />
  );
}
