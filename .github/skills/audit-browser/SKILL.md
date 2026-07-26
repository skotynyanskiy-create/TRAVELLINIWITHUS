---
name: audit-browser
description: Full real-browser audit of the TRAVELLINIWITHUS site using Playwright MCP. Checks homepage, navigation, hero, CTAs, responsive, console errors, and key pages.
agent: browser-auditor
---

# /audit-browser

Usa il browser-auditor con Playwright MCP per auditare il sito reale.

**Scope**: $ARGUMENTS (se vuoto: audit completo homepage + nav + mobile)

## Procedura standard

1. Apri `http://localhost:3000` (dev server deve essere in esecuzione)
2. Homepage: above-the-fold, h1, hero, CTA principale, nav
3. Mobile (375px): stacking, leggibilità, CTA, overflow orizzontale
4. Pagine chiave: `/destinazioni`, `/collaborazioni`, `/media-kit`, `/contatti`
5. Errori console in ogni pagina
6. Link rotti o immagini mancanti visibili

## Output

Lista problemi per severità:

- **BLOCKER**: layout rotto, pagina inaccessibile, overflow grave
- **SERIO**: CTA non visibile, testo illeggibile mobile, immagine mancante
- **MINORE**: spaziatura incoerente, copy migliorabile

Per ogni problema: route + componente probabile + fix consigliato.

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
