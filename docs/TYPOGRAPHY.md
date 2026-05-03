# Typography System

## Core Principles

This system enforces visual consistency through centralized control. See `src/styles/global.css` for all canonical token values.

### Restrained Hierarchyhej navečeřím

Fixed scale with no arbitrary sizes. All heading levels (`h1`-`h6`) are styled by element in CSS, ensuring consistent appearance across the entire site. Markdown content follows the same scale automatically.

**Rationale**: Prevents visual inconsistency from ad-hoc sizing decisions.

### System Fonts Only

No webfont loading permitted. The font stack uses platform-native fonts only.

**Rationale**: Performance, privacy, and reliability. External font requests are blocked by CSP.

### Calm Defaults

Light weights and subtle tracking create an unobtrusive reading experience.

**Rationale**: Reduces visual noise; prioritizes content over decoration.

### Consistent Vocabulary

Semantic HTML elements (`h1`-`h6`) for headings plus a shared set of utility classes for body text and metadata.

**Rationale**: Predictable patterns reduce cognitive load for contributors.

---

## Semantic Heading Scale

Headings use native `h1`-`h6` tags styled by element. The specific size, weight, leading, and tracking values are defined in `src/styles/global.css` and must not be overridden in component code.

**Rationale**: Centralized control ensures consistency. Headings should be styled by their semantic level, not by page-specific utility classes.

---

## Body Text System

Body copy uses dedicated classes (`home-body-text`, `home-subtle-text`, `home-inline-strong`) rather than inline utilities. Color values reference CSS custom properties defined in `global.css`.

**Rationale**: Ensures consistent color application across light and dark modes. The reduced contrast for body text is intentional for visual calm.

---

## Font Stacks

Font families are defined as CSS custom properties (`--font-sans`, `--font-mono`) in `global.css`. Platform-specific overrides ensure optimal rendering on each operating system.

**Rationale**: Leverages system fonts for zero-load-time typography while maintaining visual consistency.

---

## Color System

Text colors use CSS custom properties (`--color-brand`, `--color-text-secondary`, `--color-text-muted`, `--color-text-strong`). The mapping of semantic elements to color variables is defined in `global.css`.

**Rationale**: Centralized color management enables consistent light/dark mode switching and simplifies theming.

---

## Spacing System

Vertical rhythm uses Tailwind spacing utilities. The specific gap values for different contexts are standardized across the codebase.

**Rationale**: Consistent spacing improves readability and visual flow.

---

## Surface Template

The shared `<Surface>` component in `src/components/ui/Surface.astro` implements floating panels, cards, and dashboards with consistent border radii, backgrounds, and shadows.

**Rules**:

- Always use the `<Surface>` component instead of inlining its classes
- Use the `as` prop to specify the semantic element
- Do not add custom shadows or alternate border radii
- Keep background and border tokens consistent for light/dark mode parity

**Rationale**: Prevents proliferation of inconsistent card styles.

---

## Layout Constraints

All pages use `max-w-2xl` (672px) container with consistent padding (`px-6` horizontal, `py-16` vertical).

**Rationale**: Optimal line length for readability across devices.

---

## Rules (Enforced)

### Rule 1: Semantic Classes Only

Use semantic HTML elements with their default styling. Do not add utility classes that duplicate or override typography defined in `global.css`.

### Rule 2: Hierarchy Matching

Visual hierarchy must reflect DOM hierarchy. `h1` for page titles, `h2` for section titles, `h3` for card titles.

### Rule 3: Body Text Color

`home-body-text` must use `--color-text-secondary`. Do not override with darker colors.

### Rule 4: No Webfonts

Never add `@font-face` declarations, Google Fonts imports, or external font services.

### Rule 5: Light Weights for Large Text

Large headings use lighter weights (500) for elegant appearance.

### Rule 6: Negative Tracking on Headlines

`h1` and `h2` use negative letter-spacing for tighter appearance. Defined in CSS.

### Rule 7: Uppercase Labels

`home-micro-label` includes uppercase transformation and tracking. Do not apply uppercase to body text or titles.

### Rule 8: Line Height Scale

Smaller text needs more leading for readability. The scale is defined in `global.css`.

### Rule 9: Responsive Automation

`h1` and `h2` auto-scale at 640px breakpoint. Do not add manual `@media` queries for typography.

### Rule 10: New Pages Inherit System

Any new page must use semantic heading levels, `home-body-text` for copy, standard spacing, and `max-w-2xl` container.

### Rule 11: Surface Template Reuse

Any new surface-like component must reuse the shared shell attributes from the Surface component.

---

## Source of Truth

All typography values are defined in: `src/styles/global.css`
