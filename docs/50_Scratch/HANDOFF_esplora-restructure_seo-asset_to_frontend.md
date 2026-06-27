---
title: HANDOFF_esplora-restructure_seo-asset_to_frontend
status: consumed
created: 2026-05-24
from: travellini-seo-conversion-strategist + travellini-asset-curator
to: travellini-frontend-builder
slug: esplora-restructure
expires: 2026-06-07
---

# Handoff: implementazione della nuova Esplora

## Why this work matters

Tutte le decisioni a monte (job-to-be-done, IA, gerarchia filtri, copy/meta/schema, piano foto) sono lockate. Questo step le rende vive su localhost senza rompere typecheck, audit:ui, ne' il regime noindex preview.

## Decisions already made

- Job-to-be-done + priorita' dimensioni + innesti monetizzazione: growth.
- Sequenza blocchi + gerarchia filtri + empty-state + destino EsploraQuiz.tsx: ui-designer.
- Label filtri + h1 + meta + microcopy + schema: seo-strategist.
- Piano foto + alt + LCP image: asset-curator.
- Param URL canonical NON cambiano (back-compat bookmark).
- File alto rischio (server.ts, firestore.rules, admin.ts) NON si toccano da qui.

## Context the receiver needs

- Le risposte di growth / ui-designer / seo / asset-curator (questa catena di handoff).
- Pagina: [src/pages/Esplora.tsx]; componenti [src/components/discovery/], [src/components/Navbar.tsx].
- Tassonomia [src/config/contentTaxonomy.ts], picks [src/config/discoveryPicks.ts], query [src/utils/discoveryQuery.ts].
- Nota stato: git segna `EsploraQuiz.tsx` deleted e altri componenti discovery modificati; allineare l'implementazione alla decisione ui-designer su quiz/finder guidato (no quiz pubblico per direttiva owner 2026-05-24).

## What the receiver should produce

- /esplora ristrutturata e funzionante su localhost: nuova sequenza blocchi, gerarchia filtri, empty-state, copy/meta/schema applicati, immagini con alt + peso corretti, innesti monetizzazione posizionati.
- Mega menu navbar allineato se la direzione lo richiede.
- Eventi analytics canonical preservati o aggiornati secondo IA (explore_view, explore_filter_apply, explore_card_click, explore_search, partner_cta_click_from_explore).
- `npm run typecheck` 0 errori, `npm run audit:ui` pulito (o solo warning preesistenti).

## Out of scope (do NOT touch)

- server.ts / firestore.rules / admin.ts.
- Riscrivere copy o ridecidere IA: implementare quanto lockato; se emerge un conflitto, escalare all'orchestrator, non improvvisare.
- Forzare l'indicizzazione: rispettare noindex preview.

## Next hand-off

- Next agent: travellini-quality-auditor + browser-auditor (parallelo)
- Trigger: pagina live su localhost, typecheck + audit:ui verdi.
