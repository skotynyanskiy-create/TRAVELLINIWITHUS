---
type: bug
area: seo
status: in-progress
priority: p1
owner: team
severity: medium
repo: TRAVELLINIWITHUS
route: /esplora, /destinazioni, /esperienze, /guide
repo_path: scripts/generate-sitemap.js
blocked_by: contenuti preview/demo non ancora sostituiti da contenuti reali R+B
related: '[[10_Projects/PROJECT_DESTINATIONS_SECTION_REVIEW]], [[10_Projects/PROJECT_RELEASE_READINESS]]'
source: Esplora 10/10 Sprint P0
tags:
  - bug
  - seo
  - sitemap
  - noindex
---

# BUG_2026-05-15_discovery_sitemap_noindex_mismatch

## Sintomo

Le route discovery basate su contenuti preview/demo possono emettere `noindex`, ma il generatore sitemap le includeva tra le route statiche pubblicabili.

## Impatto

Rischio di segnale SEO incoerente: URL dichiarati in sitemap ma marcati `noindex` in runtime. Questo puo ridurre fiducia del crawler e sporcare la release pubblica finche l'archivio non e composto da contenuti reali R+B.

## Repo context

- route: `/esplora`, `/destinazioni`, `/esperienze`, `/guide`
- repo_path: `scripts/generate-sitemap.js`, `public/sitemap.xml`

## Riproduzione

1. Generare la sitemap con `npm run build`.
2. Verificare che le route discovery preview siano presenti in `public/sitemap.xml`.
3. Aprire le route e verificare il meta robots `noindex` quando il contenuto principale e preview/demo.

## Fix

Mitigato nello Sprint P0: le route discovery sono escluse dalla sitemap di default e vengono incluse solo con `PUBLISH_DISCOVERY_HUBS=true`, da usare quando i contenuti sono pubblicabili e coerenti con l'indicizzazione.

## Test

- `npm run build`: PASS, sitemap generata senza discovery hubs di default.
- `npm run audit:visual`: PASS.

## Root cause

Il generatore sitemap era statico e non conosceva lo stato editoriale runtime delle route preview.

## Link

- [[10_Projects/PROJECT_DESTINATIONS_SECTION_REVIEW]]
- [[10_Projects/PROJECT_RELEASE_READINESS]]
