import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getUrlsFromSitemap } from './scripts/sitemap-urls.cjs';

const __dirname = join(fileURLToPath(import.meta.url), '..');

const urls = getUrlsFromSitemap({
  distDir: join(__dirname, 'dist'),
  origin: 'http://127.0.0.1:4322',
});

if (urls.length === 0) {
  throw new Error('No URLs found in sitemap for auditing.');
}

export const ci = {
  collect: {
    staticDistDir: null,
    startServerCommand: 'npm run preview:ci',
    startServerReadyPattern: 'Local',
    url: urls,
    numberOfRuns: 3,
    settings: {
      preset: 'desktop',
      chromeFlags: '--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage',
    },
  },
  assert: {
    assertions: {
      'categories:performance': ['error', { minScore: 0.9 }],
      'categories:accessibility': ['error', { minScore: 0.95 }],
      'categories:best-practices': ['error', { minScore: 0.95 }],
      'categories:seo': ['error', { minScore: 0.95 }],
      'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
      'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
    },
  },
  upload: {
    target: 'filesystem',
    outputDir: '.lighthouseci',
  },
};

export default { ci };
