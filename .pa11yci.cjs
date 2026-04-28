/* eslint-disable @typescript-eslint/no-require-imports */
const { join } = require('node:path');
const { getUrlsFromSitemap } = require('./scripts/sitemap-urls.cjs');

const urls = getUrlsFromSitemap({
  distDir: join(__dirname, 'dist'),
  origin: 'http://localhost:4324',
});

module.exports = {
  defaults: {
    standard: 'WCAG2AA',
    timeout: 60000,
    concurrency: 1,
    chromeLaunchConfig: {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  },
  urls: urls,
};
