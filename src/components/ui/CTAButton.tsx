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
          'bg-gradient-to-r from-flame to-royal text-paper shadow-[0_8px_34px_-10px_rgba(232,50,63,0.7)] hover:brightness-110 hover:shadow-[0_8px_44px_-8px_rgba(232,50,63,0.85)]',
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
