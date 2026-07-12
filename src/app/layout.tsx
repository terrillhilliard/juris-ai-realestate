import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: 'Laurie Wotus · East Bay Real Estate | Keller Williams (JURIS AI Demo)',
  description:
    'Buy, sell, and invest in Pleasant Hill, Walnut Creek, Concord, Clayton, Martinez & Lafayette with Laurie Wotus — now with a 24/7 AI assistant that answers every call and text. Concept demo by JURIS AI.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-body antialiased">
        <div className="bg-ambient" />
        {children}
      </body>
    </html>
  );
}
