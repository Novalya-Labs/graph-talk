export type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'area' | 'composed' | 'table';

export interface ChartRecommendation {
  type: ChartType;
  title: string;
  confidence: number;
  reasoning: string;
  xAxis?: {
    key: string;
    label: string;
    type: 'category' | 'number' | 'date';
  };
  yAxis?: {
    key: string;
    label: string;
    type: 'number';
  };
  series?: Array<{
    key: string;
    name: string;
    color?: string;
  }>;
}

export interface DataInsight {
  type: 'trend' | 'comparison' | 'outlier' | 'summary';
  message: string;
  value?: number | string;
}

export interface EnhancedQueryResponse {
  prompt: string;
  sqlQuery: string;
  result: unknown;
  chartRecommendation: ChartRecommendation | null;
  conversationalResponse: string;
  insights: DataInsight[];
  executionTime?: number;
}
