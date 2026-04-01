# AI Workflow Guide

## Purpose

This document makes project context easy for AI coding tools to parse quickly and reliably.

## Project Facts

- Framework: Astro static site
- Languages: en, cs
- Deployment target: Codeberg Pages via pages branch
- Build output: dist
- Styling: Tailwind CSS v4

## Conventions For AI Agents

- Prefer small, targeted patches.
- Keep source files and comments in English.
- Preserve minimalist UI and typography direction.
- Keep privacy-friendly defaults.
- Avoid adding runtime JavaScript unless needed.

## High-Value Commands

- npm run check
- npm run typecheck
- npm run build
- npm run test:e2e
- npm run lighthouse:ci
- npm run size:check

## Safety Rules

- Never commit secrets.
- Keep deploy tokens in CI secrets only.
- Do not change deployment branch naming without updating docs and CI.
