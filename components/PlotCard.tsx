'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts';
import type { PlotPoint } from '@/types';

interface PlotCardProps {
  title: string;
  data: PlotPoint[];
  xLabel: string;
  yLabel: string;
  highlightX?: number;
}

export function PlotCard({ title, data, xLabel, yLabel, highlightX }: PlotCardProps) {
  const highlightPoint = highlightX !== undefined
    ? data.find(p => p.x === highlightX)
    : undefined;

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-stone-700 mb-4">{title}</h3>
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis
              dataKey="x"
              tick={{ fontSize: 11, fill: '#78716c' }}
              label={{ value: xLabel, position: 'insideBottom', offset: -10, style: { fontSize: 12, fill: '#78716c' } }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#78716c' }}
              label={{ value: yLabel, angle: -90, position: 'insideLeft', offset: 5, style: { fontSize: 12, fill: '#78716c' } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fafaf9',
                border: '1px solid #d6d3d1',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
              formatter={(value) => [typeof value === 'number' ? value.toLocaleString() : String(value), yLabel]}
              labelFormatter={(label) => `${xLabel}: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="y"
              stroke="#6b8f71"
              strokeWidth={2}
              dot={{ r: 3, fill: '#6b8f71', stroke: '#6b8f71' }}
              activeDot={{ r: 5, fill: '#4a7050' }}
            />
            {highlightPoint && (
              <ReferenceDot
                x={highlightPoint.x}
                y={highlightPoint.y}
                r={7}
                fill="#ef4444"
                stroke="#fff"
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
