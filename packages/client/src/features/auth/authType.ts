export interface AuthState {
  loading: boolean;
  error: string | null;
  language: string;
}

export type AuthStore = AuthState & {
  resetAuth: () => void;
  clearError: () => void;
  setLanguage: (language: string) => void;
};
