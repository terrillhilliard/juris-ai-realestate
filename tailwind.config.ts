import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Light theme: white canvas + royal red accent.
        paper: '#FFFFFF', // page background / surfaces
        ink: '#181818', // primary text / dark strokes
        royal: '#9B111E', // royal red — primary accent
        flame: '#C4142A', // brighter royal for gradients / hover
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
