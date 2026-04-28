# Contributing to annazez/personal-web

## Quality Gate

This project enforces a strict quality gate via automated CI (Woodpecker) and local checks.

### Automated Checks

Before submitting a PR, ensure that all checks pass:

- **Formatting**: `npm run format:check`
- **Linting**: `npm run lint`
- **Type Safety**: `npm run typecheck`
- **Accessibility**: `npm run test:a11y` (Requires a build and local server)
- **Comprehensive Check**: `npm run check` (Runs all of the above)

### Accessibility Standards

The site aims for **WCAG 2.1 AA** compliance. Accessibility is validated automatically on every build using `pa11y-ci`.

To run a11y checks locally:

```bash
npm run test:a11y
```

This will build the site, serve it locally, and run pa11y against critical paths.

### Deployment

Pushing to `main` triggers a deployment to Codeberg Pages, provided all quality gates pass.
