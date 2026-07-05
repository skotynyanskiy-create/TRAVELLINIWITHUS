---
title: HANDOFF_site-levelup_orchestrator_to_data-analyst
status: open
created: 2026-07-05
from: travellini-orchestrator
to: travellini-data-analyst
slug: site-levelup
expires: 2026-07-19
type: handoff
area: delivery
---

# Handoff: baseline misurabile + candidati metrica primaria "level up"

## Why this work matters

Growth è il dominio più debole (4/10 nella scoreboard 2026-06-18). Prima di
qualsiasi spinta di distribution serve (1) un baseline onesto dello stato attuale
e (2) UNA metrica primaria che sia proxy di "livello" (trust + specificità +
premium-calm), non vanity reach. Questa traccia gira **in parallelo** al TIER 1
design, ma la sua ESECUZIONE (distribution) è gated dietro il baseline di fiducia.

## Decisions already made (LOCK)

- "Livello" = trust + specificità + premium-calm → la metrica primaria deve
  esserne un proxy, non reach grezzo.
- La distribution amplifica, non ripara: la sua esecuzione parte solo dopo TIER 1+2.
- Nessun numero inventato. Dove il dato non è disponibile → `[VERIFY: ...]`.

## Context the receiver needs

- GA4 wired via `analytics-mcp` (read-only) ma richiede owner ADC auth + enable API
  - restart → potrebbe NON essere disponibile: se così, dichiaralo `[VERIFY]` e
    riporta solo il misurabile.
- Stripe pre-launch (nessun revenue reale). Funnel per lo più wired-not-active
  (vedi `docs/MARKETING_OPERATIONS_HUB.md` → "Revenue surface").
- Surfaces con qualche segnale live: newsletter/lead-magnet, form media-kit.
- CWV/Lighthouse: `lighthouserc.json` in root; `npm run audit:cwv` disponibile.

## What the receiver should produce

- **Baseline attuale** (solo dati reali/misurabili): sorgenti traffico e top pages
  se GA4 accessibile; stato CWV/Lighthouse corrente sulle route pubbliche; score
  a11y corrente (`audit:a11y`); eventuale conversione sulle surface live.
- **2-3 candidati metrica primaria** per "level up", con tradeoff, tra cui l'owner
  sceglierà (es. proxy-qualità: Lighthouse+a11y+CWV; proxy-engagement:
  newsletter signup rate; proxy-B2B: lead media-kit qualificati).
- Gap di misurazione espliciti (cosa NON possiamo misurare oggi e perché).

## Out of scope (do NOT touch)

- Decidere le azioni (spetta a growth-operator).
- Progettare campagne o offer.
- Inventare numeri per riempire i buchi.

## Next hand-off

- Next agent: travellini-growth-revenue-operator (consuma il baseline per lockare
  metrica + offer).
- Trigger: baseline + candidati metrica consegnati.
