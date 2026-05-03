# Personal Website

A fast, static personal website built with Astro and Tailwind CSS.

## 🚀 Tech Stack

- **Framework:** [Astro](https://astro.build/) (Static Site Generation)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing:** Custom i18n static routing (`/cs/`, `/en/`)
- **Deployment:** Custom domain (zezulka.me) via Forgejo git-pages
- **CI/CD:** Forgejo Actions (verify, e2e, performance, deploy)

## 📁 Project Structure

- `src/i18n/` - Custom routing logic and language dictionaries
- `src/pages/` - Static page templates and localized routes
- `src/components/` - Reusable UI components
- `src/styles/` - Global Tailwind CSS configuration
- `src/data/` - Data files, CSP configuration, and headers template
- `src/scripts/` - Build scripts and utilities
- `tests/e2e/` - Playwright end-to-end and web-vitals tests
- `tests/unit/` - Unit tests
- `docs/` - Architecture, operations, security, and workflow documentation
- `public/pgp/` - PGP public key
- `.forgejo/workflows/` - CI/CD pipeline configurations

## 💻 Commands

All commands are run from the root of the project, from a terminal:

| Command                 | Action                                             |
| :---------------------- | :------------------------------------------------- |
| `npm run dev`           | Starts local dev server at `localhost:4321`        |
| `npm run build`         | Builds your production site to `./dist/`           |
| `npm run preview`       | Preview the production build locally               |
| `npm run lint`          | Runs ESLint to check code quality                  |
| `npm run format`        | Runs Prettier to format the codebase               |
| `npm run clean`         | Removes cached files and build outputs             |
| `npm run test:e2e`      | Runs Playwright end-to-end tests                   |
| `npm run test:unit`     | Runs unit tests                                    |
| `npm run lighthouse:ci` | Runs Lighthouse CI to enforce performance budgets  |
| `npm run size:check`    | Validates JS/CSS bundle budget                     |
| `npm run check`         | Runs format check, lint, typecheck, and a11y tests |

## CI/CD on Forgejo

- CI is configured via `.forgejo/workflows/ci.yml` using Forgejo Actions (GitHub Actions syntax).
- Deployment is handled automatically by the CI workflow when pushing to main.
- Running `npm ci` installs the repo hooks, including a `pre-commit` formatter that auto-runs Prettier before code is pushed.
- Playwright E2E coverage includes Chromium, Firefox, and WebKit; CI runs on Ubuntu, so local Fedora hosts may need extra Playwright system dependencies for browser execution.

## PGP Key

- Public key file path: `public/pgp/public-key.asc`
- Public URL after deployment: `/pgp/public-key.asc`
- `security.txt` (located at `/.well-known/security.txt`) references this URL via `Encryption: https://annazez.codeberg.page/pgp/public-key.asc`

## Docs

- `docs/MANIFESTO.md`
- `docs/AI_WORKFLOW.md`
- `docs/ARCHITECTURE.md`
- `docs/OPERATIONS.md`
- `docs/SECURITY.md`
- `docs/TYPOGRAPHY.md`
