'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GlassPanel } from '@/components/ui/GlassPanel';
import VoicePanel, { PhoneIcon } from './VoicePanel';
import { BRAND } from '@/lib/brand';
import {
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

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
    </svg>
  );
}

/**
 * Center-screen conversational interface — the primary way to navigate the
 * page. Ellie answers, qualifies, books, and scrolls the visitor to any
 * section on request. Voice mode lives behind the phone toggle.
 */
export default function ChatHero() {
  const [mode, setMode] = useState<'chat' | 'voice'>('chat');
  const [messages, setMessages] = useState<Msg[]>([{ role: 'ai', text: OPENER.text }]);
  const [quickReplies, setQuickReplies] = useState<string[]>(OPENER.quickReplies);
  const [chatState, setChatState] = useState<ChatState>(INITIAL_STATE);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);

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

      // Conversational navigation first — chip prompts always navigate;
      // free text navigates only when not mid-qualification.
      const isChipPrompt = NAV_CHIPS.some((c) => c.prompt === text);
      const navOk =
        isChipPrompt || chatState.stage === 'intent' || chatState.stage === 'booked' || chatState.stage === 'open';
      const nav = navOk ? detectNav(text) : undefined;

      if (nav) {
        await withTyping(null, 800);
        document.getElementById(nav.sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTyping(false);
        setMessages((m) => [...m, { role: 'ai', text: nav.reply }]);
        setQuickReplies(
          chatState.stage === 'intent' ? OPENER.quickReplies : [],
        );
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

  // Sections can hand the conversation a prompt: window "ellie:ask" event.
  useEffect(() => {
    const onAsk = (e: Event) => {
      const prompt = (e as CustomEvent<string>).detail;
      setMode('chat');
      document.getElementById('assistant')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        void send(prompt);
        inputRef.current?.focus();
      }, 450);
    };
    window.addEventListener('ellie:ask', onAsk);
    return () => window.removeEventListener('ellie:ask', onAsk);
  }, [send]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void send();
  };

  return (
    <GlassPanel
      elevation="floating"
      glow
      className="mx-auto w-full max-w-2xl"
      id="assistant"
    >
      <div className="flex h-[540px] flex-col p-5 sm:h-[560px] sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-paper text-lg font-bold text-ink">
              {BRAND.assistant[0]}
            </div>
            <div>
              <div className="font-display text-base font-semibold text-paper">
                {BRAND.assistant} — {BRAND.assistantTagline}
              </div>
              <span className="flex items-center gap-1.5 text-xs text-white/50">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-paper" />
                Online · answers instantly, 24/7
              </span>
            </div>
          </div>
          <div className="flex gap-1.5 rounded-full border border-white/12 bg-white/[0.04] p-1">
            <button
              onClick={() => setMode('chat')}
              aria-label="Chat with Ellie"
              className={`grid h-8 w-8 place-items-center rounded-full transition ${
                mode === 'chat' ? 'bg-paper text-ink' : 'text-white/50 hover:text-white'
              }`}
            >
              <ChatIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMode('voice')}
              aria-label="Call Ellie, AI voice agent"
              className={`grid h-8 w-8 place-items-center rounded-full transition ${
                mode === 'voice' ? 'bg-paper text-ink' : 'text-white/50 hover:text-white'
              }`}
            >
              <PhoneIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {mode === 'voice' ? (
          <div className="min-h-0 flex-1 pt-4">
            <VoicePanel />
          </div>
        ) : (
          <>
            {/* Messages */}
            <div ref={scrollRef} className="min-h-0 flex-1 space-y-2.5 overflow-y-auto py-4 pr-1">
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === 'ai'
                        ? 'border border-white/10 bg-white/[0.06] text-paper'
                        : 'ml-auto bg-paper text-ink'
                    }`}
                  >
                    {m.text}
                  </motion.div>
                ))}
              </AnimatePresence>
              {typing && (
                <div className="flex w-16 items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-paper"
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
                    className="rounded-full border border-white/25 bg-white/[0.06] px-3.5 py-1.5 text-xs font-medium text-paper transition hover:bg-white/[0.14]"
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
                className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm text-paper placeholder-white/35 outline-none transition focus:border-white/40"
              />
              <button
                type="submit"
                disabled={typing || !input.trim()}
                className="rounded-xl bg-paper px-5 font-semibold text-ink transition hover:bg-white disabled:opacity-40"
              >
                ↑
              </button>
            </form>

            {/* Persistent nav — the chatbot is the menu */}
            <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1.5 border-t border-white/10 pt-3">
              {NAV_CHIPS.map((c) => (
                <button
                  key={c.label}
                  onClick={() => void send(c.prompt)}
                  className="text-xs text-white/45 underline-offset-4 transition hover:text-paper hover:underline"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </GlassPanel>
  );
}
