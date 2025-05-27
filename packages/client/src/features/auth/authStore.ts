import { env } from '@/src/configs/env';
import i18next from 'i18next';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, AuthStore } from './authType';

const initialAuthState: AuthState = {
  loading: false,
  error: null,
  language: 'en',
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialAuthState,

      resetAuth: () => {
        set({ ...initialAuthState });
      },

      clearError: () => {
        set({ error: null });
      },

      setLanguage: (language) => {
        i18next.changeLanguage(language);
        set({ language });
      },
    }),
    {
      name: `auth-storage-${env.app.appKey}`,
      partialize: (state) => ({
        language: state.language,
      }),
    },
  ),
);
