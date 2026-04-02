import { dictionary, defaultLang, type LanguageCode, type TranslationKey } from './dictionary.ts';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in dictionary) return lang as keyof typeof dictionary;
  return defaultLang;
}

export function useTranslations(lang: LanguageCode) {
  return function t(key: TranslationKey) {
    return dictionary[lang][key] ?? dictionary[defaultLang][key];
  };
}
