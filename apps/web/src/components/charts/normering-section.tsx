'use client'

import { useState, useEffect } from 'react'
import { NormeringChart } from './normering-chart'
import { NormeringTable } from './normering-table'
import type { NormeringData } from '@/lib/normering/types'

interface NormeringSectionProps {
  data: NormeringData
}

type TabId = 'total' | 'verbal' | 'kvantitativ'

export function NormeringSection({ data }: NormeringSectionProps) {
  const [activeTab, setActiveTab] = useState<TabId>('total')
  const [isJsEnabled, setIsJsEnabled] = useState(false)

  // Detect JavaScript availability for progressive enhancement
  useEffect(() => {
    setIsJsEnabled(true)
  }, [])

  // Determine which tabs to show (only if data exists)
  const tabs: { id: TabId; label: string }[] = [
    { id: 'total', label: 'Hela provet' },
  ]
  if (data.verbal) {
    tabs.push({ id: 'verbal', label: 'Verbal del' })
  }
  if (data.kvantitativ) {
    tabs.push({ id: 'kvantitativ', label: 'Kvantitativ del' })
  }

  // Get current distribution based on active tab
  const currentData = activeTab === 'total'
    ? data.total
    : activeTab === 'verbal'
      ? data.verbal
      : data.kvantitativ

  if (!currentData) return null

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-foreground mb-4">Normering</h2>

      {/* Tabs - only show if multiple options */}
      {tabs.length > 1 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card-background border-2 border-border text-foreground hover:border-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Chart - only render when JavaScript is enabled */}
      {isJsEnabled && (
        <div className="mb-6">
          <NormeringChart data={currentData} />
        </div>
      )}

      {/* Table - always rendered, collapsible when JS enabled */}
      <NormeringTable
        data={currentData}
        collapsible={isJsEnabled}
        defaultCollapsed={isJsEnabled}
      />
    </section>
  )
}
