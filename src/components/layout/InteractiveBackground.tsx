'use client';

import { useEffect, useRef } from 'react';

/**
 * Interactive spatial background: a dot matrix that ignites toward the
 * pointer with a royal-red spotlight and reacts with depth + parallax.
 * Ambient auto-drift on touch/no-pointer; static frame under reduced motion.
 * Performance: capped DPR, single rAF, paused when the tab is hidden.
 */

const FLAME = [232, 50, 63]; // #E8323F
const SPACING = 34; // px between dots (CSS px)
const RADIUS = 190; // interactive falloff radius
const BASE_ALPHA = 0.05;

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduced =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const finePointer = window.matchMedia?.('(pointer: fine)').matches ?? false;

    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;

    // Pointer: real target + eased current position.
    const target = { x: -9999, y: -9999 };
    const eased = { x: -9999, y: -9999 };
    let usingReal = false;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / SPACING) + 1;
      rows = Math.ceil(h / SPACING) + 1;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: PointerEvent) => {
      usingReal = true;
      target.x = e.clientX;
      target.y = e.clientY;
    };
    const onLeave = () => {
      usingReal = false;
    };
    if (finePointer) {
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerleave', onLeave);
    }

    const R2 = RADIUS * RADIUS;

    const drawSpotlight = (px: number, py: number, intensity: number) => {
      const g = ctx.createRadialGradient(px, py, 0, px, py, RADIUS * 1.8);
      g.addColorStop(0, `rgba(${FLAME[0]},${FLAME[1]},${FLAME[2]},${0.1 * intensity})`);
      g.addColorStop(0.4, `rgba(${FLAME[0]},${FLAME[1]},${FLAME[2]},${0.04 * intensity})`);
      g.addColorStop(1, 'rgba(232,50,63,0)');
      ctx.fillStyle = g;
      ctx.fillRect(px - RADIUS * 1.8, py - RADIUS * 1.8, RADIUS * 3.6, RADIUS * 3.6);
    };

    let raf = 0;
    let t = 0;

    const frame = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);

      // Resolve the active focal point: eased real pointer, or a slow
      // Lissajous drift when there's no pointer (touch devices, idle).
      let fx: number;
      let fy: number;
      if (usingReal) {
        eased.x += (target.x - eased.x) * 0.12;
        eased.y += (target.y - eased.y) * 0.12;
        fx = eased.x;
        fy = eased.y;
      } else {
        fx = w * (0.5 + 0.32 * Math.sin(t * 0.18));
        fy = h * (0.42 + 0.26 * Math.cos(t * 0.13));
        eased.x = fx;
        eased.y = fy;
      }

      const intensity = usingReal ? 1 : 0.7;
      drawSpotlight(fx, fy, intensity);

      for (let iy = 0; iy < rows; iy++) {
        for (let ix = 0; ix < cols; ix++) {
          const bob = reduced ? 0 : Math.sin(t * 0.9 + (ix + iy) * 0.55) * 1.1;
          const x = ix * SPACING;
          const y = iy * SPACING + bob;

          const dx = x - fx;
          const dy = y - fy;
          const d2 = dx * dx + dy * dy;

          let alpha = BASE_ALPHA;
          let size = 1;
          let r = 255;
          let g = 255;
          let b = 255;

          if (d2 < R2) {
            const prox = 1 - Math.sqrt(d2) / RADIUS; // 0..1
            const e = prox * prox;
            alpha = BASE_ALPHA + e * 0.55;
            size = 1 + e * 2.2;
            // Tint toward flame red near the focal point.
            r = Math.round(255 + (FLAME[0] - 255) * e);
            g = Math.round(255 + (FLAME[1] - 255) * e);
            b = Math.round(255 + (FLAME[2] - 255) * e);
          }

          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        }
      }

      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        // Re-measure in case the canvas mounted while the tab was hidden
        // (innerWidth reports 0 then), otherwise it stays a 0×0 blank.
        if (w === 0 || h === 0) resize();
        reduced ? frame() : start();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    if (reduced) {
      // Single static frame — grid + centered soft glow, no loop.
      usingReal = false;
      target.x = w / 2;
      target.y = h * 0.4;
      frame();
      stop();
    } else {
      start();
    }

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: -1 }}
    />
  );
}
