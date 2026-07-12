'use client';

import { clsx } from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

interface CTAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

/** Royal-red primary / outlined-ink secondary CTAs on the white theme. */
export function CTAButton({ variant = 'primary', className, children, ...rest }: CTAButtonProps) {
  return (
    <button
      className={clsx(
        'rounded-xl px-6 py-3.5 text-sm font-semibold transition-all duration-200',
        variant === 'primary' &&
          'bg-gradient-to-r from-royal to-flame text-white shadow-[0_10px_32px_-10px_rgba(155,17,30,0.6)] hover:brightness-110 hover:shadow-[0_10px_42px_-8px_rgba(155,17,30,0.75)]',
        variant === 'secondary' &&
          'border border-ink/20 bg-white/60 text-ink backdrop-blur-md hover:border-ink/40 hover:bg-white',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
