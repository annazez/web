import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { isLanguageCode } from '../../../src/i18n/dictionary.ts';

describe('isLanguageCode', () => {
  it('should return true for valid language codes', () => {
    assert.equal(isLanguageCode('en'), true);
    assert.equal(isLanguageCode('cs'), true);
  });

  it('should return false for invalid language codes', () => {
    assert.equal(isLanguageCode('fr'), false);
    assert.equal(isLanguageCode('de'), false);
    assert.equal(isLanguageCode('123'), false);
  });

  it('should return false for an empty string', () => {
    assert.equal(isLanguageCode(''), false);
  });

  it('should return false for object properties that exist but are not language codes', () => {
    assert.equal(isLanguageCode('constructor'), false);
    assert.equal(isLanguageCode('toString'), false);
    assert.equal(isLanguageCode('hasOwnProperty'), false);
  });
});
