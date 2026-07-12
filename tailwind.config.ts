import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#0B0A0C',
        kwred: '#CE011F', // Keller Williams red
        kwrose: '#FF5A6E', // legible red variant for text on dark
        kwdark: '#8F0116', // deep red for gradient stops
        gold: '#C8A26A',
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
