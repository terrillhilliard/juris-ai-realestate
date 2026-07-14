'use client';

import { useState } from 'react';
import SiteNav from '@/components/site/SiteNav';
import HeroSection from '@/components/site/HeroSection';
import StartConversation from '@/components/site/StartConversation';
import StatsStrip from '@/components/site/StatsStrip';
import ServicesSection from '@/components/site/ServicesSection';
import PaymentCalculator from '@/components/site/PaymentCalculator';
import NeighborhoodsChart from '@/components/site/NeighborhoodsChart';
import MeetLaurie from '@/components/site/MeetLaurie';
import ContactForm from '@/components/site/ContactForm';
import FinalCTA from '@/components/site/FinalCTA';
import SiteFooter from '@/components/site/SiteFooter';
import VoiceMicButton from '@/components/ai/VoiceMicButton';
import { BookingModal } from '@/components/layout/BookingModal';

export default function Home() {
  const [consult, setConsult] = useState(false);

  return (
    <main>
      <SiteNav />
      <HeroSection />
      <StartConversation />
      <StatsStrip />
      <ServicesSection />
      <PaymentCalculator />
      <NeighborhoodsChart />
      <MeetLaurie />
      <FinalCTA onConsult={() => setConsult(true)} />
      <ContactForm />
      <SiteFooter />

      <VoiceMicButton />
      <BookingModal open={consult} onClose={() => setConsult(false)} />
    </main>
  );
}
