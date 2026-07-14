'use client';

import { useEffect, useRef } from 'react';

/**
 * Ambient, pointer-reactive background for the cream theme. A handful of
 * soft blurred orbs drift on their own and ease toward the cursor with
 * different parallax depths. Canvas-free, GPU transforms only; pauses when
 * the tab is hidden and honors reduced-motion.
 */
const ORBS = [
  { size: 460, color: 'rgba(28,107,82,0.10)', depth: 0.05, ox: 0.16, oy: 0.22, sp: 0.00018 },
  { size: 520, color: 'rgba(51,150,124,0.09)', depth: 0.09, ox: 0.82, oy: 0.30, sp: 0.00013 },
  { size: 380, color: 'rgba(217,164,65,0.08)', depth: 0.07, ox: 0.30, oy: 0.78, sp: 0.00021 },
  { size: 440, color: 'rgba(169,77,193,0.05)', depth: 0.12, ox: 0.72, oy: 0.82, sp: 0.00016 },
];

export default function InteractiveBackground() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const fine = window.matchMedia?.('(pointer: fine)').matches ?? false;
    const nodes = Array.from(layer.children) as HTMLElement[];

    const target = { x: 0.5, y: 0.4 };
    const eased = { x: 0.5, y: 0.4 };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth;
      target.y = e.clientY / window.innerHeight;
    };
    if (fine) window.addEventListener('pointermove', onMove, { passive: true });

    const frame = (t: number) => {
      eased.x += (target.x - eased.x) * 0.05;
      eased.y += (target.y - eased.y) * 0.05;
      nodes.forEach((n, i) => {
        const o = ORBS[i];
        const dx = (eased.x - 0.5) * o.depth * window.innerWidth;
        const dy = (eased.y - 0.5) * o.depth * window.innerHeight;
        const driftX = Math.sin(t * o.sp + i) * 26;
        const driftY = Math.cos(t * o.sp * 1.3 + i) * 22;
        n.style.transform = `translate3d(${dx + driftX}px, ${dy + driftY}px, 0)`;
      });
      raf = requestAnimationFrame(frame);
    };

    if (reduced) {
      nodes.forEach((n) => (n.style.transform = 'none'));
    } else {
      raf = requestAnimationFrame(frame);
    }

    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf && !reduced) {
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <div ref={layerRef} aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {ORBS.map((o, i) => (
        <div
          key={i}
          className="absolute rounded-full will-change-transform"
          style={{
            width: o.size,
            height: o.size,
            left: `calc(${o.ox * 100}% - ${o.size / 2}px)`,
            top: `calc(${o.oy * 100}% - ${o.size / 2}px)`,
            background: o.color,
            filter: 'blur(80px)',
          }}
        />
      ))}
    </div>
  );
}
