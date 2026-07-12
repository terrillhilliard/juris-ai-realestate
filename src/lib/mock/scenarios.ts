import type { Scenario } from '@/lib/types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'portal-buyer',
    title: 'First-Time Buyer From Zillow',
    icon: '🏠',
    leadType: 'buyer',
    situation:
      'A first-time buyer inquires on a Pleasant Hill 3-bed at 9:42pm — long after office hours.',
    aiResponse:
      'Ellie answers instantly, walks them through pre-approval basics, and books a Saturday showing with Laurie before they open the next Zillow tab.',
    speedToBooking: '3m 12s',
    projectedLTV: '$40,000+',
    color: '#FF5A6E',
  },
  {
    id: 'seller-consult',
    title: 'Walnut Creek Listing Consult',
    icon: '📋',
    leadType: 'seller',
    situation:
      'A Walnut Creek homeowner wants a pricing and staging consult while Laurie is at a closing.',
    aiResponse:
      'Ellie captures the property details, timeline, and motivation, then books a listing consult — pricing and staging plan included — for Tuesday 4pm.',
    speedToBooking: '4m 05s',
    projectedLTV: '$52,000+',
    color: '#C8A26A',
  },
  {
    id: 'past-client-referral',
    title: 'Past-Client Referral, Lafayette',
    icon: '🤝',
    leadType: 'past_client',
    situation:
      'A past client calls on Sunday to refer their coworker who is relocating to Lafayette.',
    aiResponse:
      'Ellie recognizes the past client, thanks them by name, collects the referral contact, and schedules an intro call with Laurie for Monday 9am.',
    speedToBooking: '2m 40s',
    projectedLTV: '$80,000+',
    color: '#4ade80',
  },
  {
    id: 'investor-inquiry',
    title: 'Investor Duplexes in Concord',
    icon: '📈',
    leadType: 'investor',
    situation:
      'An out-of-state investor texts at 6am about two Concord duplexes — fix & hold strategy.',
    aiResponse:
      'Ellie qualifies budget, financing structure, and 1031 timeline over SMS, then books a same-day portfolio review video call with Laurie.',
    speedToBooking: '6m 30s',
    projectedLTV: '$120,000+',
    color: '#E8E6EA',
  },
];
