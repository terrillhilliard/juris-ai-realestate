'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { CTAButton } from '@/components/ui/CTAButton';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

export function BookingModal({ open, onClose }: BookingModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Mock async booking call — swap for a real scheduler (Calendly, etc.).
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 1200);
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
                  <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-positive/15 text-2xl">
                    ✓
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white">Demo requested</h3>
                  <p className="mt-2 text-sm text-white/55">
                    Our team will reach out within one business day to schedule your live walkthrough.
                  </p>
                  <CTAButton variant="secondary" className="mt-6" onClick={close}>
                    Close
                  </CTAButton>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-xl font-semibold text-white">Book a live demo</h3>
                  <p className="mt-1 text-sm text-white/50">
                    See JURIS AI answer, qualify, and book real estate leads in real time.
                  </p>
                  <form onSubmit={submit} className="mt-6 space-y-4">
                    <input
                      required
                      placeholder="Full name"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-cyanAI/50"
                    />
                    <input
                      required
                      type="email"
                      placeholder="Work email"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-cyanAI/50"
                    />
                    <input
                      placeholder="Brokerage / team name"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-cyanAI/50"
                    />
                    <CTAButton type="submit" className="w-full" disabled={sending}>
                      {sending ? 'Requesting…' : 'Request demo'}
                    </CTAButton>
                  </form>
                </>
              )}
            </GlassPanel>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
