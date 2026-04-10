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
  return function t(key: TranslationKey) {
    const value = Object.prototype.hasOwnProperty.call(langDictionary, key)
      ? langDictionary[key]
      : undefined;
    return value ?? (Object.prototype.hasOwnProperty.call(dictionary[defaultLang], key)
      ? dictionary[defaultLang][key]
      : undefined);
  };
}
