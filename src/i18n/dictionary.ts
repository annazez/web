import en from './locales/en';
import cs from './locales/cs';
import type { TranslationDictionary, TranslationKey } from './locales/en';

export const languages = {
  en: 'EN',
  cs: 'CS',
} as const;

export type LanguageCode = keyof typeof languages;

export const supportedLangs = Object.keys(languages) as readonly LanguageCode[];
export const languageEntries = Object.entries(languages) as readonly [LanguageCode, string][];

export const defaultLang: LanguageCode = 'en';

export const dictionary: Record<LanguageCode, TranslationDictionary> = {
  en,
  cs,
};

export const langPrefixRegex = new RegExp(`^/(${Object.keys(languages).join('|')})(?:/|$)`);

export const routes = {
  workspace: {
    en: 'inventory',
    cs: 'inventar',
  } satisfies Record<LanguageCode, string>,
} as const;

export type { TranslationKey };

export function isLanguageCode(value: string): value is LanguageCode {
  return Object.prototype.hasOwnProperty.call(languages, value);
}

export function getValidLanguageCode(value: string | undefined): LanguageCode {
  if (value && isLanguageCode(value)) return value;
  return defaultLang;
}
