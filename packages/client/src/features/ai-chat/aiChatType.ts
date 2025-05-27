import type { DataAnalysis } from '@/lib/data-analyzer';

export interface SqlQueryResponse {
  prompt: string;
  sqlQuery: string;
  result: Record<string, unknown>[] | { error: string };
  analysis?: DataAnalysis;
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
