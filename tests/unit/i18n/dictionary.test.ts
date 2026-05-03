import assert from 'node:assert';
import { describe, it } from 'node:test';
import {
  languages,
  defaultLang,
  langPrefixRegex,
  getValidLanguageCode,
  routeLookup,
} from '../../../src/i18n/dictionary.ts';

describe('dictionary config', () => {
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

  describe('routeLookup', () => {
    it('should have standard static routes', () => {
      // 5 static routes * 2 languages = 10
      assert.strictEqual(routeLookup.size, 10);
    });

    it('should not match segment from different language', () => {
      assert.strictEqual(routeLookup.get('cs:about'), undefined);
      assert.strictEqual(routeLookup.get('en:o-mne'), undefined);
    });

    it('should return undefined for unknown segments', () => {
      assert.strictEqual(routeLookup.get('en:unknown'), undefined);
      assert.strictEqual(routeLookup.get('unknown'), undefined);
    });
  });
});
