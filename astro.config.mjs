// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import { SITE_URL } from './src/config';

export default defineConfig({
  site: SITE_URL,

  build: {
    assets: 'assets',
  },

  vite: {
    plugins: [tailwindcss()],
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
  ],
});
