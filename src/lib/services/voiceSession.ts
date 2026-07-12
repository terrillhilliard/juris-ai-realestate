import type { VoiceTurn } from '@/lib/types';

export interface ScriptStep extends VoiceTurn {
  delayMs: number;
  stage: 'answer' | 'qualify' | 'book' | 'handoff';
}

export const CALL_SCRIPT: ScriptStep[] = [
  {
    stage: 'answer',
    role: 'ai',
    delayMs: 400,
    at: 0,
    text: "Thanks for calling Laurie Wotus at Keller Williams East Bay — this is Ellie, Laurie's AI assistant. How can I help you today?",
  },
  {
    stage: 'answer',
    role: 'caller',
    delayMs: 1400,
    at: 0,
    text: 'Hi, I saw the listing on Gregory Lane in Pleasant Hill and wanted to set up a showing.',
  },
  {
    stage: 'qualify',
    role: 'ai',
    delayMs: 1200,
    at: 0,
    text: 'Great choice — that one is getting a lot of interest. Are you pre-approved for financing, and what timeline are you working with?',
  },
  {
    stage: 'qualify',
    role: 'caller',
    delayMs: 1500,
    at: 0,
    text: "We're pre-approved up to nine hundred thousand, and we'd love to be in before the school year.",
  },
  {
    stage: 'book',
    role: 'ai',
    delayMs: 1200,
    at: 0,
    text: 'Perfect. Laurie has Thursday at 5:30 or Saturday at 11am open for that property — which works better?',
  },
  {
    stage: 'book',
    role: 'caller',
    delayMs: 1200,
    at: 0,
    text: 'Saturday at 11 works great.',
  },
  {
    stage: 'handoff',
    role: 'ai',
    delayMs: 1200,
    at: 0,
    text: "You're all set — I've texted you the confirmation and let Laurie know. She'll meet you at the property Saturday at 11. Anything else I can help with?",
  },
];

/** Async generator streaming turns with realistic pacing. Abortable. */
export async function* runVoiceSession(signal?: AbortSignal): AsyncGenerator<ScriptStep> {
  for (const step of CALL_SCRIPT) {
    await new Promise((res) => setTimeout(res, step.delayMs));
    if (signal?.aborted) return;
    yield { ...step, at: Date.now() };
  }
}

/**
 * Speak a turn via the Web Speech API. Resolves when the utterance finishes
 * (or immediately if TTS is unavailable). Caller is responsible for
 * speechSynthesis.cancel() on abort.
 */
export function speakTurn(step: ScriptStep, voices: SpeechSynthesisVoice[]): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }
    const u = new SpeechSynthesisUtterance(step.text);
    const en = voices.filter((v) => v.lang.startsWith('en'));
    if (step.role === 'ai') {
      // Prefer a female-sounding voice for Ellie.
      u.voice =
        en.find((v) => /female|zira|aria|jenny|samantha|susan/i.test(v.name)) ?? en[0] ?? null;
      u.pitch = 1.05;
      u.rate = 1.04;
    } else {
      u.voice =
        en.find((v) => /male|david|guy|mark|daniel/i.test(v.name)) ??
        en[1] ??
        en[0] ??
        null;
      u.pitch = 0.92;
      u.rate = 1.0;
    }
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}
