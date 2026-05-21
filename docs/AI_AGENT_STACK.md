---
type: guide
area: workspace
status: active
tags:
  - ai
  - agents
  - skills
  - workflow
---

# AI Agent Stack

## Purpose

Keep every AI assistant aligned on the same local operating system for TRAVELLINIWITHUS: brand memory, design rules, quality gates, documentation updates, and release readiness.

## Local Policy

- Canonical project skills live in `.agents/skills`.
- Synced copies live in `.claude/skills`, `.github/skills`, `.cursor/skills`, and `.gemini/skills`.
- Codex uses the repo `AGENTS.md` plus the canonical `.agents/skills` skill source exposed in this workspace; its local runtime MCP parity is configured in `~/.codex/config.toml`.
- Claude project agents live in `.claude/agents`.
- External skills are reference material only until reviewed and adapted locally.
- `DESIGN.md` is the design-system prompt source for Stitch, Figma, agents, and code reviews.

## Commands

```bash
npm run sync:agents
npm run audit:agents
npm run audit:visual
npm run audit:quality
```

Use `npm run sync:agents` after editing `.agents/skills`. Use `npm run audit:agents` before committing agent, skill, or workflow changes.

## Current Integrations

- Codex plugin: GitHub is enabled in the local Codex config for repository, issue, pull request and CI workflows.
- Codex MCP: `~/.codex/config.toml` is aligned with `.mcp.json` for Playwright, Obsidian, Context7, Chrome DevTools, Sentry, GitHub, Firebase and Stripe.
- Claude Code project MCP: `.mcp.json` enables Playwright, Obsidian, Context7, Chrome DevTools, Sentry, GitHub, Firebase and Stripe.
- Claude Code project hooks: `.claude/settings.json` uses PowerShell-based safety hooks for this Windows workspace.
- Obsidian memory: the repository root is the active Obsidian vault for Local REST API / MCP automation; `docs/` is the operational memory and note storage. Do not duplicate stable project facts into a separate AI memory unless they are cross-project user preferences.

## Curated External References

These sources informed the local stack and should be reviewed before importing future material:

- Vercel Agent Skills: `https://github.com/vercel-labs/agent-skills`
- Addy Osmani Web Quality Skills: `https://github.com/addyosmani/web-quality-skills`
- Google Labs Stitch Skills: `https://github.com/google-labs-code/stitch-skills`
- Google Labs Stitch Loop: `https://github.com/google-labs-code/stitch-loop`
- Figma Skills directory: `https://officialskills.sh/figma/skills`
- VoltAgent Claude Subagents: `https://github.com/VoltAgent/awesome-claude-code-subagents`
- Agency Agents: `https://github.com/msitarzewski/agency-agents` reviewed at `783f6a72bfd7f3135700ac273c619d92821b419a`; only locally adapted slices should be imported.

Do not install a whole upstream catalog into this repo. Copy, reduce, attribute, and adapt only the pieces that match the brand and workflow.

## CLI Tooling (2026-05-14)

Catalogo CLI integrate o documentate per il progetto, valutate il 2026-05-14. Vedi [docs/10_Projects/PROJECT_CLI_TOOLING_INTEGRATION.md](10_Projects/PROJECT_CLI_TOOLING_INTEGRATION.md) per la matrice completa, gli script package.json aggiunti e le decisioni aperte.

Riepilogo:

| Status          | CLI                      | Script npm                 | Quando                                            |
| --------------- | ------------------------ | -------------------------- | ------------------------------------------------- |
| installato      | `firebase-tools` 15.17   | `npm run emulators`        | Firestore/Auth locali per dev + bug investigation |
| installato      | `gh` 2.89                | (non in scripts)           | PR / issue / API operations                       |
| installato      | `docker` 29.3            | (non in scripts)           | container locale (non obbligatorio)               |
| opt-in (npx)    | `@lhci/cli`              | `npm run audit:cwv`        | Core Web Vitals + budget pre-deploy               |
| opt-in (npx)    | `unlighthouse`           | `npm run audit:bulk`       | Lighthouse bulk su tutte le pagine                |
| opt-in (npx)    | `@axe-core/cli`          | `npm run audit:a11y`       | WCAG 2.2 AA automated                             |
| opt-in (system) | `gitleaks`               | `npm run audit:secrets`    | Secret scanning pre-commit + scheduled            |
| opt-in (npx)    | `size-limit`             | `npm run audit:size`       | Bundle budget enforcement                         |
| opt-in (npx)    | `vite-bundle-visualizer` | `npm run audit:bundle:viz` | Exploration bundle                                |
| opt-in (npx)    | `knip`                   | `npm run audit:deps`       | Unused deps + exports                             |
| opt-in (npx)    | `markdownlint-cli2`      | `npm run lint:md`          | Lint docs/ markdown                               |
| opt-in (system) | `stripe` CLI             | `npm run webhook:listen`   | Webhook live + replay events                      |
| opt-in (npx)    | `@sentry/cli`            | `npm run release:sentry`   | Source maps + release tracking                    |

