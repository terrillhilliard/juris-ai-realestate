'use client';

import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CTAButtonProps {
  variant?: 'primary' | 'secondary' | 'ghostDark';
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  'aria-label'?: string;
}

/**
 * Forest-green primary / outlined secondary CTA. Motion-driven micro-
 * interactions: hover lift, tap compression, and a light sweep on hover.
 */
export function CTAButton({
  variant = 'primary',
  className,
  children,
  onClick,
  type = 'button',
  disabled,
  ...rest
}: CTAButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -2, scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 420, damping: 26 }}
      className={clsx(
        'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50',
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
      {/* sweeping shine on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
