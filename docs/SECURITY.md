# Security Notes

## Public Security Contact

- security.txt path: public/.well-known/security.txt
- contact channel: anna.zezulka@proton.me
- encryption key URL: /pgp/public-key.asc

## Privacy Defaults

- No third-party tracking scripts.
- No ad-tech integrations.
- Performance checks run in CI only.

## Release Checklist

1. Run npm run check.
2. Run npm run typecheck.
3. Run npm run build.
4. Run npm run test:e2e.
5. Run npm run lighthouse:ci.
6. Run npm run size:check.
