import { BRAND } from '@/lib/brand';
import { CITY_MARKETS } from '@/lib/mock/cities';

/**
 * Scripted qualification engine for the demo chat.
 * State machine: intent → city → budget → timeline → slot → booked.
 * Deterministic, fully client-side, abortable by discarding state.
 */

export type ChatStage =
  | 'intent'
  | 'city'
  | 'budget'
  | 'timeline'
  | 'slot'
  | 'booked'
  | 'open';

export interface ChatState {
  stage: ChatStage;
  intent?: 'buy' | 'sell' | 'invest';
  city?: string;
  budget?: string;
  timeline?: string;
  slot?: string;
}

export interface ChatTurnResult {
  state: ChatState;
  reply: string;
  quickReplies: string[];
  typingMs: number;
}

export const INITIAL_STATE: ChatState = { stage: 'intent' };

export const OPENER = {
  text: `Hi! I'm ${BRAND.assistant}, Laurie's AI assistant at Keller Williams East Bay. Are you looking to buy, sell, or invest in the East Bay?`,
  quickReplies: ['Buy', 'Sell', 'Invest'],
};

const CITIES = BRAND.markets;

/**
 * Conversational navigation — the chatbot is the site's primary nav.
 * If a message matches a destination, the UI scrolls there and Ellie narrates.
 */
export interface NavTarget {
  sectionId: string;
  reply: string;
}

const NAV_RULES: { match: RegExp; target: NavTarget }[] = [
  {
    match: /service|what.*(do|offer)|help me with|sell.*house.*how|how.*work/i,
    target: {
      sectionId: 'services',
      reply:
        "Here's everything Laurie does — buying, selling, and investing. Tap any one and I'll get you started.",
    },
  },
  {
    match: /payment|calculator|mortgage|afford|monthly|rate|loan/i,
    target: {
      sectionId: 'mortgage',
      reply:
        'Pulling up the payment calculator. Slide the numbers around — when you want real quotes, I can connect you with Laurie’s lenders.',
    },
  },
  {
    match: /neighborhood|market|cities|skyline|area|where/i,
    target: {
      sectionId: 'markets',
      reply:
        'These are Laurie’s six East Bay markets — hover any building for the numbers. Want me to qualify you for one of them?',
    },
  },
  {
    match: /about|who is laurie|experience|background|bio/i,
    target: {
      sectionId: 'about',
      reply:
        'Meet Laurie — 25+ years in the East Bay, and a neighbor before she’s a realtor.',
    },
  },
  {
    match: /review|testimonial|reference|past client/i,
    target: {
      sectionId: 'about',
      reply: 'Here’s what clients say. Nicole’s review is a good place to start.',
    },
  },
  {
    match: /contact|reach|office|address|phone number|email/i,
    target: {
      sectionId: 'contact',
      reply: `Here are all the ways to reach us. Or honestly — just keep talking to me, I can book you with Laurie right here.`,
    },
  },
];

export function detectNav(msg: string): NavTarget | undefined {
  return NAV_RULES.find((r) => r.match.test(msg))?.target;
}

