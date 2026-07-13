'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { CITY_MARKETS, type CityMarket } from '@/lib/mock/cities';
import { BRAND } from '@/lib/brand';

/**
 * 3D East Bay market map. A perspective-tilted glass plane carries the
 * county geography (Carquinez Strait, Mt. Diablo contours, flowing
 * highways); each city rises as an extruded pillar whose height tracks
 * its median price. The whole scene tilts and pans with the pointer;
 * hovering a pillar lifts it and opens an in-world card; a tap hands the
 * city to Ellie.
 */

const VB = { w: 800, h: 560 };
const BASE_TILT = 55; // deg

// Approximate lat/lon → plane coordinates (percent of plane).
const COORDS: Record<string, [number, number]> = {
  martinez: [20, 19.5],
  concord: [51.3, 39],
  'pleasant-hill': [42.1, 53.4],
  clayton: [80, 56.6],
  'walnut-creek': [40.9, 73.4],
  lafayette: [24.9, 82.9],
};

const fmtPrice = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${Math.round(n / 1000)}k`;

const ask = (city: string) =>
  window.dispatchEvent(new CustomEvent('ellie:ask', { detail: `Tell me about ${city}` }));

const hasFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(pointer: fine)').matches;

/** Pillar height in px from median price. */
const pillarH = (price: number) => 46 + (price / 1_900_000) * 92;

export default function EastBayMap() {
  const [active, setActive] = useState<CityMarket | null>(null);

  // Scene tilt/pan driven by the pointer, spring-damped.
  const tilt = useMotionValue(BASE_TILT);
  const spin = useMotionValue(0);
  const sTilt = useSpring(tilt, { stiffness: 70, damping: 16 });
  const sSpin = useSpring(spin, { stiffness: 70, damping: 16 });
  // Pillars counter-rotate so they always stand upright on the plane.
  const counterTilt = useTransform(sTilt, (v) => -v);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!hasFinePointer()) return;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
    const ny = (e.clientY - r.top) / r.height - 0.5;
    tilt.set(BASE_TILT - ny * 14); // lean the plane toward the cursor
    spin.set(nx * 10); // subtle turntable
  };
  const onPointerLeave = () => {
    tilt.set(BASE_TILT);
    spin.set(0);
    setActive(null);
  };

  return (
    <div className="relative">
      <div
        className="relative mx-auto max-w-4xl"
        style={{ perspective: '1300px' }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        {/* The tilted glass map plane */}
        <motion.div
          initial={{ opacity: 0, rotateX: 70 }}
          whileInView={{ opacity: 1, rotateX: BASE_TILT }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ rotateX: sTilt, rotateZ: sSpin, transformStyle: 'preserve-3d' }}
          className="edge-light relative mx-auto aspect-[800/520] w-full rounded-[32px] border border-black/[0.07] bg-white/45 shadow-[0_60px_110px_-50px_rgba(0,0,0,0.45),0_30px_70px_-40px_rgba(155,17,30,0.25)] backdrop-blur-xl"
        >
          {/* Geography layer */}
          <svg
            viewBox={`0 0 ${VB.w} ${VB.h}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full rounded-[32px]"
            aria-hidden
          >
            {/* Spatial grid */}
            {Array.from({ length: 9 }, (_, i) => (
              <line key={`v${i}`} x1={(i + 1) * 80} y1="0" x2={(i + 1) * 80} y2={VB.h} stroke="rgba(0,0,0,0.045)" strokeWidth="1" />
            ))}
            {Array.from({ length: 6 }, (_, i) => (
              <line key={`h${i}`} x1="0" y1={(i + 1) * 80} x2={VB.w} y2={(i + 1) * 80} stroke="rgba(0,0,0,0.045)" strokeWidth="1" />
            ))}

            {/* Carquinez Strait */}
            <path d="M0,66 C130,38 300,54 460,30 C600,10 720,26 800,12 L800,0 L0,0 Z" fill="rgba(155,17,30,0.06)" />
            <path d="M0,66 C130,38 300,54 460,30 C600,10 720,26 800,12" fill="none" stroke="rgba(155,17,30,0.3)" strokeWidth="2" />
            <text x="600" y="46" fill="rgba(0,0,0,0.35)" fontSize="14" fontStyle="italic">
              Carquinez Strait
            </text>

            {/* Mt. Diablo contours */}
            {[70, 52, 35, 20].map((r, i) => (
              <ellipse key={r} cx="712" cy="470" rx={r * 1.5} ry={r} fill={i === 3 ? 'rgba(155,17,30,0.07)' : 'none'} stroke={`rgba(0,0,0,${0.08 + i * 0.04})`} strokeWidth="1.2" />
            ))}
            <text x="712" y="475" textAnchor="middle" fill="rgba(155,17,30,0.7)" fontSize="14">▲</text>
            <text x="712" y="540" textAnchor="middle" fill="rgba(0,0,0,0.4)" fontSize="13" fontWeight="600">Mt. Diablo</text>

            {/* Flowing highways */}
            <path className="road-flow" d="M172,88 C240,160 320,220 337,299 C350,360 330,380 327,411 C324,450 340,510 360,556" fill="none" stroke="rgba(155,17,30,0.35)" strokeWidth="3" strokeDasharray="3 9" strokeLinecap="round" />
            <path className="road-flow" d="M96,522 C140,496 240,450 327,411" fill="none" stroke="rgba(155,17,30,0.35)" strokeWidth="3" strokeDasharray="3 9" strokeLinecap="round" style={{ animationDelay: '-0.8s' }} />
            <path className="road-flow" d="M120,120 C220,150 320,190 410,219 C500,248 580,280 640,317" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="2.5" strokeDasharray="3 9" strokeLinecap="round" style={{ animationDelay: '-1.5s' }} />
            <text x="350" y="350" fill="rgba(0,0,0,0.35)" fontSize="12" fontWeight="600">I-680</text>
            <text x="176" y="505" fill="rgba(0,0,0,0.35)" fontSize="12" fontWeight="600">SR-24</text>
          </svg>

          {/* City pillars */}
          {CITY_MARKETS.map((c, i) => {
            const [xp, yp] = COORDS[c.id];
            const h = pillarH(c.medianPrice);
            const isActive = active?.id === c.id;
            return (
              <div
                key={c.id}
                className="absolute"
                style={{ left: `${xp}%`, top: `${yp}%`, transformStyle: 'preserve-3d' }}
              >
                {/* Base glow on the plane */}
                <span className="base-pulse absolute left-0 top-0 h-8 w-12 rounded-full bg-royal/30 blur-[6px]" style={{ animationDelay: `${i * 0.4}s` }} />
                <span className="absolute left-0 top-0 h-3 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-royal/60" />

                {/* Upright billboard: counter-rotated so it stands on the plane */}
                <motion.div
                  style={{ rotateX: counterTilt, x: '-50%', transformOrigin: 'bottom center', transformStyle: 'preserve-3d' }}
                  className="absolute bottom-0 left-0 flex flex-col items-center"
                >
                  {/* In-world detail card */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="pointer-events-none mb-2 w-52 rounded-xl border border-black/10 bg-white/90 p-3 text-left text-xs shadow-[0_18px_44px_-18px_rgba(0,0,0,0.45)] backdrop-blur-xl"
                      >
                        <div className="mb-1 text-sm font-semibold text-ink">{c.name}</div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-ink/55">Median price</span>
                          <span className="font-mono font-semibold text-royal">{fmtPrice(c.medianPrice)}</span>
                        </div>
                        <div className="flex justify-between py-0.5">
                          <span className="text-ink/55">Days on market</span>
                          <span className="font-mono text-ink">~{c.daysOnMarket}</span>
                        </div>
                        <div className="mt-1 border-t border-black/10 pt-1 text-ink/60">{c.vibe}</div>
                        <div className="mt-1 text-[10px] font-semibold text-royal">
                          Tap to ask {BRAND.assistant} →
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Label */}
                  {!isActive && (
                    <div className="mb-1.5 whitespace-nowrap text-center">
                      <div className="text-[13px] font-semibold text-ink">{c.name}</div>
                      <div className="font-mono text-[11px] text-ink/50">{fmtPrice(c.medianPrice)}</div>
                    </div>
                  )}

                  {/* Extruded pillar */}
                  <motion.button
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: 0.25 + i * 0.09, ease: 'easeOut' }}
                    animate={{ height: isActive ? h + 16 : h }}
                    onMouseEnter={() => setActive(c)}
                    onMouseLeave={() => setActive(null)}
                    onClick={() => {
                      setActive(c);
                      ask(c.name);
                    }}
                    aria-label={`${c.name} — median ${fmtPrice(c.medianPrice)}, ask ${BRAND.assistant}`}
                    style={{ height: h, transformOrigin: 'bottom center' }}
                    className={`relative w-[18px] cursor-pointer rounded-t-full border border-white/40 bg-gradient-to-b shadow-[0_10px_28px_-8px_rgba(155,17,30,0.5)] transition-[filter] ${
                      isActive
                        ? 'from-flame to-royal brightness-110'
                        : 'from-royal/90 to-royal/60'
                    }`}
                  >
                    {/* Glass shine down the pillar */}
                    <span className="absolute inset-y-1 left-[3px] w-[4px] rounded-full bg-white/45" />
                  </motion.button>
                </motion.div>
              </div>
            );
          })}
        </motion.div>

        {/* Ground shadow under the scene */}
        <div aria-hidden className="mx-auto mt-[-14px] h-8 w-3/4 rounded-[100%] bg-black/15 blur-2xl" />
      </div>

      <p className="mt-4 text-center text-xs text-ink/45">
        Move your cursor to tilt the map · tap a pillar and {BRAND.assistant} picks up the
        conversation. Market data illustrative.
      </p>
    </div>
  );
}
