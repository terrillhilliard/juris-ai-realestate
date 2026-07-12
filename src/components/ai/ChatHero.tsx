'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { BRAND } from '@/lib/brand';
import { openVoiceAgent } from '@/lib/voiceWidget';
import {
  cityInfoTurn,
  detectNav,
  INITIAL_STATE,
  NAV_CHIPS,
  nextTurn,
  OPENER,
  withTyping,
  type ChatState,
} from '@/lib/services/chat';

interface Msg {
  role: 'user' | 'ai';
  text: string;
}

export function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
    </svg>
  );
}

const hasFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(pointer: fine)').matches;

/**
 * Center-screen conversational interface with spatial pointer tilt.
 * Ellie answers, qualifies, books, and navigates the page; the phone
 * button starts a LIVE voice session via the ElevenLabs agent.
 */
export default function ChatHero() {
  const [messages, setMessages] = useState<Msg[]>([{ role: 'ai', text: OPENER.text }]);
  const [quickReplies, setQuickReplies] = useState<string[]>(OPENER.quickReplies);
  const [chatState, setChatState] = useState<ChatState>(INITIAL_STATE);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [voiceHint, setVoiceHint] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);

  // Spatial tilt — the panel leans toward the pointer.
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 18 });
  const sry = useSpring(ry, { stiffness: 120, damping: 18 });

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!hasFinePointer()) return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 7);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 5);
  };
  const onPointerLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = useCallback(
    async (raw?: string) => {
      const text = (raw ?? input).trim();
      if (!text || busyRef.current) return;
      busyRef.current = true;
      setInput('');
      setQuickReplies([]);
      setMessages((m) => [...m, { role: 'user', text }]);
      setTyping(true);

      // City Q&A from the map ("Tell me about Walnut Creek") takes priority.
      const cityTurn = cityInfoTurn(chatState, text);
      if (cityTurn) {
        await withTyping(null, cityTurn.typingMs);
        setTyping(false);
        setChatState(cityTurn.state);
        setMessages((m) => [...m, { role: 'ai', text: cityTurn.reply }]);
        setQuickReplies(cityTurn.quickReplies);
        busyRef.current = false;
        return;
      }

      const isChipPrompt = NAV_CHIPS.some((c) => c.prompt === text);
      const navOk =
        isChipPrompt ||
        chatState.stage === 'intent' ||
        chatState.stage === 'booked' ||
        chatState.stage === 'open';
      const nav = navOk ? detectNav(text) : undefined;

      if (nav) {
        await withTyping(null, 800);
        document
          .getElementById(nav.sectionId)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTyping(false);
        setMessages((m) => [...m, { role: 'ai', text: nav.reply }]);
        setQuickReplies(chatState.stage === 'intent' ? OPENER.quickReplies : []);
        busyRef.current = false;
        return;
      }

      const result = nextTurn(chatState, text);
      await withTyping(null, result.typingMs);
      setTyping(false);
      setChatState(result.state);
      setMessages((m) => [...m, { role: 'ai', text: result.reply }]);
      setQuickReplies(result.quickReplies);
      busyRef.current = false;
    },
    [chatState, input],
  );

  // Sections can hand the conversation a prompt via the "ellie:ask" event.
  useEffect(() => {
    const onAsk = (e: Event) => {
      const prompt = (e as CustomEvent<string>).detail;
      document
        .getElementById('assistant')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        if (prompt) void send(prompt);
        inputRef.current?.focus();
      }, 450);
    };
    window.addEventListener('ellie:ask', onAsk);
    return () => window.removeEventListener('ellie:ask', onAsk);
  }, [send]);

  const startVoice = () => {
    const opened = openVoiceAgent();
    if (!opened) {
      setVoiceHint(true);
      setTimeout(() => setVoiceHint(false), 4000);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void send();
  };

  return (
    <motion.div
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1200 }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="mx-auto w-full max-w-2xl will-change-transform"
    >
      <GlassPanel elevation="floating" glow id="assistant">
        <div className="flex h-[540px] flex-col p-5 sm:h-[560px] sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/[0.08] pb-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-royal to-flame text-lg font-bold text-white shadow-[0_6px_20px_-6px_rgba(155,17,30,0.7)]">
                {BRAND.assistant[0]}
              </div>
              <div>
                <div className="font-display text-base font-semibold text-ink">
                  {BRAND.assistant} — {BRAND.assistantTagline}
                </div>
                <span className="flex items-center gap-1.5 text-xs text-ink/50">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-royal" />
                  Online · answers instantly, 24/7
                </span>
              </div>
            </div>
            <div className="relative">
              <button
                onClick={startVoice}
                aria-label="Speak with the AI voice agent"
                className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-royal to-flame px-4 py-2.5 text-xs font-semibold text-white shadow-[0_8px_24px_-8px_rgba(155,17,30,0.7)] transition hover:brightness-110"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                <PhoneIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Speak with AI</span>
              </button>
              {voiceHint && (
                <div className="absolute right-0 top-12 z-20 w-52 rounded-xl border border-black/10 bg-white p-3 text-xs text-ink/70 shadow-xl">
                  Voice agent is still loading — try again in a moment, or use the voice bubble
                  in the corner.
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="min-h-0 flex-1 space-y-2.5 overflow-y-auto py-4 pr-1">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed backdrop-blur-xl ${
                    m.role === 'ai'
                      ? 'border border-black/[0.07] bg-white/55 text-ink shadow-[0_6px_18px_-10px_rgba(0,0,0,0.25),0_1px_0_0_rgba(255,255,255,0.85)_inset]'
                      : 'ml-auto border border-white/25 bg-gradient-to-br from-royal/90 to-flame/90 text-white shadow-[0_8px_22px_-10px_rgba(155,17,30,0.55),0_1px_0_0_rgba(255,255,255,0.3)_inset]'
                  }`}
                >
                  {m.text}
                </motion.div>
              ))}
            </AnimatePresence>
            {typing && (
              <div className="flex w-16 items-center gap-1 rounded-2xl border border-black/[0.07] bg-white/55 px-4 py-3 shadow-[0_6px_18px_-10px_rgba(0,0,0,0.25),0_1px_0_0_rgba(255,255,255,0.85)_inset] backdrop-blur-xl">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-royal/70"
                    style={{ animationDelay: `${d * 0.15}s` }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Flow quick replies */}
          {quickReplies.length > 0 && !typing && (
            <div className="flex flex-wrap gap-2 pb-3">
              {quickReplies.map((q) => (
                <button
                  key={q}
                  onClick={() => void send(q)}
                  className="rounded-full border border-royal/30 bg-white/50 px-3.5 py-1.5 text-xs font-medium text-royal shadow-[0_4px_14px_-8px_rgba(155,17,30,0.35),0_1px_0_0_rgba(255,255,255,0.8)_inset] backdrop-blur-xl transition hover:border-royal/60 hover:bg-royal/[0.08]"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={onSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything — or say where you want to go…"
              className="min-w-0 flex-1 rounded-xl border border-black/10 bg-white/60 px-4 py-3 text-sm text-ink placeholder-ink/35 shadow-[0_1px_0_0_rgba(255,255,255,0.9)_inset] outline-none backdrop-blur-xl transition focus:border-royal/50 focus:bg-white/80"
            />
            <button
              type="submit"
              disabled={typing || !input.trim()}
              className="rounded-xl bg-gradient-to-r from-royal to-flame px-5 font-semibold text-white transition hover:brightness-110 disabled:opacity-40"
            >
              ↑
            </button>
          </form>

          {/* Persistent nav — the chatbot is the menu */}
          <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1.5 border-t border-black/[0.08] pt-3">
            {NAV_CHIPS.map((c) => (
              <button
                key={c.label}
                onClick={() => void send(c.prompt)}
                className="text-xs text-ink/45 underline-offset-4 transition hover:text-royal hover:underline"
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
