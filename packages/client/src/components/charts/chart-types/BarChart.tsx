import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface BarChartComponentProps {
  data: Record<string, unknown>[];
  config: Record<string, { label: string; color: string }>;
  xAxisKey: string;
  series: Array<{ key: string; name: string; color?: string }>;
}

export function BarChartComponent({ data, config, xAxisKey, series }: BarChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
        <YAxis tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
        <ChartTooltip content={<ChartTooltipContent />} />
        {series.map((s) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            fill={s.color || config[s.key]?.color || 'hsl(var(--chart-1))'}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
