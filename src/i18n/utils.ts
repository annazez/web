// src/i18n/utils.ts
import { dictionary, defaultLang } from './dictionary';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in dictionary) return lang as keyof typeof dictionary;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof dictionary) {
  return function t(key: keyof (typeof dictionary)[typeof defaultLang]) {
    return dictionary[lang][key] || dictionary[defaultLang][key];
  };
}
