import test from 'node:test';
import assert from 'node:assert';
import { getLangFromUrl, useTranslations } from '../../../src/i18n/utils.ts';
import { defaultLang, dictionary, type TranslationKey } from '../../../src/i18n/dictionary.ts';

test('getLangFromUrl', async t => {
  await t.test('should return supported language when URL has valid prefix', () => {
    assert.strictEqual(getLangFromUrl(new URL('https://example.com/en/about')), 'en');
    assert.strictEqual(getLangFromUrl(new URL('https://example.com/cs/about')), 'cs');

    assert.strictEqual(getLangFromUrl(new URL('https://example.com/en/')), 'en');
    assert.strictEqual(getLangFromUrl(new URL('https://example.com/cs/')), 'cs');

    assert.strictEqual(getLangFromUrl(new URL('https://example.com/en')), 'en');
    assert.strictEqual(getLangFromUrl(new URL('https://example.com/cs')), 'cs');
  });

  await t.test('should return default language when URL has unsupported prefix', () => {
    assert.strictEqual(getLangFromUrl(new URL('https://example.com/fr/about')), defaultLang);
    assert.strictEqual(getLangFromUrl(new URL('https://example.com/de/about')), defaultLang);
  });

  await t.test('should return default language when URL has no prefix (root)', () => {
    assert.strictEqual(getLangFromUrl(new URL('https://example.com/')), defaultLang);
    assert.strictEqual(getLangFromUrl(new URL('https://example.com')), defaultLang);
    assert.strictEqual(getLangFromUrl(new URL('https://example.com/about')), defaultLang);
  });

  await t.test('should return default language when URL has invalid/similar prefix', () => {
    assert.strictEqual(getLangFromUrl(new URL('https://example.com/english/about')), defaultLang);
    assert.strictEqual(getLangFromUrl(new URL('https://example.com/c/about')), defaultLang);
    assert.strictEqual(getLangFromUrl(new URL('https://example.com/invalid/')), defaultLang);
    assert.strictEqual(getLangFromUrl(new URL('https://example.com/toString/about')), defaultLang);
    assert.strictEqual(getLangFromUrl(new URL('https://example.com/__proto__/about')), defaultLang);
  });
});

test('useTranslations', async t => {
  await t.test('should return correct translation for English', () => {
    const translate = useTranslations('en');
    assert.strictEqual(translate('seo.home'), dictionary.en['seo.home']);
  });

  await t.test('should return correct translation for Czech', () => {
    const translate = useTranslations('cs');
    assert.strictEqual(translate('seo.home'), dictionary.cs['seo.home']);
  });

  await t.test(
    'should fallback to default language if translation is missing in the target dictionary',
    () => {
      const translate = useTranslations('cs');
      const testKey = 'seo.home' as const;
      const originalCsValue = dictionary.cs[testKey];

      // @ts-expect-error - testing fallback logic by temporarily deleting a key
      delete dictionary.cs[testKey];

      try {
        assert.strictEqual(dictionary.cs[testKey], undefined);
        assert.strictEqual(translate(testKey), dictionary[defaultLang][testKey]);
      } finally {
        dictionary.cs[testKey] = originalCsValue;
      }
    }
  );

  await t.test('should return undefined if key is missing in both dictionaries', () => {
    const translate = useTranslations('cs');
    const missingKey = 'non.existent.key' as TranslationKey;

    assert.strictEqual(translate(missingKey), undefined);
  });

  await t.test('should work correctly for the default language itself', () => {
    const translate = useTranslations(defaultLang);
    assert.strictEqual(translate('seo.home'), dictionary[defaultLang]['seo.home']);
  });

  await t.test('should gracefully fallback to default language for unsupported language codes', () => {
    // @ts-expect-error - testing runtime behavior for invalid input
    const translate = useTranslations('fr');
    assert.strictEqual(translate('seo.home'), dictionary[defaultLang]['seo.home']);
  });
});
