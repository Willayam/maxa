'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface PhoneMockupProps {
  src: string;
  alt: string;
  className?: string;
  animate?: boolean;
}

export function PhoneMockup({
  src,
  alt,
  className,
  animate = true,
}: PhoneMockupProps) {
  const Wrapper = animate ? motion.div : 'div';
  const wrapperProps = animate
    ? {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
      }
    : {};

  return (
    <Wrapper
      className={cn('relative', className)}
      {...(wrapperProps as Record<string, unknown>)}
    >
      {/* Phone frame */}
      <div className="relative mx-auto w-[280px] h-[580px] bg-foreground rounded-[3rem] p-2 shadow-2xl">
        {/* Screen bezel */}
        <div className="relative w-full h-full bg-background rounded-[2.5rem] overflow-hidden">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-foreground rounded-b-2xl z-10" />

          {/* Screenshot */}
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover object-top"
            sizes="280px"
          />
        </div>
      </div>

      {/* Floating effect shadow */}
      {animate && (
        <motion.div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-4 bg-foreground/10 dark:bg-white/5 rounded-full blur-xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </Wrapper>
  );
}
