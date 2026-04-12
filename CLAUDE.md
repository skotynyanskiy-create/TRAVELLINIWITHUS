# TRAVELLINIWITHUS

Claude should treat `AGENTS.md` as the root operating guide for this repository.

## Required reading order

1. `AGENTS.md`
2. `README.md`
3. `docs/OBSIDIAN_HOME.md`
4. `docs/OBSIDIAN_DASHBOARD.md`
5. `docs/MARKETING_OPERATIONS_HUB.md`

## Project summary

Travel media brand, affiliate shop and B2B partnership site by Rodrigo & Betta.
Primary language is Italian. The repository combines website code, marketing operations and project memory.

## Core truths

- `docs/` is not optional documentation: it is the shared operating vault.
- important website or marketing work should update both code and the relevant operational note.
- the owner is acting as marketing lead / website builder for the influencer brand.

## Stack

- React 19 + TypeScript + Vite 6
- Tailwind CSS 4
- Express
- Firebase / Firestore
- Stripe
- Vitest + Playwright

## Important conventions

- TypeScript is not in strict mode
- prefer explicit typing and avoid new `any`
- preserve current visual language unless redesign is requested
- treat `server.ts`, `firestore.rules` and `src/config/admin.ts` as high-risk

## Operational commands

```bash
npm run dev
npm run typecheck
npm run build
npm run audit:ui
npm run audit:firebase
npm run audit:stripe
npm run predeploy
```

## Shared workflows

See `docs/AGENT_WORKFLOWS.md` and `docs/AI_COLLABORATION_PROTOCOL.md`.

## Claude Code session start

For new Claude Code sessions, use:

- `.claude/CLAUDE_CODE_START_PROMPT.md`

And keep these notes in scope when relevant:

- `docs/10_Projects/PROJECT_TRAVELLINIWITHUS_SITE.md`
- `docs/MARKETING_OPERATIONS_HUB.md`
- `docs/10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT.md`
