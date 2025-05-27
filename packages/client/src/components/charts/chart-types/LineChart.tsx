import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface LineChartComponentProps {
  data: Record<string, unknown>[];
  config: Record<string, { label: string; color: string }>;
  xAxisKey: string;
  series: Array<{ key: string; name: string; color?: string }>;
}

export function LineChartComponent({ data, config, xAxisKey, series }: LineChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
        <YAxis tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
        <ChartTooltip content={<ChartTooltipContent />} />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            stroke={s.color || config[s.key]?.color || 'hsl(var(--chart-1))'}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
