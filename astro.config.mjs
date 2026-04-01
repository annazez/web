// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

const site = process.env.SITE_URL || 'https://annazez.codeberg.page';

export default defineConfig({
  site,

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
      filter: page => page !== `${site}/`,
    }),
    icon(),
  ],
});
