import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import EN from './locales/en.json';
import FR from './locales/fr.json';

export type LocaleKey = 'en' | 'fr';
export type Namespace = 'common' | 'home' | 'errorBoundary' | 'howItWorks';

export const defaultNS: Namespace = 'common';
export const resources = {
  en: EN,
  fr: FR,
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    defaultNS,
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['navigator'],
      caches: [],
    },
  });

export default i18n;
