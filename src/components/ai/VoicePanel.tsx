'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BRAND } from '@/lib/brand';
import { CALL_SCRIPT, speakTurn, type ScriptStep } from '@/lib/services/voiceSession';

type CallState = 'idle' | 'dialing' | 'in_call' | 'ended';

export default function VoicePanel() {
  const [state, setState] = useState<CallState>('idle');
  const [audioOn, setAudioOn] = useState(true);
  const [turns, setTurns] = useState<ScriptStep[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [answerMs, setAnswerMs] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state !== 'in_call') return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [state]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns]);

  useEffect(
    () => () => {
      abortRef.current?.abort();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    },
    [],
  );

  const call = async (withAudio: boolean) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setAudioOn(withAudio);
    setState('dialing');
    setTurns([]);
    setElapsed(0);

    const ringStart = performance.now();
    await new Promise((r) => setTimeout(r, 700));
    if (ctrl.signal.aborted) return;
    setAnswerMs(Math.round(performance.now() - ringStart));
    setState('in_call');

    let voices: SpeechSynthesisVoice[] = [];
    if (withAudio && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        await new Promise<void>((res) => {
          const timer = setTimeout(res, 800);
          window.speechSynthesis.onvoiceschanged = () => {
            clearTimeout(timer);
            res();
          };
        });
        voices = window.speechSynthesis.getVoices();
      }
    }

    for (const step of CALL_SCRIPT) {
      await new Promise((r) => setTimeout(r, withAudio ? 350 : step.delayMs));
      if (ctrl.signal.aborted) return;
      setTurns((t) => [...t, { ...step, at: Date.now() }]);
      if (withAudio) {
        await speakTurn(step, voices);
        if (ctrl.signal.aborted) return;
      }
    }
    if (!ctrl.signal.aborted) setState('ended');
  };

  const hangUp = () => {
    abortRef.current?.abort();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setState('idle');
    setTurns([]);
  };

  const mmss = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-kwred to-kwdark text-sm font-bold text-white">
            {BRAND.assistant[0]}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{BRAND.assistant} · AI Voice Agent</div>
            <div className="text-[11px] text-white/45">{BRAND.phoneDisplay} · answers 24/7</div>
          </div>
        </div>
        {state === 'in_call' && (
          <span className="flex items-center gap-1.5 font-mono text-xs text-positive">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-positive" /> {mmss}
          </span>
        )}
      </div>

      {state === 'idle' && (
        <div className="grid flex-1 place-items-center py-6">
          <div className="text-center">
            <motion.button
              onClick={() => call(true)}
              whileTap={{ scale: 0.94 }}
              className="relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-kwred to-kwdark shadow-[0_0_40px_-8px_rgba(206,1,31,0.8)]"
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-kwred/30" />
              <PhoneIcon className="h-8 w-8 text-white" />
            </motion.button>
            <p className="mt-4 text-sm text-white/70">Tap to call {BRAND.assistant}</p>
            <p className="mt-1 text-xs text-white/40">
              Hear a real simulated intake call — she picks up in under a second
            </p>
            <button
              onClick={() => call(false)}
              className="mt-4 text-xs text-white/40 underline-offset-2 hover:text-white/70 hover:underline"
            >
              or run it muted (transcript only)
            </button>
          </div>
        </div>
      )}

      {state === 'dialing' && (
        <div className="grid flex-1 place-items-center py-6">
          <div className="text-center">
            <div className="mx-auto mb-3 h-14 w-14 animate-pulse rounded-full bg-gradient-to-br from-kwred to-kwdark opacity-90" />
            <p className="text-sm text-white/70">Ringing…</p>
          </div>
        </div>
      )}

      {(state === 'in_call' || state === 'ended') && (
        <>
          {answerMs !== null && (
            <div className="mb-2 flex items-center gap-2 rounded-lg border border-positive/25 bg-positive/[0.07] px-3 py-1.5 text-[11px] text-positive">
              ⚡ Answered in {(answerMs / 1000).toFixed(1)}s — no voicemail, no hold
            </div>
          )}
          <div ref={scrollRef} className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {turns.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[90%] rounded-xl px-3 py-2 text-[13px] leading-relaxed ${
                    t.role === 'ai'
                      ? 'bg-gradient-to-br from-kwred/25 to-kwdark/25 text-white'
                      : 'ml-auto bg-white/[0.07] text-white/80'
                  }`}
                >
                  <span className="mb-0.5 block text-[9px] uppercase tracking-wider text-white/40">
                    {t.role === 'ai' ? BRAND.assistant : 'You'}
                  </span>
                  {t.text}
                </motion.div>
              ))}
            </AnimatePresence>
            {state === 'in_call' && audioOn && (
              <div className="flex items-center gap-1.5 px-1 py-1">
                {[0, 1, 2, 3, 4].map((b) => (
                  <span
                    key={b}
                    className="w-1 animate-pulse rounded-full bg-kwrose"
                    style={{ height: `${7 + (b % 3) * 5}px`, animationDelay: `${b * 0.12}s` }}
                  />
                ))}
                <span className="ml-2 text-[10px] text-white/40">live audio</span>
              </div>
            )}
          </div>
          <button
            onClick={hangUp}
            className="mt-3 w-full rounded-xl bg-danger/90 py-2.5 text-sm font-semibold text-white transition hover:bg-danger"
          >
            {state === 'ended' ? 'Call ended — reset' : 'End call'}
          </button>
        </>
      )}
    </div>
  );
}

export function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
    </svg>
  );
}
