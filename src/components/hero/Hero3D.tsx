'use client';

import dynamic from 'next/dynamic';
import { GlassPanel } from '@/components/ui/GlassPanel';

const CityScene = dynamic(() => import('./CityScene'), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full animate-pulse place-items-center rounded-3xl bg-white/[0.03] text-sm text-white/30">
      Loading 3D command center…
    </div>
  ),
});

export default function Hero3D() {
  return (
    <GlassPanel elevation="floating" glow className="h-[420px] w-full sm:h-[520px]">
      <CityScene />
    </GlassPanel>
  );
}
