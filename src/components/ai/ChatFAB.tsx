'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BRAND } from '@/lib/brand';

/**
 * Appears once the visitor scrolls past the hero assistant. One tap returns
 * the conversation to center screen — the assistant stays the primary nav.
 */
export default function ChatFAB() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('assistant');
    if (!hero) return;
    const obs = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting), {
      threshold: 0.05,
    });
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  const backToChat = () => {
    window.dispatchEvent(new CustomEvent('ellie:ask', { detail: '' }));
    document.getElementById('assistant')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          onClick={backToChat}
          aria-label={`Back to ${BRAND.assistant}, your AI assistant`}
          className="fixed bottom-5 left-5 z-[90] flex items-center gap-2.5 rounded-full bg-paper py-3 pl-4 pr-5 text-sm font-semibold text-ink shadow-[0_16px_50px_-12px_rgba(255,255,255,0.45)] transition hover:bg-white"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink/40" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ink" />
          </span>
          Ask {BRAND.assistant}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
