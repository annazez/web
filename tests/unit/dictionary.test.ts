import test, { describe } from 'node:test';
import assert from 'node:assert';
import { isLanguageCode, getValidLanguageCode, defaultLang } from '../../src/i18n/dictionary.ts';

describe('src/i18n/dictionary.ts', () => {
  describe('isLanguageCode', () => {
    test('returns true for valid language codes', () => {
      assert.strictEqual(isLanguageCode('en'), true);
      assert.strictEqual(isLanguageCode('cs'), true);
    });

    test('returns false for invalid language codes', () => {
      assert.strictEqual(isLanguageCode('fr'), false);
      assert.strictEqual(isLanguageCode('de'), false);
      assert.strictEqual(isLanguageCode('invalid'), false);
    });

    test('returns false for empty string', () => {
      assert.strictEqual(isLanguageCode(''), false);
    });

    test('returns false for prototype-chain property names', () => {
      assert.strictEqual(isLanguageCode('__proto__'), false);
      assert.strictEqual(isLanguageCode('toString'), false);
    });
  });

  describe('getValidLanguageCode', () => {
    test('returns the passed code if it is valid', () => {
      assert.strictEqual(getValidLanguageCode('en'), 'en');
      assert.strictEqual(getValidLanguageCode('cs'), 'cs');
    });

    test('returns the default language code for invalid strings', () => {
      assert.strictEqual(getValidLanguageCode('fr'), defaultLang);
      assert.strictEqual(getValidLanguageCode('invalid'), defaultLang);
    });

    test('returns the default language code for empty string', () => {
      assert.strictEqual(getValidLanguageCode(''), defaultLang);
    });

    test('returns the default language code for undefined', () => {
      assert.strictEqual(getValidLanguageCode(undefined), defaultLang);
    });
  });
});
