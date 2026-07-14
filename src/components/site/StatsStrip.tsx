'use client';

import { motion } from 'framer-motion';

const STATS = [
  { k: '25+', v: 'years living & selling the East Bay' },
  { k: '6', v: 'cities, one trusted neighbor' },
  { k: '24/7', v: 'every call & text answered by AI' },
  { k: '<1s', v: 'time to a live answer, day or night' },
];

export default function StatsStrip() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
      <div className="grid grid-cols-2 gap-y-8 border-y border-hairline py-10 sm:grid-cols-4 sm:divide-x sm:divide-hairline">
        {STATS.map((s, i) => (
          <motion.div
            key={s.k}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="px-2 sm:px-6"
          >
            <div className="font-display text-4xl font-semibold text-forest sm:text-5xl">{s.k}</div>
            <div className="mt-2 text-sm leading-snug text-muted">{s.v}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
