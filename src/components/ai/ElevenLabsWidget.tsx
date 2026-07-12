'use client';

import { createElement, useEffect } from 'react';

const AGENT_ID = 'agent_5801kxb282y8ffe8zdnd6p1m2cwr';
const SCRIPT_SRC = 'https://unpkg.com/@elevenlabs/convai-widget-embed';

/**
 * Live AI voice agent (ElevenLabs ConvAI). Renders the widget host element
 * and injects the embed script once on the client.
 */
export default function ElevenLabsWidget() {
  useEffect(() => {
    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;
    const s = document.createElement('script');
    s.src = SCRIPT_SRC;
    s.async = true;
    s.type = 'text/javascript';
    document.body.appendChild(s);
  }, []);

  // Custom element — createElement avoids JSX intrinsic typing for web components.
  return createElement('elevenlabs-convai', { 'agent-id': AGENT_ID });
}
