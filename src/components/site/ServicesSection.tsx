'use client';

import { motion } from 'framer-motion';
import { KeyIcon, TagIcon, ChartIcon, ArrowIcon } from '@/components/ui/icons';
import { BRAND } from '@/lib/brand';

const ask = (prompt: string) =>
  window.dispatchEvent(new CustomEvent('ellie:ask', { detail: prompt }));

const SERVICES = [
  {
    n: '01',
    Icon: KeyIcon,
    title: 'Buy a home',
    prompt: "I'm looking to buy a home",
    body: 'First-time buyers to move-up families — a proven 8-step process, neighborhood-level knowledge, and offer strategy that wins.',
    points: ['Neighborhood-level expertise', 'Offer strategy that wins', 'Guided 8-step process'],
  },
  {
    n: '02',
    Icon: TagIcon,
    title: 'Sell your home',
    prompt: 'I want to sell my home',
    body: 'Pricing, staging, and marketing that gets East Bay homes sold — a 7-step selling plan built on 25+ years of local comps.',
    points: ['Free, no-pressure pricing consult', '7-step selling plan with staging', 'Comps read by a 25-year local'],
  },
  {
    n: '03',
    Icon: ChartIcon,
    title: 'Invest in real estate',
    prompt: "I'm interested in investing",
    body: 'Fix & flip, fix & hold, and underwater strategies — Laurie helps investors find East Bay numbers that actually pencil.',
    points: ['Deal analysis that pencils', 'Fix & flip and fix & hold sourcing', '1031 exchange timeline management'],
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">Services</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Buy. Sell. Invest.
        </h2>
        <p className="mt-3 max-w-xl text-base text-muted">
          Full-time representation, from first showing to final signature. Every path starts with a
          conversation.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.09 }}
            className="flex flex-col rounded-3xl border border-hairline bg-card p-6 transition hover:-translate-y-1 hover:shadow-[0_28px_60px_-38px_rgba(22,26,23,0.4)]"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-sm text-muted">{s.n}</span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-forest/[0.08] text-forest">
                <s.Icon className="h-4 w-4" />
              </span>
            </div>
            <h3 className="mt-5 font-display text-2xl font-semibold text-ink">{s.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.body}</p>
            <ul className="mt-4 space-y-2">
              {s.points.map((p) => (
                <li key={p} className="flex items-start gap-2 text-[13px] text-ink/75">
                  <span className="mt-0.5 text-forest">✓</span> {p}
                </li>
              ))}
            </ul>
            <button
              onClick={() => ask(s.prompt)}
              className="mt-6 inline-flex items-center gap-1.5 self-start rounded-full border border-forest/30 px-4 py-2 text-sm font-semibold text-forest transition hover:bg-forest hover:text-white"
            >
              Ask {BRAND.assistant}
              <ArrowIcon className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
