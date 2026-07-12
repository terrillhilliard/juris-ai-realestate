'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { clsx } from 'clsx';

type Elevation = 'flat' | 'raised' | 'floating';

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: Elevation;
  glow?: boolean; // bright monochrome edge
  interactive?: boolean; // hover lift
}

const ELEVATION: Record<Elevation, string> = {
  flat: 'shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset]',
  raised:
    'shadow-[0_8px_30px_-12px_rgba(0,0,0,0.7),0_1px_0_0_rgba(255,255,255,0.08)_inset]',
  floating:
    'shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85),0_1px_0_0_rgba(255,255,255,0.10)_inset]',
};

/**
 * Monochrome liquid-glass surface: translucent fill + top sheen + hairline
 * border. `glow` swaps the hairline for a brighter white edge.
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
        glow ? 'border border-white/25' : 'border border-white/10',
        'bg-white/[0.045] backdrop-blur-xl backdrop-saturate-150',
        'before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl',
        'before:bg-gradient-to-b before:from-white/[0.12] before:to-transparent before:opacity-70',
        ELEVATION[elevation],
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
