'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Hero3D from '@/components/hero/Hero3D';
import EconomicsCalculator from '@/components/economics/EconomicsCalculator';
import AIFlowVisualizer from '@/components/flow/AIFlowVisualizer';
import ScenarioCards from '@/components/scenarios/ScenarioCards';
import DemoActions from '@/components/demo/DemoActions';
import { Navbar } from '@/components/layout/Navbar';
import { Section } from '@/components/layout/Section';
import { BookingModal } from '@/components/layout/BookingModal';
import { CTAButton } from '@/components/ui/CTAButton';

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <main id="top">
      <Navbar />

      {/* Hero / Command Center */}
      <section className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-32 sm:px-8 sm:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center"
        >
          <span className="mb-5 inline-block rounded-full border border-cyanAI/25 bg-cyanAI/[0.07] px-4 py-1.5 text-xs uppercase tracking-widest text-cyanAI">
            AI Intake for Real Estate
          </span>
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Never Miss Another{' '}
            <span className="bg-gradient-to-r from-cyanAI via-violetAI to-gold bg-clip-text text-transparent">
              Real Estate Lead.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-white/55 sm:text-lg">
            Every call answered, every lead captured, every showing booked — automatically.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <CTAButton onClick={() => document.getElementById('flow')?.scrollIntoView({ behavior: 'smooth' })}>
              ▶ Watch AI Work a Lead
            </CTAButton>
            <CTAButton variant="secondary" onClick={() => setBookingOpen(true)}>
              Book a Live Demo
            </CTAButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
          className="mt-14"
        >
          <Hero3D />
          <p className="mt-3 text-center text-xs text-white/35">
            Each building is a lead stream — hover to see what missed calls are costing it.
          </p>
        </motion.div>
      </section>

      {/* Missed Call Economics */}
      <Section
        id="economics"
        eyebrow="Missed Call Economics"
        title="What is every missed call actually costing you?"
        subtitle="One transaction is worth $5,000–$20,000. One client is worth $15,000–$80,000 over their lifetime — and refers 3.1 more. Slide to see your leakage."
      >
        <EconomicsCalculator />
      </Section>

      {/* Agentic AI Flow */}
      <Section
        id="flow"
        eyebrow="Agentic AI Flow"
        title="Watch the AI work a lead end-to-end"
        subtitle="Call, SMS, or web form — the AI answers instantly, qualifies the lead, books the appointment, and hands off warm to your agent."
      >
        <AIFlowVisualizer />
      </Section>

      {/* Scenarios */}
      <Section
        id="scenarios"
        eyebrow="Real Estate Scenarios"
        title="Built for how real estate leads actually arrive"
        subtitle="After-hours portal inquiries, Sunday referral calls, 6am investor texts — the AI handles each one the way your best ISA would."
      >
        <ScenarioCards />
      </Section>

      {/* Try the AI */}
      <Section
        id="demo"
        eyebrow="Try It Yourself"
        title="Experience the AI right now"
        subtitle="Dial the mock line or open the chat — both run the same intake engine your leads would talk to."
      >
        <DemoActions />
      </Section>

      {/* Final CTA */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-24 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyanAI/[0.12] via-violetAI/[0.08] to-gold/[0.1] p-10 text-center backdrop-blur-xl sm:p-16"
        >
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold text-white sm:text-4xl">
            Your next $80,000 client is calling. Who&apos;s answering?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/55">
            Deploy JURIS AI on your existing number in days — no new phone system, no new CRM.
          </p>
          <div className="mt-8">
            <CTAButton onClick={() => setBookingOpen(true)}>Book a Live Demo</CTAButton>
          </div>
        </motion.div>
        <footer className="mt-14 flex flex-col items-center gap-2 text-center text-xs text-white/30">
          <span>© 2026 JURIS AI · Demo site — all data, names, and metrics are illustrative.</span>
          <span>Built with Next.js, Three.js & React Three Fiber.</span>
        </footer>
      </section>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </main>
  );
}
