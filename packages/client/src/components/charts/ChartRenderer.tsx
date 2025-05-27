import React, { useRef } from 'react';
import { ChartContainer } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import type { ChartConfig } from '@/lib/chart-types';

// Import chart types
import { BarChartComponent } from './chart-types/BarChart';
import { LineChartComponent } from './chart-types/LineChart';
import { PieChartComponent } from './chart-types/PieChart';
import { ScatterChartComponent } from './chart-types/ScatterChart';
import { AreaChartComponent } from './chart-types/AreaChart';
import { ComposedChartComponent } from './chart-types/ComposedChart';

import { ChartExportToolbar } from './ChartExportToolbar';

interface ChartRendererProps {
  data: Record<string, unknown>[];
  config: ChartConfig;
  showExportToolbar?: boolean;
  className?: string;
}

export function ChartRenderer({ data, config, showExportToolbar = true, className }: ChartRendererProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);

  const renderChart = () => {
    const chartConfig = {
      [config.xAxis.key]: {
        label: config.xAxis.label,
        color: config.series[0]?.color || 'hsl(var(--chart-1))',
      },
      ...config.series.reduce((acc: Record<string, { label: string; color: string }>, series) => {
        acc[series.key] = {
          label: series.name,
          color: series.color || 'hsl(var(--chart-1))',
        };
        return acc;
      }, {}),
    };

    const commonProps = {
      data,
      config: chartConfig,
      xAxisKey: config.xAxis.key,
      series: config.series,
    };

    switch (config.type) {
      case 'bar':
        return <BarChartComponent {...commonProps} />;
      case 'line':
        return <LineChartComponent {...commonProps} />;
      case 'pie':
        return <PieChartComponent {...commonProps} />;
      case 'scatter':
        return <ScatterChartComponent {...commonProps} />;
      case 'area':
        return <AreaChartComponent {...commonProps} />;
      case 'composed':
        return <ComposedChartComponent {...commonProps} />;
      default:
        return (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Chart type "{config.type}" not implemented yet
          </div>
        );
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4" />
          <CardTitle className="text-base font-medium">{config.title}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {data.length} points
          </Badge>
          {showExportToolbar && <ChartExportToolbar chartRef={chartRef} data={data} chartTitle={config.title} />}
        </div>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} className="w-full">
          <ChartContainer config={{}} className="h-[400px] w-full">
            {renderChart()}
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
