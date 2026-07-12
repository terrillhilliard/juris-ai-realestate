'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { annualLeakage, ECONOMICS } from '@/lib/economics';

const usd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label className="text-sm text-white/60">{label}</label>
        <span className="font-mono text-base font-semibold text-white">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full outline-none
                   [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white
                   [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_12px_2px_rgba(110,231,255,0.7)]"
        style={{
          background: `linear-gradient(90deg,#6ee7ff ${pct}%,rgba(255,255,255,0.12) ${pct}%)`,
        }}
      />
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-lg bg-white/[0.04] p-3">
      <div className="text-xs text-white/45">{label}</div>
      <div className="mt-1 font-mono text-xl font-semibold" style={{ color: accent ?? '#fff' }}>
        {value}
      </div>
    </div>
  );
}

export default function EconomicsCalculator() {
  const [monthlyCalls, setMonthlyCalls] = useState(160);
  const [missedPct, setMissedPct] = useState(0.42);
  const [conversion, setConversion] = useState(0.18);

  const r = useMemo(
    () => annualLeakage({ monthlyCalls, missedPct, conversion }),
    [monthlyCalls, missedPct, conversion],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <GlassPanel elevation="raised" className="p-6 sm:p-8">
        <h3 className="mb-6 text-lg font-semibold text-white">Your inputs</h3>
        <div className="space-y-7">
          <Slider
            label="Monthly inbound calls"
            value={monthlyCalls}
            min={20}
            max={600}
            step={5}
            onChange={setMonthlyCalls}
            format={(v) => String(v)}
          />
          <Slider
            label="% of calls missed"
            value={missedPct}
            min={0.05}
            max={0.8}
            step={0.01}
            onChange={setMissedPct}
            format={(v) => `${Math.round(v * 100)}%`}
          />
          <Slider
            label="Lead → client conversion"
            value={conversion}
            min={0.05}
            max={0.5}
            step={0.01}
            onChange={setConversion}
            format={(v) => `${Math.round(v * 100)}%`}
          />
        </div>
        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-3 text-center">
            <div className="font-mono text-sm font-semibold text-gold">$5k–$20k</div>
            <div className="mt-1 text-[11px] text-white/40">per transaction</div>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-3 text-center">
            <div className="font-mono text-sm font-semibold text-gold">$15k–$80k</div>
            <div className="mt-1 text-[11px] text-white/40">lifetime value</div>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-3 text-center">
            <div className="font-mono text-sm font-semibold text-gold">3.1×</div>
            <div className="mt-1 text-[11px] text-white/40">referrals / client</div>
          </div>
        </div>
        <p className="mt-6 text-xs leading-relaxed text-white/40">
          Model: {usd(ECONOMICS.lifetime.mid)} avg lifetime value + {ECONOMICS.referralsPerClient}{' '}
          referrals per happy client at {Math.round(ECONOMICS.referralConversion * 100)}% referral
          conversion.
        </p>
      </GlassPanel>

      <GlassPanel elevation="floating" glow className="flex flex-col justify-between p-6 sm:p-8">
        <div>
          <span className="text-sm uppercase tracking-widest text-danger">
            Annual revenue leaking away
          </span>
          <motion.div
            key={r.annualLeakage}
            initial={{ opacity: 0.4, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 bg-gradient-to-br from-[#ff8a8a] to-[#ff5b5b] bg-clip-text font-mono text-5xl font-bold text-transparent sm:text-6xl"
          >
            {usd(r.annualLeakage)}
          </motion.div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <Stat label="Missed calls / yr" value={r.missedPerYear.toLocaleString()} />
          <Stat label="Lost clients / yr" value={r.lostClients.toLocaleString()} />
          <Stat label="Lost referrals / yr" value={r.lostReferrals.toLocaleString()} />
          <Stat label="Recoverable with AI" value={usd(r.recoverable)} accent="#4ade80" />
        </div>

        <div className="mt-8 rounded-xl border border-positive/25 bg-positive/[0.07] p-4">
          <p className="text-sm text-white/80">
            JURIS AI answers every one of those calls instantly — recovering an estimated{' '}
            <span className="font-semibold text-positive">{usd(r.recoverable)}</span> per year.
          </p>
        </div>
      </GlassPanel>
    </div>
  );
}
