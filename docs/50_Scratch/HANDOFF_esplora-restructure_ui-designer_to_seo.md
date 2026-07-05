---
title: HANDOFF_esplora-restructure_ui-designer_to_seo
status: obsolete
created: 2026-05-24
from: travellini-ui-designer
to: travellini-seo-conversion-strategist
slug: esplora-restructure
expires: 2026-06-07
type: handoff
area: workspace
---

# Handoff: findability, copy dei filtri e discovery SEO di Esplora

## Why this work matters

La nuova IA di Esplora ha bisogno di parole giuste: etichette dei filtri che la coppia italiana capisce e cerca davvero, copy dei vuoti/collezioni, h1, meta e structured data dell'archivio. Senza, una bella IA resta non trovabile e non convertente.

## Decisions already made

- IA, sequenza blocchi, gerarchia filtri lockate da ui-designer (leggi la sua direzione).
- Job-to-be-done e priorita' dimensioni lockati da growth.
- Regime noindex su Esplora finche' <6 articoli reali: la strategia SEO qui prepara il terreno, NON forza l'indicizzazione prematura.
- Tassonomia canonical NON si tocca nei valori (`contentTaxonomy.ts`); si lavora solo su label user-facing, microcopy, meta, schema.

## Context the receiver needs

- Direzione ui-designer: leggi la sua risposta + [HANDOFF_esplora-restructure_growth_to_ui-designer.md]
- Param URL canonical + legacy: [src/utils/discoveryQuery.ts] e [docs/10_Projects/PROJECT_ESPLORA_CONSOLIDATION.md] (sezione "Parametri URL canonical")
- Pagina: [src/pages/Esplora.tsx]; schema esistente CollectionPage.
- SEO targets / keyword cluster: memoria seo_targets + [docs/MARKETING_OPERATIONS_HUB.md]

## What the receiver should produce

Inline:

1. **Label dei filtri** (zone/type/format/period/budget/durata) in italiano cercabile e chiaro, allineate ai valori canonical. Eventuali rinomine user-facing (senza cambiare gli slug URL).
2. **H1 + meta title + meta description** di /esplora coerenti col cluster "posti particolari Italia / coppia".
3. **Microcopy**: empty-state, collezioni curate, banner preview, CTA filtri. Italiano, specifico, niente verbi banditi (scopri/esplora generico), niente "magico mondo".
4. **Structured data**: cosa serve ora (CollectionPage / BreadcrumbList) e cosa attivare quando l'archivio si popola. Gestione noindex coerente con regime preview.
5. **Findability interna**: come i filtri/URL bookmarkabili si legano a SearchModal e mega menu.

## Out of scope (do NOT touch)

- Layout/visual (gia' deciso da ui-designer).
- Corpo articoli (-> editorial-writer, fuori scope qui).
- Codice (-> frontend-builder).
- Cambiare gli slug dei param URL canonical (back-compat dei bookmark).

## Next hand-off

- Next agent: travellini-frontend-builder
- Trigger: copy + meta + schema approvati; asset-curator ha consegnato il piano foto in parallelo.
