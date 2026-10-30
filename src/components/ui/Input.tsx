import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Search } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-2.5 text-slate-400 dark:text-zinc-500 pointer-events-none flex items-center">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={twMerge(
            clsx(
              'w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-white/[0.08] rounded-lg text-xs text-slate-900 dark:text-zinc-200 placeholder:text-slate-400 dark:placeholder:text-zinc-500 py-1.5 px-3 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all duration-150',
              icon ? 'pl-8' : '',
              className
            )
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export const SearchInput: React.FC<InputProps> = (props) => {
  return <Input icon={<Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />} {...props} />;
};
