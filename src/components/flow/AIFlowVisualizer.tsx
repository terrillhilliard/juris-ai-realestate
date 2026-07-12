'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { runVoiceSession, type ScriptStep } from '@/lib/services/voiceSession';

type Stage = ScriptStep['stage'];

const NODES: { id: Stage; label: string; sub: string; color: string }[] = [
  { id: 'answer', label: 'AI Answers', sub: 'Voice · SMS · Web', color: '#6ee7ff' },
  { id: 'qualify', label: 'Qualifies', sub: 'Budget · Timeline', color: '#8b7bff' },
  { id: 'book', label: 'Books', sub: 'Showing / consult', color: '#c8a26a' },
  { id: 'handoff', label: 'Hands to Agent', sub: 'Warm transfer', color: '#4ade80' },
];

export default function AIFlowVisualizer() {
  const [running, setRunning] = useState(false);
  const [stage, setStage] = useState<Stage | null>(null);
  const [turns, setTurns] = useState<ScriptStep[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const start = async () => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setTurns([]);
    setStage(null);
    setRunning(true);
    for await (const step of runVoiceSession(ctrl.signal)) {
      setStage(step.stage);
      setTurns((t) => [...t, step]);
    }
    if (!ctrl.signal.aborted) setRunning(false);
  };

  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      {/* Flow graph */}
      <GlassPanel elevation="raised" className="p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">Live lead</span>
          <span className="text-sm text-white/50">Incoming buyer · portal lead</span>
        </div>

        <div className="flex flex-col gap-3">
          {NODES.map((n, i) => {
            const active = stage === n.id;
            const done = NODES.findIndex((x) => x.id === stage) > i;
            return (
              <motion.div
                key={n.id}
                animate={{
                  scale: active ? 1.04 : 1,
                  borderColor: active ? n.color : 'rgba(255,255,255,0.1)',
                }}
                className="flex items-center justify-between rounded-xl border bg-white/[0.04] px-4 py-3"
                style={{ boxShadow: active ? `0 0 24px -4px ${n.color}` : 'none' }}
              >
                <div>
                  <div className="font-semibold text-white">{n.label}</div>
                  <div className="text-xs text-white/45">{n.sub}</div>
                </div>
                <span
                  className="grid h-7 w-7 place-items-center rounded-full text-xs font-bold"
                  style={{
                    background: done || active ? n.color : 'rgba(255,255,255,0.08)',
                    color: done || active ? '#04121a' : '#fff',
                  }}
                >
                  {done ? '✓' : i + 1}
                </span>
              </motion.div>
            );
          })}
        </div>

        <button
          onClick={start}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyanAI to-violetAI py-3 font-semibold text-slate-950 transition hover:opacity-90 disabled:opacity-50"
          disabled={running}
        >
          {running ? 'AI working the lead…' : '▶ Watch AI work a lead'}
        </button>
      </GlassPanel>

      {/* Transcript */}
      <GlassPanel elevation="floating" glow className="flex flex-col p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-positive" />
          <span className="text-sm text-white/60">Live transcript</span>
        </div>
        <div ref={scrollRef} className="h-72 space-y-3 overflow-y-auto pr-2">
          <AnimatePresence initial={false}>
            {turns.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  t.role === 'ai'
                    ? 'ml-auto bg-gradient-to-br from-cyanAI/20 to-violetAI/20 text-white'
                    : 'bg-white/[0.06] text-white/80'
                }`}
              >
                <span className="mb-0.5 block text-[10px] uppercase tracking-wider text-white/40">
                  {t.role === 'ai' ? 'Ava · JURIS AI' : 'Caller'}
                </span>
                {t.text}
              </motion.div>
            ))}
          </AnimatePresence>
          {turns.length === 0 && (
            <p className="grid h-full place-items-center text-center text-sm text-white/30">
              Press &ldquo;Watch AI work a lead&rdquo; to run a simulated intake call.
            </p>
          )}
        </div>
        {stage === 'handoff' && !running && (
          <div className="mt-4 rounded-xl border border-positive/30 bg-positive/[0.08] p-3 text-sm text-white/80">
            ✓ Showing booked · Sat 11:00am · Agent Dana Whitfield · est. lifetime value{' '}
            <span className="font-semibold text-gold">$40,000+</span>
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
