import {
  dictionary,
  defaultLang,
  type LanguageCode,
  type TranslationKey,
  isLanguageCode,
} from './dictionary';

export function getLangFromUrl(url: URL) {
  const match = langPrefixRegex.exec(url.pathname);
  if (match) return match[1] as LanguageCode;
  return defaultLang;
}

export function useTranslations(lang: LanguageCode) {
  return function t(key: TranslationKey) {
    return dictionary[lang][key] ?? dictionary[defaultLang][key];
  };
}