Tutti gli script sono **opt-in** — NON inclusi in `audit:quality` per non rompere CI esistente. Vengono lanciati on-demand. Le CLI con `(npx)` non richiedono install esplicito (npx scarica al volo). Le CLI con `(system)` richiedono install OS-level documentato nel doc dedicato.

## MCP Policy

Keep MCP servers minimal. Every added server must have a concrete use case, a trusted source, auth handled through environment variables, and documentation in this file or a linked project note.

Current shared MCP set:

- `playwright`: browser QA, visual review, responsive checks and smoke tests.
- `obsidian`: optional vault automation against the local Obsidian REST API. Normal Travellini work should still read and edit `docs/` directly.
- `context7`: official/library documentation lookup when implementation details may have changed.
- `chrome-devtools`: Core Web Vitals, performance traces and real-browser diagnostics.
- `sentry`: production error investigation when `SENTRY_ACCESS_TOKEN` is available.
- `github`: pull requests, issues, review comments, CI and repository operations. Prefer the existing Codex GitHub plugin where available.
- `firebase`: Firebase/Firestore inspection and debugging with task-scoped auth.
- `stripe`: Stripe docs, checkout, webhook and sandbox work with `STRIPE_SECRET_KEY`.

Approved candidates when the task requires them:

- Figma MCP: design-to-code context from real Figma files. Enable only when there is a concrete Figma file or Dev Mode workflow.

Do not add broad MCP registries, random community servers or full external agent catalogs as default project tools.

## Local Skills

### Strategic & operator skills

- `travellini-stitch-figma-bridge`: controlled Stitch/Figma usage and design-to-code handoff.

> Retired 2026-05-21: the legacy `travellini-design-director`, `travellini-web-quality-auditor`, `travellini-page-builder`, `travellini-release-quality`, `travellini-social-content-operator`, and `travellini-growth-revenue-operator` wrapper skills were removed. Their scope is owned by the specialist agents (see "Claude Project Agents") plus narrow operational skills (`new-page`, `predeploy`, `audit-ui`, etc.).

### Operational skills (canonicalized 2026-05-14)

These short, action-scoped skills were originally Claude-local. They have been promoted to `.agents/skills` so Codex, Cursor and Gemini share the same operating manual. They are intentionally narrow: each one wraps a single task with concrete checks or scaffolding.

- `audit-ui`: CSS vars, inline styles, Tailwind patterns, responsive, a11y, icons, layout wrappers.
- `audit-browser`: real-browser UX audit via Playwright MCP (responsive, console, forms, regressions).
- `cwv`: Core Web Vitals capture (LCP, CLS, INP, TBT) via Chrome DevTools MCP.
- `a11y-check`: WCAG 2.2 AA pass via Playwright accessibility tree (contrast, alt, focus, aria, keyboard).
- `responsive-check`: viewport sweep 320/375/768/1024/1440 with overflow and CTA visibility checks.
- `smoke-test`: post-change browser smoke test (home loads, nav works, CTA visible, no console errors).
- `seo-check`: meta tags, OG/Twitter, structured data, alt text, sitemap, robots, headings, CWV basics.
- `firebase-check`: Firestore filters, indexes, error handling, client safety, security rules signals.
- `stripe-flow`: cart, server-side price integrity, webhook signing, env vars, sandbox flows.
- `predeploy`: full pre-deploy validation suite (typecheck/lint/test/build/audit:\* aggregator).
- `deploy`: deploy procedure with preflight, Firebase Hosting, release docs (no auto-execution).
- `copywriting-italian`: hero, sections, CTA, meta description, articles in Rodrigo & Betta voice.
- `new-article`: scaffold editorial article + Obsidian content note with Italian metadata.
- `new-page`: scaffold a new React page (PageLayout, SEO, Section, route wiring, sitemap).
- `social-card`: 1200x630 OG / Instagram preview cards per page or article.
- `design-research`: fetch and digest references from awwwards, siteinspire, godly.website, editorial travel sites.
- `animate`: apply motion patterns (GSAP, motion, lenis, TiltCard, MagneticWrapper, AnimatedCounter).

