import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  accentColor?: 'ord' | 'las' | 'mek' | 'elf' | 'xyz' | 'kva' | 'nog' | 'dtk';
}

const accentColorMap = {
  ord: 'border-l-section-ord',
  las: 'border-l-section-las',
  mek: 'border-l-section-mek',
  elf: 'border-l-section-elf',
  xyz: 'border-l-section-xyz',
  kva: 'border-l-section-kva',
  nog: 'border-l-section-nog',
  dtk: 'border-l-section-dtk',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, accentColor, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-card-background rounded-3xl border-2 border-border p-6',
          'transition-all duration-200',
          hover && [
            'hover:-translate-y-1 hover:shadow-lg',
            'dark:hover:shadow-card-dark',
          ],
          accentColor && ['border-l-4', accentColorMap[accentColor]],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
