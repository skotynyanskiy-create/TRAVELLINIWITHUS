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

## Local environment setup

Copy `.env.example` to `.env`. The site runs with zero keys configured (every integration self-disables silently), but the following keys unlock real behavior in dev:

| Key                                                        | Purpose                                           | Without it                                                                                                                                           |
| ---------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_MAPBOX_TOKEN`                                        | Geocoding only, via `scripts/geocode-content.mjs` | `/mappa` works fine — it renders MapLibre tiles from `tiles.openfreemap.org` and never calls Mapbox. Only the manual geocoding script needs this key |
| `BREVO_API_KEY` + `BREVO_LIST_ID`                          | Forwards newsletter signups to Brevo              | Form still collects, falls back to localStorage `twu_newsletter_leads`. Keys at https://app.brevo.com/settings/keys/api                              |
| `RESEND_API_KEY`                                           | Sends transactional email for `/api/contact-lead` | Lead saved server-side and to localStorage `twu_contact_leads`, no email sent. Keys at https://resend.com/api-keys                                   |
| `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET`              | Real Stripe checkout & webhooks                   | Set `ALLOW_MOCK_CHECKOUT=true` to bypass with mock checkout in dev                                                                                   |
| `VITE_GA_ID`, `VITE_META_PIXEL_ID`, `VITE_TIKTOK_PIXEL_ID` | Analytics & ad pixels (consent-gated)             | No tracking, banner still appears                                                                                                                    |

Never commit `.env`. `.env.example` is the only env file checked in.

## Setup on a second PC

Clone only the canonical repository:

```bash
git clone https://github.com/skotynyanskiy-create/TRAVELLINIWITHUS.git
cd TRAVELLINIWITHUS
npm install
npm run dev
```

Then open the dedicated operational notes folder as the Obsidian vault:

```txt
<cartella-del-repo>/docs
```

The `docs/` folder contains the operational notes, project records, marketing
hub and release tracking. Its local `docs/.obsidian/` configuration keeps
Obsidian fast by excluding the application code and `node_modules`; Graphify
indexes the codebase separately from the repository root.

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
npm run audit:quality
npm run predeploy
```

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

For Codex sessions:

- repo instructions come from `AGENTS.md`
- local project skills come from `.agents/skills`
- MCP runtime parity with Claude Code is configured in `~/.codex/config.toml`, aligned to `.mcp.json`

## Obsidian

Open this folder as vault:

`<cartella-del-repo>/docs`

Main notes:

- `docs/OBSIDIAN_HOME.md`
- `docs/OBSIDIAN_DASHBOARD.md`
- `docs/MARKETING_OPERATIONS_HUB.md`

## Main working notes

- `docs/10_Projects/PROJECT_TRAVELLINIWITHUS_SITE.md`
- `docs/10_Projects/PROJECT_HOME_RICOMPOSIZIONE_2026-07-26.md`
- `docs/10_Projects/PROJECT_BACKLOG_UNICO_2026-07-31.md` — l unica lista viva
- `docs/10_Projects/PROJECT_DESTINATIONS_SECTION_REVIEW.md`
- `docs/10_Projects/PROJECT_RELEASE_READINESS.md`

## Public references

- Instagram: https://www.instagram.com/travelliniwithus/?hl=it
- Website: https://www.travelliniwithus.it/
