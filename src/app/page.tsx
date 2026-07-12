'use client';

import { useState } from 'react';
/* eslint-disable @next/next/no-img-element */
import { motion } from 'framer-motion';
import EastBayMap from '@/components/home/EastBayMap';
import ChatHero, { PhoneIcon } from '@/components/ai/ChatHero';
import ChatFAB from '@/components/ai/ChatFAB';
import ElevenLabsWidget from '@/components/ai/ElevenLabsWidget';
import ServicesRows from '@/components/home/ServicesRows';
import MortgageCalculator from '@/components/home/MortgageCalculator';
import AboutLaurie from '@/components/about/AboutLaurie';
import { Navbar } from '@/components/layout/Navbar';
import { Section } from '@/components/layout/Section';
import { BookingModal } from '@/components/layout/BookingModal';
import { CTAButton } from '@/components/ui/CTAButton';
import { BRAND } from '@/lib/brand';
import { openVoiceAgent } from '@/lib/voiceWidget';

function SmsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM8 11H6V9h2v2Zm5 0h-2V9h2v2Zm5 0h-2V9h2v2Z" />
    </svg>
  );
}

const STATS = [
  { k: '25+', v: 'years living & selling the East Bay' },
  { k: '6', v: 'cities, one trusted neighbor' },
  { k: '24/7', v: 'every call & text answered by AI' },
  { k: '<1s', v: 'time to a live answer, day or night' },
] as const;

