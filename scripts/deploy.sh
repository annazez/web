#!/bin/sh
set -e

REMOTE="https://annazez:${CODEBERG_TOKEN}@codeberg.org/annazez/pages.git"
DIST="dist"
BRANCH="pages"

git init "$DIST"
git -C "$DIST" checkout --orphan "$BRANCH"
git -C "$DIST" add .
git -C "$DIST" -c user.name="Woodpecker CI" \
                -c user.email="anna.zezulka@proton.me" \
    commit -m "deploy: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git -C "$DIST" push --force "$REMOTE" "$BRANCH"
