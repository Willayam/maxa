'use client'

import { useState } from 'react'
import type { NormeringDistribution } from '@/lib/normering/types'

interface NormeringTableProps {
  data: NormeringDistribution
  collapsible?: boolean
  defaultCollapsed?: boolean
}

export function NormeringTable({
  data,
  collapsible = false,
  defaultCollapsed = false
}: NormeringTableProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  return (
    <div className="border-2 border-border rounded-xl overflow-hidden">
      {collapsible && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full p-4 bg-card-background text-left font-semibold hover:bg-primary/5 transition-colors flex items-center justify-between"
          aria-expanded={!isCollapsed}
        >
          <span>{isCollapsed ? 'Visa tabell' : 'Dölj tabell'}</span>
          <span className="text-foreground-muted">{isCollapsed ? '+' : '-'}</span>
        </button>
      )}

      {!isCollapsed && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <caption className="sr-only">
              Normeringstabell för högskoleprovet - fördelning av HP-värden
            </caption>
            <thead>
              <tr className="bg-primary/5">
                <th scope="col" className="p-3 text-left font-semibold">HP-värde</th>
                <th scope="col" className="p-3 text-right font-semibold">Antal</th>
                <th scope="col" className="p-3 text-right font-semibold">Andel (%)</th>
                <th scope="col" className="p-3 text-right font-semibold">Percentil</th>
              </tr>
            </thead>
            <tbody>
              {data.distribution.map((row, index) => (
                <tr
                  key={row.hpScore}
                  className={index % 2 === 0 ? 'bg-card-background' : 'bg-background'}
                >
                  <td className="p-3 font-medium">{row.hpScore.toFixed(2)}</td>
                  <td className="p-3 text-right">{row.count.toLocaleString('sv-SE')}</td>
                  <td className="p-3 text-right">{row.percentage.toFixed(1)}%</td>
                  <td className="p-3 text-right">
                    Topp {Math.round(100 - row.cumulativePercentage)}%
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-primary/5 font-semibold">
                <td className="p-3" colSpan={4}>
                  Medelvärde: {data.mean.toFixed(2)} |
                  Standardavvikelse: {data.stdDev.toFixed(2)} |
                  Deltagare: {data.totalParticipants.toLocaleString('sv-SE')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  )
}
