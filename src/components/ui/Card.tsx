import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white dark:bg-[#10121a]/95 border border-slate-200/90 dark:border-white/[0.07] rounded-xl shadow-xs dark:shadow-[0_2px_10px_rgba(0,0,0,0.25)] transition-all duration-150',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return <div className={twMerge(clsx('px-3.5 py-2.5 border-b border-slate-100 dark:border-white/[0.06]', className))} {...props}>{children}</div>;
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => {
  return (
    <h3 className={twMerge(clsx('text-xs font-semibold text-slate-900 dark:text-zinc-200 tracking-wider uppercase', className))} {...props}>
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, children, ...props }) => {
  return <p className={twMerge(clsx('text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 leading-normal', className))} {...props}>{children}</p>;
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return <div className={twMerge(clsx('p-3.5', className))} {...props}>{children}</div>;
};
