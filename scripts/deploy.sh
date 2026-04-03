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
    commit -m "deAvoid the local options (glm-4.7-flash, qwen3.5 non-cloud) for this task — 11–25GB models running locally will struggle with a prompt this long and multi-step.ploy: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git -C "$DIST" push --force "$REMOTE" "$BRANCH"
