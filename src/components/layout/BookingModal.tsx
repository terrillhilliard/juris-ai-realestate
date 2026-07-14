'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CTAButton } from '@/components/ui/CTAButton';
import { BRAND } from '@/lib/brand';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  service?: string;
}

export function BookingModal({ open, onClose, service }: BookingModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 1100);
  };

  const close = () => {
    onClose();
    setTimeout(() => setSubmitted(false), 300);
  };

  const field =
    'w-full rounded-xl border border-hairline bg-paper px-4 py-3 text-sm text-ink placeholder-muted outline-none transition focus:border-forest/50';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-ink/50 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-hairline bg-card p-6 shadow-[0_40px_90px_-40px_rgba(22,26,23,0.5)] sm:p-8"
          >
            {submitted ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-forest/10 text-2xl text-forest">
                  ✓
                </div>
                <h3 className="font-display text-2xl font-semibold text-ink">Request received</h3>
                <p className="mt-2 text-sm text-muted">
                  Laurie will reach out shortly. Want an answer right now? {BRAND.assistant} can help
                  24/7 — tap Talk to Ellie anytime.
                </p>
                <CTAButton variant="secondary" className="mt-6" onClick={close}>
                  Close
                </CTAButton>
              </div>
            ) : (
              <>
                <h3 className="font-display text-2xl font-semibold text-ink">Work with Laurie</h3>
                <p className="mt-1 text-sm text-muted">
                  Tell us a little about your plans — buying, selling, or investing in the East Bay.
                </p>
                <form onSubmit={submit} className="mt-6 space-y-3.5">
                  <input required placeholder="Full name" className={field} />
                  <input required type="tel" placeholder="Phone number" className={field} />
                  <select defaultValue={service ?? ''} required className={field}>
                    <option value="" disabled>
                      I&apos;m looking to…
                    </option>
                    <option value="buy">Buy a home</option>
                    <option value="sell">Sell my home</option>
                    <option value="invest">Invest</option>
                  </select>
                  <select defaultValue="" className={field}>
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
                <p className="mt-3 text-center text-[11px] text-muted">
                  Demo form — submissions are simulated
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
