'use client';

import { useState } from 'react';
import { BookingModal } from './BookingModal';

const LINKS = [
  { href: '#economics', label: 'Economics' },
  { href: '#flow', label: 'AI Flow' },
  { href: '#scenarios', label: 'Scenarios' },
  { href: '#demo', label: 'Try It' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-void/60 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="font-display text-lg font-bold tracking-tight text-white">
            JURIS<span className="bg-gradient-to-r from-cyanAI to-violetAI bg-clip-text text-transparent"> AI</span>
            <span className="ml-2 hidden text-xs font-normal text-white/40 sm:inline">Real Estate</span>
          </a>
          <div className="hidden items-center gap-7 md:flex">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-white/60 transition hover:text-white">
                {l.label}
              </a>
            ))}
          </div>
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg bg-gradient-to-r from-cyanAI to-violetAI px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110"
          >
            Book a Live Demo
          </button>
        </nav>
      </header>
      <BookingModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
