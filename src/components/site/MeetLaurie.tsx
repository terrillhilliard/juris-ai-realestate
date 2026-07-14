'use client';

/* eslint-disable @next/next/no-img-element */
import { motion } from 'framer-motion';
import { PinIcon, StarIcon } from '@/components/ui/icons';
import { BRAND } from '@/lib/brand';

export default function MeetLaurie() {
  return (
    <section id="about" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-3xl border border-hairline bg-cream"
        >
          <div className="relative flex min-h-[380px] items-end justify-center">
            <img
              src={BRAND.assets.standing}
              alt={`${BRAND.agent}, ${BRAND.brokerage}`}
              className="h-[92%] w-auto object-contain object-bottom"
            />
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-hairline bg-card px-5 py-4">
            <div>
              <div className="font-display text-lg font-semibold text-ink">{BRAND.agent}</div>
              <div className="text-xs text-muted">{BRAND.title}</div>
            </div>
            <img src={BRAND.assets.kwLogo} alt={BRAND.brokerage} className="h-7 w-auto" />
          </div>
        </motion.div>

        {/* Bio + reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">Meet Laurie</p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl">
            A neighbor first, a realtor second
          </h2>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-forest">
            Integrity · Honesty · Community
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            Laurie has lived and worked in the {BRAND.region} for {BRAND.yearsInEastBay} years — she
            works, shops, hikes, and volunteers in the same communities she sells in. From first-time
            buyers to pricing and staging for sellers to fix &amp; flip investors, her promise is
            simple: your interests supersede her own.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {BRAND.markets.map((m) => (
              <span
                key={m}
                className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-card px-3 py-1.5 text-xs text-ink/75"
              >
                <PinIcon className="h-3 w-3 text-orchid" />
                {m}
              </span>
            ))}
          </div>

          {/* Reviews */}
          <div id="reviews" className="mt-8 grid gap-4 sm:grid-cols-2">
            {BRAND.testimonials.map((t) => (
              <div key={t.author} className="rounded-2xl border border-hairline bg-card p-5">
                <div className="flex gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="h-3.5 w-3.5" />
                  ))}
                </div>
                <blockquote className="mt-3 text-sm italic leading-relaxed text-ink/80">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-4 flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-forest/10 text-xs font-bold text-forest">
                    {t.author[0]}
                  </div>
                  <div className="text-xs leading-tight">
                    <div className="font-semibold text-ink">{t.author}</div>
                    <div className="text-muted">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
