# Operations Manual

## Quick Start

### First Time Setup

```bash
# Install dependencies
npm ci

# Start development server
npm run dev

# Open http://localhost:4321
```

`npm ci` also configures the repo Git hooks, so formatting runs automatically in `pre-commit` before you push.

---

## Development Workflow

### Daily Development

```bash
# 1. Install (if needed)
npm ci

# 2. Run dev server
npm run dev

# 3. Make changes → auto-reload

# 4. Validate before commit
npm run check && npm run typecheck
```

### Pre-Commit Checklist

- [ ] `npm run check` passes
- [ ] `npm run typecheck` passes
- [ ] No console errors in browser
- [ ] No secrets in changes
- [ ] Typography uses `home-*` classes

---

## Quality Gates

### Run Order (Strict)

```bash
# 1. Astro validation
npm run check

# 2. TypeScript check
npm run typecheck

# 3. Production build
npm run build

# 4. End-to-end tests
npm run test:e2e

# 5. Performance audit
npm run lighthouse:ci

# 6. Bundle size check
npm run size:check

# 7. Security audit
npm run security-audit
```

### Gate Definitions

| Command                  | Tool       | Purpose                  | Fail Condition     |
| ------------------------ | ---------- | ------------------------ | ------------------ |
| `npm run check`          | Astro      | Validate syntax, imports | Any Astro error    |
| `npm run typecheck`      | TypeScript | Type safety              | Any TS error       |
| `npm run build`          | Astro      | Production build         | Build failure      |
| `npm run test:e2e`       | Playwright | Integration tests        | Any test failure   |
| `npm run lighthouse:ci`  | Lighthouse | Performance score        | Score < 100        |
| `npm run size:check`     | Custom     | Bundle limits            | Exceeds threshold  |
| `npm run security-audit` | npm        | Vulnerability scan       | High/critical vuln |

---

## Deployment

### Manual Deploy

```bash
# Ensure on main branch
git checkout main

# Pull latest
git pull

# Run all gates
npm run check && npm run typecheck && npm run build && npm run test:e2e

# Deploy
npm run deploy
```

### CI Deploy (Woodpecker)

**Pipeline**: `.woodpecker/*.yml`

```
push → test → build → deploy
              ↓
         all gates must pass
```

**Target**: `pages` branch (Codeberg Pages)

**Secrets Required**:

- `CODEBERG_TOKEN`: Push authorization

---

## Dependency Management

### Automated Updates

| Tool         | Purpose         | Config          |
| ------------ | --------------- | --------------- |
| Renovate Bot | Safe auto-merge | `renovate.json` |

**Renovate Behavior**:

- Patch/minor updates → auto-merge if tests pass
- Major updates → PR for review
- Runs on schedule (not every push)

### Manual Updates

```bash
# Check outdated
npm outdated

# Update specific package
npm install <package>@latest

# Verify no breaking changes
npm run test:e2e
```

### Security Audits

```bash
# Run audit
npm run security-audit

# If high/critical found:
# 1. Check affected package
# 2. Update or remove
# 3. Re-run audit
```

---

## PGP Key Rotation

### When

- Before `security.txt` expiry date
- If key is compromised
- Annually (recommended)

### Procedure

```bash
# 1. Export new key
gpg --armor --export > public/pgp/public-key.asc

# 2. Update security.txt
# Edit: public/.well-known/security.txt
# Set new Expires: date (ISO 8601)

# 3. Commit
git add public/
git commit -m "security: rotate PGP key"

# 4. Deploy
npm run deploy
```

---

## Troubleshooting

### Build Fails

```bash
# Check Astro errors
npm run check

# Check TypeScript errors
npm run typecheck

# Check for missing files
ls -la src/
```

### Tests Fail

```bash
# Run tests with output
npm run test:e2e -- --reporter=list

# Common causes:
# - Selector changed
# - Route changed
# - Content changed
```

Note: Playwright coverage is expected to run in Ubuntu-based CI. On Fedora or other unsupported Linux hosts, browser binaries may install but still require extra system dependencies before WebKit can launch.

### Performance Regression

```bash
# Run Lighthouse locally
npm run lighthouse:ci

# Check report in .lighthouseci/
# Identify failing category
```

### Dependency Issues

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm ci

# Check for conflicts
npm ls
```

---

## File Impact Matrix

| File Changed                              | Affected Systems               | Validation Required |
| ----------------------------------------- | ------------------------------ | ------------------- |
| `src/layouts/Layout.astro`                | All pages (SEO, CSP, theme)    | Full gate run       |
| `src/styles/global.css`                   | All pages (typography, colors) | Visual + Lighthouse |
| `src/i18n/dictionary.ts`                  | All translations, routing      | Typecheck + build   |
| `src/pages/[lang]/[workspace_slug].astro` | Inventory page only            | E2E + visual        |
| `src/components/ui/*`                     | All pages using component      | E2E + visual        |
| `public/.well-known/security.txt`         | Security contact               | Manual verification |
| `.woodpecker/*.yml`                       | CI pipeline                    | Deploy test         |

---

## Environment Variables

### Required (CI Only)

| Variable         | Purpose              | Scope   |
| ---------------- | -------------------- | ------- |
| `CODEBERG_TOKEN` | Deploy authorization | CI only |

### Not Required

| Variable       | Reason       |
| -------------- | ------------ |
| `API_KEY`      | No API calls |
| `DATABASE_URL` | No database  |
| `ANALYTICS_ID` | No analytics |

---

## Monitoring

### What We Monitor

| Metric           | Tool | Target             |
| ---------------- | ---- | ------------------ |
| Lighthouse score | CI   | 100/100/100/100    |
| Bundle size      | CI   | Under threshold    |
| Vulnerabilities  | CI   | Zero high/critical |

### What We Don't Monitor

| Metric        | Reason                        |
| ------------- | ----------------------------- |
| Page views    | No analytics                  |
| User behavior | Privacy principle             |
| Uptime        | Static site; Codeberg handles |

---

## Release Checklist

Before deploying to production:

- [ ] All quality gates pass
- [ ] No secrets in git history
- [ ] PGP key current (check `security.txt` expiry)
- [ ] Changelog updated (if applicable)
- [ ] Tested on target browsers
- [ ] Accessibility verified (`#audit` mode)
- [ ] Performance verified (Lighthouse CI)

---

## Contact

For operational issues, contact: anna@zezulka.me
