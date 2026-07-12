'use client';

import { useState } from 'react';
/* eslint-disable @next/next/no-img-element */
import { BookingModal } from './BookingModal';
import { BRAND } from '@/lib/brand';

/**
 * Minimalist floating top bar — no menu. The center-screen assistant is the
 * navigation; this bar carries only identity and one action.
 */
export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-4 z-50 px-4">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between rounded-full border border-white/12 bg-ink/70 px-5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:px-6">
          <a href="#top" className="flex items-center gap-3">
            <img src={BRAND.assets.logoWhite} alt={BRAND.agent} className="h-7 w-auto" />
          </a>
          <div className="hidden items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/40 sm:flex">
            {BRAND.tagline}
          </div>
          <button
            onClick={() => setOpen(true)}
            className="rounded-full bg-gradient-to-r from-flame to-royal px-4 py-2 text-xs font-semibold text-paper transition hover:brightness-110"
          >
            Work with Laurie
          </button>
        </div>
      </header>
      <BookingModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
