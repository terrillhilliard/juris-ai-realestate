import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm cream + forest green editorial palette.
        paper: '#F6F3EC', // warm page background
        card: '#FFFFFF', // flat paper cards
        cream: '#F1EBE0', // tinted panels (chat bubble, portrait bg)
        ink: '#161A17', // near-black warm text
        muted: '#6C736E', // muted body / labels
        hairline: '#E6DFCF', // warm hairline borders
        forest: '#1C6B52', // primary green (buttons, links, accents)
        forestDeep: '#14503E', // hover / gradient stop
        emerald: '#33967C', // bright accent — bars, highlights
        mint: '#6FC3A6', // light accent on dark grounds
        night: '#111E19', // dark section base
        nightRaise: '#16241E', // raised dark cards
        orchid: '#A94DC1', // magenta pop — slider thumbs, map pins
        gold: '#D9A441', // testimonial stars
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
