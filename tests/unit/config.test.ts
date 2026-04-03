import assert from 'node:assert';
import { describe, it } from 'node:test';
import { SITE_URL } from '../../src/config.ts';

describe('config', () => {
  describe('SITE_URL', () => {
    it('should export the site URL constant', () => {
      assert.strictEqual(typeof SITE_URL, 'string');
      assert.ok(SITE_URL.length > 0);
    });

    it('should use environment variable when available', () => {
      // The value is determined at import time based on process.env.SITE_URL
      // We verify it follows URL format
      assert.ok(
        SITE_URL.startsWith('http://') || SITE_URL.startsWith('https://'),
        'SITE_URL should be a valid URL with http(s) protocol'
      );
    });

    it('should have valid URL structure', () => {
      const url = new URL(SITE_URL);
      assert.ok(url.hostname, 'SITE_URL should have a hostname');
    });
  });
});
