'use client';

import { clsx } from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

interface CTAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

/** High-contrast monochrome CTAs: solid white / outlined. */
export function CTAButton({ variant = 'primary', className, children, ...rest }: CTAButtonProps) {
  return (
    <button
      className={clsx(
        'rounded-xl px-6 py-3.5 text-sm font-semibold transition-all duration-200',
        variant === 'primary' &&
          'bg-paper text-ink shadow-[0_8px_30px_-10px_rgba(255,255,255,0.4)] hover:bg-white hover:shadow-[0_8px_40px_-8px_rgba(255,255,255,0.55)]',
        variant === 'secondary' &&
          'border border-white/20 bg-white/[0.04] text-paper backdrop-blur-md hover:border-white/40 hover:bg-white/[0.09]',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
