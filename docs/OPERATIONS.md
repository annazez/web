# Operations

## Local Development

1. npm ci
2. npm run dev

## Quality Gates

1. npm run check
2. npm run typecheck
3. npm run build
4. npm run test:e2e

## Performance Gates

1. npm run size:check
2. npm run lighthouse:ci

## Continuous Security

### npm audit

The CI pipeline includes an automatic security audit step (`security-audit`) that runs on every push and pull request. This step uses `npm audit --audit-level=high` to fail the build if any high or critical vulnerabilities are detected in dependencies.

### Renovate Bot

Renovate Bot automates dependency updates and is configured in `renovate.json`. It continuously monitors dependencies and automatically creates pull requests for updates. Safe updates (minor and patch versions) are configured to merge automatically, reducing manual maintenance burden while keeping the project secure and up-to-date.

Renovate is hosted on Codeberg and serves as the open-source alternative to GitHub's Dependabot, providing the same automated dependency management capabilities.

## CI Secret Requirements

- codeberg_token: personal access token with repository write access

## PGP Key Rotation

1. Export armored public key.
2. Replace content of public/pgp/public-key.asc.
3. Commit and deploy.
4. Update security.txt expiry date when needed.
