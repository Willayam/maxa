'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider')
  }
  return context
}

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'pill' | 'underline'
}

export function TabsList({ children, className, variant = 'default' }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center gap-1',
        variant === 'default' && 'p-1 bg-card-background border-2 border-border rounded-xl',
        variant === 'pill' && 'gap-2',
        variant === 'underline' && 'border-b-2 border-border gap-0',
        className
      )}
    >
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'pill' | 'underline'
}

export function TabsTrigger({ value, children, className, variant = 'default' }: TabsTriggerProps) {
  const { value: selectedValue, onValueChange } = useTabsContext()
  const isSelected = selectedValue === value

  return (
    <button
      role="tab"
      aria-selected={isSelected}
      onClick={() => onValueChange(value)}
      className={cn(
        'font-bold text-sm transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',

        variant === 'default' && [
          'px-4 py-2 rounded-lg',
          isSelected
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-foreground-muted hover:text-foreground hover:bg-primary/10',
        ],

        variant === 'pill' && [
          'px-4 md:px-6 py-2.5 rounded-xl',
          isSelected
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105'
            : 'bg-card-background border-2 border-border text-foreground hover:border-primary hover:text-primary',
        ],

        variant === 'underline' && [
          'px-4 py-3 border-b-2 -mb-[2px]',
          isSelected
            ? 'text-primary border-primary'
            : 'text-foreground-muted border-transparent hover:text-foreground hover:border-foreground-muted',
        ],

        className
      )}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { value: selectedValue } = useTabsContext()

  if (selectedValue !== value) return null

  return (
    <div
      role="tabpanel"
      className={cn('mt-4', className)}
    >
      {children}
    </div>
  )
}
