import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'relative font-bold rounded-2xl transition-all duration-150 uppercase tracking-wide',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',

          // Variant styles
          variant === 'primary' && [
            'bg-primary text-[#1a1625]',
            'border-b-[4px] border-primary-dark',
            'hover:translate-y-[2px] hover:border-b-[2px]',
            'active:translate-y-[4px] active:border-b-0',
          ],
          variant === 'secondary' && [
            'bg-card-background text-foreground border-2 border-border',
            'hover:border-primary hover:text-primary',
          ],
          variant === 'ghost' && [
            'bg-transparent text-foreground-muted',
            'hover:text-foreground hover:bg-card-background',
          ],

          // Size styles
          size === 'sm' && 'px-4 py-2 text-sm',
          size === 'md' && 'px-6 py-3 text-base',
          size === 'lg' && 'px-8 py-4 text-lg',

          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
