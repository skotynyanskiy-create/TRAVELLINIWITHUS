# TRAVELLINIWITHUS

Website and marketing operating system for the influencer brand `@travelliniwithus`.

## Canonical repository

This is the official and canonical Travelliniwithus repository:

`https://github.com/skotynyanskiy-create/TRAVELLINIWITHUS`

Use this repository as the only source of truth for:

- website source code
- homepage, navigation and public funnel work
- Obsidian vault and marketing operations in `docs/`
- release, campaign, partnership and content planning notes

Do not create or continue parallel Travelliniwithus repositories unless they are explicitly marked as archived experiments. New work should branch from this repository and return here through commits or pull requests.

This repository is used to build and operate:

- public website
- editorial content and destination storytelling
- affiliate / shop flows
- collaborations and media kit conversion
- project, marketing and release operations through the Obsidian vault in `docs/`

## Core stack

- React 19
- TypeScript
- Vite 6
- Tailwind CSS 4
- Express
- Firebase / Firestore
- Stripe
- Vitest + Playwright

## Run locally

```bash
npm install
npm run dev
```

## Setup on a second PC

Clone only the canonical repository:

```bash
git clone https://github.com/skotynyanskiy-create/TRAVELLINIWITHUS.git
cd TRAVELLINIWITHUS
npm install
npm run dev
```

Then open Obsidian with this folder as the vault:

```txt
docs/
```

The `docs/` folder is part of the repository on purpose. It contains the operational vault, project notes, marketing hub and release tracking. Obsidian settings that are useful for keeping the working environment consistent across computers are also versioned.

## Git workflow

Use this repo as the only upstream project:

```bash
git remote -v
git pull
git checkout -b codex/short-description
git push -u origin codex/short-description
```

Before switching computers, commit or push your work here. On the second PC, run `git pull` before editing.

## Main commands

```bash
npm run dev
npm run typecheck
npm run lint
npm run test
npm run build
npm run audit:ui
npm run audit:firebase
npm run audit:stripe
npm run audit:all
npm run predeploy
```

## Architecture

Mappa dello stack, data flow, API endpoints, CI/CD e security boundaries: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Troubleshooting

Problemi comuni (dev server, Firebase, Stripe, build, test, lint, Claude Code hook, `npm audit`): [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md).

## AI collaboration

This repo is configured to work cleanly across multiple AI tools.

Read in this order:

1. `AGENTS.md`
2. `CLAUDE.md`
3. `docs/AI_COLLABORATION_PROTOCOL.md`
4. `docs/OBSIDIAN_HOME.md`
5. `docs/MARKETING_OPERATIONS_HUB.md`

For Claude Code session startup:

- `.claude/CLAUDE_CODE_START_PROMPT.md`

## Deploy

- Frontend hosting: **Vercel** (raccomandato, linkato in `.vercel/`). Config in `vercel.json`.
- Firestore rules / Auth / Storage / backup: **Firebase** (`firebase.json`, `firestore.rules`, `.firebaserc`). Firebase Hosting è alternativa per il frontend.
- Runbook completo: [`docs/DEPLOYMENT_RUNBOOK.md`](docs/DEPLOYMENT_RUNBOOK.md).
- Stripe webhook setup: [`docs/STRIPE_WEBHOOK_RUNBOOK.md`](docs/STRIPE_WEBHOOK_RUNBOOK.md).

## Obsidian

Open this folder as vault:

`docs/`

Main notes:

- `docs/OBSIDIAN_HOME.md`
- `docs/OBSIDIAN_DASHBOARD.md`
- `docs/MARKETING_OPERATIONS_HUB.md`

## Main working notes

- `docs/10_Projects/PROJECT_TRAVELLINIWITHUS_SITE.md`
- `docs/10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT.md`
- `docs/10_Projects/PROJECT_DESTINATIONS_SECTION_REVIEW.md`
- `docs/10_Projects/PROJECT_RELEASE_READINESS.md`

## Public references

- Instagram: https://www.instagram.com/travelliniwithus/?hl=it
- Website: https://www.travelliniwithus.it/
