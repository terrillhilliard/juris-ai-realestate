'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import VoicePanel, { PhoneIcon } from './VoicePanel';
import ChatPanel from './ChatPanel';
import { BRAND } from '@/lib/brand';

type Widget = 'voice' | 'chat' | null;

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Zm-9 9H7V9h4v2Zm6 0h-4V9h4v2Z" />
    </svg>
  );
}

/**
 * Floating AI launcher — the JURIS AI layer on Laurie's site.
 * Voice agent + SMS chat, bottom-right, like a real intake widget.
 */
export default function FloatingAI() {
  const [open, setOpen] = useState<Widget>(null);
  const [hintDismissed, setHintDismissed] = useState(false);

  const toggle = (w: Exclude<Widget, null>) => {
    setHintDismissed(true);
    setOpen((cur) => (cur === w ? null : w));
  };

  return (
    <div className="fixed bottom-5 right-5 z-[90] flex flex-col items-end gap-3">
      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key={open}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="flex h-[480px] w-[min(370px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#141016]/95 p-4 shadow-[0_24px_70px_-18px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
          >
            <button
              onClick={() => setOpen(null)}
              className="absolute right-3 top-3 z-10 grid h-7 w-7 place-items-center rounded-full bg-white/[0.06] text-white/50 transition hover:bg-white/[0.12] hover:text-white"
              aria-label="Close"
            >
              ✕
            </button>
            {open === 'voice' ? <VoicePanel /> : <ChatPanel />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint pill */}
      {!open && !hintDismissed && (
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2 }}
          className="rounded-full border border-white/10 bg-[#141016]/90 px-4 py-2 text-xs text-white/75 shadow-lg backdrop-blur-xl"
        >
          👋 Questions? {BRAND.assistant} answers 24/7 — call or text
        </motion.div>
      )}

      {/* Launchers */}
      <div className="flex items-center gap-3">
        <motion.button
          onClick={() => toggle('chat')}
          whileTap={{ scale: 0.92 }}
          aria-label={`Text ${BRAND.assistant}, AI SMS chat`}
          className={`relative grid h-14 w-14 place-items-center rounded-full border transition ${
            open === 'chat'
              ? 'border-kwred/60 bg-kwred/20'
              : 'border-white/12 bg-[#141016]/90 hover:border-white/25'
          } shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] backdrop-blur-xl`}
        >
          <ChatIcon className="h-6 w-6 text-white" />
          <span className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full border-2 border-[#141016] bg-positive" />
        </motion.button>

        <motion.button
          onClick={() => toggle('voice')}
          whileTap={{ scale: 0.92 }}
          aria-label={`Call ${BRAND.assistant}, AI voice agent`}
          className="relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-kwred to-kwdark shadow-[0_0_44px_-8px_rgba(206,1,31,0.85)] transition hover:brightness-110"
        >
          {open !== 'voice' && (
            <span className="absolute inset-0 animate-ping rounded-full bg-kwred/25" />
          )}
          <PhoneIcon className="h-7 w-7 text-white" />
        </motion.button>
      </div>
    </div>
  );
}
