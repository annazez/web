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

## CI Secret Requirements

- codeberg_token: personal access token with repository write access

## PGP Key Rotation

1. Export armored public key.
2. Replace content of public/pgp/public-key.asc.
3. Commit and deploy.
4. Update security.txt expiry date when needed.