### Claude-only support skills (not canonicalized)

These remain in `.claude/skills` because they encode Claude Code workflow ergonomics (TodoWrite, plan mode, conversational triage) rather than tool-agnostic procedures:

- `bug-triage`, `small-fix`, `deep-refactor`, `quick-review`, `commit`, `explain-module`.

Promoting them would require translating their conversational steps into tool-neutral instructions; until then, they stay scoped to Claude Code.

### Editorial leverage skills (added 2026-05-17, Claude-local)

Aggiunte dopo audit confronto vs catalogo skills esterno @avatarist.ai. Reimplementate Travellini-style anziché importate, per evitare conflitti con routing CLAUDE.md, anti-brand patterns e rischi prompt injection da skill di terzi. Tutte vivono in `.claude/skills/` e attendono promozione a `.agents/skills` dopo prima validazione operativa.

- `anti-ai-slop`: rifinitura italiano long-form post-editorial-writer per togliere pattern AI (ritmo monotono, cliché, transizioni "inoltre/tuttavia", superlativi vuoti, generalita). Preserva fatti; segnala `[VERIFY]` per dati incerti.
- `hook`: generatore 5 hook scroll-stopper italiani su 7 framework testati (curiosity gap onesto, specificita numerica, contrarian autentico, scena, stake personale, contraddizione, domanda specifica). Per Reel/TikTok opener, lead pillar, hero subtitle, oggetto newsletter, headline lead magnet. Mai clickbait.
- `repurpose`: trasforma pillar article in pacchetto multi-canale (carosello IG 8 slide + Reel 30s + quiz 5 domande + bullet newsletter + OG brief). Orchestra `social-content-operator` + `seo-strategist` + `asset-curator`. Scrive `docs/13_Content/REPURPOSE_*.md` + handoff brief.
- `ai-seo`: audit Generative Engine Optimization su 7 assi (entity clarity, claim citabili, structured authorship, llms.txt, snippet density, headline onesti, freshness signals). Complementa `/seo-check` (SERP classica) con AI search (Perplexity, ChatGPT search, Google AI Overviews, Claude).
- `verify-facts`: fact-check sistematico pre-pubblicazione. Estrae ogni claim verificabile (prezzi, orari, distanze, indirizzi, eventi, codici) e classifica `verified` / `dated` / `stale` / `unverified` / `risk` / `missing-attr`. Aggiorna `fact_check_status` nel frontmatter dell'articolo. Blocca pubblicazione se >30% claim problematici.

Sequenza canonica suggerita per nuovo pillar article:

```
/new-article → editorial-writer → /anti-ai-slop → /verify-facts → /ai-seo → /seo-check → quality-auditor → publish → /repurpose
```

Sequenza canonica per Reel/IG opener nuovo:

```
/hook (genera 5 varianti) → social-content-operator (finalizza caption + scheduling) → /social-card (OG opzionale)
```

## Claude Project Agents

- `travellini-ui-designer`: read-only design critique.
- `travellini-frontend-builder`: implementation agent for React/Tailwind work.
- `travellini-quality-auditor`: read-only quality and release review.
- `travellini-seo-conversion-strategist`: SEO, content architecture, conversion and marketing alignment.
- `travellini-social-content-operator`: social calendars, Reels/TikTok concepts, campaign briefs, creator partnerships, newsletters, and content-to-conversion planning.
- `travellini-growth-revenue-operator`: growth strategy, partner pipeline, media kit conversion, affiliate/shop planning, campaign prioritization, offer design, and analytics events.

## Operating Rules

- Every agent must treat `docs/` as operational truth.
- UI, positioning, collaboration, homepage, navbar, release, bug, campaign, partner, and content changes must update the relevant note.
- Stitch/Figma outputs must pass through repo adaptation and QA before becoming code.
- `npm run predeploy` excludes visual QA by design; use `npm run audit:quality` for the full pass.
