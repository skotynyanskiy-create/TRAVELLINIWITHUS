# TRAVELLINIWITHUS — GitHub Copilot Instructions

Use `AGENTS.md` as the primary repository instruction file. Keep this file
short; do not duplicate `CLAUDE.md` or the AI stack docs here.

## Required Context

- `README.md`
- `AGENTS.md`
- `CLAUDE.md`
- `DESIGN.md`
- `docs/AI_AGENT_STACK.md`
- `docs/AI_OPERATIONS_DASHBOARD.md`
- `docs/MARKETING_OPERATIONS_HUB.md`
- `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`

## Non-Negotiable Rules

- `docs/` is operational truth, not optional documentation.
- `.agents/skills` is the canonical skill source; run `npm run sync:agents`
  after changing local skills.
- New AI/dev tooling follows Scouting -> Lab -> Adoption in
  `docs/AI_AGENT_STACK.md`.
- Track tooling candidates in `docs/AI_TOOLING_RADAR.md`.
- Use `docs/90_Templates/TPL_Tooling_Evaluation.md` before stable adoption.
- Public UI and content are Italian and must follow `DESIGN.md`.
- Prefer typed props and avoid new `any`.
- Treat `server.ts`, `firestore.rules`, and `src/config/admin.ts` as high-risk.

## Operating Modes

- **SAFE**: read, audit, research, plan, inspect, browser smoke.
- **BUILD**: normal code/docs/skill edits with tests.
- **OWNER ONLY**: deploy, push, `.env`, secrets, database migrations,
  Stripe/Firebase writes, destructive cleanup and high-risk files.

## Main Commands

```bash
npm run dev
npm run typecheck
npm run build
npm run audit:ui
npm run audit:firebase
npm run audit:stripe
npm run audit:agents
npm run audit:visual
npm run audit:quality
npm run predeploy
```

## Documentation Policy

- UI/home/nav changes: update the relevant project note in `docs/10_Projects/`.
- Bugs: create or update a note in `docs/14_Bugs/`.
- Campaigns, partners and content planning: use templates in `docs/90_Templates/`.
- AI/dev tooling changes: update `docs/AI_AGENT_STACK.md`,
  `docs/AI_TOOLING_RADAR.md`, or `docs/AI_OPERATIONS_DASHBOARD.md`.
