import { useAuthStore } from '@/features/auth/authStore';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const { language } = useAuthStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (language && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  return <>{children}</>;
};
