'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function Section({ id, eyebrow, title, subtitle, children }: SectionProps) {
  return (
    <section id={id} className="relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {eyebrow && (
          <span className="mb-3 inline-block rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-widest text-flame/90">
            {eyebrow}
          </span>
        )}
        <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        {subtitle && <p className="mt-3 max-w-2xl text-base text-white/55">{subtitle}</p>}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: 0.12, ease: 'easeOut' }}
        className="mt-10"
      >
        {children}
      </motion.div>
    </section>
  );
}
