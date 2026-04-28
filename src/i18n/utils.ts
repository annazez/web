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
    return langDictionary[key] ?? fallbackDictionary[key];
  };
}

export function localeForOg(lang: LanguageCode): string {
  return lang === 'cs' ? 'cs_CZ' : 'en_US';
}

export function localeFor(lang: LanguageCode): string {
  return lang === 'cs' ? 'cs-CZ' : 'en-GB';
}
