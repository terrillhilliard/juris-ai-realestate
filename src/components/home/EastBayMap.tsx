'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { CITY_MARKETS, type CityMarket } from '@/lib/mock/cities';
import { BRAND } from '@/lib/brand';

/**
 * Stylized East Bay market map. Cities are placed on their real relative
 * geography (Contra Costa County): Martinez on the strait up north, Concord
 * northeast, Clayton at the foot of Mt. Diablo, Lafayette down the SR-24
 * corridor. Tap a city — the assistant picks up the conversation.
 */

const VB = { w: 800, h: 560 };

// Approximate lat/lon → viewBox projection.
const COORDS: Record<string, [number, number]> = {
  martinez: [160, 109],
  concord: [410, 219],
  'pleasant-hill': [337, 299],
  clayton: [640, 317],
  'walnut-creek': [327, 411],
  lafayette: [199, 464],
};

const fmtPrice = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${Math.round(n / 1000)}k`;

const ask = (city: string) =>
  window.dispatchEvent(new CustomEvent('ellie:ask', { detail: `Tell me about ${city}` }));

export default function EastBayMap() {
  const [active, setActive] = useState<CityMarket | null>(null);
  const pos = active ? COORDS[active.id] : null;

  return (
    <GlassPanel elevation="floating" glow className="relative">
      <div className="relative p-3 sm:p-5">
        <svg
          viewBox={`0 0 ${VB.w} ${VB.h}`}
          className="h-auto w-full"
          role="img"
          aria-label="Map of Laurie's six East Bay markets"
        >
          {/* Carquinez Strait — water to the north */}
          <path
            d="M0,66 C130,38 300,54 460,30 C600,10 720,26 800,12 L800,0 L0,0 Z"
            fill="rgba(0,0,0,0.05)"
          />
          <path
            d="M0,66 C130,38 300,54 460,30 C600,10 720,26 800,12"
            fill="none"
            stroke="rgba(0,0,0,0.14)"
            strokeWidth="1.5"
          />
          <text x="620" y="46" fill="rgba(0,0,0,0.3)" fontSize="13" fontStyle="italic">
            Carquinez Strait
          </text>

          {/* Mt. Diablo — contour rings SE of Clayton */}
          {[64, 46, 30, 16].map((r, i) => (
            <ellipse
              key={r}
              cx="712"
              cy="452"
              rx={r * 1.45}
              ry={r}
              fill="none"
              stroke={`rgba(0,0,0,${0.07 + i * 0.03})`}
              strokeWidth="1"
            />
          ))}
          <text x="712" y="456" textAnchor="middle" fill="rgba(0,0,0,0.4)" fontSize="12">
            ▲
          </text>
          <text x="712" y="536" textAnchor="middle" fill="rgba(0,0,0,0.3)" fontSize="12">
            Mt. Diablo
          </text>

          {/* Highways — I-680 north–south, SR-24 southwest, SR-4 east–west */}
          <path
            d="M172,88 C240,160 320,220 337,299 C350,360 330,380 327,411 C324,450 340,510 360,556"
            fill="none"
            stroke="rgba(0,0,0,0.12)"
            strokeWidth="2.5"
            strokeDasharray="1 7"
            strokeLinecap="round"
          />
          <path
            d="M96,522 C140,496 240,450 327,411"
            fill="none"
            stroke="rgba(0,0,0,0.12)"
            strokeWidth="2.5"
            strokeDasharray="1 7"
            strokeLinecap="round"
          />
          <path
            d="M120,120 C220,150 320,190 410,219 C500,248 580,280 640,317"
            fill="none"
            stroke="rgba(0,0,0,0.10)"
            strokeWidth="2"
            strokeDasharray="1 7"
            strokeLinecap="round"
          />
          <text x="352" y="345" fill="rgba(0,0,0,0.28)" fontSize="11">
            I-680
          </text>
          <text x="180" y="502" fill="rgba(0,0,0,0.28)" fontSize="11">
            SR-24
          </text>

          {/* City nodes */}
          {CITY_MARKETS.map((c, i) => {
            const [x, y] = COORDS[c.id];
            const isActive = active?.id === c.id;
            return (
              <motion.g
                key={c.id}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setActive(c)}
                onMouseLeave={() => setActive(null)}
                onClick={() => {
                  setActive(c);
                  ask(c.name);
                }}
              >
                {/* halo */}
                <circle cx={x} cy={y} r={isActive ? 26 : 20} fill="rgba(0,0,0,0.06)" />
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 13 : 10}
                  fill={isActive ? '#9B111E' : 'rgba(0,0,0,0.9)'}
                  stroke={isActive ? 'rgba(155,17,30,0.45)' : 'rgba(0,0,0,0.25)'}
                  strokeWidth="5"
                />
                <text
                  x={x}
                  y={y - (isActive ? 34 : 28)}
                  textAnchor="middle"
                  fill="#181818"
                  fontSize="16"
                  fontWeight="600"
                >
                  {c.name}
                </text>
                <text
                  x={x}
                  y={y + 38}
                  textAnchor="middle"
                  fill="rgba(0,0,0,0.55)"
                  fontSize="13"
                  fontFamily="monospace"
                >
                  {fmtPrice(c.medianPrice)}
                </text>
              </motion.g>
            );
          })}
        </svg>

        {/* Hover / tap detail card */}
        <AnimatePresence>
          {active && pos && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-none absolute z-20 w-56 -translate-x-1/2 rounded-xl border border-black/10 bg-white/95 p-3.5 text-xs shadow-2xl backdrop-blur-xl"
              style={{
                left: `clamp(120px, ${(pos[0] / VB.w) * 100}%, calc(100% - 120px))`,
                top: `${(pos[1] / VB.h) * 100}%`,
                transform: 'translate(-50%, calc(-100% - 46px))',
              }}
            >
              <div className="mb-1.5 text-sm font-semibold text-ink">{active.name}</div>
              <div className="flex justify-between py-0.5">
                <span className="text-ink/55">Median price</span>
                <span className="font-mono text-ink">{fmtPrice(active.medianPrice)}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-ink/55">Days on market</span>
                <span className="font-mono text-ink">~{active.daysOnMarket}</span>
              </div>
              <div className="mt-1.5 border-t border-black/10 pt-1.5 text-ink/60">
                {active.vibe}
              </div>
              <div className="mt-1.5 text-[10px] text-ink/45">
                Tap to ask {BRAND.assistant} about {active.name}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="pb-1 pt-2 text-center text-xs text-ink/45">
          Tap a city — {BRAND.assistant} knows the numbers. Market data illustrative.
        </p>
      </div>
    </GlassPanel>
  );
}
