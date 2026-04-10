# Personal Website

A fast, static personal website built with Astro and Tailwind CSS.

> ⚠️ **Repository Notice**
> This repository is actively maintained on [Codeberg](https://codeberg.org/annazez/pages). The GitHub repository is an automated, read-only mirror. Please direct any issues or development matters to the Codeberg repository.

## 🚀 Tech Stack

- **Framework:** [Astro](https://astro.build/) (Static Site Generation)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing:** Custom i18n static routing (`/cs/`, `/en/`)
- **Deployment:** Codeberg Pages
- **CI/CD:** Woodpecker pipelines (verify, e2e, performance, deploy)

## 📁 Project Structure

- `src/i18n/` - Custom routing logic and language dictionaries
- `src/pages/` - Static page templates and localized routes
- `src/components/` - Reusable UI components
- `src/styles/` - Global Tailwind CSS configuration
- `tests/e2e/` - Playwright end-to-end and web-vitals tests
- `docs/` - Manifesto, architecture, operations, and AI workflow docs

## 💻 Commands

All commands are run from the root of the project, from a terminal:

| Command                 | Action                                               |
| :---------------------- | :--------------------------------------------------- |
| `npm run dev`           | Starts local dev server at `localhost:4321`          |
| `npm run build`         | Builds your production site to `./dist/`             |
| `npm run deploy`        | Builds the site and deploys it to the `pages` branch |
| `npm run lint`          | Runs ESLint to check code quality                    |
| `npm run format`        | Runs Prettier to format the codebase                 |
| `npm run clean`         | Removes cached files and build outputs               |
| `npm run test:e2e`      | Runs Playwright end-to-end tests                     |
| `npm run lighthouse:ci` | Runs Lighthouse CI to enforce 100/100 scores         |
| `npm run size:check`    | Validates JS/CSS bundle budget                       |

## CI/CD on Codeberg

- CI is configured via `.woodpecker.yml`.
- Deployment keeps your existing flow and runs an automated variant of `npm run deploy`.
- Required secret in Woodpecker: `codeberg_token`.
- Running `npm ci` installs the repo hooks, including a `pre-commit` formatter that auto-runs Prettier before code is pushed.
- Playwright E2E coverage includes Chromium, Firefox, and WebKit; CI runs on Ubuntu, so local Fedora hosts may need extra Playwright system dependencies for browser execution.

## PGP Key

- Public key file path: `public/pgp/public-key.asc`
- Public URL after deployment: `/pgp/public-key.asc`
- `security.txt` references this URL via `Encryption:`.

## Docs

- `docs/MANIFESTO.md`
- `docs/AI_WORKFLOW.md`
- `docs/ARCHITECTURE.md`
- `docs/OPERATIONS.md`
