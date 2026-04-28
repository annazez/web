# Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Astro Static Site                       │
├─────────────────────────────────────────────────────────────┤
│  Build Time                    │  Runtime (Browser)          │
│  - Content collection          │  - Theme toggle (minimal)   │
│  - i18n routing                │  - Hash-based modes         │
│  - Tailwind compilation        │  - 3D layers interaction    │
│  - Zero external deps          │  - No analytics             │
└─────────────────────────────────────────────────────────────┘
```

The user-facing navigation should feel SPA-like, but the implementation stays SSG-first and avoids client-side runtime by default.

---

## Topology

### Core Files

| File                                 | Responsibility                     |
| ------------------------------------ | ---------------------------------- |
| `src/layouts/Layout.astro`           | SEO metadata, CSP, shell structure |
| `src/pages/index.astro`              | Locale detection and redirect      |
| `src/pages/[lang]/index.astro`       | Localized homepage                 |
| `src/pages/en/projects/[slug].astro` | Project detail pages               |

### Component Layers

| Directory                       | Purpose                                            |
| ------------------------------- | -------------------------------------------------- |
| `src/components/ui/`            | Reusable UI primitives (buttons, toggles, pickers) |
| `src/components/home/`          | Homepage-specific section components               |
| `src/components/BackLink.astro` | Navigation primitive                               |

### Shared Surface Template

The site uses one reusable panel shell for cards and dashboard blocks:

- `rounded-2xl`
- `border border-(--color-border)`
- `bg-(--color-bg-surface)`
- `shadow-sm`
- `px-4 py-5 sm:px-5`

Use this shell consistently across pages so the design reads as one system rather than separate one-off cards.

Current uses include the homepage Projects, Contact, and Lighthouse dashboard panels.

Typography is likewise semantic: page titles use `h1`, section titles use `h2`, card titles use `h3`, and markdown content follows the same scale.

### i18n System

| File                     | Role                            |
| ------------------------ | ------------------------------- |
| `src/i18n/dictionary.ts` | Language config, route mappings |
| `src/i18n/utils.ts`      | Translation lookup, URL helpers |
| `src/i18n/locales/en.ts` | English strings                 |
| `src/i18n/locales/cs.ts` | Czech strings                   |

---

## Implemented Features

### Theme System

**Implementation**: Inline blocking script + storage event sync

```
┌─────────────────────────────────────────────────────────┐
│ 1. Inline script reads localStorage on page load        │
│ 2. Applies .dark class before first paint (FOUC guard)  │
│ 3. storage event listener syncs across tabs             │
│ 4. prefers-color-scheme fallback for first visit        │
└─────────────────────────────────────────────────────────┘
```

**Files**: `Layout.astro` (lines 45-98)

---

### Carbon Footprint Calculator

**Standard**: Sustainable Web Design (SWD) v4 Model

**Implementation**: Browser-native calculation using Performance API

```
┌─────────────────────────────────────────────────────────┐
│ 1. Measure transferred bytes (performance entries)      │
│ 2. Apply SWD emissions factor (0.00000057 kWh/MB)       │
│ 3. Convert to CO2e using grid intensity                 │
│ 4. Cache-aware: excludes cached resources from calc     │
└─────────────────────────────────────────────────────────┘
```

**Zero external API calls** — all computation is local.

---

### Accessibility (a11y)

| Feature        | Implementation                     |
| -------------- | ---------------------------------- |
| Skip link      | Targets `#main-content`            |
| Reduced motion | Respects `prefers-reduced-motion`  |
| Focus visible  | Custom outline on `:focus-visible` |
| Audit mode     | `#audit` hash exposes aria-labels  |

---

### Blueprint Print Mode

**Trigger**: `window.print()` or PDF export

**Behavior**:

- Strips UI elements (nav, theme toggle)
- Forces monospace font
- Expands URLs as text: `[REF: https://...]`
- Injects architectural header banner
- Applies `break-inside: avoid` to sections

**CSS**: `@media print` in `global.css`

---

