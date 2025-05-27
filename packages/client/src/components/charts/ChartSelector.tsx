import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart3, LineChart, PieChart, ScatterChart, AreaChart, BarChart } from 'lucide-react';
import type { ChartConfig, ChartType } from '@/lib/chart-types';

interface ChartSelectorProps {
  suggestedCharts: ChartConfig[];
  selectedChart: ChartConfig;
  onChartChange: (chart: ChartConfig) => void;
  confidence: number;
}

const CHART_ICONS: Record<ChartType, React.ComponentType<{ className?: string }>> = {
  bar: BarChart3,
  line: LineChart,
  pie: PieChart,
  scatter: ScatterChart,
  area: AreaChart,
  composed: BarChart,
  heatmap: BarChart3,
};

const CHART_LABELS: Record<ChartType, string> = {
  bar: 'Barres',
  line: 'Ligne',
  pie: 'Secteurs',
  scatter: 'Nuage de points',
  area: 'Aires',
  composed: 'Mixte',
  heatmap: 'Carte de chaleur',
};

export function ChartSelector({ suggestedCharts, selectedChart, onChartChange, confidence }: ChartSelectorProps) {
  if (suggestedCharts.length <= 1) return null;

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.8) return 'bg-green-500';
    if (conf >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Type de graphique:</span>
        <Badge variant="outline" className="gap-1">
          <div className={`w-2 h-2 rounded-full ${getConfidenceColor(confidence)}`} />
          {Math.round(confidence * 100)}% confiance
        </Badge>
      </div>

      <Select
        value={selectedChart.type}
        onValueChange={(value) => {
          const chart = suggestedCharts.find((c) => c.type === value);
          if (chart) onChartChange(chart);
        }}
      >
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {suggestedCharts.map((chart) => {
            const Icon = CHART_ICONS[chart.type];
            return (
              <SelectItem key={chart.type} value={chart.type}>
                <div className="flex items-center gap-2">
                  <Icon className="size-4" />
                  <span>{CHART_LABELS[chart.type]}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {suggestedCharts.length > 3 && (
        <div className="flex gap-1">
          {suggestedCharts.slice(0, 3).map((chart) => {
            const Icon = CHART_ICONS[chart.type];
            return (
              <Button
                key={chart.type}
                variant={selectedChart.type === chart.type ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChartChange(chart)}
                className="h-8 w-8 p-0"
              >
                <Icon className="size-3" />
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
