import en from './locales/en.ts';
import cs from './locales/cs.ts';
import type { TranslationDictionary, TranslationKey } from './locales/en';

export const languages = {
  en: 'EN',
  cs: 'CS',
} as const;

export type LanguageCode = keyof typeof languages;

export const supportedLangs: ReadonlyArray<LanguageCode> = Object.keys(languages) as LanguageCode[];
export const languageEntries: ReadonlyArray<[LanguageCode, string]> = Object.entries(
  languages
) as Array<[LanguageCode, string]>;

export const defaultLang: LanguageCode = 'en';

export const dictionary: Record<LanguageCode, TranslationDictionary> = {
  en,
  cs,
};

export const langPrefixRegex = /^\/(en|cs)(?:\/|$)/;

export const routes = {
  workspace: {
    en: 'inventory',
    cs: 'inventar',
  } satisfies Record<LanguageCode, string>,
  about: {
    en: 'about',
    cs: 'o-mne',
  } satisfies Record<LanguageCode, string>,
} as const;

export const localizedSlugSets: ReadonlyArray<Record<LanguageCode, string>> = Object.values(routes);

export const routeLookup: ReadonlyMap<string, Record<LanguageCode, string>> = new Map(
  localizedSlugSets.flatMap(slugSet =>
    (Object.entries(slugSet) as Array<[LanguageCode, string]>).map(([lang, slug]) => [
      `${lang}:${slug}`,
      slugSet,
    ])
  )
);

export type { TranslationKey };

export function getValidLanguageCode(value: string | undefined): LanguageCode {
  return value === 'en' || value === 'cs' ? value : defaultLang;
}
