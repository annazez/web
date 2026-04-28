# PGP Public Key

This directory contains the site owner's armored PGP public key.

## Key Details

- **File**: `public-key.asc`
- **Fingerprint**: `20CE F7B1 FB8B 21BF E64D  5AE0 91E9 CF41 C256 1839`
- **Algorithm**: Ed25519

## Keyoxide Identity Proofs

The key contains OpenPGP notation packets (`proof@ariadne.id`) that allow
[Keyoxide](https://keyoxide.org) to cryptographically verify ownership of
external accounts (GitHub, Codeberg, etc.).

The site links to the Keyoxide profile at:
`https://keyoxide.org/20CEF7B1FB8B21BFE64D5AE091E9CF41C2561839`

## Key Rotation Workflow

When rotating the key, re-add notation packets for each platform proof:

```bash
# 1. Generate or import the new key
gpg --full-generate-key

# 2. Add identity proof notations
gpg --edit-key <fingerprint>
# > notation
# Enter: proof@ariadne.id=https://codeberg.org/annazez/keyoxide-proof
# Repeat for each platform (GitHub gist, etc.)
# > save

# 3. Export the updated key
gpg --armor --export <fingerprint> > public/pgp/public-key.asc

# 4. Update src/data/identity.ts with the new fingerprint (if changed)

# 5. Commit and deploy
```

For the full guide on creating Keyoxide proofs, see:
https://docs.keyoxide.org/getting-started/creating-profile/
