# JURIS AI — Real Estate Demo

Single-page, 3D/4D "liquid glass" demo site for JURIS AI, an AI-powered business intake platform, focused on the real estate market.

**Live demo:** deployed on Vercel.

## What it shows

- **3D hero command center** — interactive cityscape (Three.js / React Three Fiber) where each building is a lead stream; hover for missed-call and lifetime-value metrics. A photon "wave" of leads flows into the central AI core.
- **Missed-call economics calculator** — sliders for monthly calls, missed %, and conversion rate compute real-time annual revenue leakage using real estate economics ($5k–$20k per transaction, $15k–$80k lifetime value, 3.1 referrals per client).
- **Agentic AI flow visualizer** — animated Lead → Answer → Qualify → Book → Handoff pipeline with a scripted live transcript.
- **Industry scenarios** — portal buyer, seller consult, past-client referral, investor inquiry.
- **Try-it demos** — mock phone keypad with a simulated AI voice call, plus an AI chat widget.

All AI behavior is simulated client-side (`setTimeout`-based mock services) — the site deploys as a fully static export.

## Stack

Next.js 14 (App Router, static export) · TypeScript · TailwindCSS · Three.js + React Three Fiber + drei · Framer Motion

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export to /out
```

## Notes

- All names, numbers, and transcripts are illustrative mock data.
- To take it live: swap `src/lib/services/voiceSession.ts` for a real telephony backend (e.g. Twilio ConversationRelay) — everything downstream already consumes an async stream of turns.
- Tune the economic model in `src/lib/economics.ts`.
