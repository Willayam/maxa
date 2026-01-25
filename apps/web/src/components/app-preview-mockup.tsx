'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AppPreviewMockupProps {
  variant: 'dashboard' | 'practice' | 'progress';
  className?: string;
  animate?: boolean;
}

export function AppPreviewMockup({
  variant,
  className,
  animate = true,
}: AppPreviewMockupProps) {
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

          {/* App content */}
          <div className="w-full h-full pt-10 px-4 pb-4">
            {variant === 'dashboard' && <DashboardPreview />}
            {variant === 'practice' && <PracticePreview />}
            {variant === 'progress' && <ProgressPreview />}
          </div>
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

function DashboardPreview() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-foreground-muted">Välkommen tillbaka</p>
          <p className="text-lg font-bold text-foreground">Ditt HP-mål: 1.8</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-lg">🔥</span>
        </div>
      </div>

      {/* Countdown card */}
      <div className="bg-primary rounded-2xl p-4 mb-4 text-primary-foreground">
        <p className="text-sm opacity-80">Dagar till provet</p>
        <p className="text-4xl font-black">47</p>
        <p className="text-sm opacity-80">7 april 2026</p>
      </div>

      {/* Today's tasks */}
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground mb-3">Idag</p>
        <div className="space-y-2">
          <TaskItem label="ORD - 10 frågor" done={true} color="bg-[#58CC02]" />
          <TaskItem label="LÄS - 5 frågor" done={false} color="bg-[#1CB0F6]" />
          <TaskItem label="KVA - 8 frågor" done={false} color="bg-[#FF9600]" />
        </div>
      </div>

      {/* Streak */}
      <div className="flex items-center justify-center gap-2 py-3 bg-background-secondary rounded-xl">
        <span className="text-2xl">🔥</span>
        <span className="font-bold text-foreground">12 dagars streak!</span>
      </div>
    </div>
  );
}

function PracticePreview() {
  return (
    <div className="flex flex-col h-full">
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-2 bg-background-secondary rounded-full overflow-hidden">
          <div className="w-3/5 h-full bg-primary rounded-full" />
        </div>
        <span className="text-sm text-foreground-muted">6/10</span>
      </div>

      {/* Question */}
      <div className="flex-1">
        <p className="text-xs text-primary font-medium mb-2">ORD</p>
        <p className="text-lg font-medium text-foreground mb-6">
          Vilket ord har samma betydelse som <span className="font-bold">&quot;pragmatisk&quot;</span>?
        </p>

        {/* Options */}
        <div className="space-y-3">
          <OptionButton label="A) Teoretisk" />
          <OptionButton label="B) Praktisk" selected />
          <OptionButton label="C) Idealistisk" />
          <OptionButton label="D) Abstrakt" />
        </div>
      </div>

      {/* Check button */}
      <button className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl">
        Kolla svar
      </button>
    </div>
  );
}

function ProgressPreview() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-sm text-foreground-muted">Din uppskattade poäng</p>
        <p className="text-5xl font-black text-primary">1.6</p>
        <p className="text-sm text-foreground-muted">+0.3 sedan start</p>
      </div>

      {/* Progress by section */}
      <div className="flex-1 space-y-3">
        <ProgressBar label="ORD" value={78} color="bg-[#58CC02]" />
        <ProgressBar label="LÄS" value={65} color="bg-[#1CB0F6]" />
        <ProgressBar label="MEK" value={42} color="bg-[#FF4B4B]" />
        <ProgressBar label="KVA" value={71} color="bg-[#FF9600]" />
        <ProgressBar label="NOG" value={55} color="bg-[#CE82FF]" />
      </div>

      {/* Tip */}
      <div className="bg-background-secondary rounded-xl p-3">
        <p className="text-xs text-foreground-muted mb-1">Tips från Max</p>
        <p className="text-sm text-foreground">
          Fokusera på MEK denna vecka – där kan du höja mest!
        </p>
      </div>
    </div>
  );
}

function TaskItem({ label, done, color }: { label: string; done: boolean; color: string }) {
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-xl border-2",
      done ? "border-border bg-background-secondary" : "border-border"
    )}>
      <div className={cn("w-3 h-3 rounded-full", color)} />
      <span className={cn("flex-1 text-sm", done ? "text-foreground-muted line-through" : "text-foreground")}>
        {label}
      </span>
      {done && <span className="text-primary">✓</span>}
    </div>
  );
}

function OptionButton({ label, selected }: { label: string; selected?: boolean }) {
  return (
    <div className={cn(
      "p-4 rounded-xl border-2 text-sm",
      selected
        ? "border-primary bg-primary/10 text-foreground"
        : "border-border text-foreground"
    )}>
      {label}
    </div>
  );
}

function ProgressBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-foreground">{label}</span>
        <span className="text-foreground-muted">{value}%</span>
      </div>
      <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
