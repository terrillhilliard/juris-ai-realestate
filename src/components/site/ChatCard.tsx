'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BRAND } from '@/lib/brand';
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

/** Ellie's conversation card — the hero's live intake surface. */
export default function ChatCard() {
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

      const isChip = NAV_CHIPS.some((c) => c.prompt === text);
      const navOk =
        isChip ||
        chatState.stage === 'intent' ||
        chatState.stage === 'booked' ||
        chatState.stage === 'open';
      const nav = navOk ? detectNav(text) : undefined;
      if (nav) {
        await withTyping(null, 700);
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

  useEffect(() => {
    const onAsk = (e: Event) => {
      const prompt = (e as CustomEvent<string>).detail;
      document.getElementById('ellie')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        if (prompt) void send(prompt);
        inputRef.current?.focus();
      }, 420);
    };
    window.addEventListener('ellie:ask', onAsk);
    return () => window.removeEventListener('ellie:ask', onAsk);
  }, [send]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void send();
  };

  return (
    <motion.div
      id="ellie"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
      className="flex w-full flex-col overflow-hidden rounded-3xl border border-hairline bg-card shadow-[0_30px_70px_-40px_rgba(22,26,23,0.4)]"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-hairline px-5 py-4">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-forest text-base font-bold text-white">
          {BRAND.assistant[0]}
        </div>
        <div>
          <div className="text-sm font-semibold text-ink">
            {BRAND.assistant} — {BRAND.assistantTagline}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
            Online · answers instantly, 24/7
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-paper/40 p-5 max-h-[320px] min-h-[220px]">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-[88%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                m.role === 'ai'
                  ? 'bg-cream text-ink'
                  : 'ml-auto bg-forest text-white'
              }`}
            >
              {m.text}
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <div className="flex w-14 items-center gap-1 rounded-2xl bg-cream px-3.5 py-2.5">
            {[0, 1, 2].map((d) => (
              <span
                key={d}
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-forest"
                style={{ animationDelay: `${d * 0.15}s` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick replies */}
      {quickReplies.length > 0 && !typing && (
        <div className="flex flex-wrap gap-2 px-5 pb-1 pt-3">
          {quickReplies.map((q) => (
            <button
              key={q}
              onClick={() => void send(q)}
              className="flex-1 rounded-xl bg-forest/[0.08] px-3 py-2 text-[13px] font-semibold text-forest transition hover:bg-forest/[0.14]"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={onSubmit} className="flex items-center gap-2 p-4">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Ellie anything…"
          className="min-w-0 flex-1 rounded-full border border-hairline bg-paper px-4 py-2.5 text-sm text-ink placeholder-muted outline-none transition focus:border-forest/50"
        />
        <button
          type="submit"
          disabled={typing || !input.trim()}
          aria-label="Send"
          className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-forest text-white transition hover:bg-forestDeep disabled:opacity-40"
        >
          ↑
        </button>
      </form>
    </motion.div>
  );
}
