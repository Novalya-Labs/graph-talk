import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface AreaChartComponentProps {
  data: Record<string, unknown>[];
  config: Record<string, { label: string; color: string }>;
  xAxisKey: string;
  series: Array<{ key: string; name: string; color?: string }>;
}

export function AreaChartComponent({ data, config, xAxisKey, series }: AreaChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
        <YAxis tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
        <ChartTooltip content={<ChartTooltipContent />} />
        {series.map((s, index) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            stackId={index === 0 ? '1' : undefined}
            stroke={s.color || config[s.key]?.color || 'hsl(var(--chart-1))'}
            fill={s.color || config[s.key]?.color || 'hsl(var(--chart-1))'}
            fillOpacity={0.6}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
