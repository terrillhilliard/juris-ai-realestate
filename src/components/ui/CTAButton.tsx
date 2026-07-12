'use client';

import { clsx } from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

interface CTAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function CTAButton({ variant = 'primary', className, children, ...rest }: CTAButtonProps) {
  return (
    <button
      className={clsx(
        'rounded-xl px-6 py-3.5 text-sm font-semibold transition-all duration-200',
        variant === 'primary' &&
          'bg-gradient-to-r from-cyanAI to-violetAI text-slate-950 shadow-[0_8px_30px_-8px_rgba(110,231,255,0.5)] hover:shadow-[0_8px_40px_-6px_rgba(110,231,255,0.7)] hover:brightness-110',
        variant === 'secondary' &&
          'border border-white/15 bg-white/[0.06] text-white backdrop-blur-md hover:border-white/30 hover:bg-white/[0.1]',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
