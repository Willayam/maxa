'use client';

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';

export interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  accentColor: 'ord' | 'las' | 'mek' | 'elf' | 'xyz' | 'kva' | 'nog' | 'dtk';
  delay?: number;
}

const iconBgMap = {
  ord: 'bg-section-ord/10 text-section-ord',
  las: 'bg-section-las/10 text-section-las',
  mek: 'bg-section-mek/10 text-section-mek',
  elf: 'bg-section-elf/10 text-section-elf',
  xyz: 'bg-section-xyz/10 text-section-xyz',
  kva: 'bg-section-kva/10 text-section-kva',
  nog: 'bg-section-nog/10 text-section-nog',
  dtk: 'bg-section-dtk/10 text-section-dtk',
};

export function FeatureCard({
  icon,
  title,
  description,
  accentColor,
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Card hover accentColor={accentColor} className="h-full">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
            iconBgMap[accentColor]
          )}
        >
          {icon}
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-foreground-muted">{description}</p>
      </Card>
    </motion.div>
  );
}