export default function Home() {
  const [consult, setConsult] = useState(false);

  return (
    <main id="top">
      <Navbar />

      {/* Hero — the conversation IS the interface */}
      <section className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-4 pb-16 pt-28 sm:px-8">
        {/* Spatial orbs */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="orb left-[6%] top-[16%] h-56 w-56 bg-royal/10" />
          <div
            className="orb right-[8%] top-[42%] h-72 w-72 bg-white/[0.06]"
            style={{ animationDelay: '-4s' }}
          />
          <div
            className="orb bottom-[6%] left-[30%] h-48 w-48 bg-white/[0.05]"
            style={{ animationDelay: '-7s' }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            {BRAND.agent} · {BRAND.brokerage}
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-paper sm:text-6xl">
            East Bay real estate,
            <br />
            one conversation away.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/55">
            Don&apos;t browse. Just ask. {BRAND.assistant} answers, qualifies, books — and takes
            you anywhere on this page.
          </p>
          <div className="mt-8 flex items-center justify-center gap-5">
            {/* Live call — animated dial icon */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => openVoiceAgent()}
                aria-label="Call and speak with the AI voice agent"
                title="Speak with the AI — live"
                className="relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-flame to-royal text-paper shadow-[0_10px_36px_-8px_rgba(232,50,63,0.75)] transition hover:brightness-110 active:scale-95"
              >
                <span className="call-pulse absolute inset-0 rounded-full border border-flame/60" />
                <span
                  className="call-pulse absolute inset-0 rounded-full border border-flame/40"
                  style={{ animationDelay: '0.9s' }}
                />
                <PhoneIcon className="animate-ring h-6 w-6" />
              </button>
              <span className="text-xs font-medium text-white/60">Call the AI</span>
            </div>

            {/* Text — SMS icon */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() =>
                  window.dispatchEvent(new CustomEvent('ellie:ask', { detail: '' }))
                }
                aria-label="Text the AI assistant instead"
                title="Text instead"
                className="grid h-16 w-16 place-items-center rounded-full border border-white/20 bg-white/[0.05] text-paper backdrop-blur-md transition hover:border-white/40 hover:bg-white/[0.1] active:scale-95"
              >
                <SmsIcon className="h-6 w-6" />
              </button>
              <span className="text-xs font-medium text-white/60">Text instead</span>
            </div>
          </div>
        </motion.div>

        {/* Laurie — the human behind the assistant */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          className="mt-12 flex flex-col items-center"
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-flame/40 to-transparent blur-md" />
            <img
              src={BRAND.assets.headshot}
              alt={`${BRAND.agent}, ${BRAND.brokerage}`}
              className="relative h-24 w-24 rounded-full border border-white/20 object-cover object-top shadow-2xl sm:h-28 sm:w-28"
            />
            <span className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-ink bg-flame">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-paper" />
            </span>
          </div>
          <p className="mt-3 text-sm font-semibold text-paper">{BRAND.agent}</p>
          <p className="text-xs text-white/45">
            {BRAND.title} · answered 24/7 by {BRAND.assistant}, her AI assistant
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
          className="mt-8"
        >
          <ChatHero />
        </motion.div>
      </section>

      {/* Stats — text-heavy, high contrast */}
      <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.k} className="group bg-ink p-7 transition-colors hover:bg-white/[0.03] sm:p-9">
              <div className="font-mono text-4xl font-bold text-paper sm:text-5xl">{s.k}</div>
              <div className="mt-2 text-sm leading-snug text-white/50">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services — editorial rows */}
      <Section
        id="services"
        eyebrow="Services"
        title="Buy. Sell. Invest."
        subtitle="Full-time representation, from first showing to final signature. Every path starts with a conversation."
      >
        <ServicesRows />
      </Section>

      {/* Mortgage calculator */}
      <Section
        id="mortgage"
        eyebrow="Plan the numbers"
        title="What would your monthly payment look like?"
        subtitle="Slide to explore. When you want real quotes, Laurie connects you with trusted local lenders."
      >
        <MortgageCalculator />
      </Section>

      {/* Markets — interactive East Bay map */}
      <Section
        id="markets"
        eyebrow="Neighborhoods"
        title="Six cities. One neighbor."
        subtitle="Laurie's corner of Contra Costa County, from the Carquinez Strait to Mt. Diablo. Tap any city and Ellie picks up the conversation."
      >
        <EastBayMap />
      </Section>

      {/* About + testimonial */}
      <Section
        id="about"
        eyebrow="Meet Laurie"
        title="A neighbor first, a realtor second"
        subtitle="Laurie works, shops, hikes, and volunteers in the same East Bay communities she sells in."
      >
        <AboutLaurie />
      </Section>

      {/* Contact */}
      <section id="contact" className="mx-auto w-full max-w-6xl px-5 pb-28 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="edge-light relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center backdrop-blur-xl sm:p-16"
        >
          <h2 className="mx-auto max-w-3xl font-display text-3xl font-semibold leading-tight text-paper sm:text-5xl">
            Ready when you are.
            <br />
            Day or night.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-white/55">
            Call or text {BRAND.phoneDisplay} anytime — {BRAND.assistant} answers instantly,
            qualifies your needs, and gets you on Laurie&apos;s calendar. No voicemail. Ever.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <CTAButton onClick={() => openVoiceAgent()} className="flex items-center gap-2.5">
              <PhoneIcon className="h-4 w-4" />
              Speak with the AI
            </CTAButton>
            <CTAButton variant="secondary" onClick={() => setConsult(true)}>
              Request a consult
            </CTAButton>
          </div>
          <div className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-1.5 text-sm text-white/45">
            <span className="font-semibold text-white/70">
              {BRAND.agent} · {BRAND.title}
            </span>
            <span>{BRAND.brokerage}</span>
            <span>{BRAND.office}</span>
            <img
              src={BRAND.assets.kwLogo}
              alt={BRAND.brokerage}
              className="mt-3 h-8 w-auto opacity-70"
            />
          </div>
        </motion.div>

        <footer className="mt-14 flex flex-col items-center gap-2 text-center text-xs text-white/30">
          <span>
            Concept demonstration by{' '}
            <a
              href="https://jurisai.dev"
              target="_blank"
              rel="noreferrer"
              className="text-white/50 underline-offset-2 hover:underline"
            >
              JURIS AI
            </a>{' '}
            — website + AI voice &amp; SMS intake. Contact details, market data, and metrics are
            illustrative.
          </span>
          <span>
            The AI assistant qualifies inquiries and books appointments only — it does not provide
            legal or financial advice. Not affiliated with or endorsed by Keller Williams Realty.
          </span>
          <span>Each office independently owned and operated. Equal Housing Opportunity.</span>
        </footer>
      </section>

      <ChatFAB />
      <ElevenLabsWidget />
      <BookingModal open={consult} onClose={() => setConsult(false)} />
    </main>
  );
}
