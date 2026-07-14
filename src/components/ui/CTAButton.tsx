'use client';

import { clsx } from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

interface CTAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghostDark';
}

/** Forest-green primary / outlined secondary CTAs, pill-shaped. */
export function CTAButton({ variant = 'primary', className, children, ...rest }: CTAButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98]',
        variant === 'primary' &&
          'bg-forest text-white shadow-[0_10px_26px_-12px_rgba(28,107,82,0.7)] hover:bg-forestDeep',
        variant === 'secondary' &&
          'border border-ink/25 bg-transparent text-ink hover:border-ink/45 hover:bg-ink/[0.03]',
        variant === 'ghostDark' &&
          'border border-white/25 bg-white/[0.04] text-white hover:border-white/45 hover:bg-white/[0.08]',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
