# TRAVELLINIWITHUS — Shared AI Operating Rules

This repository is the website and marketing operating system for the travel creator brand `@travelliniwithus`.

## Single source of truth

- Code truth: repo root
- Documentation and operational truth: `docs/`
- Obsidian vault: `docs/`
- Design-system truth for agents and design tools: `DESIGN.md`
- Agent stack truth: `docs/AI_AGENT_STACK.md`
- Marketing operating hub: `docs/MARKETING_OPERATIONS_HUB.md`
- Project hub: `docs/10_Projects/PROJECT_TRAVELLINIWITHUS_SITE.md`
- Editorial rules: `docs/EDITORIAL_GUIDE.md`
- Vault taxonomy and naming: `docs/OBSIDIAN_TAXONOMY.md`

## Read this order first

1. `README.md`
2. `CLAUDE.md`
3. `docs/OBSIDIAN_HOME.md`
4. `docs/OBSIDIAN_DASHBOARD.md`
5. `docs/MARKETING_OPERATIONS_HUB.md`
6. `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`

## Project context

- Brand: Rodrigo & Betta / Travelliniwithus
- Role of repository owner: marketing lead / website builder
- Primary language for UI and content: Italian
- Website goals:
  - brand clarity
  - editorial authority
  - partnerships / media kit conversion
  - lead capture
  - affiliate / shop monetization

## Working rules for any AI agent

- Do not treat Obsidian notes as optional side material. `docs/` is part of the working system.
- Use `.agents/skills` as the **canonical** local skill source for cross-tool skills (currently: all five `travellini-*` skills). `.github/skills/`, `.cursor/skills/`, `.gemini/skills/`, and the `travellini-*` copies in `.claude/skills/` are generated mirrors — never edit them directly. After editing `.agents/skills/**`, always run `npm run sync:agents` (and `npm run audit:agents` in CI validates the sync).
- `.claude/skills/` also hosts **Claude-only skills** that do not live in `.agents/skills/` by design (e.g. `bug-triage`, `small-fix`, `quick-review`, `deep-refactor`, `explain-module`, `audit-ui`, `audit-browser`, `smoke-test`, `commit`, `deploy`, `predeploy`, `firebase-check`, `stripe-flow`, `new-page`, `new-article`, `seo-check`, `route`). These are runtime workflow helpers specific to Claude Code; other AI tools (Cursor/Gemini/Copilot) do not consume them. They can be edited directly in `.claude/skills/`. `audit:agents` ignores them by design: it only validates the mirror of the canonical `travellini-*` skills.
- Use `DESIGN.md` for UI direction, Stitch/Figma prompts and design-system interpretation.
- Do not import external skill behavior directly into the repo without adapting it locally and documenting the source in `docs/AI_AGENT_STACK.md`.
- When changing important UI, flows, positioning or operations, update the relevant note in `docs/`.
- If a change affects homepage, navbar, collaborations, content architecture or release readiness, update or create a project note.
- If a change introduces or resolves a bug, create or update a bug note.
- If a new campaign, partner lead or content plan appears, use the marketing templates in `docs/90_Templates/`.

## Default operational notes

- Homepage/UI work: `docs/10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT.md`
- Destinations section: `docs/10_Projects/PROJECT_DESTINATIONS_SECTION_REVIEW.md`
- Release tracking: `docs/10_Projects/PROJECT_RELEASE_READINESS.md`
- Campaigns hub: `docs/MARKETING_OPERATIONS_HUB.md`

## Code conventions

- React 19 + TypeScript + Vite 6
- Tailwind CSS 4 + CSS variables
- Prefer typed props and explicit interfaces
- Keep Firestore operations centralized unless there is a clear reason not to
- Preserve the existing visual language unless a redesign is explicitly requested
- High-risk files:
  - `server.ts`
  - `firestore.rules`
  - `src/config/admin.ts`

## Must-run checks when relevant

```bash
npm run typecheck
npm run build
npm run audit:ui
npm run audit:firebase
npm run audit:stripe
npm run audit:agents
npm run predeploy
```

## Marketing-specific operating model

- Use `MARKETING_OPERATIONS_HUB.md` as the top marketing dashboard
- Track campaigns with `TPL_Campaign.md`
- Track partnerships with `TPL_Partner.md` or `TPL_Collaboration.md` (extended)
- Track content planning with `TPL_Content_Brief.md`
- Track articles and guides with `TPL_Article.md`, `TPL_Destination_Guide.md`, `TPL_Itinerary.md`
- Track places/hotels with `TPL_Place.md`
- Track SEO page audits with `TPL_SEO_Page.md`
- Track products with `TPL_Product.md`
- Track release checkpoints with `TPL_Release_Note.md`
- Web clips and design references: `TPL_Web_Clip.md`, `TPL_Design_Reference.md`

## Public brand references

- Instagram: `https://www.instagram.com/travelliniwithus/?hl=it`
- Website: `https://www.travelliniwithus.it/`

Use the local note `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md` as the normalized reference.
