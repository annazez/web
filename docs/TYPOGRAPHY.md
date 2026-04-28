# Typography System

## Core Principles

| Principle             | Enforcement                                     |
| --------------------- | ----------------------------------------------- |
| Restrained hierarchy  | Fixed scale; no arbitrary sizes                 |
| System fonts only     | No webfont loading permitted                    |
| Calm defaults         | Light weights, subtle tracking                  |
| Consistent vocabulary | Semantic h1-h6 headings + shared body utilities |

---

## Semantic Heading Scale

The site uses a single heading logic everywhere: native `h1`-`h6` tags, styled by element rather than component-specific classes. Markdown content follows the same scale.

| Element | Mobile   | Desktop  | Weight | Leading | Tracking |
| ------- | -------- | -------- | ------ | ------- | -------- |
| `h1`    | 2.25rem  | 3rem     | 500    | 1.05    | -0.025em |
| `h2`    | 1.75rem  | 2rem     | 500    | 1.15    | -0.02em  |
| `h3`    | 1.25rem  | 1.25rem  | 600    | 1.35    | 0        |
| `h4`    | 1.125rem | 1.125rem | 600    | 1.4     | 0        |
| `h5`    | 1rem     | 1rem     | 600    | 1.4     | 0        |
| `h6`    | 0.75rem  | 0.75rem  | 600    | 1       | 0.08em   |

### Body Level

| Class                | Usage      | Size     | Weight | Leading | Color     |
| -------------------- | ---------- | -------- | ------ | ------- | --------- |
| `home-body-text`     | Paragraphs | 1rem     | 400    | 1.75    | secondary |
| `home-inline-strong` | Emphasis   | 1rem     | 500    | inherit | strong    |
| `home-subtle-text`   | Metadata   | 0.875rem | 400    | 1.6     | muted     |

### Micro Level

| Class               | Usage         | Size     | Weight | Leading | Tracking | Transform |
| ------------------- | ------------- | -------- | ------ | ------- | -------- | --------- |
| `home-micro-label`  | Labels, links | 0.75rem  | 500    | 1       | 0.08em   | uppercase |
| `home-micro-copy`   | Fine print    | 0.75rem  | 400    | 1.6     | 0        | none      |
| `home-tag-text`     | Tags, badges  | 0.75rem  | 500    | 1       | 0        | none      |
| `home-action-text`  | Buttons       | 0.75rem  | 600    | 1       | 0.01em   | none      |
| `home-social-links` | Nav links     | 0.875rem | 500    | 1       | 0        | none      |

---

## Font Stacks

### Primary (Sans-Serif)

```css
--font-sans: 'Segoe UI', 'San Francisco', Roboto, system-ui, sans-serif;
```

### Platform Overrides

| Platform | Stack                                              |
| -------- | -------------------------------------------------- |
| Windows  | `'Segoe UI'`, system-ui                            |
| Apple    | `'SF Pro Text'`, `'SF Pro Display'`, -apple-system |
| Android  | `Roboto`, `'Noto Sans'`                            |
| Linux    | `'Adwaita Sans'`, `'Cantarell'`, `'Noto Sans'`     |

### Monospace (Code)

```css
--font-mono: Consolas, 'SF Mono', Menlo, 'Noto Mono', ui-monospace, monospace;
```

---

## Color System

### Text Colors

| Variable                 | Light   | Dark    | Usage                  |
| ------------------------ | ------- | ------- | ---------------------- |
| `--color-brand`          | #18181b | #fafafa | Headings, primary text |
| `--color-text-secondary` | #52525b | #a1a1aa | Body copy (default)    |
| `--color-text-muted`     | #71717a | #71717a | Metadata,辅助 text     |
| `--color-text-strong`    | #27272a | #e4e4e7 | Emphasized inline      |

### Color Application Rules

| Element/utility    | Color Variable           | Rationale                        |
| ------------------ | ------------------------ | -------------------------------- |
| `h1`, `h2`, `h3`   | `--color-brand`          | Maximum prominence               |
| `h4`, `h5`         | `--color-brand`          | Secondary hierarchy              |
| `h6`               | `--color-text-muted`     | Micro heading / label treatment  |
| `home-body-text`   | `--color-text-secondary` | Reduced contrast for readability |
| `home-subtle-text` | `--color-text-muted`     | Secondary metadata               |
| `home-micro-label` | `--color-text-muted`     | Non-primary action               |

---

## Spacing System

### Vertical Rhythm

| Context             | Utility        | Value           | Usage                    |
| ------------------- | -------------- | --------------- | ------------------------ |
| Main container flow | `gap-4`        | 1rem            | Between major elements   |
| Section spacing     | `gap-8`        | 2rem            | Between content sections |
| Category spacing    | `gap-3`        | 0.75rem         | Header to list           |
| Card list           | `gap-4`        | 1rem            | Between cards            |
| Card internal       | `mt-2`, `mt-3` | 0.5rem, 0.75rem | Title to description     |

### Page Padding

| Breakpoint | Horizontal      | Vertical       |
| ---------- | --------------- | -------------- |
| Mobile     | `px-6` (1.5rem) | `py-16` (4rem) |
| Desktop    | `px-6` (1.5rem) | `py-16` (4rem) |

### Card Padding

| Default surface padding | `px-4 py-5 sm:px-5` |
| Legacy simple card | `p-4` (1rem) |

### Surface Template

The site uses a shared `<Surface>` component to implement floating panels, cards, and dashboards. This ensures consistent border radii, backgrounds, and shadows across all features.

**Implementation**:

