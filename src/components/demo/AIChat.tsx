'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { getAIReply } from '@/lib/services/chat';

interface Msg {
  role: 'user' | 'ai';
  text: string;
}

const OPENER: Msg = {
  role: 'ai',
  text: "Hi! I'm Ava, Summit Realty's AI assistant. Are you looking to buy, sell, or invest?",
};

export default function AIChat() {
  const [messages, setMessages] = useState<Msg[]>([OPENER]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || typing) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text }]);
    setTyping(true);
    const reply = await getAIReply(text);
    setTyping(false);
    setMessages((m) => [...m, { role: 'ai', text: reply.text }]);
  };

  return (
    <GlassPanel elevation="floating" className="flex flex-col p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-cyanAI to-violetAI text-lg font-bold text-slate-950">
          A
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-white">Chat with Ava</h3>
          <span className="flex items-center gap-1.5 text-xs text-positive">
            <span className="h-1.5 w-1.5 rounded-full bg-positive" /> Online · replies instantly
          </span>
        </div>
      </div>

      <div ref={scrollRef} className="h-64 space-y-2.5 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-[88%] rounded-xl px-3.5 py-2 text-sm ${
                m.role === 'ai'
                  ? 'bg-gradient-to-br from-cyanAI/20 to-violetAI/20 text-white'
                  : 'ml-auto bg-white/[0.07] text-white/80'
              }`}
            >
              {m.text}
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <div className="flex w-16 items-center gap-1 rounded-xl bg-cyanAI/10 px-3.5 py-2.5">
            {[0, 1, 2].map((d) => (
              <span
                key={d}
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyanAI"
                style={{ animationDelay: `${d * 0.15}s` }}
              />
            ))}
          </div>
        )}
      </div>

      <form onSubmit={send} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. I want to book a showing…"
          className="flex-1 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-cyanAI/50"
        />
        <button
          type="submit"
          disabled={typing || !input.trim()}
          className="rounded-xl bg-gradient-to-r from-cyanAI to-violetAI px-5 font-semibold text-slate-950 transition hover:brightness-110 disabled:opacity-40"
        >
          ↑
        </button>
      </form>
    </GlassPanel>
  );
}
