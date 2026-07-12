'use client';

import { useState } from 'react';
/* eslint-disable @next/next/no-img-element */
import { BookingModal } from './BookingModal';
import { BRAND } from '@/lib/brand';

const LINKS = [
  { href: '#services', label: 'Buy · Sell · Invest' },
  { href: '#markets', label: 'Neighborhoods' },
  { href: '#mortgage', label: 'Mortgage Calculator' },
  { href: '#about', label: 'About Laurie' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-void/70 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <a href="#top" className="flex items-center">
            <img src={BRAND.assets.logoWhite} alt={BRAND.agent} className="h-8 w-auto sm:h-9" />
          </a>
          <div className="hidden items-center gap-6 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-white/60 transition hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg bg-gradient-to-r from-kwred to-kwdark px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Work with Laurie
          </button>
        </nav>
      </header>
      <BookingModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
