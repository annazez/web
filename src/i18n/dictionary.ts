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

export const langPrefixRegex = new RegExp(`^\\/(${supportedLangs.join('|')})(?:\\/|$)`);

export const staticSlugSets: ReadonlyArray<Record<LanguageCode, string>> = [
  { en: 'projects', cs: 'projects' },
  { en: 'quality', cs: 'quality' },
  { en: 'uses', cs: 'uses' },
  { en: 'architecture-decisions', cs: 'architecture-decisions' },
];

export function buildRouteLookup(
  customSlugSets: ReadonlyArray<Record<LanguageCode, string>>
): ReadonlyMap<string, Record<LanguageCode, string>> {
  const allSets = [...staticSlugSets, ...customSlugSets];
  return new Map(
    allSets.flatMap(slugSet =>
      (Object.entries(slugSet) as Array<[LanguageCode, string]>).map(([lang, slug]) => [
        `${lang}:${slug}`,
        slugSet,
      ])
    )
  );
}

// Default lookup with only static slugs
export const routeLookup = buildRouteLookup([]);

export type { TranslationKey };

export function getValidLanguageCode(value: string | undefined): LanguageCode {
  return (supportedLangs as ReadonlyArray<string>).includes(value || '')
    ? (value as LanguageCode)
    : defaultLang;
}
