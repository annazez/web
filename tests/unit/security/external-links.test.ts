import assert from 'node:assert';
import { describe, it } from 'node:test';
import { toSafeExternalUrl } from '../../../src/security/external-links.ts';

describe('security/external-links', () => {
  it('allows known https hosts', () => {
    assert.strictEqual(
      toSafeExternalUrl('https://github.com/annazez/telperion-web'),
      'https://github.com/annazez/telperion-web'
    );
    assert.strictEqual(toSafeExternalUrl('https://telperion.cz'), 'https://telperion.cz/');
  });

  it('rejects unknown hosts and unsafe protocols', () => {
    assert.strictEqual(toSafeExternalUrl('https://example.com'), undefined);
    assert.strictEqual(toSafeExternalUrl('http://github.com/annazez/telperion-web'), undefined);
    assert.strictEqual(toSafeExternalUrl('javascript:alert(1)'), undefined);
    assert.strictEqual(toSafeExternalUrl('data:text/html,hello'), undefined);
  });

  it('rejects malformed values', () => {
    assert.strictEqual(toSafeExternalUrl('not-a-url'), undefined);
    assert.strictEqual(toSafeExternalUrl(undefined), undefined);
  });
});
