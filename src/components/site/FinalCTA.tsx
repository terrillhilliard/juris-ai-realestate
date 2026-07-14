'use client';

import { motion } from 'framer-motion';
import { CTAButton } from '@/components/ui/CTAButton';
import { PhoneIcon } from '@/components/ui/icons';
import { BRAND } from '@/lib/brand';
import { openVoiceAgent } from '@/lib/voiceWidget';

export default function FinalCTA({ onConsult }: { onConsult: () => void }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[2rem] bg-night px-6 py-16 text-center sm:px-10 sm:py-20"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 text-xs font-semibold text-mint">
            <span className="h-1.5 w-1.5 rounded-full bg-mint" />
            No voicemail. Ever.
          </span>
          <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.05] text-white sm:text-6xl">
            Ready when you are. <span className="italic text-mint">Day or night.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-white/60">
            Call or text <span className="font-semibold text-white">{BRAND.phoneDisplay}</span>{' '}
            anytime — {BRAND.assistant} answers instantly, qualifies your needs, and gets you on
            Laurie&apos;s calendar.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <CTAButton onClick={() => openVoiceAgent()}>
              <PhoneIcon className="h-4 w-4" />
              Speak with Ellie
            </CTAButton>
            <CTAButton variant="ghostDark" onClick={onConsult}>
              Request a consult
            </CTAButton>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
