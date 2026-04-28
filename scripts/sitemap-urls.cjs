/* eslint-disable @typescript-eslint/no-require-imports */
const { readFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');

/**
 * Parses the generated sitemap and returns a filtered list of page URLs.
 *
 * @param {Object} options
 * @param {string} options.distDir - Path to the build output directory.
 * @param {string} options.origin - The base URL to use for the returned paths.
 * @returns {string[]}
 */
function getUrlsFromSitemap({ distDir, origin }) {
  const sitemapPath = join(distDir, 'sitemap-0.xml');

  if (!existsSync(sitemapPath)) {
    throw new Error(
      'Sitemap not found. Please run "npm run build" before running Lighthouse or pa11y-ci.'
    );
  }

  const content = readFileSync(sitemapPath, 'utf-8');

  // Use regex to extract <loc> contents as we don't want to pull in a full XML parser dependency.
  const locRegex = /<loc>(https?:\/\/[^<]+)<\/loc>/g;
  const urls = [];
  let match;

  while ((match = locRegex.exec(content)) !== null) {
    const originalUrl = match[1];
    try {
      const url = new URL(originalUrl);
      const path = url.pathname;

      if (!isTechnicalPath(path)) {
        urls.push(new URL(path, origin).toString());
      }
    } catch {
      // Skip invalid URLs
    }
  }

  return [...new Set(urls)].sort();
}

/**
 * Filter for technical paths that shouldn't be audited.
 * Based on logic in src/scripts/performance-dashboard.ts.
 */
function isTechnicalPath(path) {
  if (!path) return true;

  const lowered = path.toLowerCase();

  // Root is always audited
  if (lowered === '/') return false;

  // Exclusions
  if (lowered.includes('/404')) return true;
  if (lowered.endsWith('.xml') || lowered.endsWith('.txt') || lowered.endsWith('.asc')) return true;
  if (lowered.includes('/sitemap')) return true;
  if (lowered.includes('/rss')) return true;
  if (lowered.startsWith('/pgp/')) return true;

  return false;
}

module.exports = { getUrlsFromSitemap };
