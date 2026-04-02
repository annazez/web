import en from './locales/en';
import cs from './locales/cs';
import type { TranslationDictionary, TranslationKey } from './locales/en';

export const languages = {
  en: 'EN',
  cs: 'CS',
} as const;

export type LanguageCode = keyof typeof languages;

export const defaultLang: LanguageCode = 'en';

export const dictionary: Record<LanguageCode, TranslationDictionary> = {
  en,
  cs,
};

export const routes = {
  workspace: {
    en: 'inventory',
    cs: 'inventar',
  },
} as const;

export type { TranslationKey };

export function isLanguageCode(value: string): value is LanguageCode {
  return value in languages;
}

export function getValidLanguageCode(value: string | undefined): LanguageCode {
  if (value && isLanguageCode(value)) return value;
  return defaultLang;
}
