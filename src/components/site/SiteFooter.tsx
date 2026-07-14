'use client';

/* eslint-disable @next/next/no-img-element */
import { BRAND } from '@/lib/brand';

export default function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-5 pb-16 pt-8 sm:px-8">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <div className="font-display text-xl font-semibold text-ink">{BRAND.agent}</div>
          <div className="mt-1 text-sm text-muted">
            {BRAND.title} · {BRAND.brokerage}
          </div>
          <div className="text-sm text-muted">{BRAND.office}</div>
        </div>
        <img src={BRAND.assets.kwLogo} alt={BRAND.brokerage} className="h-9 w-auto" />
      </div>

      <hr className="my-6 border-hairline" />

      <p className="max-w-4xl text-xs leading-relaxed text-muted">
        Concept demonstration by{' '}
        <a
          href="https://jurisai.dev"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-forest underline-offset-2 hover:underline"
        >
          JURIS AI
        </a>{' '}
        — website + AI voice &amp; SMS intake. Contact details, market data, and metrics are
        illustrative. The AI assistant qualifies inquiries and books appointments only — it does not
        provide legal or financial advice. Not affiliated with or endorsed by Keller Williams Realty.
        Each office is independently owned and operated. Equal Housing Opportunity.
      </p>
    </footer>
  );
}
