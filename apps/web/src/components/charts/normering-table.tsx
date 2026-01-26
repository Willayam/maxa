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

  // Find which row is closest to the mean
  const meanRowIndex = data.distribution.findIndex(
    (row, i, arr) => {
      if (i === arr.length - 1) return true
      return row.hpScore <= data.mean && arr[i + 1].hpScore > data.mean
    }
  )

  return (
    <div className="border-2 border-[#3A3550] rounded-2xl overflow-hidden bg-[#1E1A2D]">
      {collapsible && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full p-4 md:p-5 text-left font-bold hover:bg-[#F7C948]/5 transition-colors flex items-center justify-between group"
          aria-expanded={!isCollapsed}
        >
          <span className="flex items-center gap-2">
            <span className="text-[#F7C948]">📊</span>
            <span className="text-white group-hover:text-[#F7C948] transition-colors">
              {isCollapsed ? 'Visa fullständig tabell' : 'Dölj tabell'}
            </span>
          </span>
          <span className={`
            w-8 h-8 rounded-lg bg-[#3A3550] flex items-center justify-center
            text-[#A8A3B8] font-mono text-lg
            group-hover:bg-[#F7C948] group-hover:text-[#1a1625]
            transition-all duration-200
            ${!isCollapsed ? 'rotate-180' : ''}
          `}>
            ↓
          </span>
        </button>
      )}

      {!isCollapsed && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <caption className="sr-only">
              Normeringstabell för högskoleprovet - fördelning av HP-värden
            </caption>
            <thead>
              <tr className="bg-[#F7C948]/10 border-b-2 border-[#3A3550]">
                <th scope="col" className="p-3 md:p-4 text-left font-bold text-[#F7C948] text-sm">
                  HP-värde
                </th>
                <th scope="col" className="p-3 md:p-4 text-right font-bold text-[#F7C948] text-sm">
                  Antal
                </th>
                <th scope="col" className="p-3 md:p-4 text-right font-bold text-[#F7C948] text-sm">
                  Andel
                </th>
                <th scope="col" className="p-3 md:p-4 text-right font-bold text-[#F7C948] text-sm">
                  Percentil
                </th>
              </tr>
            </thead>
            <tbody>
              {data.distribution.map((row, index) => {
                const percentile = Math.max(0, Math.round(100 - row.cumulativePercentage))
                const isTopScore = percentile <= 10
                const isMeanRow = index === meanRowIndex

                return (
                  <tr
                    key={row.hpScore}
                    className={`
                      border-b border-[#3A3550]/50 transition-colors
                      ${isMeanRow
                        ? 'bg-[#F7C948]/10 border-l-4 border-l-[#F7C948]'
                        : index % 2 === 0
                          ? 'bg-[#1E1A2D]'
                          : 'bg-[#0F0D1A]/50'
                      }
                      hover:bg-[#F7C948]/5
                    `}
                  >
                    <td className={`p-3 md:p-4 font-mono font-bold ${isTopScore ? 'text-[#F7C948]' : 'text-white'}`}>
                      {row.hpScore.toFixed(2)}
                      {isMeanRow && (
                        <span className="ml-2 text-xs bg-[#F7C948] text-[#1a1625] px-1.5 py-0.5 rounded font-sans">
                          MEDEL
                        </span>
                      )}
                    </td>
                    <td className="p-3 md:p-4 text-right text-[#A8A3B8] font-mono">
                      {row.count.toLocaleString('sv-SE')}
                    </td>
                    <td className="p-3 md:p-4 text-right text-[#A8A3B8]">
                      {row.percentage.toFixed(1)}%
                    </td>
                    <td className={`p-3 md:p-4 text-right font-semibold ${isTopScore ? 'text-[#F7C948]' : 'text-white'}`}>
                      {percentile === 0 ? (
                        <span className="text-[#F7C948]">Topp! 🏆</span>
                      ) : (
                        `Topp ${percentile}%`
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="bg-[#F7C948]/10 border-t-2 border-[#3A3550]">
                <td className="p-4" colSpan={4}>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <span className="text-[#A8A3B8]">
                      Medelvärde: <strong className="text-[#F7C948]">{data.mean.toFixed(2)}</strong>
                    </span>
                    <span className="text-[#A8A3B8]">
                      Standardavvikelse: <strong className="text-white">{data.stdDev.toFixed(2)}</strong>
                    </span>
                    <span className="text-[#A8A3B8]">
                      Totalt: <strong className="text-white">{data.totalParticipants.toLocaleString('sv-SE')}</strong> deltagare
                    </span>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  )
}
