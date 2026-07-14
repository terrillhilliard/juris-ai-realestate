'use client';

import { useEffect, useState } from 'react';
import { openVoiceAgent } from '@/lib/voiceWidget';
import { SparkIcon } from '@/components/ui/icons';

const LINKS = [
  { href: '#services', label: 'Services' },
  { href: '#mortgage', label: 'Payment calculator' },
  { href: '#neighborhoods', label: 'Neighborhoods' },
  { href: '#about', label: 'About Laurie' },
  { href: '#reviews', label: 'Reviews' },
];

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-hairline bg-paper/85 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a href="#top" className="font-display text-xl font-semibold tracking-tight text-ink">
          Laurie Wotus
        </a>
        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted transition hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>
        <button
          onClick={() => openVoiceAgent()}
          className="inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white transition hover:bg-forestDeep"
        >
          <SparkIcon className="h-3.5 w-3.5" />
          Talk to Ellie
        </button>
      </nav>
    </header>
  );
}
