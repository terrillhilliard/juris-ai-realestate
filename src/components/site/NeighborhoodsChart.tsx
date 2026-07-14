'use client';

import { motion } from 'framer-motion';
import { CITY_MARKETS } from '@/lib/mock/cities';
import { BRAND } from '@/lib/brand';

const fmtPrice = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${Math.round(n / 1000)}k`;

const MAX = Math.max(...CITY_MARKETS.map((c) => c.medianPrice));

const ask = (city: string) =>
  window.dispatchEvent(new CustomEvent('ellie:ask', { detail: `Tell me about ${city}` }));

export default function NeighborhoodsChart() {
  return (
    <section id="neighborhoods" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="max-w-xl"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">Neighborhoods</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Six cities. One neighbor.
        </h2>
        <p className="mt-3 text-base text-muted">
          Laurie&apos;s corner of Contra Costa County, from the Carquinez Strait to Mt. Diablo. Tap
          any city and {BRAND.assistant} picks up the conversation.
        </p>
      </motion.div>

      <div className="relative mt-10 overflow-hidden rounded-3xl bg-night p-6 pt-10 sm:p-10 sm:pt-12">
        {/* map annotations */}
        <span className="pointer-events-none absolute left-6 top-5 text-[11px] italic text-white/25 sm:left-10">
          Carquinez Strait
        </span>
        <span className="pointer-events-none absolute bottom-6 right-6 text-[11px] italic text-white/25 sm:right-10">
          ▲ Mt. Diablo
        </span>
        <span className="pointer-events-none absolute bottom-16 left-10 hidden -rotate-[24deg] text-[10px] tracking-widest text-white/15 sm:block">
          I-680
        </span>

        <div className="relative flex h-[300px] items-end justify-between gap-2 sm:h-[340px] sm:gap-4">
          {CITY_MARKETS.map((c, i) => {
            const h = 26 + (c.medianPrice / MAX) * 74; // % of track
            return (
              <button
                key={c.id}
                onClick={() => ask(c.name)}
                className="group flex h-full flex-1 cursor-pointer flex-col items-center justify-end"
                aria-label={`${c.name} — median ${fmtPrice(c.medianPrice)}, ask ${BRAND.assistant}`}
              >
                <div className="mb-2 text-center">
                  <div className="font-display text-[11px] font-semibold leading-tight text-white sm:text-sm">
                    {c.name}
                  </div>
                  <div className="font-mono text-[10px] text-mint sm:text-xs">
                    {fmtPrice(c.medianPrice)}
                  </div>
                </div>
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: 'easeOut' }}
                  className="w-full max-w-[54px] rounded-t-lg bg-gradient-to-b from-mint to-forest shadow-[0_0_30px_-8px_rgba(51,150,124,0.6)] transition group-hover:from-white group-hover:to-emerald"
                />
              </button>
            );
          })}
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-muted">
        Tap a city — {BRAND.assistant} knows the numbers. Market data illustrative.
      </p>
    </section>
  );
}
