/**
 * Single source of truth for prospect branding.
 * Contact details are intentionally MOCKED for this sales demo —
 * do not wire real phone/email without explicit approval.
 */
export const BRAND = {
  agent: 'Laurie Wotus',
  title: 'Realtor · DRE #01703135',
  brokerage: 'Keller Williams Realty East Bay',
  office: '201 N Civic Drive, Suite 130, Walnut Creek, CA 94596',
  phoneDisplay: '(925) 555-0142', // mock — demo only
  calendlyUrl: 'https://calendly.com/terrillhilliard/30min',
  assistant: 'Ellie',
  assistantTagline: "Laurie's AI Assistant",
  tagline: 'integrity · honesty · community',
  markets: ['Pleasant Hill', 'Walnut Creek', 'Concord', 'Clayton', 'Martinez', 'Lafayette'],
  region: 'San Francisco East Bay',
  yearsInEastBay: '25+',
  testimonial: {
    quote:
      'Laurie was fabulous to work with! She got started right away and moved so quickly to get us listed. Wonderful experience, made the experience easy and enjoyable. Highly recommend!',
    author: 'Nicole S.',
    role: 'Seller',
  },
  testimonials: [
    {
      quote:
        'Laurie was fabulous to work with! She got started right away and moved so quickly to get us listed. Made the experience easy and enjoyable. Highly recommend!',
      author: 'Nicole S.',
      role: 'Seller',
    },
    {
      quote:
        'She knew every street and every comp. We wrote one offer, it was accepted, and Laurie kept the whole thing calm. A true East Bay neighbor.',
      author: 'David & Axel R.',
      role: 'Buyers',
    },
  ],
  assets: {
    logoWhite: '/brand/laurie-logo-white.png',
    logoColor: '/brand/laurie-logo-color.png',
    headshot: '/brand/laurie-headshot.jpg',
    standing: '/brand/laurie-standing.png',
    kwLogo: '/brand/kw-eastbay-logo.png',
  },
} as const;
