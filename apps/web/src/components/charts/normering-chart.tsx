'use client'

import { Bar, Line, ComposedChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import type { NormeringDistribution } from '@/lib/normering/types'

interface NormeringChartProps {
  data: NormeringDistribution
}

export function NormeringChart({ data }: NormeringChartProps) {
  // Transform data for chart, calculate percentile from cumulative
  const chartData = data.distribution.map(row => ({
    hpScore: row.hpScore,
    count: row.count,
    percentile: Math.round(100 - row.cumulativePercentage),
  }))

  return (
    <div className="h-[300px] md:h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
          <XAxis
            dataKey="hpScore"
            tickFormatter={(v) => v.toFixed(1)}
            label={{ value: 'HP-värde', position: 'insideBottom', offset: -10 }}
            domain={[0, 2.0]}
          />
          <YAxis
            label={{ value: 'Antal', angle: -90, position: 'insideLeft', offset: -10 }}
          />

          {/* Histogram bars */}
          <Bar
            dataKey="count"
            fill="hsl(var(--primary))"
            radius={[2, 2, 0, 0]}
            barSize={8}
          />

          {/* Bell curve line */}
          <Line
            dataKey="count"
            stroke="hsl(var(--primary-dark, var(--primary)))"
            strokeWidth={3}
            dot={false}
            type="monotone"
          />

          {/* Custom tooltip - positioned above on mobile */}
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null
              const d = payload[0].payload
              return (
                <div className="bg-card-background border-2 border-border rounded-lg p-3 shadow-lg">
                  <p className="font-bold text-foreground text-lg">
                    {d.hpScore.toFixed(1)}
                  </p>
                  <p className="text-foreground-muted">
                    Topp {d.percentile}%
                  </p>
                </div>
              )
            }}
            position={{ y: 0 }}
            wrapperStyle={{ zIndex: 1000 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
