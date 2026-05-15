---
name: new-article
description: Scaffold a TRAVELLINIWITHUS editorial article AND trigger the canonical S1 sequence (growth → seo → editorial → asset → frontend → social → quality+browser). Creates the seed file, the Obsidian content note, then invokes travellini-orchestrator to plan the multi-agent work. Use when the user says "nuovo articolo", "pillar", "destinazione", "itinerario", "scriviamo una guida su X".
---

# /new-article

Single entry point for any new editorial piece. Combines scaffolding + multi-agent orchestration.

## Arguments

- **title** (Italian): e.g. "Tre giorni nel Salento ad agosto"
- **slug** (optional): URL slug — auto-generated from title if not provided
- **category**: `destinazioni` | `esperienze` | `guide` | `risorse`
- **destination** (optional): place name
- **type** (default: `pillar`): `pillar` (1500-3500 parole) | `destination-guide` | `itinerary` | `story`

## Protocol

### Phase 1 — Scaffold (file creation)

1. **Generate slug** from title if not provided (lowercase, dashed, no accents, max 5 stopword-free words).
2. **Check uniqueness** — grep `src/data/articles/` and `docs/13_Content/` for slug conflict. Stop if conflict.
3. **Create seed file** `src/data/articles/[slug].seed.ts`:

```typescript
import { Timestamp } from 'firebase/firestore';

export const articleSeed = {
  title: 'TITLE',
  slug: 'SLUG',
  excerpt: 'PLACEHOLDER — sarà scritto da seo-strategist (max 160 char)',
  content: '# TITLE\n\n[Corpo articolo: sarà scritto da editorial-writer]',
  category: 'CATEGORY',
  destination: 'DESTINATION',
  tags: [],
  author: { name: 'Rodrigo & Betta', bio: 'Viaggiatori e creatori di @travelliniwithus' },
  coverImage: '/hero-adventure.jpg', // PLACEHOLDER — sarà scelto da asset-curator
  published: false,
  featured: false,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
};
```

4. **Create Obsidian content note** `docs/13_Content/ARTICLE_[SLUG].md`:

```markdown
---
type: content
area: editorial
status: draft
category: CATEGORY
slug: SLUG
route: /articolo/SLUG
repo_path: src/data/articles/SLUG.seed.ts
article_type: TYPE
tags: [article, CATEGORY]
---

# TITLE

## Brief (compilato da travellini-growth-revenue-operator nella prossima fase)

- Why now:
- Audience:
- Business goal:
- Primary metric:

## SEO (compilato da travellini-seo-conversion-strategist)

- H1:
- Meta title:
- Meta description:
- Slug:
- Keyword cluster:
- Schema.org type:

## Body (compilato da travellini-editorial-writer)

[Outline + body verranno scritti qui]

## Assets (compilato da travellini-asset-curator)

- Hero photo:
- Section photos:
- OG card:
- Alt text:

## Quality gates

- [ ] H1 + meta + slug definiti
- [ ] Body 1500-3500 parole
- [ ] Photo plan completo + alt text Italian
- [ ] Pagina live su localhost
- [ ] /predeploy passa (quality + security + perf + browser)
- [ ] Repurpose plan in social calendar

## Repurpose (compilato da travellini-social-content-operator)

[Reel + carousel + newsletter saranno pianificati qui]
```

### Phase 2 — Orchestrate

5. **Invoke `travellini-orchestrator`** with:

   > Pianifica la sequenza canonica S1 per il nuovo articolo "<TITLE>" (slug: <SLUG>, tipo: <TYPE>, categoria: <CATEGORY>, destinazione: <DESTINATION>). Scrivi tutti gli handoff briefs in `docs/50_Scratch/HANDOFF_<SLUG>_*` e ritorna il piano. Il file content note esiste già a `docs/13_Content/ARTICLE_<SLUG>.md` e il seed a `src/data/articles/<SLUG>.seed.ts`.

6. **Receive the plan** with all handoff briefs created.

### Phase 3 — Hand off to user

Report:

- ✓ Seed file at `src/data/articles/[slug].seed.ts`
- ✓ Content note at `docs/13_Content/ARTICLE_[slug].md`
- ✓ Plan + handoffs at `docs/50_Scratch/PLAN_[slug].md` + N handoffs
- ✓ First action: invoke `travellini-growth-revenue-operator` with the handoff at `docs/50_Scratch/HANDOFF_<slug>_orchestrator_to_growth.md`

## S1 sequence (reference)

1. `growth-operator` — why-now, audience, business goal
2. `seo-strategist` — H1, slug, meta, schema.org, keyword cluster
3. `editorial-writer` — article body (1500-3500 parole, voce R&B)
4. `asset-curator` — photo plan + Italian alt text + OG card
5. `frontend-builder` — render the article page (probably no new components — uses existing article route)
6. `social-content-operator` — repurpose plan (Reel + carousel + newsletter)
7. `quality-auditor` + `browser-auditor` — gate before publish

## Hard rules

- **`published: false`** always on creation — never auto-publish
- **Italian** throughout — title, excerpt, body, alt text, meta
- **Slug uniqueness** is mandatory — never proceed with conflict
- **Cover image placeholder** stays until `asset-curator` provides the real one
- **Never write the body or meta in this skill** — that's editorial-writer + seo-strategist
- **Always invoke orchestrator** — never skip the multi-agent plan

## Conventions

- All content in Italian
- Cover image placeholder: `/hero-adventure.jpg` until asset-curator confirms final asset
- Article seed lives in `src/data/articles/` — gets seeded to Firestore via AdminDashboard later
- Route pattern: `/articolo/[slug]`

## Project context

Before applying this skill, anchor in the local operating system:

- `AGENTS.md` — root operating guide and skill routing.
- `CLAUDE.md` — Claude-specific rules, quality bar, and model routing.
- `DESIGN.md` — design tokens, palette, typography and component conventions.
- `docs/` — the Obsidian-style operational vault; treat it as source of truth.
- `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md` — brand positioning, audience, tone.
- `docs/MARKETING_OPERATIONS_HUB.md` — funnel state, KPIs, analytics contract, partner pipeline.
- `docs/AI_AGENT_STACK.md` — current skills, agents, MCP policy.

Every finding must respect Italian public copy, premium editorial tone, and the release readiness gate documented in `docs/10_Projects/PROJECT_RELEASE_READINESS.md`.
