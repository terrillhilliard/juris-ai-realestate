/**
 * Bridge to the ElevenLabs ConvAI widget — the live AI voice agent.
 * The widget renders its own floating launcher; this opens it
 * programmatically so page CTAs can start a voice session directly.
 */
export function openVoiceAgent(): boolean {
  const el = document.querySelector('elevenlabs-convai');
  if (!el) return false;
  // The launcher button lives in the widget's shadow root.
  const btn = el.shadowRoot?.querySelector('button');
  if (btn instanceof HTMLElement) {
    btn.click();
    return true;
  }
  // Fallback: some builds respond to a click on the host element.
  (el as HTMLElement).click();
  return true;
}
