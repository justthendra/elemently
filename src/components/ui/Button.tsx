import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isActive?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isActive = false, children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500/40 disabled:opacity-40 disabled:cursor-not-allowed select-none cursor-pointer';

    const variants = {
      primary: 'bg-violet-600 hover:bg-violet-500 text-white shadow-[0_1px_3px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.16)] active:scale-[0.98]',
      secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.09] dark:text-zinc-200 dark:border-white/[0.08] active:scale-[0.98]',
      outline: 'bg-transparent hover:bg-slate-100 text-slate-700 border border-slate-200 dark:hover:bg-white/[0.05] dark:text-zinc-300 dark:border-white/[0.1] active:scale-[0.98]',
      ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 dark:hover:bg-white/[0.06] dark:text-zinc-400 dark:hover:text-zinc-100',
      destructive: 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-500/20 active:scale-[0.98]',
      icon: 'p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-white/[0.07] rounded-md',
    };

    const activeStyles = isActive
      ? 'bg-violet-600/10 text-violet-700 border-violet-500/40 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/40 shadow-xs'
      : '';

    const sizes = {
      sm: 'text-xs px-2.5 py-1.5 gap-1.5',
      md: 'text-sm px-3.5 py-2 gap-2',
      lg: 'text-base px-5 py-2.5 gap-2.5',
      icon: 'p-1.5 w-7 h-7',
    };

    return (
      <button
        ref={ref}
        className={twMerge(clsx(base, variants[variant], sizes[size], activeStyles, className))}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
