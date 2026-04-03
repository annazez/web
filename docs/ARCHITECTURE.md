# Architecture

## Topology

- src/pages/index.astro: locale redirect entrypoint
- src/pages/[lang]/index.astro: localized homepage
- src/layouts/Layout.astro: SEO and shell
- src/components/home: domain section components
- src/components/ui: reusable UI primitives
- src/i18n: locale config, dictionary, and translation helpers

## Core Implementations

- Sustainability / Carbon Footprint: the site calculates carbon footprint natively in the browser using the Performance API and TextEncoder, including cached resource fallback handling, and follows the Sustainable Web Design (SWD) v4 model without any external API tracking.
- Accessibility (a11y): the global skip link targets #main-content, and theme transitions respect prefers-reduced-motion so users with vestibular disorders can disable the overlay animation.
- Theme Management: dark mode is implemented with a custom toggle that syncs across browser tabs through the storage event and uses an inline blocking script to prevent FOUC during initial render.

### Blueprint Print Mode

When the page is printed or exported to PDF, a CSS `@media print` query strips away the UI, enforces a monospace font, expands URL links as text, and injects a technical architectural header. The printed output intentionally reads like a strict technical specification document rather than a conventional webpage. Semantic sections use `break-inside: avoid` to prevent awkward page splits.

## Special Features & Easter Eggs

### Architectural X-Ray

Appending `#arch` to the URL triggers a global structural wireframe through a Zero-JavaScript implementation that uses modern CSS `:has()` and `:target`. The mode outlines the page into a semantic blueprint, strips away visual polish, and aligns with the project’s strict zero-bloat, high-performance philosophy.

### Accessibility Auditor Mode

Appending `#audit` to the URL triggers a Zero-JavaScript accessibility audit layer that uses CSS `:has()` and `:target` to apply grayscale filtering, visually expose `aria-label` values as tooltips, and highlight missing `alt` attributes or broken links. It acts as an interactive proof of the site’s color-independent hierarchy and strict a11y standards without adding runtime scripting.

### Exploded Layers 3D

Appending `#layers` to the URL triggers an isometric 3D transformation of the entire DOM. The base effect uses CSS `perspective`, `preserve-3d`, and `translateZ` to visually explode the structural hierarchy of the page, while a lightweight client-side interaction layer maps mouse wheel zoom and click-drag rotation onto CSS variables for a more tactile model. The JavaScript is lazy-loaded only when the hash is present and cleans up properly on exit.

## i18n Model

- Locale dictionaries are split into src/i18n/locales
- src/i18n/dictionary.ts composes dictionaries and exports typed helpers
- src/i18n/utils.ts handles language detection and translation lookup

## Deployment

- Manual: npm run deploy
- CI: Woodpecker deploy step runs npm run deploy:ci
- Publish branch: pages
