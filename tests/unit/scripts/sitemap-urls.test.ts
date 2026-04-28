import test from 'node:test';
import assert from 'node:assert';
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { getUrlsFromSitemap } from '../../../scripts/sitemap-urls.cjs';

const TEST_DIST_DIR = join(process.cwd(), 'tests/unit/scripts/temp-dist');

test('getSitemapUrls', async t => {
  // Setup
  if (!existsSync(TEST_DIST_DIR)) {
    mkdirSync(TEST_DIST_DIR, { recursive: true });
  }

  const cleanup = () => {
    if (existsSync(TEST_DIST_DIR)) {
      rmSync(TEST_DIST_DIR, { recursive: true, force: true });
    }
  };

  await t.test('should extract and filter URLs correctly', () => {
    const sitemapContent = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://zezulka.me/en/</loc></url>
  <url><loc>https://zezulka.me/cs/</loc></url>
  <url><loc>https://zezulka.me/en/projects/telperion/</loc></url>
  <url><loc>https://zezulka.me/404/</loc></url>
  <url><loc>https://zezulka.me/sitemap-index.xml</loc></url>
  <url><loc>https://zezulka.me/rss.xml</loc></url>
</urlset>
    `.trim();

    writeFileSync(join(TEST_DIST_DIR, 'sitemap-0.xml'), sitemapContent);

    const urls = getUrlsFromSitemap({
      distDir: TEST_DIST_DIR,
      origin: 'http://127.0.0.1:4322',
    });

    assert.deepStrictEqual(urls, [
      'http://127.0.0.1:4322/cs/',
      'http://127.0.0.1:4322/en/',
      'http://127.0.0.1:4322/en/projects/telperion/',
    ]);
  });

  await t.test('should throw error if sitemap is missing', () => {
    const missingDir = join(TEST_DIST_DIR, 'missing');
    assert.throws(() => {
      getUrlsFromSitemap({ distDir: missingDir, origin: 'http://127.0.0.1:4322' });
    }, /Sitemap not found/);
  });

  // Teardown
  cleanup();
});