## Special Modes (Zero-JavaScript)

All modes use CSS `:has()` and `:target` pseudo-classes — no runtime required.

### X-Ray Mode (`#arch`)

**Purpose**: Visualize DOM structure as architectural blueprint

**CSS Chain**:

```css
html:has(#arch:target) * → outline all elements
html:has(#arch:target) header/section/article → dashed brand color
html:has(#arch:target) body → remove dot-grid background
```

---

### Audit Mode (`#audit`)

**Purpose**: Real-time accessibility inspection

**CSS Chain**:

```css
html:has(#audit:target) → grayscale + contrast boost
html:has(#audit:target) [aria-label]::after → expose label as tooltip
html:has(#audit:target) img:not([alt]) → red dashed outline
html:has(#audit:target) a:not([href]) → red dashed outline
```

**Tooltip Format**: `[aria: <label-value>]` positioned absolutely

---

### 3D Layers Mode (`#layers`)

**Purpose**: Isometric exploded view of page hierarchy

**CSS Chain**:

```css
html:has(#layers:target) → overflow: hidden, bg: #09090b
html:has(#layers:target) #page-shell → perspective + rotateX + rotateZ
html:has(#layers:target) header/section/ul → translateZ(50px)
html:has(#layers:target) h1/h2/p/a → translateZ(30px)
```

**JavaScript Enhancement**: Lazy-loaded interaction layer for mouse drag rotation and wheel zoom (maps to CSS variables `--layers-rotate-x`, `--layers-rotate-z`, `--layers-scale`)

**Cleanup**: Event listeners removed on hash change

---

## Deployment Pipeline

### Manual Deploy

```bash
npm run deploy
```

### CI Deploy (Woodpecker)

```yaml
Pipeline: test → build → deploy
Target Branch: pages
Output: dist/ → Codeberg Pages
```

### Requirements

| Secret           | Purpose                |
| ---------------- | ---------------------- |
| `codeberg_token` | Push to `pages` branch |

---

## Quality Gates

```
┌─────────────────────────────────────────────────────────┐
│ npm run check        → Astro validation                 │
│ npm run typecheck    → TypeScript check                │
│ npm run build        → Production build                │
│ npm run test:e2e     → Playwright E2E tests            │
│ npm run lighthouse:ci → Performance audit (CI)         │
│ npm run size:check   → Bundle size limits              │
│ npm run security-audit → npm vulnerability scan        │
└─────────────────────────────────────────────────────────┘
```

All gates must pass before merge.

---

## Security Model

### Content Security Policy

```
default-src 'self'
script-src 'self' 'unsafe-inline'   # Astro requires inline for theme script
style-src 'self' 'unsafe-inline'    # Tailwind + inline theme application
img-src 'self' data:                # SVG support
font-src 'self' data:               # System fonts only
connect-src 'self'                  # No external XHR
```

### Dependency Management

| Tool         | Role                                         |
| ------------ | -------------------------------------------- |
| `npm audit`  | CI vulnerability scan (high/critical = fail) |
| Renovate Bot | Automated PRs for safe updates               |

### PGP Key Rotation

1. Export armored key: `gpg --armor --export`
2. Replace `public/pgp/public-key.asc`
3. Update `security.txt` expiry field
4. Commit and deploy

---

## File Change Impact Matrix

| File Modified     | Affected Systems                  |
| ----------------- | --------------------------------- |
| `Layout.astro`    | SEO, CSP, theme, all pages        |
| `global.css`      | Typography, colors, special modes |
| `dictionary.ts`   | i18n routing, all translations    |
| `components/ui/*` | All pages using primitives        |

---

## Design Principles

| Principle                       | Enforcement                      |
| ------------------------------- | -------------------------------- |
| Architecture over improvisation | Structured docs, typed config    |
| Security by default             | CSP, no analytics, audit mode    |
| Speed with ethics               | SWD carbon calc, system fonts    |
| Privacy by design               | No tracking, local theme storage |
| Zero-runtime first              | CSS `:has()` > JavaScript        |
