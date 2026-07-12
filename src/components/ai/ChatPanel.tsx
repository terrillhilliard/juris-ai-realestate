'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BRAND } from '@/lib/brand';
import {
  INITIAL_STATE,
  nextTurn,
  OPENER,
  withTyping,
  type ChatState,
} from '@/lib/services/chat';

interface Msg {
  role: 'user' | 'ai';
  text: string;
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<Msg[]>([{ role: 'ai', text: OPENER.text }]);
  const [quickReplies, setQuickReplies] = useState<string[]>(OPENER.quickReplies);
  const [chatState, setChatState] = useState<ChatState>(INITIAL_STATE);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = async (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || typing) return;
    setInput('');
    setQuickReplies([]);
    setMessages((m) => [...m, { role: 'user', text }]);
    setTyping(true);

    const result = nextTurn(chatState, text);
    await withTyping(null, result.typingMs);

    setTyping(false);
    setChatState(result.state);
    setMessages((m) => [...m, { role: 'ai', text: result.reply }]);
    setQuickReplies(result.quickReplies);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void send();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center gap-2.5">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-kwred to-kwdark text-sm font-bold text-white">
          {BRAND.assistant[0]}
        </div>
        <div>
          <div className="text-sm font-semibold text-white">
            {BRAND.assistant} · Text {BRAND.agent.split(' ')[0]}&apos;s team
          </div>
          <span className="flex items-center gap-1.5 text-[11px] text-positive">
            <span className="h-1.5 w-1.5 rounded-full bg-positive" /> Online · replies in seconds, 24/7
          </span>
        </div>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-[90%] whitespace-pre-line rounded-xl px-3 py-2 text-[13px] leading-relaxed ${
                m.role === 'ai'
                  ? 'bg-gradient-to-br from-kwred/25 to-kwdark/25 text-white'
                  : 'ml-auto bg-white/[0.07] text-white/80'
              }`}
            >
              {m.text}
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <div className="flex w-14 items-center gap-1 rounded-xl bg-kwred/15 px-3 py-2">
            {[0, 1, 2].map((d) => (
              <span
                key={d}
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-kwrose"
                style={{ animationDelay: `${d * 0.15}s` }}
              />
            ))}
          </div>
        )}
      </div>

      {quickReplies.length > 0 && !typing && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {quickReplies.map((q) => (
            <button
              key={q}
              onClick={() => void send(q)}
              className="rounded-full border border-kwred/40 bg-kwred/[0.08] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-kwred/[0.18]"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Text Ellie anything…"
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-kwred/60"
        />
        <button
          type="submit"
          disabled={typing || !input.trim()}
          className="rounded-xl bg-gradient-to-r from-kwred to-kwdark px-4 font-semibold text-white transition hover:brightness-110 disabled:opacity-40"
        >
          ↑
        </button>
      </form>
      <p className="mt-2 text-center text-[10px] text-white/30">
        {BRAND.assistant} qualifies &amp; books only — no legal or financial advice
      </p>
    </div>
  );
}
