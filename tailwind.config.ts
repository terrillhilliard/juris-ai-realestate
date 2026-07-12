import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#060912',
        cyanAI: '#6ee7ff',
        violetAI: '#8b7bff',
        gold: '#c8a26a',
        positive: '#4ade80',
        danger: '#ff6b6b',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
