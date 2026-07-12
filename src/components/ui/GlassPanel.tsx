'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { clsx } from 'clsx';

type Elevation = 'flat' | 'raised' | 'floating';

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: Elevation;
  glow?: boolean; // liquid-glass edge light (royal → ink gradient hairline)
  interactive?: boolean; // hover lift
}

const ELEVATION: Record<Elevation, string> = {
  flat: 'shadow-[0_1px_0_0_rgba(255,255,255,0.7)_inset]',
  raised:
    'shadow-[0_10px_30px_-16px_rgba(0,0,0,0.28),0_1px_0_0_rgba(255,255,255,0.7)_inset]',
  floating:
    'shadow-[0_30px_70px_-28px_rgba(0,0,0,0.32),0_18px_50px_-24px_rgba(155,17,30,0.18),0_1px_0_0_rgba(255,255,255,0.8)_inset]',
};

/**
 * Frosted white liquid-glass surface: translucent white fill, drifting
 * specular gloss, hairline ink border. `glow` adds the royal edge light.
 */
export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  (
    { elevation = 'raised', glow = false, interactive = false, className, children, ...rest },
    ref,
  ) => (
    <div
      ref={ref}
      className={clsx(
        'relative isolate overflow-hidden rounded-2xl',
        'border border-black/[0.07]',
        'bg-white/60 backdrop-blur-2xl backdrop-saturate-150',
        'specular before:pointer-events-none before:absolute before:-inset-x-1/3 before:inset-y-0',
        'before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent',
        ELEVATION[elevation],
        glow && 'edge-light',
        interactive &&
          'transition-transform duration-300 ease-out will-change-transform hover:-translate-y-1 hover:border-black/15',
        className,
      )}
      {...rest}
    >
      <div className="relative z-10 h-full">{children}</div>
    </div>
  ),
);

GlassPanel.displayName = 'GlassPanel';
