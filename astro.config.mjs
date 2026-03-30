// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

// TODO: Add a repository README with setup, build, and deploy instructions.
// TODO: Add CI workflow to run Astro checks and production build on push/PR.

// TODO: enhance with https://astro.build/config tags
export default defineConfig({
  site: 'https://annazez.codeberg.page',

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

  integrations: [mdx(), sitemap(), icon()],
});
