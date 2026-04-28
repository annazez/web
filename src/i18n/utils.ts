import {
  dictionary,
  defaultLang,
  langPrefixRegex,
  getValidLanguageCode,
  type LanguageCode,
  type TranslationKey,
} from './dictionary';

export function getLangFromUrl(url: URL): LanguageCode {
  const match = langPrefixRegex.exec(url.pathname);
  return (match?.[1] as LanguageCode) ?? defaultLang;
}

export function useTranslations(lang: LanguageCode) {
  const validLang = getValidLanguageCode(lang);
  const langDictionary = dictionary[validLang];
  const fallbackDictionary = dictionary[defaultLang];

  return function t(key: TranslationKey): string {
    const value = langDictionary[key] ?? fallbackDictionary[key];
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
