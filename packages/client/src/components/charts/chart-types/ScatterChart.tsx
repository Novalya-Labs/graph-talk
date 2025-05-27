import React from 'react';
import { Scatter, ScatterChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface ScatterChartComponentProps {
  data: Record<string, unknown>[];
  config: Record<string, { label: string; color: string }>;
  xAxisKey: string;
  series: Array<{ key: string; name: string; color?: string }>;
}

export function ScatterChartComponent({ data, config, xAxisKey, series }: ScatterChartComponentProps) {
  const yAxisKey = series[0]?.key;

  if (!yAxisKey) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          type="number"
          dataKey={xAxisKey}
          tickLine={false}
          axisLine={false}
          className="text-xs fill-muted-foreground"
        />
        <YAxis
          type="number"
          dataKey={yAxisKey}
          tickLine={false}
          axisLine={false}
          className="text-xs fill-muted-foreground"
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Scatter dataKey={yAxisKey} fill={series[0]?.color || config[yAxisKey]?.color || 'hsl(var(--chart-1))'} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
