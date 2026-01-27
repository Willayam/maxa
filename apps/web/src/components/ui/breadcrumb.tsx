import * as React from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbProps {
  children: React.ReactNode
  className?: string
}

export function Breadcrumb({ children, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('', className)}>
      {children}
    </nav>
  )
}

interface BreadcrumbListProps {
  children: React.ReactNode
  className?: string
}

export function BreadcrumbList({ children, className }: BreadcrumbListProps) {
  return (
    <ol className={cn('flex items-center gap-2 text-sm', className)}>
      {children}
    </ol>
  )
}

interface BreadcrumbItemProps {
  children: React.ReactNode
  className?: string
}

export function BreadcrumbItem({ children, className }: BreadcrumbItemProps) {
  return (
    <li className={cn('flex items-center gap-2', className)}>
      {children}
    </li>
  )
}

interface BreadcrumbLinkProps {
  asChild?: boolean
  children: React.ReactNode
  className?: string
}

export function BreadcrumbLink({ asChild, children, className }: BreadcrumbLinkProps) {
  if (asChild) {
    return <>{children}</>
  }

  return (
    <a
      className={cn(
        'text-foreground-muted hover:text-primary transition-colors',
        className
      )}
    >
      {children}
    </a>
  )
}

interface BreadcrumbPageProps {
  children: React.ReactNode
  className?: string
}

export function BreadcrumbPage({ children, className }: BreadcrumbPageProps) {
  return (
    <span
      aria-current="page"
      className={cn('text-foreground font-medium', className)}
    >
      {children}
    </span>
  )
}

interface BreadcrumbSeparatorProps {
  children?: React.ReactNode
  className?: string
}

export function BreadcrumbSeparator({ children, className }: BreadcrumbSeparatorProps) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn('text-foreground-muted', className)}
    >
      {children || <ChevronRight className="h-4 w-4" />}
    </span>
  )
}
