'use client';

/* eslint-disable @next/next/no-img-element */
import { motion } from 'framer-motion';
import ChatCard from './ChatCard';
import { CTAButton } from '@/components/ui/CTAButton';
import { PhoneIcon, CalendarIcon } from '@/components/ui/icons';
import { BRAND } from '@/lib/brand';
import { openVoiceAgent } from '@/lib/voiceWidget';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

export default function HeroSection() {
  return (
    <section id="top" className="mx-auto w-full max-w-6xl px-5 pb-8 pt-28 sm:px-8 sm:pt-32">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left — message */}
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-forest/[0.07] px-3.5 py-1.5 text-xs font-semibold text-forest"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
            ELLIE IS ONLINE · ANSWERS 24/7
          </motion.span>

          <motion.p
            variants={item}
            className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-muted"
          >
            Work with Laurie · {BRAND.brokerage}
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-3 font-display text-[2.6rem] font-semibold leading-[1.04] tracking-tight text-ink [text-wrap:balance] sm:text-6xl"
          >
            East Bay real estate,{' '}
            <span className="italic text-forest">one conversation</span> away.
          </motion.h1>

          <motion.p variants={item} className="mt-5 max-w-md text-base leading-relaxed text-muted">
            Don&apos;t browse. Just ask. {BRAND.assistant} answers, qualifies, books — and takes you
            anywhere on this page.
          </motion.p>

          <motion.div variants={item} className="mt-7 flex flex-wrap items-center gap-3">
            <CTAButton onClick={() => openVoiceAgent()}>
              <PhoneIcon className="h-4 w-4" />
              Speak with Ellie
            </CTAButton>
            <a href={BRAND.calendlyUrl} target="_blank" rel="noreferrer">
              <CTAButton variant="secondary">
                <CalendarIcon className="h-4 w-4" />
                Schedule with Laurie
              </CTAButton>
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-8 flex items-center gap-3">
            <img
              src={BRAND.assets.headshot}
              alt={BRAND.agent}
              className="h-11 w-11 rounded-full border border-hairline object-cover object-top"
            />
            <div className="text-sm leading-tight">
              <div className="font-semibold text-ink">
                {BRAND.agent} <span className="font-normal text-muted">· {BRAND.title}</span>
              </div>
              <div className="text-xs text-muted">
                answered 24/7 by {BRAND.assistant}, her AI assistant
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right — Ellie card */}
        <ChatCard />
      </div>
    </section>
  );
}
