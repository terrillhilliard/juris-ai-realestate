export interface ChatReply {
  text: string;
  delayMs: number;
}

const REPLIES: { match: RegExp; reply: string }[] = [
  {
    match: /(buy|purchase|looking|house|home|listing)/i,
    reply:
      "I'd love to help you find the right home. What area are you searching in, and do you have a pre-approval in place yet?",
  },
  {
    match: /(sell|list|valuation|worth)/i,
    reply:
      'I can set up a free listing consult. What is the property address, and when are you hoping to go to market?',
  },
  {
    match: /(invest|rental|duplex|units|cash flow)/i,
    reply:
      'Great — we work with a lot of investors. Are you targeting single-family rentals or multi-unit, and what is your budget range?',
  },
  {
    match: /(showing|tour|viewing|appointment|book)/i,
    reply:
      'I can book that now. I have Thursday 5:30pm or Saturday 11am available with agent Dana Whitfield — which works better?',
  },
  {
    match: /(thursday|saturday|11|5:30|works|yes)/i,
    reply:
      "Perfect, you're booked! I've texted you a confirmation with the address and Dana's contact info. Anything else I can help with?",
  },
];

const FALLBACK =
  "Happy to help with that. Could you share a bit more about what you're looking for — buying, selling, or investing?";

/** Fake AI chat: returns a canned, keyword-matched reply with typing latency. */
export function getAIReply(userMessage: string): Promise<ChatReply> {
  const matched = REPLIES.find((r) => r.match.test(userMessage));
  const text = matched ? matched.reply : FALLBACK;
  const delayMs = 900 + Math.min(1400, text.length * 12);
  return new Promise((resolve) => setTimeout(() => resolve({ text, delayMs }), delayMs));
}
