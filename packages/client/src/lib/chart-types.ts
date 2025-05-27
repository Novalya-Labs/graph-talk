export type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'area' | 'composed' | 'heatmap';

export interface ChartConfig {
  type: ChartType;
  title: string;
  xAxis: { key: string; label: string; type: 'category' | 'number' | 'date' };
  yAxis: { key: string; label: string; type: 'number' };
  series: Array<{ key: string; name: string; color?: string }>;
  options?: Record<string, unknown>;
}
