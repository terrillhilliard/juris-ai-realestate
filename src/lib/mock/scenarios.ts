import type { Scenario } from '@/lib/types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'portal-buyer',
    title: 'New Buyer From Portal',
    icon: '🏠',
    leadType: 'buyer',
    situation: 'Inquiry on a $485k listing at 9:42pm — after office hours.',
    aiResponse:
      'Ava answers in 2 rings, confirms pre-approval status, and books a Saturday showing before the buyer opens the next listing tab.',
    speedToBooking: '3m 12s',
    projectedLTV: '$40,000+',
    color: '#6ee7ff',
  },
  {
    id: 'seller-consult',
    title: 'Seller Listing Consult',
    icon: '📋',
    leadType: 'seller',
    situation: 'Homeowner requests a valuation while your team is at a closing.',
    aiResponse:
      'Ava captures property details, timeline, and motivation, then books a listing consult with your top listing agent for Tuesday 4pm.',
    speedToBooking: '4m 05s',
    projectedLTV: '$52,000+',
    color: '#c8a26a',
  },
  {
    id: 'past-client-referral',
    title: 'Past Client Referral',
    icon: '🤝',
    leadType: 'past_client',
    situation: 'A past client calls to refer their coworker — call goes unanswered on Sunday.',
    aiResponse:
      'Ava recognizes the past client, thanks them by name, collects the referral contact, and schedules an intro call for Monday 9am.',
    speedToBooking: '2m 40s',
    projectedLTV: '$80,000+',
    color: '#4ade80',
  },
  {
    id: 'investor-inquiry',
    title: 'Investor Multi-Unit Inquiry',
    icon: '📈',
    leadType: 'investor',
    situation: 'Out-of-state investor asks about three duplexes via SMS at 6am.',
    aiResponse:
      'Ava qualifies budget, financing structure, and 1031 timeline over SMS, then books a portfolio review video call the same day.',
    speedToBooking: '6m 30s',
    projectedLTV: '$120,000+',
    color: '#8b7bff',
  },
];
