# Architecture

## Topology

- src/pages/index.astro: locale redirect entrypoint
- src/pages/[lang]/index.astro: localized homepage
- src/layouts/Layout.astro: SEO and shell
- src/components/home: domain section components
- src/components/ui: reusable UI primitives
- src/i18n: locale config, dictionary, and translation helpers

## i18n Model

- Locale dictionaries are split into src/i18n/locales
- src/i18n/dictionary.ts composes dictionaries and exports typed helpers
- src/i18n/utils.ts handles language detection and translation lookup

## Deployment

- Manual: npm run deploy
- CI: Woodpecker deploy step runs npm run deploy:ci
- Publish branch: pages
