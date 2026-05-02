// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import { SITE_URL } from './src/config';
import { SITE_CSP } from './src/data/csp';

const PERMISSIONS_POLICY = [
  'accelerometer=()',
  'ambient-light-sensor=()',
  'autoplay=()',
  'battery=()',
  'camera=()',
  'display-capture=()',
  'document-domain=()',
  'encrypted-media=()',
  'fullscreen=()',
  'geolocation=()',
  'gyroscope=()',
  'layout-animations=(self)',
  'legacy-image-formats=(self)',
  'magnetometer=()',
  'microphone=()',
  'midi=()',
  'payment=()',
  'picture-in-picture=()',
  'publickey-credentials-get=()',
  'screen-wake-lock=()',
  'speaker-selection=()',
  'sync-xhr=()',
  'unoptimized-images=(self)',
  'unsized-media=(self)',
  'usb=()',
  'web-share=()',
  'xr-spatial-tracking=()',
].join(', ');

const SECURITY_HEADERS = {
  'Content-Security-Policy': SITE_CSP,
  'X-Content-Type-Options': 'nosniff',
  'Permissions-Policy': PERMISSIONS_POLICY,
  'Referrer-Policy': 'no-referrer',
};

export default defineConfig({
  site: SITE_URL,
  build: { assets: 'assets' },
  vite: {
    plugins: [tailwindcss()],
    build: { assetsInlineLimit: 0 },
    server: { headers: SECURITY_HEADERS },
    preview: { headers: SECURITY_HEADERS },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'cs'],
    routing: { prefixDefaultLocale: true },
  },
  integrations: [mdx(), sitemap({ filter: page => page !== `${SITE_URL}/` }), icon()],
});