```astro
<Surface as="section" class="flex flex-col gap-4">
  <slot />
</Surface>
```

| Purpose       | Attribute / Utility                                                            |
| ------------- | ------------------------------------------------------------------------------ |
| Component     | `src/components/ui/Surface.astro`                                              |
| Outer shell   | `rounded-2xl border border-(--color-border) bg-(--color-bg-surface) shadow-sm` |
| Inner spacing | `px-4 py-5 sm:px-5`                                                            |
| Clipping      | `overflow-hidden`                                                              |

**Rules**:

- **Always** use the `<Surface>` component instead of inlining its classes.
- Use the `as` prop to specify the semantic element (`section`, `article`, `li`, etc.).
- Do not add custom shadows or alternate border radii for new feature surfaces.
- Keep background and border tokens consistent so light and dark modes match.

---

## Layout Constraints

| Property       | Value               | Rationale                           |
| -------------- | ------------------- | ----------------------------------- |
| Max width      | `max-w-2xl` (672px) | Optimal line length for readability |
| Mobile padding | `px-6`              | Consistent edge spacing             |
| Centering      | `mx-auto`           | Symmetrical layout                  |

---

## Class Usage Matrix

### Valid Combinations

| Class              | Valid Elements | Invalid Elements |
| ------------------ | -------------- | ---------------- |
| `home-body-text`   | p, span        | h1-h6            |
| `home-micro-label` | a, span, small | h1-h6, p         |

### Required Pairings

| Class              | Required/Recommended        | Example                                 |
| ------------------ | --------------------------- | --------------------------------------- |
| `h1`               | none                        | Site titles, page titles                |
| `h2`               | none                        | Section titles                          |
| `h3`               | none                        | Card titles                             |
| `home-micro-label` | `transition-colors` (links) | `src/components/home/ContentCard.astro` |

---

## Rules (Enforced)

### Rule 1: Semantic Classes Only

**DO**:

```astro
<h1>Title</h1>
<p class="home-body-text">Description</p>
```

**DON'T**:

```astro
<h1 class="text-3xl font-light">Title</h1>
<p class="text-gray-600">Description</p>
```

**Rationale**: Centralized control, consistent appearance. Headings should be styled by their semantic level, not by page-specific utility classes.

---

### Rule 2: Hierarchy Matching

| Heading Level | Required Class      |
| ------------- | ------------------- |
| h1            | display title scale |
| h2            | section title scale |
| h3            | card title scale    |

**Rationale**: Visual hierarchy reflects DOM hierarchy.

---

### Rule 3: Body Text Color

`home-body-text` **must** use `--color-text-secondary` (default in CSS).

**DON'T** override with darker colors for "better contrast" — the reduced contrast is intentional for visual calm.

---

### Rule 4: No Webfonts

**NEVER** add:

- `@font-face` declarations
- Google Fonts imports
- `font-family` pointing to external services

**Rationale**: Performance, privacy, reliability.

---

### Rule 5: Light Weights for Large Text

| Element | Weight | Reason                      |
| ------- | ------ | --------------------------- |
| `h1`    | 500    | Elegant appearance          |
| `h2`    | 500    | Consistent with display     |
| `h3`    | 600    | Card prominence (exception) |

---

### Rule 6: Negative Tracking on Headlines

| Element | Tracking | Reason           |
| ------- | -------- | ---------------- |
| `h1`    | -0.025em | Tighter headline |
| `h2`    | -0.02em  | Tighter headline |

**DON'T** add positive tracking to headlines.

---

### Rule 7: Uppercase Labels

`home-micro-label` **includes** `text-transform: uppercase` and `letter-spacing: 0.08em`.

**DON'T** apply uppercase to body text or titles.

---

### Rule 8: Line Height Scale

| Size Category      | Leading   |
| ------------------ | --------- |
| Display (2.25rem+) | 1.05-1.15 |
| Card (1.25rem)     | 1.35      |
| Body (1rem)        | 1.75      |
| Micro (0.75rem)    | 1-1.6     |

**Rationale**: Smaller text needs more leading for readability.

---

### Rule 9: Responsive Automation

`h1` and `h2` auto-scale at 640px breakpoint.

**DON'T** add manual `@media` queries for typography — handled in `global.css`.

---

### Rule 10: New Pages Inherit System

Any new page **must**:

1. Use semantic heading levels (`h1`-`h3`) for titles
2. Use `home-body-text` and `home-micro-label` for supporting copy
3. Match spacing conventions (`gap-4`, `py-16`, `px-6`)
4. Use `max-w-2xl` container

**Rationale**: Site-wide visual consistency.

### Rule 11: Surface Template Reuse

Any new surface-like component **must** reuse the shared shell attributes from the Surface Template section instead of inventing a new card style.

**Rationale**: Keeps floating panels visually consistent across the entire website.

---

## Quick Reference

### Creating a New Section

```astro
<section class="flex flex-col gap-8">
  <h2>Section Title</h2>
  <p class="home-body-text">Section description goes here.</p>

  <ul class="flex flex-col gap-4">
    <Surface as="li">
      <h3>Card Title</h3>
      <p class="home-body-text mt-2">Card description.</p>
    </Surface>
  </ul>
</section>
```

### Creating a Back Link

```astro
<a class="home-subtle-text inline-flex items-center gap-1" href="/en/">
  <span>←</span>
  <span>Back</span>
</a>
```

### Creating Metadata Labels

```astro
<span class="home-micro-label">External Link</span>
```

---

## Source of Truth

All typography classes defined in: `src/styles/global.css` (lines 188-280)
