'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Reveal } from '@/components/ui/Reveal';
import { LISTINGS } from '@/lib/mock/listings';
import { ArrowIcon } from '@/components/ui/icons';
import { BRAND } from '@/lib/brand';

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const ask = (l: (typeof LISTINGS)[number]) =>
  window.dispatchEvent(
    new CustomEvent('ellie:ask', {
      detail: `Tell me about the ${l.headline.toLowerCase()} in ${l.city} (${l.price})`,
    }),
  );

// Burst targets for the exploding info chips (px offsets from card center).
const BURST = [
  { x: -168, y: -18 },
  { x: -104, y: -128 },
  { x: 8, y: -166 },
  { x: 120, y: -128 },
  { x: 178, y: -14 },
];

export default function LuxuryHomes() {
  const [index, setIndex] = useState(0);
  const [exploded, setExploded] = useState(false);
  const [cardW, setCardW] = useState(420);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measure = () => {
      const stageW = stageRef.current?.clientWidth ?? 900;
      // Never let a card exceed the viewport — clamp by both stage and screen.
      const w = Math.min(stageW, window.innerWidth);
      setCardW(Math.min(Math.round(w * 0.8), 440));
    };
    measure();
    const raf = requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
    };
  }, []);

  const go = (dir: number) => {
    setExploded(false);
    setIndex((i) => (i + dir + LISTINGS.length) % LISTINGS.length);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const active = LISTINGS[index];

  return (
    <section id="listings" className="mx-auto w-full max-w-6xl overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
      <Reveal className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">
          Featured listings
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Homes worth a conversation.
        </h2>
        <p className="mt-3 text-base text-muted">
          A glimpse of the East Bay at its finest. Drag through the gallery, pop open the details,
          and ask {BRAND.assistant} about any one.
        </p>
      </Reveal>

      {/* 3D coverflow stage */}
      <div ref={stageRef} className="mt-12" style={{ perspective: '1600px' }}>
        <div className="relative mx-auto h-[420px] sm:h-[460px]" style={{ transformStyle: 'preserve-3d' }}>
          {LISTINGS.map((l, i) => {
            let off = i - index;
            // wrap to shortest direction for a continuous carousel feel
            if (off > LISTINGS.length / 2) off -= LISTINGS.length;
            if (off < -LISTINGS.length / 2) off += LISTINGS.length;
            const isActive = off === 0;
            const hidden = Math.abs(off) > 2;
            return (
              <motion.article
                key={l.id}
                initial={false}
                animate={{
                  x: off * cardW * 0.56,
                  rotateY: clamp(off * -28, -50, 50),
                  scale: isActive ? 1 : Math.max(0.7, 1 - Math.abs(off) * 0.16),
                  opacity: hidden ? 0 : 1,
                  filter: isActive ? 'brightness(1)' : 'brightness(0.8)',
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  width: cardW,
                  marginLeft: -cardW / 2,
                  zIndex: 20 - Math.abs(off),
                  pointerEvents: hidden ? 'none' : 'auto',
                  transformStyle: 'preserve-3d',
                }}
                onClick={() => !isActive && (setIndex(i), setExploded(false))}
                className={!isActive ? 'cursor-pointer' : ''}
              >
                <div className="relative h-[420px] overflow-hidden rounded-3xl border border-hairline bg-card shadow-[0_40px_90px_-45px_rgba(22,26,23,0.55)] sm:h-[460px]">
                  <img src={l.img} alt={`${l.headline}, ${l.city}`} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />

                  <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-xs font-semibold text-forest backdrop-blur">
                    {l.city}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <div className="font-display text-2xl font-semibold text-white">{l.price}</div>
                    <p className="mt-1 text-sm text-white/80">{l.headline}</p>
                    {isActive && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExploded((v) => !v);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/25 active:scale-95"
                        >
                          {exploded ? 'Hide details' : 'Pop the details'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            ask(l);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-forestDeep active:scale-95"
                        >
                          Ask {BRAND.assistant}
                          <ArrowIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Exploding info objects — origin at card center */}
                  <AnimatePresence>
                    {isActive && exploded && (
                      <div className="pointer-events-none absolute inset-0">
                        {(
                          [
                            ['Beds', l.beds],
                            ['Baths', l.baths],
                            ['Sq ft', l.sqft],
                            ['Lot', l.lot],
                            ['Built', l.year],
                          ] as const
                        ).map(([label, value], b) => (
                          <div
                            key={label}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                          >
                            <motion.div
                              initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: -20 }}
                              animate={{ x: BURST[b].x, y: BURST[b].y, scale: 1, opacity: 1, rotate: 0 }}
                              exit={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                              transition={{ type: 'spring', stiffness: 320, damping: 18, delay: b * 0.05 }}
                              className="flex flex-col items-center rounded-2xl border border-white/30 bg-paper/95 px-3.5 py-2 shadow-[0_14px_30px_-14px_rgba(0,0,0,0.6)] backdrop-blur"
                            >
                              <span className="font-display text-lg font-semibold text-ink">{value}</span>
                              <span className="text-[10px] uppercase tracking-wider text-muted">{label}</span>
                            </motion.div>
                          </div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => go(-1)}
            aria-label="Previous home"
            className="grid h-11 w-11 place-items-center rounded-full border border-hairline bg-card text-ink transition hover:border-forest hover:text-forest active:scale-90"
          >
            <ArrowIcon className="h-4 w-4 rotate-180" />
          </button>
          <div className="flex items-center gap-2">
            {LISTINGS.map((l, i) => (
              <button
                key={l.id}
                onClick={() => {
                  setIndex(i);
                  setExploded(false);
                }}
                aria-label={`Show ${l.city} listing`}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-6 bg-forest' : 'w-2 bg-ink/20 hover:bg-ink/40'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => go(1)}
            aria-label="Next home"
            className="grid h-11 w-11 place-items-center rounded-full border border-hairline bg-card text-ink transition hover:border-forest hover:text-forest active:scale-90"
          >
            <ArrowIcon className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          {active.city} · {active.price} — illustrative listings, not for sale.
        </p>
      </div>
    </section>
  );
}
