'use client';

import { useState } from 'react';
/* eslint-disable @next/next/no-img-element */
import { motion } from 'framer-motion';
import Hero3D from '@/components/hero/Hero3D';
import ServicesCards from '@/components/home/ServicesCards';
import MortgageCalculator from '@/components/home/MortgageCalculator';
import AboutLaurie from '@/components/about/AboutLaurie';
import FloatingAI from '@/components/ai/FloatingAI';
import { Navbar } from '@/components/layout/Navbar';
import { Section } from '@/components/layout/Section';
import { BookingModal } from '@/components/layout/BookingModal';
import { CTAButton } from '@/components/ui/CTAButton';
import { BRAND } from '@/lib/brand';

export default function Home() {
  const [consult, setConsult] = useState<{ open: boolean; service?: string }>({ open: false });

  const openConsult = (service?: string) => setConsult({ open: true, service });

  return (
    <main id="top">
      <Navbar />

      {/* Hero */}
      <section className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-32 sm:px-8 sm:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center"
        >
          <span className="mb-5 inline-block rounded-full border border-gold/30 bg-gold/[0.07] px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-gold">
            {BRAND.tagline}
          </span>
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Your East Bay Home,{' '}
            <span className="bg-gradient-to-r from-kwrose via-kwred to-gold bg-clip-text text-transparent">
              Found.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-white/55 sm:text-lg">
            {BRAND.yearsInEastBay} years living and working in the {BRAND.region}. Buy, sell, or
            invest with an agent whose promise is simple: your interests supersede her own.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <CTAButton onClick={() => openConsult('buy')}>🏠 Find my home</CTAButton>
            <CTAButton variant="secondary" onClick={() => openConsult('sell')}>
              What&apos;s my home worth?
            </CTAButton>
          </div>
          <p className="mt-5 text-sm text-white/40">
            Or just call or text — <span className="text-kwrose">{BRAND.assistant}</span>,
            Laurie&apos;s AI assistant, answers instantly, 24/7 ↘
          </p>
        </motion.div>

        <motion.div
          id="markets"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
          className="mt-14 scroll-mt-24"
        >
          <Hero3D />
          <p className="mt-3 text-center text-xs text-white/35">
            Laurie&apos;s East Bay — hover a building to explore each market (illustrative data)
          </p>
        </motion.div>
      </section>

      {/* Services */}
      <Section
        id="services"
        eyebrow="How can Laurie help?"
        title="Buy. Sell. Invest. All of it, done right."
        subtitle="Full-time realtor, full-service representation — from first showings to final signatures."
      >
        <ServicesCards onCTA={(s) => openConsult(s)} />
      </Section>

      {/* Mortgage calculator */}
      <Section
        id="mortgage"
        eyebrow="Plan Your Purchase"
        title="What would your monthly payment look like?"
        subtitle="Slide to explore. When you're ready for real numbers, Laurie connects you with trusted local lenders."
      >
        <MortgageCalculator />
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

      {/* Contact / final CTA */}
      <section id="contact" className="mx-auto w-full max-w-6xl px-5 pb-28 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-kwred/[0.14] via-kwdark/[0.08] to-gold/[0.1] p-10 text-center backdrop-blur-xl sm:p-16"
        >
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold text-white sm:text-4xl">
            Ready when you are — day or night.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/55">
            Call or text {BRAND.phoneDisplay} anytime. {BRAND.assistant} answers instantly,
            qualifies your needs, and gets you on Laurie&apos;s calendar — no voicemail, ever.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <CTAButton onClick={() => openConsult()}>Request a consult</CTAButton>
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
              className="mt-3 h-8 w-auto opacity-80"
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
          <span>Each office independently owned and operated. 🏠 Equal Housing Opportunity.</span>
        </footer>
      </section>

      <FloatingAI />
      <BookingModal
        open={consult.open}
        service={consult.service}
        onClose={() => setConsult({ open: false })}
      />
    </main>
  );
}
