'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { clsx } from 'clsx';

type Elevation = 'flat' | 'raised' | 'floating';

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: Elevation;
  glow?: boolean; // liquid-glass edge light (royal → white gradient hairline)
  interactive?: boolean; // hover lift
}

const ELEVATION: Record<Elevation, string> = {
  flat: 'shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset]',
  raised:
    'shadow-[0_8px_30px_-12px_rgba(0,0,0,0.7),0_1px_0_0_rgba(255,255,255,0.08)_inset]',
  floating:
    'shadow-[0_32px_80px_-24px_rgba(0,0,0,0.9),0_18px_50px_-20px_rgba(155,17,30,0.12),0_1px_0_0_rgba(255,255,255,0.10)_inset]',
};

/**
 * Liquid-glass surface: translucent fill, drifting specular sheen, hairline
 * border. `glow` adds the animated royal edge light.
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
        'border border-white/10',
        'bg-white/[0.045] backdrop-blur-2xl backdrop-saturate-150',
        'specular before:pointer-events-none before:absolute before:-inset-x-1/3 before:inset-y-0',
        'before:bg-gradient-to-r before:from-transparent before:via-white/[0.07] before:to-transparent',
        ELEVATION[elevation],
        glow && 'edge-light',
        interactive &&
          'transition-transform duration-300 ease-out will-change-transform hover:-translate-y-1 hover:border-white/25',
        className,
      )}
      {...rest}
    >
      <div className="relative z-10 h-full">{children}</div>
    </div>
  ),
);

GlassPanel.displayName = 'GlassPanel';
