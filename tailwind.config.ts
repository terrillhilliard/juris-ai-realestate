import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Monochrome base + royal red accent.
        ink: '#0A0A0A', // page background
        paper: '#FAFAFA', // primary text / solid CTAs
        royal: '#9B111E', // royal red — accent fills, gradients
        flame: '#E8323F', // legible red for text/glows on dark
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
