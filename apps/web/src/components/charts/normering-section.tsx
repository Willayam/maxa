'use client'

import { useState, useEffect } from 'react'
import { NormeringChart } from './normering-chart'
import { NormeringTable } from './normering-table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { NormeringData, NormeringDistribution } from '@/lib/normering/types'

interface NormeringFile {
  label: string
  url: string
}

interface NormeringSectionProps {
  data: NormeringData
  pdfSources?: NormeringFile[]
}

type TabId = 'total' | 'verbal' | 'kvantitativ'
type ViewMode = 'chart' | 'table'

// Helper to find score at a given percentile
function getScoreAtPercentile(distribution: NormeringDistribution, targetPercentile: number): number {
  const threshold = 100 - targetPercentile
  const row = distribution.distribution.find(r => r.cumulativePercentage >= threshold)
  return row?.hpScore ?? 2.0
}

export function NormeringSection({ data, pdfSources = [] }: NormeringSectionProps) {
  const [activeTab, setActiveTab] = useState<TabId>('total')
  const [viewMode, setViewMode] = useState<ViewMode>('chart')
  const [isJsEnabled, setIsJsEnabled] = useState(false)

  useEffect(() => {
    setIsJsEnabled(true)
  }, [])

  // Build tabs based on available data
  const tabs: { id: TabId; label: string; shortLabel: string }[] = [
    { id: 'total', label: 'Hela provet', shortLabel: 'Totalt' },
  ]
  if (data.verbal) {
    tabs.push({ id: 'verbal', label: 'Verbal del', shortLabel: 'Verbal' })
  }
  if (data.kvantitativ) {
    tabs.push({ id: 'kvantitativ', label: 'Kvantitativ del', shortLabel: 'Kvant' })
  }

  // Get current distribution
  const currentData = activeTab === 'total'
    ? data.total
    : activeTab === 'verbal'
      ? data.verbal
      : data.kvantitativ

  if (!currentData) return null

  // Calculate key percentile thresholds
  const top10Score = getScoreAtPercentile(currentData, 10)
  const top25Score = getScoreAtPercentile(currentData, 25)

  return (
    <section className="mt-16 mb-8">
      {/* Header with gradient accent */}
      <div className="relative mb-6">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary-dark rounded-full" />
        <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
          Normering
        </h2>
        {/* Integrated explainer intro */}
        <div className="text-foreground-muted text-base md:text-lg max-w-3xl space-y-3">
          <p>
            <strong className="text-foreground">Normering</strong> omvandlar din råpoäng till ett jämförbart
            HP-värde mellan <strong className="text-primary">0.00</strong> och{' '}
            <strong className="text-primary">2.00</strong>. Detta gör att resultat från olika
            provtillfällen kan jämföras rättvist.
          </p>
          <p>
            Fördelningen nedan visar hur alla {currentData.totalParticipants.toLocaleString('sv-SE')} provdeltagare
            presterade. De flesta hamnar runt genomsnittet (<strong className="text-primary">{currentData.mean.toFixed(2)}</strong>),
            medan färre når de högsta och lägsta poängen. Ditt HP-värde gäller i fem år och endast ditt bästa
            resultat räknas vid universitetsansökan.
          </p>
          {/* PDF sources as inline links */}
          {pdfSources.length > 0 && (
            <p className="text-sm text-foreground-muted">
              <span className="font-medium text-foreground">Källor:</span>{' '}
              {pdfSources.map((source, index) => (
                <span key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {source.label}
                  </a>
                  {index < pdfSources.length - 1 && ', '}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        {/* Mean score card */}
        <div className="bg-card-background border-2 border-border rounded-2xl p-4">
          <p className="text-foreground-muted text-xs uppercase tracking-wide mb-1">Genomsnitt</p>
          <p className="text-3xl md:text-4xl font-black text-foreground tabular-nums">
            {currentData.mean.toFixed(2)}
          </p>
          <p className="text-foreground-muted/60 text-xs mt-1">HP-värde</p>
        </div>

        {/* Participants card */}
        <div className="bg-card-background border-2 border-border rounded-2xl p-4">
          <p className="text-foreground-muted text-xs uppercase tracking-wide mb-1">Provdeltagare</p>
          <p className="text-3xl md:text-4xl font-black text-foreground tabular-nums">
            {(currentData.totalParticipants / 1000).toFixed(0)}k
          </p>
          <p className="text-foreground-muted/60 text-xs mt-1">personer</p>
        </div>

        {/* Top 10% threshold - highlighted card */}
        <div className="bg-gradient-to-br from-primary/20 to-primary-dark/10 border-2 border-primary/50 rounded-2xl p-4">
          <p className="text-primary text-xs uppercase tracking-wide mb-1 font-semibold">Topp 10%</p>
          <p className="text-3xl md:text-4xl font-black text-primary tabular-nums">
            {top10Score.toFixed(2)}+
          </p>
          <p className="text-foreground-muted text-xs mt-1">eller högre</p>
        </div>

        {/* Top 25% threshold */}
        <div className="bg-card-background border-2 border-border rounded-2xl p-4">
          <p className="text-foreground-muted text-xs uppercase tracking-wide mb-1">Topp 25%</p>
          <p className="text-3xl md:text-4xl font-black text-foreground tabular-nums">
            {top25Score.toFixed(2)}+
          </p>
          <p className="text-foreground-muted/60 text-xs mt-1">eller högre</p>
        </div>
      </div>

      {/* Controls row: Data tabs on left, View toggle on right */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Data selection tabs */}
        {tabs.length > 1 && (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabId)}>
            <TabsList variant="default">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} variant="default">
                  <span className="hidden md:inline">{tab.label}</span>
                  <span className="md:hidden">{tab.shortLabel}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {/* Chart/Table view toggle */}
        {isJsEnabled && (
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
            <TabsList variant="default">
              <TabsTrigger value="chart" variant="default">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="hidden sm:inline">Diagram</span>
                </span>
              </TabsTrigger>
              <TabsTrigger value="table" variant="default">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="hidden sm:inline">Tabell</span>
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>

      {/* Content area: Chart or Table based on view mode */}
      {viewMode === 'chart' && isJsEnabled && (
        <div className="bg-card-background/50 border-2 border-border rounded-2xl p-4 md:p-6">
          <NormeringChart data={currentData} chartKey={activeTab} />
        </div>
      )}

      {viewMode === 'table' && (
        <NormeringTable
          data={currentData}
          collapsible={false}
          defaultCollapsed={false}
        />
      )}

      {/* Fallback for no-JS: show chart placeholder and table */}
      {!isJsEnabled && (
        <div className="space-y-6">
          <div className="bg-card-background/50 border-2 border-border rounded-2xl p-8 text-center">
            <p className="text-foreground-muted">
              Aktivera JavaScript för att se det interaktiva diagrammet.
            </p>
          </div>
          <NormeringTable
            data={currentData}
            collapsible={false}
            defaultCollapsed={false}
          />
        </div>
      )}
    </section>
  )
}
