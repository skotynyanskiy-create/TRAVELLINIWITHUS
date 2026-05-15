---
name: design-research
description: Ricerca riferimenti di design web premium per TRAVELLINIWITHUS — fetch da awwwards, siteinspire, godly.website e siti editorial travel. Estrae palette, tipografia, layout e motion. Usa quando devi proporre nuove sezioni, redesign hero, o esplorare direzioni visive innovative.
---

# Design Research — Travelliniwithus

Quando l'utente chiede ispirazione visiva, nuovi pattern UI, o vuole sapere "cosa fanno gli altri" per una sezione specifica.

## Quando attivare

- "Cerca riferimenti per la hero"
- "Voglio una nuova destinazione page, dammi 3 direzioni di design"
- "Cosa fanno i siti travel premium per X?"
- "Trova ispirazione per [sezione]"

## Pipeline

1. **Definisci il brief in 1 riga** — cosa stai cercando (es. "hero per destination page, image-led, motion sottile").
2. **Vincoli da [[design-dna]]**:
   - Premium editorial, NO SaaS, NO gradient blob
   - Sand/ink palette, serif-led
   - Calm hierarchy, motion trattenuto
3. **Fonti da consultare** (via `WebFetch` o `mcp__brave-search__brave_web_search`):
   - https://www.awwwards.com/websites/travel/
   - https://www.siteinspire.com/websites?categories=2 (travel/lifestyle)
   - https://godly.website/tags/travel
   - https://lapa.ninja/category/travel/
   - Editorial benchmarks: condenast traveller, monocle, kinfolk, gestalten
4. **Per ogni riferimento estrai**:
   - URL + screenshot reference
   - Palette (3-5 colori)
   - Tipografia (display + body)
   - Layout principio (grid, hierarchy)
   - Motion pattern (cosa anima, come)
   - Cosa è applicabile a Travelliniwithus e cosa NO (anti-pattern)
5. **Output**: 3 riferimenti shortlisted in markdown, con verdict "applicabile / con adattamenti / da scartare".

## Output template

```markdown
## Brief

[1 riga del task]

## Reference 1 — [Brand]

- URL: [link]
- Cosa rubare: [pattern specifico]
- Palette: [3-5 hex]
- Type: [display / body]
- Motion: [descrizione]
- Verdict: [applicabile / con adattamenti / da scartare]
- Cosa NON portare: [anti-pattern]

[ripeti per ref 2, 3]

## Sintesi finale

Per Travelliniwithus, la direzione consigliata e: [pattern + perche]
```

## Vincoli

- Non proporre direzioni che violano [[design-dna]] o [[brand-voice]].
- Se il riferimento e un SaaS dashboard, scartalo a priori.
- Non scaricare immagini, solo URL reference.
- Risultato finale deve essere actionable: deve includere come tradurre il pattern in `src/components/`.

## Skill correlate

- `/audit-ui` per verificare aderenza
- `travellini-ui-designer` agent per critica
- `travellini-stitch-figma-bridge` se serve creare un mockup Figma dopo

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
