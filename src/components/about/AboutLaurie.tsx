'use client';

/* eslint-disable @next/next/no-img-element */
import { motion } from 'framer-motion';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { BRAND } from '@/lib/brand';

export default function AboutLaurie() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      {/* Portrait card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
      >
        <GlassPanel elevation="floating" glow className="h-full overflow-hidden p-0">
          <div className="relative flex h-full min-h-[380px] flex-col justify-end bg-gradient-to-b from-kwred/[0.12] via-transparent to-black/60">
            <img
              src={BRAND.assets.standing}
              alt={`${BRAND.agent}, ${BRAND.brokerage}`}
              className="absolute inset-x-0 bottom-0 mx-auto h-[92%] w-auto object-contain object-bottom"
            />
            <div className="relative z-10 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-5 pt-16">
              <div className="font-display text-xl font-semibold text-white">{BRAND.agent}</div>
              <div className="text-sm text-white/60">{BRAND.title}</div>
              <img src={BRAND.assets.kwLogo} alt={BRAND.brokerage} className="mt-3 h-7 w-auto" />
            </div>
          </div>
        </GlassPanel>
      </motion.div>

      {/* Story + testimonial */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col gap-6"
      >
        <GlassPanel elevation="raised" className="flex-1 p-6 sm:p-8">
          <span className="text-xs uppercase tracking-widest text-gold">{BRAND.tagline}</span>
          <p className="mt-3 text-base leading-relaxed text-white/75">
            Laurie has lived and worked in the {BRAND.region} for {BRAND.yearsInEastBay} years —
            she works, shops, hikes, and volunteers in the same communities she sells in. From
            first-time buyers to pricing and staging for sellers to fix &amp; flip investors, her
            promise is simple: your interests supersede her own.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {BRAND.markets.map((m) => (
              <span
                key={m}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60"
              >
                📍 {m}
              </span>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel elevation="raised" glow className="p-6 sm:p-8">
          <div className="flex gap-1 text-gold">{'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}</div>
          <blockquote className="mt-3 text-base italic leading-relaxed text-white/80">
            &ldquo;{BRAND.testimonial.quote}&rdquo;
          </blockquote>
          <div className="mt-4 flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gold/20 text-sm font-bold text-gold">
              {BRAND.testimonial.author[0]}
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{BRAND.testimonial.author}</div>
              <div className="text-xs text-white/45">{BRAND.testimonial.role}</div>
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  );
}
