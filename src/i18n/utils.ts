import { getEntry } from 'astro:content';
import {
  defaultLang,
  langPrefixRegex,
  getValidLanguageCode,
  type LanguageCode,
} from './dictionary';

export function getLangFromUrl(url: URL): LanguageCode {
  const match = langPrefixRegex.exec(url.pathname);
  return (match?.[1] as LanguageCode) ?? defaultLang;
}

export async function useTranslations(lang: LanguageCode) {
  const validLang = getValidLanguageCode(lang);
  const entry = await getEntry('translations', validLang);
  const fallbackEntry = await getEntry('translations', defaultLang);

  if (!entry) {
    throw new Error(`Translations not found for language: ${validLang}`);
  }

  return function t(key: string): string {
    const value =
      entry.data[key as keyof typeof entry.data] ??
      fallbackEntry?.data[key as keyof typeof entry.data];
    if (value !== undefined) {
      return value;
    }

    const isDev =
      (typeof import.meta.env !== 'undefined' ? import.meta.env.DEV : false) ||
      (typeof process !== 'undefined' && process.env.NODE_ENV === 'development');

    if (isDev) {
      throw new Error(`Missing translation key: ${key}`);
    }

    return key;
  };
}

export function localeForOg(lang: LanguageCode): string {
  return lang === 'cs' ? 'cs_CZ' : 'en_US';
}

export function localeFor(lang: LanguageCode): string {
  return lang === 'cs' ? 'cs-CZ' : 'en-GB';
}
