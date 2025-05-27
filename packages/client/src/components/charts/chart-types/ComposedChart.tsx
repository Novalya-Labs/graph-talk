import React from 'react';
import { ComposedChart, Bar, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface ComposedChartComponentProps {
  data: Record<string, unknown>[];
  config: Record<string, { label: string; color: string }>;
  xAxisKey: string;
  series: Array<{ key: string; name: string; color?: string }>;
}

export function ComposedChartComponent({ data, config, xAxisKey, series }: ComposedChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
        <YAxis tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
        <ChartTooltip content={<ChartTooltipContent />} />
        {series.map((s, index) => {
          if (index === 0) {
            return (
              <Bar
                key={s.key}
                dataKey={s.key}
                fill={s.color || config[s.key]?.color || 'hsl(var(--chart-1))'}
                radius={[4, 4, 0, 0]}
              />
            );
          }
          return (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={s.color || config[s.key]?.color || 'hsl(var(--chart-2))'}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          );
        })}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
