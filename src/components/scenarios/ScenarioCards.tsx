'use client';

import { motion } from 'framer-motion';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { SCENARIOS } from '@/lib/mock/scenarios';

export default function ScenarioCards() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {SCENARIOS.map((s, i) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
        >
          <GlassPanel elevation="raised" interactive className="h-full p-6">
            <div className="flex items-start justify-between">
              <span className="text-3xl">{s.icon}</span>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: `${s.color}20`, color: s.color }}
              >
                {s.leadType.replace('_', ' ')}
              </span>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-white">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/50">{s.situation}</p>
            <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.03] p-3.5">
              <div className="mb-1 text-[10px] uppercase tracking-wider text-cyanAI">
                How JURIS AI handles it
              </div>
              <p className="text-sm leading-relaxed text-white/75">{s.aiResponse}</p>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <div>
                <div className="text-[11px] text-white/40">Speed to booking</div>
                <div className="font-mono font-semibold text-positive">{s.speedToBooking}</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-white/40">Projected LTV</div>
                <div className="font-mono font-semibold text-gold">{s.projectedLTV}</div>
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      ))}
    </div>
  );
}
