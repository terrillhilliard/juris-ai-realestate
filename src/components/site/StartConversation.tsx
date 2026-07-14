'use client';

import { motion } from 'framer-motion';
import { ArrowIcon } from '@/components/ui/icons';

const OPTIONS = [
  { label: 'Buy', sub: 'Find your next home', prompt: "I'm looking to buy a home" },
  { label: 'Sell', sub: 'Get a pricing plan', prompt: 'I want to sell my home' },
  { label: 'Invest', sub: 'Numbers that pencil', prompt: "I'm interested in investing" },
];

const ask = (prompt: string) =>
  window.dispatchEvent(new CustomEvent('ellie:ask', { detail: prompt }));

export default function StartConversation() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-night px-6 py-8 sm:px-10 sm:py-10"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald/20 blur-3xl"
        />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mint">
              Start the conversation
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Are you looking to buy, sell, or invest in the East Bay?
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {OPTIONS.map((o) => (
              <button
                key={o.label}
                onClick={() => ask(o.prompt)}
                className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-mint/40 hover:bg-white/[0.08]"
              >
                <div className="font-display text-xl font-semibold text-white">{o.label}</div>
                <div className="mt-1 flex items-center gap-1 text-xs text-white/55">
                  {o.sub}
                  <ArrowIcon className="h-3 w-3 text-mint transition group-hover:translate-x-0.5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
