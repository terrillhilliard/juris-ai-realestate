'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { computeMortgage } from '@/lib/mortgage';

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
                   [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_12px_2px_rgba(232,50,63,0.7)]"
        style={{
          background: `linear-gradient(90deg,#E8323F ${pct}%,rgba(255,255,255,0.12) ${pct}%)`,
        }}
      />
    </div>
  );
}

export default function MortgageCalculator() {
  const [price, setPrice] = useState(975_000); // Pleasant Hill median
  const [downPct, setDownPct] = useState(0.2);
  const [rate, setRate] = useState(6.25);
  const [term, setTerm] = useState<15 | 30>(30);

  const m = useMemo(
    () => computeMortgage({ price, downPct, ratePct: rate, termYears: term }),
    [price, downPct, rate, term],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <GlassPanel elevation="raised" className="p-6 sm:p-8">
        <h3 className="mb-6 text-lg font-semibold text-white">Estimate your payment</h3>
        <div className="space-y-7">
          <Slider
            label="Home price"
            value={price}
            min={400_000}
            max={3_000_000}
            step={5_000}
            onChange={setPrice}
            format={usd}
          />
          <Slider
            label="Down payment"
            value={downPct}
            min={0.03}
            max={0.5}
            step={0.01}
            onChange={setDownPct}
            format={(v) => `${Math.round(v * 100)}% · ${usd(price * v)}`}
          />
          <Slider
            label="Interest rate"
            value={rate}
            min={4}
            max={9}
            step={0.05}
            onChange={setRate}
            format={(v) => `${v.toFixed(2)}%`}
          />
          <div>
            <div className="mb-2 text-sm text-white/60">Loan term</div>
            <div className="grid grid-cols-2 gap-2">
              {([30, 15] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTerm(t)}
                  className={`rounded-xl border py-2.5 text-sm font-semibold transition ${
                    term === t
                      ? 'border-white/60 bg-white/[0.14] text-paper'
                      : 'border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.08]'
                  }`}
                >
                  {t}-year fixed
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassPanel>

      <GlassPanel elevation="floating" glow className="flex flex-col justify-between p-6 sm:p-8">
        <div>
          <span className="text-sm uppercase tracking-widest text-white/50">
            Estimated monthly payment
          </span>
          <motion.div
            key={Math.round(m.monthlyTotal)}
            initial={{ opacity: 0.4, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 bg-gradient-to-br from-white to-white/60 bg-clip-text font-mono text-5xl font-bold text-transparent sm:text-6xl"
          >
            {usd(m.monthlyTotal)}
          </motion.div>
          <span className="text-sm text-white/40">/month</span>
        </div>

        <div className="mt-8 space-y-2.5">
          {[
            ['Principal & interest', m.monthlyPI],
            ['Property tax (est.)', m.monthlyTax],
            ['Home insurance (est.)', m.monthlyInsurance],
          ].map(([label, val]) => (
            <div key={label as string} className="flex justify-between rounded-lg bg-white/[0.04] px-4 py-2.5 text-sm">
              <span className="text-white/55">{label as string}</span>
              <span className="font-mono font-semibold text-white">{usd(val as number)}</span>
            </div>
          ))}
          <div className="flex justify-between rounded-lg border border-white/25 bg-white/[0.07] px-4 py-2.5 text-sm">
            <span className="text-white/70">Loan amount</span>
            <span className="font-mono font-semibold text-paper">{usd(m.loanAmount)}</span>
          </div>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-white/35">
          Estimates only — not a quote or financial advice. Laurie can connect you with trusted
          local lenders for real numbers.
        </p>
      </GlassPanel>
    </div>
  );
}
