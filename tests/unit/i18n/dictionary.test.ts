import assert from 'node:assert';
import { describe, it } from 'node:test';
import {
  languages,
  defaultLang,
  dictionary,
  langPrefixRegex,
  getValidLanguageCode,
  routes,
  routeLookup,
} from '../../../src/i18n/dictionary.ts';

describe('dictionary', () => {
  describe('languages', () => {
    it('should define supported languages', () => {
      assert.deepStrictEqual(languages, { en: 'EN', cs: 'CS' });
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
  });

  describe('routeLookup', () => {
    it('should contain all localized segments with language prefix', () => {
      assert.strictEqual(routeLookup.get('en:inventory'), routes.workspace);
      assert.strictEqual(routeLookup.get('cs:inventar'), routes.workspace);
      assert.strictEqual(routeLookup.get('en:about'), routes.about);
      assert.strictEqual(routeLookup.get('cs:o-mne'), routes.about);
    });

    it('should not match segment from different language', () => {
      assert.strictEqual(routeLookup.get('cs:inventory'), undefined);
      assert.strictEqual(routeLookup.get('en:inventar'), undefined);
    });

    it('should return undefined for unknown segments', () => {
      assert.strictEqual(routeLookup.get('en:unknown'), undefined);
      assert.strictEqual(routeLookup.get('unknown'), undefined);
    });
  });
});
