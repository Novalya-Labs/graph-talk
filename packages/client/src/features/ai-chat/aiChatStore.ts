import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AiChatStore, AiChatState } from './aiChatType';
import { env } from '@/configs/env';
import { sendMessage } from './send-message/sendMessage';

const initialAiChatState: AiChatState = {
  messages: [],
  loading: false,
  error: null,
};

export const useAiChatStore = create<AiChatStore>()(
  persist(
    (set, get) => ({
      ...initialAiChatState,

      sendMessage: async (message: string) => {
        set({ loading: true, error: null });
        try {
          const response = await sendMessage(message);
          set({ messages: [...get().messages, response] });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
        } finally {
          set({ loading: false });
        }
      },
      resetMessages: () => {
        set({ ...initialAiChatState });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: `ai-chat-storage-${env.app.appKey}`,
      partialize: (state) => ({
        messages: state.messages,
      }),
    },
  ),
);
