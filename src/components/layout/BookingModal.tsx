'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { CTAButton } from '@/components/ui/CTAButton';
import { BRAND } from '@/lib/brand';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  /** Preselect the service, e.g. from a services card CTA. */
  service?: string;
}

export function BookingModal({ open, onClose, service }: BookingModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Mock async — in production this posts to the CRM / JURIS AI intake.
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 1100);
  };

  const close = () => {
    onClose();
    setTimeout(() => setSubmitted(false), 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <GlassPanel elevation="floating" glow className="p-6 sm:p-8">
              {submitted ? (
                <div className="py-6 text-center">
                  <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-white/15 text-2xl">
                    ✓
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white">
                    Request received!
                  </h3>
                  <p className="mt-2 text-sm text-white/55">
                    Laurie will reach out shortly. Want an answer right now?{' '}
                    {BRAND.assistant} can help 24/7 — tap the phone or chat icon below.
                  </p>
                  <CTAButton variant="secondary" className="mt-6" onClick={close}>
                    Close
                  </CTAButton>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-xl font-semibold text-white">
                    Work with Laurie
                  </h3>
                  <p className="mt-1 text-sm text-white/50">
                    Tell us a little about your plans — buying, selling, or investing in the East
                    Bay.
                  </p>
                  <form onSubmit={submit} className="mt-6 space-y-4">
                    <input
                      required
                      placeholder="Full name"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-white/40"
                    />
                    <input
                      required
                      type="tel"
                      placeholder="Phone number"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-white/40"
                    />
                    <select
                      defaultValue={service ?? ''}
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-white/40 [&>option]:bg-[#141414]"
                    >
                      <option value="" disabled>
                        I&apos;m looking to…
                      </option>
                      <option value="buy">Buy a home</option>
                      <option value="sell">Sell my home</option>
                      <option value="invest">Invest</option>
                    </select>
                    <select
                      defaultValue=""
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-white/40 [&>option]:bg-[#141414]"
                    >
                      <option value="" disabled>
                        Preferred area (optional)
                      </option>
                      {BRAND.markets.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <CTAButton type="submit" className="w-full" disabled={sending}>
                      {sending ? 'Sending…' : 'Request a consult'}
                    </CTAButton>
                  </form>
                  <p className="mt-3 text-center text-[11px] text-white/30">
                    Demo form — submissions are simulated
                  </p>
                </>
              )}
            </GlassPanel>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
