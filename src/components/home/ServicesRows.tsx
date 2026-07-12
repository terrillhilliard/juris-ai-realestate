'use client';

import { motion } from 'framer-motion';
import { BRAND } from '@/lib/brand';

const SERVICES = [
  {
    n: '01',
    title: 'Buy a home',
    prompt: "I'm looking to buy a home",
    body: 'First-time buyers to move-up families — a proven 8-step process from search to keys. Neighborhood-level knowledge across all six of Laurie’s East Bay markets, and offer strategy built on 25+ years of winning them.',
  },
  {
    n: '02',
    title: 'Sell your home',
    prompt: 'I want to sell my home',
    body: 'Pricing, staging, and marketing that gets East Bay homes sold. A 7-step selling plan, a free pricing consultation, and comps read by someone who has watched this market for two and a half decades.',
  },
  {
    n: '03',
    title: 'Invest in real estate',
    prompt: "I'm interested in investing",
    body: 'Fix & flip. Fix & hold. Underwater property strategy. Laurie helps investors find East Bay numbers that actually pencil — and manages the timeline when a 1031 clock is ticking.',
  },
] as const;

const ask = (prompt: string) => window.dispatchEvent(new CustomEvent('ellie:ask', { detail: prompt }));

/** Editorial, text-heavy service rows. Every action routes through the assistant. */
export default function ServicesRows() {
  return (
    <div className="divide-y divide-white/10 border-y border-white/10">
      {SERVICES.map((s, i) => (
        <motion.div
          key={s.n}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: i * 0.07 }}
          className="group grid gap-4 py-10 sm:grid-cols-[80px_1fr_auto] sm:items-start sm:gap-8"
        >
          <span className="font-mono text-sm text-white/30">{s.n}</span>
          <div>
            <h3 className="font-display text-2xl font-semibold text-paper sm:text-3xl">
              {s.title}
            </h3>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/60">{s.body}</p>
          </div>
          <button
            onClick={() => ask(s.prompt)}
            className="justify-self-start whitespace-nowrap rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-paper transition group-hover:border-flame/60 hover:bg-gradient-to-r hover:from-flame hover:to-royal hover:border-transparent sm:justify-self-end"
          >
            Ask {BRAND.assistant} →
          </button>
        </motion.div>
      ))}
    </div>
  );
}
