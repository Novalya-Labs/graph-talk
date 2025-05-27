import { useMemo } from 'react';
import { analyzeData, type DataAnalysis } from '@/lib/data-analyzer';

export function useChartAnalysis(data: Record<string, unknown>[]): DataAnalysis {
  return useMemo(() => {
    return analyzeData(data);
  }, [data]);
}

export function useChartRecommendations(data: Record<string, unknown>[]) {
  const analysis = useChartAnalysis(data);
  
  return useMemo(() => {
    const { isChartable, suggestedCharts, primaryChart, confidence } = analysis;
    
    return {
      shouldShowChart: isChartable && confidence > 0.6,
      recommendedChart: primaryChart,
      alternativeCharts: suggestedCharts.slice(1),
      confidence,
      analysis,
    };
  }, [analysis]);
} 