const fmtPrice = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${Math.round(n / 1000)}k`;

/**
 * City market Q&A — "Tell me about Walnut Creek" (map taps route here).
 * Returns a stats reply and remembers the city so qualification skips
 * the "which area?" question.
 */
export function cityInfoTurn(state: ChatState, msg: string): ChatTurnResult | undefined {
  if (!/tell me about|about|market|info|stats|price/i.test(msg)) return undefined;
  const city = CITY_MARKETS.find((c) => msg.toLowerCase().includes(c.name.toLowerCase()));
  if (!city) return undefined;
  return {
    state: { ...state, city: city.name },
    reply: `${city.name} — median around ${fmtPrice(city.medianPrice)}, homes typically go in ~${city.daysOnMarket} days. ${city.vibe}. Thinking of buying, selling, or investing there?`,
    quickReplies: ['Buy', 'Sell', 'Invest'],
    typingMs: 1000,
  };
}

/** Persistent nav chips shown under the chat input. */
export const NAV_CHIPS = [
  { label: 'Services', prompt: 'Show me your services' },
  { label: 'Payment calculator', prompt: "What's my monthly payment?" },
  { label: 'Neighborhoods', prompt: 'Show me the neighborhoods' },
  { label: 'About Laurie', prompt: 'Who is Laurie?' },
  { label: 'Reviews', prompt: 'Show me reviews' },
] as const;

function detectIntent(msg: string): ChatState['intent'] | undefined {
  if (/buy|purchase|looking for|first.?time|home for/i.test(msg)) return 'buy';
  if (/sell|list|valuation|worth|market my/i.test(msg)) return 'sell';
  if (/invest|rental|duplex|units|cash ?flow|flip/i.test(msg)) return 'invest';
  return undefined;
}

function detectCity(msg: string): string | undefined {
  return CITIES.find((c) => msg.toLowerCase().includes(c.toLowerCase()));
}

const SLOTS = ['Thursday 5:30pm', 'Saturday 11:00am'];

export function nextTurn(state: ChatState, userMessage: string): ChatTurnResult {
  const msg = userMessage.trim();

  // Allow intent switching at any time before booking.
  const switched = state.stage !== 'booked' ? detectIntent(msg) : undefined;

  switch (state.stage) {
    case 'intent': {
      const intent = switched;
      if (!intent) {
        return {
          state,
          reply:
            "Happy to help! Just so I point you the right way — are you looking to buy a home, sell one, or invest in the East Bay?",
          quickReplies: ['Buy', 'Sell', 'Invest'],
          typingMs: 900,
        };
      }
      // City already known (e.g. from the map) — skip straight to budget.
      if (state.city) {
        return {
          state: { ...state, stage: 'budget', intent },
          reply:
            intent === 'sell'
              ? `${state.city} it is. Roughly what do you expect the home is worth?`
              : `${state.city} it is. What budget range are you working with?`,
          quickReplies:
            intent === 'sell'
              ? ['Under $800k', '$800k–$1.2M', 'Over $1.2M']
              : ['Under $700k', '$700k–$1M', 'Over $1M'],
          typingMs: 1000,
        };
      }
      const prompts = {
        buy: `Wonderful — the East Bay is a great place to buy. Which area are you focused on?`,
        sell: `Great — Laurie has helped East Bay sellers for ${BRAND.yearsInEastBay} years, with pricing and staging included. Where is your property?`,
        invest: `Excellent — Laurie works with fix & flip and fix & hold investors across the East Bay. Which market are you targeting?`,
      };
      return {
        state: { ...state, stage: 'city', intent },
        reply: prompts[intent],
        quickReplies: CITIES.slice(0, 4),
        typingMs: 1000,
      };
    }

    case 'city': {
      const city = detectCity(msg) ?? (msg.length > 2 ? msg : undefined);
      if (!city) {
        return {
          state,
          reply: `Which city works best? Laurie covers ${CITIES.slice(0, -1).join(', ')} and ${CITIES.at(-1)}.`,
          quickReplies: CITIES.slice(0, 4),
          typingMs: 900,
        };
      }
      const q =
        state.intent === 'sell'
          ? `Got it — ${city}. Roughly what do you expect the home is worth?`
          : `Got it — ${city}. What budget range are you working with?`;
      return {
        state: { ...state, stage: 'budget', city },
        reply: q,
        quickReplies:
          state.intent === 'sell'
            ? ['Under $800k', '$800k–$1.2M', 'Over $1.2M']
            : ['Under $700k', '$700k–$1M', 'Over $1M'],
        typingMs: 1000,
      };
    }

    case 'budget': {
      return {
        state: { ...state, stage: 'timeline', budget: msg },
        reply: 'Perfect. And what timeline are you working with?',
        quickReplies: ['ASAP', '1–3 months', '3–6 months', 'Just exploring'],
        typingMs: 900,
      };
    }

    case 'timeline': {
      const action =
        state.intent === 'sell'
          ? 'a listing consult (pricing + staging plan)'
          : state.intent === 'invest'
            ? 'a portfolio strategy call'
            : `a ${state.city ?? 'East Bay'} home tour`;
      return {
        state: { ...state, stage: 'slot', timeline: msg },
        reply: `You're a great fit — Laurie loves working with ${
          state.intent === 'buy' ? 'buyers' : state.intent === 'sell' ? 'sellers' : 'investors'
        } in ${state.city ?? 'the East Bay'}. I can book ${action} right now. Which time works?`,
        quickReplies: SLOTS,
        typingMs: 1100,
      };
    }

    case 'slot': {
      const slot = SLOTS.find((s) => msg.toLowerCase().includes(s.split(' ')[0].toLowerCase())) ?? SLOTS[1];
      return {
        state: { ...state, stage: 'booked', slot },
        reply: `Booked! ${slot} with Laurie Wotus. I've sent a confirmation text with the details and let Laurie know — she'll come prepared for your ${
          state.intent === 'sell' ? 'pricing and staging consult' : state.intent === 'invest' ? 'investment review' : 'tour'
        }. Anything else I can help with?`,
        quickReplies: ['Start over', 'No, thanks!'],
        typingMs: 1200,
      };
    }

    case 'booked':
    case 'open': {
      if (/start over|restart/i.test(msg)) {
        return {
          state: INITIAL_STATE,
          reply: OPENER.text,
          quickReplies: OPENER.quickReplies,
          typingMs: 700,
        };
      }
      return {
        state,
        reply: `You're all set — Laurie will see you ${state.slot ?? 'soon'}. If anything changes, just text this number anytime, day or night.`,
        quickReplies: ['Start over'],
        typingMs: 900,
      };
    }
  }
}

/** Simulated network + typing latency. */
export function withTyping<T>(value: T, ms: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
