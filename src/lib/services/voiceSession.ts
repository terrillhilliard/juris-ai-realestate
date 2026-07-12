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
    text: 'Thanks for calling Summit Realty — this is Ava, the AI intake assistant. How can I help?',
  },
  {
    stage: 'answer',
    role: 'caller',
    delayMs: 1600,
    at: 0,
    text: 'Hi, I saw the listing on Maple Street and wanted to schedule a viewing.',
  },
  {
    stage: 'qualify',
    role: 'ai',
    delayMs: 1400,
    at: 0,
    text: 'Great choice. Are you pre-approved for financing, and what timeline are you working with?',
  },
  {
    stage: 'qualify',
    role: 'caller',
    delayMs: 1800,
    at: 0,
    text: 'Pre-approved up to 650k, hoping to buy within 60 days.',
  },
  {
    stage: 'book',
    role: 'ai',
    delayMs: 1400,
    at: 0,
    text: 'Perfect — I have Thursday 5:30pm or Saturday 11am open with agent Dana Whitfield.',
  },
  {
    stage: 'book',
    role: 'caller',
    delayMs: 1500,
    at: 0,
    text: 'Saturday 11am works.',
  },
  {
    stage: 'handoff',
    role: 'ai',
    delayMs: 1300,
    at: 0,
    text: 'Booked — confirmation texted to you now. Dana will meet you at 14 Maple St. Anything else?',
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
