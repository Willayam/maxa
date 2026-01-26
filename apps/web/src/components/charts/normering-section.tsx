'use client'

import { useState, useEffect } from 'react'
import { NormeringChart } from './normering-chart'
import { NormeringTable } from './normering-table'
import type { NormeringData, NormeringDistribution } from '@/lib/normering/types'

interface NormeringSectionProps {
  data: NormeringData
}

type TabId = 'total' | 'verbal' | 'kvantitativ'

// Helper to find score at a given percentile
function getScoreAtPercentile(distribution: NormeringDistribution, targetPercentile: number): number {
  // Find the row where cumulative percentage first exceeds (100 - targetPercentile)
  const threshold = 100 - targetPercentile
  const row = distribution.distribution.find(r => r.cumulativePercentage >= threshold)
  return row?.hpScore ?? 2.0
}

export function NormeringSection({ data }: NormeringSectionProps) {
  const [activeTab, setActiveTab] = useState<TabId>('total')
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
      <div className="relative mb-8">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FFD93D] to-[#E5A400] rounded-full" />
        <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
          Normering
        </h2>
        <p className="text-[#A8A3B8] text-lg max-w-2xl">
          Se hur poängen fördelade sig bland alla {currentData.totalParticipants.toLocaleString('sv-SE')} som skrev provet.
        </p>
      </div>

      {/* Stats cards - gamified achievement style */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        {/* Mean score card */}
        <div className="bg-[#1E1A2D] border-2 border-[#3A3550] rounded-2xl p-4 hover:border-[#F7C948] transition-colors group">
          <p className="text-[#A8A3B8] text-xs uppercase tracking-wide mb-1">Genomsnitt</p>
          <p className="text-3xl md:text-4xl font-black text-white group-hover:text-[#F7C948] transition-colors">
            {currentData.mean.toFixed(2)}
          </p>
          <p className="text-[#6C7A89] text-xs mt-1">HP-värde</p>
        </div>

        {/* Participants card */}
        <div className="bg-[#1E1A2D] border-2 border-[#3A3550] rounded-2xl p-4 hover:border-[#F7C948] transition-colors group">
          <p className="text-[#A8A3B8] text-xs uppercase tracking-wide mb-1">Provdeltagare</p>
          <p className="text-3xl md:text-4xl font-black text-white group-hover:text-[#F7C948] transition-colors">
            {(currentData.totalParticipants / 1000).toFixed(0)}k
          </p>
          <p className="text-[#6C7A89] text-xs mt-1">personer</p>
        </div>

        {/* Top 10% threshold */}
        <div className="bg-gradient-to-br from-[#F7C948]/20 to-[#E5A400]/10 border-2 border-[#F7C948]/50 rounded-2xl p-4">
          <p className="text-[#F7C948] text-xs uppercase tracking-wide mb-1 font-semibold">Topp 10%</p>
          <p className="text-3xl md:text-4xl font-black text-[#F7C948]">
            {top10Score.toFixed(2)}+
          </p>
          <p className="text-[#A8A3B8] text-xs mt-1">eller högre</p>
        </div>

        {/* Top 25% threshold */}
        <div className="bg-[#1E1A2D] border-2 border-[#3A3550] rounded-2xl p-4 hover:border-[#F7C948] transition-colors group">
          <p className="text-[#A8A3B8] text-xs uppercase tracking-wide mb-1">Topp 25%</p>
          <p className="text-3xl md:text-4xl font-black text-white group-hover:text-[#F7C948] transition-colors">
            {top25Score.toFixed(2)}+
          </p>
          <p className="text-[#6C7A89] text-xs mt-1">eller högre</p>
        </div>
      </div>

      {/* Tabs */}
      {tabs.length > 1 && (
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 md:px-6 py-2.5 rounded-xl font-bold text-sm md:text-base
                transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-[#F7C948] text-[#1a1625] shadow-lg shadow-[#F7C948]/25 scale-105'
                  : 'bg-[#1E1A2D] border-2 border-[#3A3550] text-white hover:border-[#F7C948] hover:text-[#F7C948]'
                }
              `}
            >
              <span className="hidden md:inline">{tab.label}</span>
              <span className="md:hidden">{tab.shortLabel}</span>
            </button>
          ))}
        </div>
      )}

      {/* Chart container with subtle border */}
      {isJsEnabled && (
        <div className="bg-[#1E1A2D]/50 border-2 border-[#3A3550] rounded-2xl p-4 md:p-6 mb-6">
          <NormeringChart data={currentData} />
        </div>
      )}

      {/* Educational explainer */}
      <div className="bg-[#1E1A2D] border-2 border-[#3A3550] rounded-2xl p-5 md:p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <span className="text-[#F7C948]">💡</span>
          Vad betyder normeringen?
        </h3>
        <div className="text-[#A8A3B8] space-y-3 text-sm md:text-base">
          <p>
            <strong className="text-white">Normering</strong> omvandlar din råpoäng till ett
            jämförbart HP-värde mellan <strong className="text-[#F7C948]">0.00</strong> och{' '}
            <strong className="text-[#F7C948]">2.00</strong>. Detta gör att resultat från olika
            provtillfällen kan jämföras rättvist.
          </p>
          <p>
            Diagrammet ovan visar hur alla provdeltagare presterade. De flesta hamnar runt
            genomsnittet (<strong className="text-[#F7C948]">{currentData.mean.toFixed(2)}</strong>),
            medan färre når de högsta och lägsta poängen.
          </p>
          <p className="text-[#6C7A89] text-xs md:text-sm">
            Ditt HP-värde gäller i fem år och endast ditt bästa resultat räknas vid
            universitetsansökan.
          </p>
        </div>
      </div>

      {/* Data table */}
      <NormeringTable
        data={currentData}
        collapsible={isJsEnabled}
        defaultCollapsed={isJsEnabled}
      />
    </section>
  )
}
