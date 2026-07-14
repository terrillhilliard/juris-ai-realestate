'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { computeMortgage } from '@/lib/mortgage';

const usd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function DarkSlider({
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
        <span className="text-sm text-white/60">{label}</span>
        <span className="font-mono text-sm font-semibold text-white">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-orchid w-full"
        style={{
          background: `linear-gradient(90deg,#33967C ${pct}%,rgba(255,255,255,0.14) ${pct}%)`,
        }}
      />
    </div>
  );
}

export default function PaymentCalculator() {
  const [price, setPrice] = useState(975_000);
  const [downPct, setDownPct] = useState(0.2);
  const [rate, setRate] = useState(6.25);
  const [term, setTerm] = useState<15 | 30>(30);

  const m = useMemo(
    () => computeMortgage({ price, downPct, ratePct: rate, termYears: term }),
    [price, downPct, rate, term],
  );

  return (
    <section id="mortgage" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="max-w-xl"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">
          Plan the numbers
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
          What would your monthly payment look like?
        </h2>
        <p className="mt-3 text-base text-muted">
          Slide to explore. When you want real quotes, Laurie connects you with trusted local
          lenders.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {/* Result — cream card */}
        <div>
          <div className="rounded-3xl border border-hairline bg-card p-7 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Estimated monthly payment
            </p>
            <motion.div
              key={Math.round(m.monthlyTotal)}
              initial={{ opacity: 0.5, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 font-display text-6xl font-semibold text-forest"
            >
              {usd(m.monthlyTotal)}
              <span className="ml-1 align-middle text-base font-normal text-muted">/month</span>
            </motion.div>

            <div className="mt-7 space-y-3 border-t border-hairline pt-5 text-sm">
              {[
                ['Principal & interest', m.monthlyPI],
                ['Property tax (est.)', m.monthlyTax],
                ['Home insurance (est.)', m.monthlyInsurance],
              ].map(([label, val]) => (
                <div key={label as string} className="flex justify-between">
                  <span className="text-muted">{label as string}</span>
                  <span className="font-mono font-semibold text-ink">{usd(val as number)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-hairline pt-3">
                <span className="text-ink/70">Loan amount</span>
                <span className="font-mono font-semibold text-ink">{usd(m.loanAmount)}</span>
              </div>
            </div>
          </div>
          <p className="mt-3 px-1 text-xs leading-relaxed text-muted">
            Estimates only — not a quote or financial advice. Laurie can connect you with trusted
            local lenders for real numbers.
          </p>
        </div>

        {/* Inputs — dark card */}
        <div className="rounded-3xl bg-night p-7 sm:p-8">
          <h3 className="font-display text-xl font-semibold text-white">Estimate your payment</h3>
          <div className="mt-6 space-y-6">
            <DarkSlider label="Home price" value={price} min={400_000} max={3_000_000} step={5_000}
              onChange={setPrice} format={usd} />
            <DarkSlider label="Down payment" value={downPct} min={0.03} max={0.5} step={0.01}
              onChange={setDownPct} format={(v) => `${Math.round(v * 100)}% · ${usd(price * v)}`} />
            <DarkSlider label="Interest rate" value={rate} min={4} max={9} step={0.05}
              onChange={setRate} format={(v) => `${v.toFixed(2)}%`} />
            <div>
              <div className="mb-2 text-sm text-white/60">Loan term</div>
              <div className="grid grid-cols-2 gap-2">
                {([30, 15] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTerm(t)}
                    className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                      term === t
                        ? 'bg-forest text-white'
                        : 'border border-white/15 bg-white/[0.04] text-white/60 hover:bg-white/[0.08]'
                    }`}
                  >
                    {t}-year fixed
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
