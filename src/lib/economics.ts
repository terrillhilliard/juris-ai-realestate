export const ECONOMICS = {
  transaction: { min: 5_000, max: 20_000, mid: 12_500 },
  lifetime: { min: 15_000, max: 80_000, mid: 40_000 },
  referralsPerClient: 3.1,
  referralConversion: 0.35, // fraction of referrals that become clients
  aiCaptureRate: 0.85, // fraction of missed leads AI recovers
} as const;

/** Effective value of a captured lead: own LTV + converted referral LTV. */
export function effectiveLeadValue() {
  const { lifetime, referralsPerClient, referralConversion } = ECONOMICS;
  const referralValue = referralsPerClient * referralConversion * lifetime.mid;
  return lifetime.mid + referralValue;
}

export interface LeakageInput {
  monthlyCalls: number;
  missedPct: number; // 0–1
  conversion: number; // 0–1, lead→client
}

export function annualLeakage({ monthlyCalls, missedPct, conversion }: LeakageInput) {
  const missedPerYear = monthlyCalls * missedPct * 12;
  const lostClients = missedPerYear * conversion;
  const perClient = effectiveLeadValue();
  return {
    missedPerYear: Math.round(missedPerYear),
    lostClients: Math.round(lostClients),
    lostReferrals: Math.round(lostClients * ECONOMICS.referralsPerClient),
    annualLeakage: Math.round(lostClients * perClient),
    recoverable: Math.round(lostClients * perClient * ECONOMICS.aiCaptureRate),
  };
}
