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

export interface SqlQueryResponse {
  prompt: string;
  sqlQuery: string;
  result: Record<string, unknown>[] | { error: string };
  chartRecommendation: ChartRecommendation | null;
  conversationalResponse: string;
  insights: DataInsight[];
  executionTime?: number;
}

export interface AiChatMessage {
  id: string;
  timestamp: Date;
  userPrompt: string;
  response: SqlQueryResponse;
}

export interface AiChatState {
  messages: AiChatMessage[];
  loading: boolean;
  error: string | null;
}

export interface AiChatStore extends AiChatState {
  sendMessage: (message: string) => Promise<void>;
  resetMessages: () => void;
  clearError: () => void;
}
