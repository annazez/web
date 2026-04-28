// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import compressor from 'astro-compressor';
import { SITE_URL } from './src/config';
import { SITE_CSP } from './src/data/csp';

export default defineConfig({
  site: SITE_URL,

  build: {
    assets: 'assets',
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      assetsInlineLimit: 0,
    },
    server: {
      headers: {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Content-Security-Policy': SITE_CSP,
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
        'Permissions-Policy':
          'accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), display-capture=(), document-domain=(), encrypted-media=(), fullscreen=(), geolocation=(), gyroscope=(), layout-animations=(self), legacy-image-formats=(self), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), unoptimized-images=(self), unsized-media=(self), usb=(), screen-wake-lock=(), web-share=(), xr-spatial-tracking=()',
        'Referrer-Policy': 'no-referrer',
      },
    },
    preview: {
      headers: {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Content-Security-Policy': SITE_CSP,
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
        'Permissions-Policy':
          'accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), display-capture=(), document-domain=(), encrypted-media=(), fullscreen=(), geolocation=(), gyroscope=(), layout-animations=(self), legacy-image-formats=(self), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), speaker-selection=(), sync-xhr=(), unoptimized-images=(self), unsized-media=(self), usb=(), web-share=(), xr-spatial-tracking=()',
        'Referrer-Policy': 'no-referrer',
      },
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'cs'],
    routing: {
      prefixDefaultLocale: true,
    },
  },

  integrations: [
    mdx(),
    sitemap({
      filter: page => page !== `${SITE_URL}/`,
    }),
    icon(),
    compressor(),
  ],
});
