import type { LeadStream } from '@/lib/types';

export const LEAD_STREAMS: LeadStream[] = [
  { id: 'referral', label: 'Referral Calls', monthlyLeads: 22, missedPct: 0.34, color: '#c8a26a', height: 1.0 },
  { id: 'portal', label: 'Portal Leads', monthlyLeads: 60, missedPct: 0.48, color: '#6ee7ff', height: 1.6 },
  { id: 'sign_call', label: 'Sign Calls', monthlyLeads: 35, missedPct: 0.52, color: '#8b7bff', height: 1.25 },
  { id: 'website', label: 'Website Forms', monthlyLeads: 44, missedPct: 0.41, color: '#4ade80', height: 1.4 },
];

// Rough per-stream lifetime value midpoint used for tooltip math.
export const LIFETIME_MIDPOINT = 40_000; // ($15k–$80k range)
