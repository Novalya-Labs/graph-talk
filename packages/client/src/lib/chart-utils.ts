import type { ChartRecommendation } from '@/features/ai-chat/aiChatType';
import type { ChartConfig } from './chart-types';

export function convertToChartConfig(recommendation: ChartRecommendation): ChartConfig {
  return {
    type: recommendation.type as 'bar' | 'line' | 'pie' | 'scatter' | 'area' | 'composed',
    title: recommendation.title,
    xAxis: recommendation.xAxis || { key: '', label: '', type: 'category' as const },
    yAxis: recommendation.yAxis || { key: '', label: '', type: 'number' as const },
    series: recommendation.series || [],
  };
}
