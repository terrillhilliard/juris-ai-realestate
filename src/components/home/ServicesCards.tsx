'use client';

import { motion } from 'framer-motion';
import { GlassPanel } from '@/components/ui/GlassPanel';

const SERVICES = [
  {
    id: 'buy',
    icon: '🏠',
    title: 'Buy a Home',
    color: '#FF5A6E',
    blurb:
      'From first-time buyers to move-up families, Laurie guides you through her proven 8-step buying process — search, tour, offer, close.',
    points: ['First-time buyer specialist', 'Neighborhood-level expertise', 'Offer strategy that wins'],
    cta: 'Start my search',
  },
  {
    id: 'sell',
    icon: '💰',
    title: 'Sell Your Home',
    color: '#C8A26A',
    blurb:
      'Pricing, staging, and marketing that gets East Bay homes sold — a 7-step selling plan built on 25+ years of local comps and buyers.',
    points: ['Free pricing consultation', 'Staging guidance included', 'Listed fast, marketed everywhere'],
    cta: "What's my home worth?",
  },
  {
    id: 'invest',
    icon: '📈',
    title: 'Invest in Real Estate',
    color: '#4ade80',
    blurb:
      'Fix & flip, fix & hold, and underwater property strategies — Laurie helps investors find the East Bay numbers that actually pencil.',
    points: ['Fix & flip sourcing', 'Rental / hold analysis', '1031 exchange timelines'],
    cta: 'Talk strategy',
  },
] as const;

export default function ServicesCards({ onCTA }: { onCTA: (service: string) => void }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {SERVICES.map((s, i) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
        >
          <GlassPanel elevation="raised" interactive className="flex h-full flex-col p-6">
            <span className="text-3xl">{s.icon}</span>
            <h3 className="mt-4 font-display text-xl font-semibold text-white">{s.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">{s.blurb}</p>
            <ul className="mt-4 space-y-1.5">
              {s.points.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-white/70">
                  <span style={{ color: s.color }}>✓</span> {p}
                </li>
              ))}
            </ul>
            <button
              onClick={() => onCTA(s.id)}
              className="mt-5 w-full rounded-xl border border-white/15 bg-white/[0.05] py-2.5 text-sm font-semibold text-white transition hover:border-kwred/50 hover:bg-kwred/[0.12]"
            >
              {s.cta} →
            </button>
          </GlassPanel>
        </motion.div>
      ))}
    </div>
  );
}
