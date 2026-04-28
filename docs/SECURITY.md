# Security Model

## Core Position

Security is a structural requirement, not a feature. This site enforces security through:

- **Defense in depth**: Multiple overlapping controls
- **Minimal attack surface**: No external dependencies, no analytics
- **Transparent verification**: Public security contact, PGP encryption
- **Automated enforcement**: CI gates block insecure changes

---

## Threat Model

### Assets to Protect

| Asset              | Sensitivity | Protection                      |
| ------------------ | ----------- | ------------------------------- |
| Deploy credentials | Critical    | CI secrets only                 |
| PGP private key    | Critical    | Never committed                 |
| User privacy       | High        | No tracking, no data collection |
| Code integrity     | High        | Signed commits, verified CI     |

### Attack Vectors Mitigated

| Vector                 | Mitigation                                     |
| ---------------------- | ---------------------------------------------- |
| XSS                    | Strict CSP, no user input, no external scripts |
| Supply chain           | Minimal deps, Renovate automation, npm audit   |
| Data leakage           | No analytics, no third-party requests          |
| MITM                   | HTTPS enforcement, CSP `default-src 'self'`    |
| Information disclosure | No error messages, no stack traces             |

---

## Content Security Policy

### Current Policy

```
default-src 'self'
script-src 'self' 'unsafe-inline'
style-src 'self' 'unsafe-inline'
img-src 'self' data:
font-src 'self' data:
connect-src 'self'
```

### Rationale

| Directive                    | Value     | Justification                                   |
| ---------------------------- | --------- | ----------------------------------------------- |
| `script-src 'unsafe-inline'` | Required  | Astro theme script (inline, before first paint) |
| `style-src 'unsafe-inline'`  | Required  | Tailwind utilities + CSS custom properties      |
| `img-src data:`              | Required  | Inline SVG support                              |
| `font-src data:`             | Defensive | System fonts only; no external font loads       |
| `connect-src 'self'`         | Strict    | No external XHR/fetch allowed                   |

### Violations = Build Failures

Any CSP violation in CI testing blocks deployment.

---

## Dependency Security

### Automated Controls

| Control                | Tool         | Frequency     |
| ---------------------- | ------------ | ------------- |
| Vulnerability scan     | `npm audit`  | Every CI run  |
| Safe updates           | Renovate Bot | Continuous    |
| Lock file verification | npm          | Every install |

### Dependency Rules

| Rule                    | Enforcement                 |
| ----------------------- | --------------------------- |
| No runtime analytics    | Manifesto requirement       |
| No external CDNs        | CSP enforcement             |
| Minimal surface         | Code review + AI validation |
| Auto-merge safe updates | Renovate configuration      |

### Audit Levels

| Level      | CI Behavior     |
| ---------- | --------------- |
| `low`      | Warning only    |
| `moderate` | Warning only    |
| `high`     | **BUILD FAILS** |
| `critical` | **BUILD FAILS** |

---

## Public Security Contact

### security.txt

**Location**: `public/.well-known/security.txt`

**Fields**:

```
Contact: mailto:anna@zezulka.me
Encryption: /pgp/public-key.asc
Preferred-Languages: en, cs
Expires: [ISO 8601 date]
```

### PGP Key Management

| File                        | Content                       |
| --------------------------- | ----------------------------- |
| `public/pgp/public-key.asc` | Armored public key            |
| `~/.gnupg/` (local)         | Private key (NEVER committed) |

**Fingerprint**: `20CE F7B1 FB8B 21BF E64D  5AE0 91E9 CF41 C256 1839`

### Keyoxide Identity Verification

The site links to a [Keyoxide](https://keyoxide.org) profile that cryptographically verifies
ownership of external accounts (GitHub, Codeberg, etc.) using OpenPGP notation packets
embedded in the public key.

- **Profile URL**: `https://keyoxide.org/20CEF7B1FB8B21BFE64D5AE091E9CF41C2561839`
- **Homepage link**: Shield-check icon in the Hero section social links
- **How it works**: Keyoxide reads `proof@ariadne.id` notation packets from the published
  key and cross-references them with platform-specific proof statements (e.g. a Codeberg
  repository or GitHub gist). The site itself performs no verification — it only links out.

### Rotation Procedure

```bash
# 1. Export new key
gpg --armor --export > public/pgp/public-key.asc

# 2. Re-add Keyoxide notation packets for each platform proof
#    See: https://docs.keyoxide.org/getting-started/creating-profile/
gpg --edit-key <fingerprint>
# notation> proof@ariadne.id=https://codeberg.org/annazez/keyoxide-proof
# notation> proof@ariadne.id=https://gist.github.com/annazez/<gist-id>

# 3. Update security.txt expiry
# Edit public/.well-known/security.txt

# 4. Update fingerprint in src/data/identity.ts if changed

# 5. Commit and deploy
git add public/ src/data/identity.ts
git commit -m "Rotate PGP key"
git push
```

---

## Privacy Guarantees

### What This Site Does NOT Collect

| Data Type             | Status |
| --------------------- | ------ |
| Analytics             | None   |
| Cookies (third-party) | None   |
| User tracking         | None   |
| Form submissions      | None   |
| Session data          | None   |
| IP logging            | None   |

### Theme Storage

- **Scope**: `localStorage` only (client-side)
- **Sync**: `storage` event for cross-tab sync
- **Data**: Single key `theme` with value `light` or `dark`
- **No server transmission**

---

## CI Security Steps

### Woodpecker Pipeline

```yaml
steps:
  - security-audit: npm audit --audit-level=high
  - build: npm run build
  - deploy: push to pages branch
```

### Failure Conditions

| Condition                   | Result         |
| --------------------------- | -------------- |
| High/critical vulnerability | Pipeline fails |
| CSP violation in tests      | Pipeline fails |
| Missing typecheck           | Pipeline fails |
| Build failure               | Pipeline fails |

---

## Release Security Checklist

Before any deployment:

- [ ] `npm run security-audit` passes (no high/critical)
- [ ] `npm run check` passes (Astro validation)
- [ ] `npm run typecheck` passes (TypeScript)
- [ ] `npm run build` succeeds (production build)
- [ ] `npm run test:e2e` passes (integration tests)
- [ ] `npm run lighthouse:ci` passes (performance gate)
- [ ] `npm run size:check` passes (bundle limits)
- [ ] No secrets in git history (verify with git-secrets or similar)
- [ ] PGP key current (check `security.txt` expiry)

---

## Incident Response

### If Vulnerability Discovered

1. **Reporter**: Email `anna@zezulka.me` with PGP encryption
2. **Response**: Acknowledge within 48 hours
3. **Fix**: Patch and deploy
4. **Disclosure**: Coordinated after fix is live

### If Credentials Compromised

1. Revoke compromised token immediately
2. Generate new credentials
3. Update CI secrets
4. Audit git history for unauthorized changes

---

## Compliance Notes

| Standard | Status                         |
| -------- | ------------------------------ |
| GDPR     | Compliant (no data collection) |
| CCPA     | Compliant (no data sale)       |
| ePrivacy | Compliant (no cookies)         |
