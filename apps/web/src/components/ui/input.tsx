import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full h-14 px-5 rounded-2xl',
          'bg-card-background border-2 border-border',
          'text-foreground placeholder:text-foreground-muted',
          'font-medium text-base',
          'transition-all duration-200',
          'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
          error && 'border-error focus:border-error focus:ring-error/20',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
