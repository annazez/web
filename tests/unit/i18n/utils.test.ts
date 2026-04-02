import test from 'node:test';
import assert from 'node:assert';
import { getLangFromUrl } from '../../../src/i18n/utils.ts';
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
