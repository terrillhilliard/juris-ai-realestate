'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const AGENT_ID = 'agent_5801kxb282y8ffe8zdnd6p1m2cwr';
const SCRIPT_SRC = 'https://unpkg.com/@elevenlabs/convai-widget-embed';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function MicIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" />
      <path d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V21a1 1 0 1 0 2 0v-3.08A7 7 0 0 0 19 11Z" />
    </svg>
  );
}

/**
 * Green microphone launcher for the live ElevenLabs voice agent.
 * Replaces the widget's default "Start a call" bubble: nothing renders until
 * the mic (or any "Speak with Ellie" CTA) is tapped, then the ConvAI widget
 * mounts on demand and the call starts with its native in-call controls.
 */
export default function VoiceMicButton() {
  const [live, setLive] = useState(false);
  const liveRef = useRef(false);
  const hostRef = useRef<HTMLDivElement>(null);

  const cleanup = useCallback(() => {
    liveRef.current = false;
    setLive(false);
    const host = hostRef.current;
    if (host) host.innerHTML = '';
  }, []);

  const start = useCallback(async () => {
    if (liveRef.current) return;
    liveRef.current = true;
    setLive(true);

    if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      const s = document.createElement('script');
      s.src = SCRIPT_SRC;
      s.async = true;
      s.type = 'text/javascript';
      document.body.appendChild(s);
    }

    const host = hostRef.current;
    if (!host) return;
    let el = host.querySelector('elevenlabs-convai') as HTMLElement | null;
    if (!el) {
      el = document.createElement('elevenlabs-convai');
      el.setAttribute('agent-id', AGENT_ID);
      host.appendChild(el);
      // Best-effort: return to the mic when the call ends.
      ['elevenlabs-convai:call-ended', 'elevenlabs-convai:disconnect', 'convai:call-ended', 'end'].forEach(
        (ev) => el!.addEventListener(ev, cleanup),
      );
    }

    // The widget upgrades asynchronously — click its start control once ready.
    for (let i = 0; i < 50; i++) {
      await sleep(150);
      const btn = (el as HTMLElement & { shadowRoot?: ShadowRoot }).shadowRoot?.querySelector('button');
      if (btn instanceof HTMLElement) {
        btn.click();
        return;
      }
    }
  }, [cleanup]);

  // All "Speak with Ellie" / "Talk to Ellie" CTAs route here.
  useEffect(() => {
    const onStart = () => void start();
    window.addEventListener('ellie:voice', onStart);
    return () => window.removeEventListener('ellie:voice', onStart);
  }, [start]);

  return (
    <>
      {/* On-demand ConvAI mount point (bottom-right, native in-call UI) */}
      <div ref={hostRef} className="fixed bottom-5 right-5 z-[80]" />

      {!live && (
        <button
          onClick={() => void start()}
          aria-label="Speak with Ellie — start a voice call"
          className="group fixed bottom-5 right-5 z-[81] grid h-14 w-14 place-items-center rounded-full bg-forest text-white shadow-[0_12px_30px_-10px_rgba(28,107,82,0.7)] transition hover:bg-forestDeep active:scale-95"
        >
          <span className="absolute inset-0 rounded-full bg-forest/40 opacity-0 transition group-hover:animate-ping group-hover:opacity-100" />
          <MicIcon className="relative h-6 w-6" />
        </button>
      )}
    </>
  );
}
