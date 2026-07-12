'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { clsx } from 'clsx';

type Elevation = 'flat' | 'raised' | 'floating';

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: Elevation;
  glow?: boolean; // accent edge glow
  interactive?: boolean; // hover lift
}

const ELEVATION: Record<Elevation, string> = {
  flat: 'shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset]',
  raised:
    'shadow-[0_8px_30px_-12px_rgba(0,0,0,0.7),0_1px_0_0_rgba(255,255,255,0.08)_inset]',
  floating:
    'shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8),0_1px_0_0_rgba(255,255,255,0.10)_inset]',
};

/**
 * Liquid-glass surface. Layered background = translucent fill + top sheen
 * gradient + hairline border. backdrop-blur does the frosting; the ::before
 * sheen sells the "glass" read far more than blur alone.
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
        'bg-white/[0.055] backdrop-blur-xl backdrop-saturate-150',
        'before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl',
        'before:bg-gradient-to-b before:from-white/[0.14] before:to-transparent before:opacity-70',
        ELEVATION[elevation],
        glow &&
          'after:pointer-events-none after:absolute after:-inset-px after:rounded-2xl after:bg-gradient-to-br after:from-kwred/25 after:via-transparent after:to-gold/25',
        interactive &&
          'transition-transform duration-300 ease-out will-change-transform hover:-translate-y-1 hover:border-white/20',
        className,
      )}
      {...rest}
    >
      <div className="relative z-10 h-full">{children}</div>
    </div>
  ),
);

GlassPanel.displayName = 'GlassPanel';
