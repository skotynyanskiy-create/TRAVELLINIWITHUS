---
title: HANDOFF_site-levelup_orchestrator_to_uidesigner
status: open
created: 2026-07-05
from: travellini-orchestrator
to: travellini-ui-designer
slug: site-levelup
expires: 2026-07-19
type: handoff
area: delivery
---

# Handoff: lock the TIER 1 trust + a11y remediation spec (from today's 8-agent audit)

## Why this work matters

"Salire di livello" per questo sito = trust + specificità + esperienza premium
calma, NON feature count. Il pavimento del livello sono i trust-killer attivi:
finché sono live, nessun altro lavoro (Atlante home, distribution) fa salire il
percepito. Questi fix sono i più economici, content-independent e con il ROI di
fiducia più alto per ora spesa. Sono la prima cosa da chiudere.

## Decisions already made (LOCK — do not relitigate)

- Il DNA è intoccabile: Fraunces + sand `#faf8f4` + terracotta `#c2410c` + foto
  reali + lucide. Questo è REMEDIATION di difetti, NON un redesign.
- "Livello" = trust + specificità + premium-calm. La priorità è per ROI-di-fiducia,
  non per ordine di pagina.
- USA il piano pagina-per-pagina già prodotto dall'audit 8-agenti di stamattina
  (2026-07-05: AI-slop 1.9/4, Nielsen 27/40, 50+ finding). NON rifare l'audit.
- Solo foto reali. Nessuna AI imagery.

## Context the receiver needs

I peggiori finding dell'audit di oggi, da tradurre in spec implementabile:

- Eyebrow-monotony su ×6 superfici (device di ingresso sezione ripetuto).
- Contrasti a11y sotto 4.5:1 (multipli).
- Navbar 9px (illeggibile).
- Shop con fake-bestseller badge → **trust killer** (rimozione, non redesign).
- Pagina Destinazioni con ZERO immagini reali → qui a te spetta solo lo
  **spec di layout/placeholder** delle superfici immagine; la selezione foto reale
  è TIER 2 (asset-curator, brief separato).

Sorgenti: piano pagina-per-pagina dell'audit odierno; `DESIGN.md`;
`docs/10_Projects/PROJECT_GRAPHIC_COMPETITIVE_AUDIT_2026-06-04.md`.

## What the receiver should produce

Una **spec di remediation LOCKED**, prioritizzata, che frontend-builder possa
implementare senza ri-decidere nulla:

- **P0 trust-killer** (chiudere per primi): rimozione fake-bestseller badge dallo
  Shop; navbar a dimensione leggibile (valore esatto); tutti i contrasti user-visible
  portati a ≥4.5:1 (coppie token esatte "da → a").
- **P1 polish premium-calm**: variazione dei device di ingresso sezione per rompere
  l'eyebrow-monotony (elenca i device alternativi ammessi, per superficie); eventuali
  correzioni di gerarchia citate dall'audit.
- Per ogni item: file/componente target, token CSS var esatti, decisione esplicita.
- Scrivi l'handoff `HANDOFF_site-levelup_uidesigner_to_frontend.md` verso
  travellini-frontend-builder.

## Out of scope (do NOT touch)

- Selezione/crop delle foto reali per Destinazioni/Esplora (TIER 2 → asset-curator).
- Riscritture di copy italiano (seo-conversion-strategist).
- La nuova home Atlante (traccia separata TIER 3, gated su decisione owner).
- `server.ts`, `firestore.rules`, `src/config/admin.ts`.
- Qualsiasi cosa che alteri il DNA (palette, serif, foto reali, icone lucide).

## Open questions / decisions for the user

- Nessuna che blocchi questo step: la remediation è lockabile ora. (Le decisioni
  owner aperte riguardano TIER 3/4, non questo.)

## Next hand-off

- Next agent: travellini-frontend-builder (implementa) → poi browser-auditor +
  travellini-quality-auditor (gate: audit:a11y 0 violazioni, audit:ui, grep
  "nessun fake-bestseller residuo").
- Trigger: spec LOCKED scritta e handoff a frontend-builder pronto.
