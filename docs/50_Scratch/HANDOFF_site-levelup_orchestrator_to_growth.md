---
title: HANDOFF_site-levelup_orchestrator_to_growth
status: open
created: 2026-07-05
from: travellini-orchestrator
to: travellini-growth-revenue-operator
slug: site-levelup
expires: 2026-07-19
type: handoff
area: delivery
---

# Handoff: lock metrica primaria + UNA offer + priorità distribution (TIER 4 framing)

## Why this work matters

Growth è il dominio più debole (4/10). Ma la distribution amplifica, non ripara:
se spingi traffico su un sito con trust-killer attivi lo sprechi e danneggi il
brand. Quindi questa traccia LOCKA il framing strategico ora (in parallelo), ma la
sua ESECUZIONE parte solo dopo il baseline di fiducia (TIER 1+2). Serve anche a
dire a TIER 2 quali contenuti meritano priorità.

## Decisions already made (LOCK)

- "Livello" = trust + specificità + premium-calm. La metrica primaria deve esserne
  proxy, non reach grezzo.
- Distribution execution gated dietro TIER 1 (trust/a11y) + TIER 2 (contenuti reali
  nei vuoti).
- Regole di credibilità già in casa: 1 partner content : 4 editoriali; nessun
  outreach partner senza ≥1 case study/screenshot proof (vedi MARKETING_OPERATIONS_HUB).
- Nessun numero inventato (`[VERIFY]` dove manca).

## Context the receiver needs

- Consuma il baseline di travellini-data-analyst (handoff separato) per la scelta
  metrica.
- Revenue surface stato wired/attivo: `docs/MARKETING_OPERATIONS_HUB.md`. Sintesi:
  newsletter/lead-magnet e form media-kit sono le surface più vicine al live; shop
  è preorder-first gated (≥20 waitlist prima di Stripe live); affiliate 2/6 attivi.
- Activation gate owner-dipendente: `RESEND_API_KEY`/`BREVO_*`, bio IG/TikTok →
  `/vieni-con-noi?utm...`, PDF lead magnet con 10 luoghi reali.

## What the receiver should produce

1. **Raccomandazione metrica primaria** (consumando data-analyst) + target realistico.
2. **UNA offer àncora** per la finestra di level-up (scelta tra
   newsletter/lead-magnet, media-kit B2B, shop preorder) — con motivazione; non
   lanciarne tre.
3. **Lista prioritizzata** di pagine/contenuti che meritano distribution appena il
   baseline è verde (input a seo-strategist + social-operator).
4. **Lista esplicita di decisioni owner** (scelta offer, chiavi activation-gate, bio).

## Out of scope (do NOT touch)

- Scrivere la copy (seo-conversion-strategist).
- Scrivere i post social (social-content-operator).
- Eseguire campagne ADESSO (gated).
- Data-model contenuti (già chiuso altrove).

## Open questions / decisions for the user

- Quale offer àncora per questa finestra? (spetta all'owner confermare la
  raccomandazione di growth).
- Confermare quali chiavi activation-gate sono impostabili ora.

## Next hand-off

- Next agent: travellini-seo-conversion-strategist + travellini-social-content-operator
  (esecuzione), TRIGGERED solo dopo TIER 1+2 verdi.
- Trigger: metrica + offer + priorità lockate e baseline di fiducia raggiunto.
