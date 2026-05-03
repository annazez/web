import test from 'node:test';
import assert from 'node:assert';
import { getLangFromUrl, useTranslations } from '../../../src/i18n/utils.ts';
import { defaultLang } from '../../../src/i18n/dictionary.ts';

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
  await t.test('should return correct translation for English', async () => {
    const translate = await useTranslations('en');
    assert.strictEqual(translate('seo.home'), 'Home');
  });

  await t.test('should return correct translation for Czech', async () => {
    const translate = await useTranslations('cs');
    assert.strictEqual(translate('seo.home'), 'Domů');
  });

  await t.test(
    'should return the key itself if missing in both dictionaries (production-like)',
    async () => {
      const translate = await useTranslations('cs');
      const missingKey = 'non.existent.key';

      assert.strictEqual(translate(missingKey), missingKey);
    }
  );

  await t.test('should throw Error in development if key is missing', async () => {
    const translate = await useTranslations('cs');
    const missingKey = 'non.existent.key';

    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      assert.throws(() => translate(missingKey), {
        message: `Missing translation key: ${missingKey}`,
      });
    } finally {
      process.env.NODE_ENV = originalNodeEnv;
    }
  });

  await t.test('should work correctly for the default language itself', async () => {
    const translate = await useTranslations(defaultLang);
    assert.strictEqual(translate('seo.home'), 'Home');
  });

  await t.test(
    'should gracefully fallback to default language for unsupported language codes',
    async () => {
      const translate = await useTranslations('fr' as any);
      assert.strictEqual(translate('seo.home'), 'Home');
    }
  );
});
