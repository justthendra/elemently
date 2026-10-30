import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'error' | 'brand';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'sm',
  children,
  ...props
}) => {
  const base = 'inline-flex items-center font-mono font-medium rounded-md select-none tracking-tight';

  const variants = {
    default: 'bg-slate-100 dark:bg-white/[0.05] text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-white/[0.08]',
    secondary: 'bg-slate-50 dark:bg-white/[0.03] text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-white/[0.05]',
    outline: 'bg-transparent text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-white/[0.12]',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25',
    error: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/25',
    brand: 'bg-violet-600/10 dark:bg-violet-500/12 text-violet-700 dark:text-violet-300 border border-violet-500/25',
  };

  const sizes = {
    sm: 'text-[11px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2 py-0.5 gap-1.5',
  };

  return (
    <span className={twMerge(clsx(base, variants[variant], sizes[size], className))} {...props}>
      {children}
    </span>
  );
};
