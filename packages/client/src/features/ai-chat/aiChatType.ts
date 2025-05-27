export interface Message {
  id: string;
  message: string;
  sender: string;
  sendAt: string;
}

export interface AiChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

export type AiChatStore = AiChatState & {
  sendMessage: (message: string) => Promise<void>;
  resetMessages: () => void;
  clearError: () => void;
};
