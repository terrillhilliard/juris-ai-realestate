'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { runVoiceSession, type ScriptStep } from '@/lib/services/voiceSession';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

type CallState = 'idle' | 'dialing' | 'in_call' | 'ended';

export default function PhoneKeypad() {
  const [dialed, setDialed] = useState('');
  const [state, setState] = useState<CallState>('idle');
  const [turns, setTurns] = useState<ScriptStep[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (state !== 'in_call') return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [state]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const press = (k: string) => {
    if (state !== 'idle') return;
    setDialed((d) => (d.length < 14 ? d + k : d));
  };

  const call = async () => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setState('dialing');
    setTurns([]);
    setElapsed(0);
    await new Promise((r) => setTimeout(r, 1400));
    if (ctrl.signal.aborted) return;
    setState('in_call');
    for await (const step of runVoiceSession(ctrl.signal)) {
      setTurns((t) => [...t, step]);
    }
    if (!ctrl.signal.aborted) setState('ended');
  };

  const hangUp = () => {
    abortRef.current?.abort();
    setState('idle');
    setDialed('');
    setTurns([]);
  };

  const mmss = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;

  return (
    <GlassPanel elevation="floating" className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-white">Call the AI</h3>
        {state === 'in_call' && (
          <span className="flex items-center gap-2 font-mono text-sm text-positive">
            <span className="h-2 w-2 animate-pulse rounded-full bg-positive" /> {mmss}
          </span>
        )}
      </div>

      {state === 'idle' && (
        <>
          <div className="mb-4 grid h-12 place-items-center rounded-xl bg-white/[0.04] font-mono text-xl tracking-widest text-white">
            {dialed || <span className="text-white/25">(555) 014-2800</span>}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {KEYS.map((k) => (
              <button
                key={k}
                onClick={() => press(k)}
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] py-3.5 font-mono text-lg text-white transition hover:border-cyanAI/40 hover:bg-white/[0.08] active:scale-95"
              >
                {k}
              </button>
            ))}
          </div>
          <button
            onClick={call}
            className="mt-4 w-full rounded-xl bg-positive/90 py-3.5 font-semibold text-slate-950 transition hover:bg-positive"
          >
            📞 Call Summit Realty
          </button>
        </>
      )}

      {state === 'dialing' && (
        <div className="grid h-72 place-items-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 animate-pulse rounded-full bg-gradient-to-br from-cyanAI to-violetAI opacity-80" />
            <p className="text-white/70">Ringing…</p>
            <p className="mt-1 text-xs text-white/40">AI answers in under 2 rings</p>
          </div>
        </div>
      )}

      {(state === 'in_call' || state === 'ended') && (
        <>
          <div className="h-64 space-y-2.5 overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {turns.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[88%] rounded-xl px-3.5 py-2 text-sm ${
                    t.role === 'ai'
                      ? 'bg-gradient-to-br from-cyanAI/20 to-violetAI/20 text-white'
                      : 'ml-auto bg-white/[0.07] text-white/80'
                  }`}
                >
                  {t.text}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <button
            onClick={hangUp}
            className="mt-4 w-full rounded-xl bg-danger/90 py-3 font-semibold text-white transition hover:bg-danger"
          >
            {state === 'ended' ? 'Call ended — reset' : 'End call'}
          </button>
        </>
      )}
    </GlassPanel>
  );
}
