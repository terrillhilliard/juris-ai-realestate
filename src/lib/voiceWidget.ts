/**
 * Starts the live ElevenLabs voice agent. All "Speak with Ellie" /
 * "Talk to Ellie" CTAs call this; the VoiceMicButton listens for the
 * event and mounts + starts the ConvAI widget on demand.
 */
export function openVoiceAgent(): boolean {
  if (typeof window === 'undefined') return false;
  window.dispatchEvent(new CustomEvent('ellie:voice'));
  return true;
}
