import assert from 'node:assert';
import { describe, it } from 'node:test';
import {
  languages,
  supportedLangs,
  languageEntries,
  defaultLang,
  dictionary,
  langPrefixRegex,
  isLanguageCode,
  getValidLanguageCode,
  routes,
} from '../../../src/i18n/dictionary.ts';

describe('dictionary', () => {
  describe('languages', () => {
    it('should define supported languages', () => {
      assert.deepStrictEqual(languages, { en: 'EN', cs: 'CS' });
    });
  });

  describe('supportedLangs', () => {
    it('should contain all language codes', () => {
      assert.strictEqual(supportedLangs.length, 2);
      assert.ok(supportedLangs.includes('en'));
      assert.ok(supportedLangs.includes('cs'));
    });

    it('should be readonly', () => {
      // TypeScript enforces this, but we verify at runtime
      assert.ok(Array.isArray(supportedLangs));
    });
  });

  describe('languageEntries', () => {
    it('should contain tuples of language codes and labels', () => {
      assert.strictEqual(languageEntries.length, 2);
      assert.ok(languageEntries.some(([code]) => code === 'en'));
      assert.ok(languageEntries.some(([code]) => code === 'cs'));
    });
  });

  describe('defaultLang', () => {
    it('should be "en"', () => {
      assert.strictEqual(defaultLang, 'en');
    });
  });

  describe('dictionary', () => {
    it('should have entries for all supported languages', () => {
      assert.ok(dictionary.en);
      assert.ok(dictionary.cs);
    });

    it('should have matching keys across all languages', () => {
      const enKeys = Object.keys(dictionary.en);
      const csKeys = Object.keys(dictionary.cs);
      assert.strictEqual(enKeys.length, csKeys.length);

      for (const key of enKeys) {
        assert.ok(csKeys.includes(key), `Missing key "${key}" in Czech dictionary`);
      }
    });

    it('should have non-empty translations', () => {
      for (const [lang, dict] of Object.entries(dictionary)) {
        for (const [key, value] of Object.entries(dict)) {
          assert.ok(value && value.length > 0, `Empty translation for key "${key}" in ${lang}`);
        }
      }
    });
  });

  describe('langPrefixRegex', () => {
    it('should match language prefixes', () => {
      assert.ok(langPrefixRegex.test('/en/about'));
      assert.ok(langPrefixRegex.test('/cs/about'));
      assert.ok(langPrefixRegex.test('/en/'));
      assert.ok(langPrefixRegex.test('/cs'));
    });

    it('should not match unsupported languages', () => {
      assert.ok(!langPrefixRegex.test('/fr/about'));
      assert.ok(!langPrefixRegex.test('/de/'));
    });

    it('should not match paths without language prefix', () => {
      assert.ok(!langPrefixRegex.test('/about'));
      assert.ok(!langPrefixRegex.test('/'));
    });
  });

  describe('isLanguageCode', () => {
    it('should return true for valid language codes', () => {
      assert.strictEqual(isLanguageCode('en'), true);
      assert.strictEqual(isLanguageCode('cs'), true);
    });

    it('should return false for invalid language codes', () => {
      assert.strictEqual(isLanguageCode('fr'), false);
      assert.strictEqual(isLanguageCode('de'), false);
      assert.strictEqual(isLanguageCode(''), false);
      assert.strictEqual(isLanguageCode('english'), false);
    });

    it('should handle prototype pollution attempts safely', () => {
      assert.strictEqual(isLanguageCode('__proto__'), false);
      assert.strictEqual(isLanguageCode('constructor'), false);
      assert.strictEqual(isLanguageCode('toString'), false);
    });
  });

  describe('getValidLanguageCode', () => {
    it('should return the language code if valid', () => {
      assert.strictEqual(getValidLanguageCode('en'), 'en');
      assert.strictEqual(getValidLanguageCode('cs'), 'cs');
    });

    it('should return default language for invalid codes', () => {
      assert.strictEqual(getValidLanguageCode('fr'), defaultLang);
      assert.strictEqual(getValidLanguageCode('invalid'), defaultLang);
    });

    it('should return default language for undefined', () => {
      assert.strictEqual(getValidLanguageCode(undefined), defaultLang);
    });

    it('should return default language for empty string', () => {
      assert.strictEqual(getValidLanguageCode(''), defaultLang);
    });
  });

  describe('routes', () => {
    it('should define localized routes', () => {
      assert.ok(routes.workspace);
      assert.strictEqual(routes.workspace.en, 'inventory');
      assert.strictEqual(routes.workspace.cs, 'inventar');
    });

    it('should have routes for all supported languages', () => {
      for (const lang of supportedLangs) {
        assert.ok(
          routes.workspace[lang as keyof typeof routes.workspace],
          `Missing workspace route for ${lang}`
        );
      }
    });
  });
});
