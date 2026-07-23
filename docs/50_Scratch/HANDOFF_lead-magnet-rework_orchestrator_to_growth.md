---
title: HANDOFF_lead-magnet-rework_orchestrator_to_growth
status: consumed
created: 2026-07-23
from: travellini-orchestrator
to: travellini-growth-revenue-operator
slug: lead-magnet-rework
expires: 2026-08-06
type: handoff
area: delivery
---

# Handoff: portare il lead magnet "Italia nascosta" alla forma migliore (offerta + funnel)

## Why this work matters

La landing gratuita del primo lead magnet (guida "Alla scoperta dell'Italia
nascosta", 10 destinazioni italiane in cambio dell'iscrizione newsletter) è la
principale conversione owned del brand. L'owner vuole portarla al massimo su
ogni asse: design, copy, funnel, URL. Tu apri la catena definendo offerta,
pubblico e funnel — tutto il resto (URL, copy, visual, foto, build) discende da
qui.

## Chiarimento architetturale (leggere prima di tutto)

La richiesta iniziale nominava `src/pages/LeadMagnet.tsx` come "pagina
principale": è impreciso. La mappatura reale è:

- `/italia-nascosta` → `src/pages/VieniConNoi.tsx` = **landing di cattura** (form email). Questa è la pagina da migliorare.
- `/lead-magnet` → `src/pages/LeadMagnet.tsx` = pagina **post-iscrizione** (thank-you + download PDF), gated da `sessionStorage twu_lead_magnet_unlocked`.
- `/vieni-con-noi` e `/iscrivi` → redirect client-side (`<Navigate replace>`) a `/italia-nascosta` (in `src/App.tsx:99-100`).
- Esiste una **seconda superficie di cattura** dello stesso magnet in home: `src/components/home/HomeLeadMagnet.tsx` (usa il componente `Newsletter` inline, endpoint identico).

Entrambe le pagine sono `noindex`.

## Decisions already made (dall'orchestratore)

- La catena è: growth (tu) → seo → ui-designer → asset-curator → frontend-builder → gate (quality + browser + security).
- L'URL cambierà (l'owner non gradisce `/italia-nascosta`), ma lo slug definitivo lo propone e locka `seo-conversion-strategist` con approvazione owner — non deciderlo tu.
- Fuori scope per tutta la catena: il contenuto del PDF (i 10 luoghi), già tracciato altrove; l'attivazione delle chiavi email (`RESEND_API_KEY`/`BREVO_API_KEY`) è azione env dell'owner; nessuna modifica a `server.ts`.

## What the receiver should produce

Un brief di offerta + funnel (nella risposta, e come base per l'handoff a seo):

1. **Persona precisa** (una sola): chi scarica questa guida. Default da confermare/affinare: coppia italiana 28-45, segue R&B su IG/TikTok, cerca idee di viaggio concrete in Italia, non turismo di massa.
2. **Metrica primaria di successo**: definire (proposta: conversion rate visita→iscrizione sulla landing; secondaria: signup totali/settimana). Nessun numero inventato — se serve baseline, marca `[VERIFY: dato analytics]`.
3. **Mappa completa del funnel**, punto d'ingresso → consegna: entry points reali oggi (navbar CTA "La guida in regalo", hero home `CleanCuratedHero`, sezione `HomeLeadMagnet`, bio IG/TikTok via `BIO_LINKS` in `src/config/site.ts`) → form → `sessionStorage` unlock → `/lead-magnet` → download PDF + welcome email (Resend/Brevo). Segnala ogni punto di rottura.
4. **Decisione sulle due superfici di cattura**: consolidare home-inline vs landing dedicata, o tenerle entrambe con ruoli distinti? Motiva.
5. **Dipendenza email delivery**: dichiarare esplicitamente se la consegna PDF/welcome email è attiva o owner-blocked (per docs, `RESEND`/`BREVO` non risultano attivi in prod) — è il tallone del "best in class".
6. **Angolo di valore** dell'offerta (cosa rende la guida degna dell'email), come input copy per seo.

- Dove atterra: risposta + `docs/50_Scratch/HANDOFF_lead-magnet-rework_growth_to_seo.md` (già predisposto dall'orchestratore: aggiornalo con le tue decisioni lockate).

## Out of scope (do NOT touch)

- Scrittura dello slug/URL definitivo (è di seo).
- Copy finale della pagina, meta, H1 (è di seo).
- Direzione visiva, foto, implementazione.
- `server.ts`, `firestore.rules`, l'endpoint `/api/newsletter-subscribe`.
- Contenuto del PDF.

## Open questions / decisions for the user

- Il titolo della guida ("Alla scoperta dell'Italia nascosta") cambia insieme all'URL o resta? (Coerenza titolo↔slug.)
- Email delivery (`RESEND_API_KEY`/`BREVO_API_KEY`) attiva in prod adesso? Se no, il funnel ha una gamba di consegna non operativa.
- Consolidare o mantenere le due superfici di cattura?

## Next hand-off

- Next agent: `travellini-seo-conversion-strategist`
- Trigger: offerta + persona + metrica + funnel map lockati in `HANDOFF_lead-magnet-rework_growth_to_seo.md`.

## Notes

- Regola brand: newsletter = conversione primaria owned; Telegram resta CTA secondaria, non metterlo in competizione qui.
- `COVER_IMAGE` in `VieniConNoi.tsx` è `posti-italiani-cover-demo.webp` (asset DEMO) — segnalalo ma la sostituzione è di asset-curator.
