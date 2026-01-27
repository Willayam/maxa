'use client'

import { useMemo } from 'react'
import { Bar, ComposedChart, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, ReferenceLine } from 'recharts'
import type { NormeringDistribution } from '@/lib/normering/types'

interface NormeringChartProps {
  data: NormeringDistribution
  /** Unique key for this data set - used to trigger clean re-renders between different data structures */
  chartKey?: string
}

// Smart percentage formatter - shows more decimals for small numbers
function formatPct(value: number): string {
  if (value === 0) return '0%'
  if (value < 0.01) return '<0.01%'
  if (value < 0.1) return `${value.toFixed(2)}%`
  if (value < 1) return `${value.toFixed(1)}%`
  return `${value.toFixed(1)}%`
}

export function NormeringChart({ data, chartKey }: NormeringChartProps) {
  // Use actual distribution data directly - no normalization
  // Different data sets (total vs verbal vs kvant) may have different granularities
  const chartData = useMemo(() => {
    return data.distribution.map(row => ({
      hpScore: row.hpScore,
      count: row.count,
      percentage: row.percentage,
      cumulativePercentage: row.cumulativePercentage,
      percentile: Math.max(0, 100 - row.cumulativePercentage),
    }))
  }, [data.distribution])

  // Find the peak (mode) for gradient reference
  const maxCount = Math.max(...chartData.map(d => d.count))

  // Determine X-axis interval based on data granularity
  // 0.05 increments = ~40 points, 0.1 increments = ~21 points
  const xAxisInterval = chartData.length > 30 ? 4 : 2

  return (
    // Key forces clean re-render when switching between different data structures
    // This gives a smooth fade transition rather than trying to morph incompatible bar layouts
    <div key={chartKey} className="h-[320px] md:h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 50, left: 10 }}
        >
          <defs>
            {/* Gradient for bars - amber to gold */}
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFD93D" stopOpacity={1} />
              <stop offset="100%" stopColor="#E5A400" stopOpacity={0.9} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="hpScore"
            tickFormatter={(v) => v.toFixed(1)}
            tick={{ fill: '#A8A3B8', fontSize: 12, fontWeight: 600 }}
            axisLine={{ stroke: '#3A3550' }}
            tickLine={{ stroke: '#3A3550' }}
            interval={xAxisInterval}
            domain={[0, 2]}
          />
          <YAxis
            tick={{ fill: '#A8A3B8', fontSize: 11, fontWeight: 600 }}
            axisLine={{ stroke: '#3A3550' }}
            tickLine={{ stroke: '#3A3550' }}
            width={45}
            tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toString()}
          />

          {/* Mean reference line */}
          <ReferenceLine
            x={data.mean}
            stroke="#F7C948"
            strokeDasharray="6 4"
            strokeWidth={3}
            label={{
              value: `Medel: ${data.mean.toFixed(2)}`,
              position: 'top',
              fill: '#F7C948',
              fontSize: 13,
              fontWeight: 700,
            }}
          />

          {/* Histogram bars with gradient fill */}
          <Bar
            dataKey="count"
            fill="url(#barGradient)"
            radius={[4, 4, 0, 0]}
            maxBarSize={20}
            animationDuration={600}
            animationEasing="ease-in-out"
          >
            {chartData.map((entry) => (
              <Cell
                key={`cell-${entry.hpScore}`}
                fillOpacity={entry.count > 0 ? 0.7 + (entry.count / maxCount) * 0.3 : 0}
              />
            ))}
          </Bar>

          {/* Enhanced tooltip */}
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null
              const d = payload[0].payload
              if (d.count === 0) return null
              const isTopScore = d.percentile <= 10
              const isAboveAverage = d.hpScore > data.mean

              return (
                <div className="bg-[#1E1A2D] border-2 border-[#F7C948] rounded-xl p-4 shadow-2xl shadow-[#F7C948]/20">
                  {/* Score badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl font-black text-[#F7C948]">
                      {d.hpScore.toFixed(2)}
                    </span>
                    {isTopScore && (
                      <span className="bg-[#F7C948] text-[#1a1625] text-xs font-bold px-2 py-0.5 rounded-full">
                        TOPP 10%
                      </span>
                    )}
                  </div>

                  {/* Percentile explanation */}
                  <p className="text-white font-semibold text-sm mb-1">
                    {d.cumulativePercentage >= 100
                      ? 'Högsta möjliga resultat!'
                      : `Bättre än ${formatPct(d.cumulativePercentage).replace('%', '')}% av alla`}
                  </p>

                  {/* Stats */}
                  <div className="text-[#A8A3B8] text-xs space-y-0.5">
                    <p>{d.count.toLocaleString('sv-SE')} personer fick detta resultat</p>
                    <p>({formatPct(d.percentage)} av alla provdeltagare)</p>
                  </div>

                  {/* Encouragement for above average */}
                  {isAboveAverage && !isTopScore && (
                    <p className="text-[#4ADE80] text-xs mt-2 font-medium">
                      ✓ Över genomsnittet!
                    </p>
                  )}
                </div>
              )
            }}
            cursor={{ fill: 'rgba(247, 201, 72, 0.1)' }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* X-axis label */}
      <p className="text-center text-[#A8A3B8] text-sm -mt-4">
        HP-värde (normerat resultat)
      </p>
    </div>
  )
}
