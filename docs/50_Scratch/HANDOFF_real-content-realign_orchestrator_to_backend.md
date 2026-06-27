---
title: HANDOFF_real-content-realign_orchestrator_to_backend
status: open
created: 2026-06-22
from: travellini-orchestrator
to: travellini-backend-engineer
slug: real-content-realign
expires: 2026-07-20
---

# Handoff: integrazione Instagram Graph API → adapter ContentItem (HIGH-RISK, conferma owner)

## Why this work matters

A regime la libreria contenuti del sito si popola dai 1.251 post reali via
Instagram Graph API (account proprio), non a mano. Questo è il binario lungo,
parallelo al seed manuale: il seed dei 70 reel sblocca il sito subito; l'API
porta scala e freschezza dopo.

## Decisions already made (LOCK)

- Sorgente a regime: Instagram Graph API (account proprio). Seed iniziale resta
  manuale (70 reel) e NON dipende da questo step.
- Il modello `ContentItem` (definito da growth, implementato da frontend) è il
  target: l'adapter API riempie i campi raw (permalink/cover/caption/
  publishedAt/mediaType), l'enrichment riempie i campi curati. Non cambiare il
  contratto ContentItem qui — consumalo.
- Questo lavoro tocca file HIGH-RISK (`server.ts` e probabilmente nuovi secret/
  env): richiede CONFERMA OWNER prima di editare, come da CLAUDE.md.

## Context the receiver needs

- Schema target: blocco "Schema dati proposto — ContentItem" in
  [docs/50_Scratch/INSTAGRAM_CONTENT_SEED_2026-06-18.md] (mappa già fatta:
  media.permalink → permalink, media.media_type → mediaType, ecc.).
- Nota API: stesso doc, "Nota tecnica" — l'API fornisce media+permalink+caption+
  thumbnail; risolve anche le cover oscurate.
- Server attuale: [server.ts]. Env example: [.env.example].
- Per API IG/Graph (versioni, scope token, long-lived token, rate limit):
  interrogare context7 prima di affidarsi alla memoria.

## What the receiver should produce

1. **Adapter IG Graph API → ContentItem** (campi raw) lato server, con storage
   del token long-lived e refresh, rate-limit/retry, gestione errori reali.
2. **Endpoint/ingestion** che popola la libreria (Firestore o store scelto) e
   un passo di **enrichment** (caption parsing per hook/prezzo/partner/ADV; il
   parser deve normalizzare gli artefatti tipo "sc@nti"/"bi@").
3. **Secret handling**: nuovi token/credential SOLO in env ignorati da git;
   nessun secret in output o commit. Coordinare con security-auditor.
4. Documentare scope token, setup, e i limiti (cosa l'API NON restituisce).

VINCOLO: ottieni conferma owner prima di toccare `server.ts`. Non bloccare il
seed manuale: questo step può atterrare dopo il primo go-live del riallineamento.

## Out of scope (do NOT touch)

- UI/griglia/card (frontend-builder).
- Definizione del contratto ContentItem (growth/frontend, già fatto).
- Copy/voce (editorial/seo).

## Open questions / decisions for the user

- Conferma owner per editare `server.ts`.
- Storage libreria: Firestore (coerente con lo stack) vs altro.
- L'account IG è un account Business/Creator collegato a una Pagina FB? (requisito
  Graph API) — VERIFY con owner.

## Next hand-off

- Next agent: travellini-security-auditor (audit secret/token) → poi
  frontend-builder consuma i dati reali al posto del seed statico.
- Trigger: adapter + ingestion funzionanti in locale, owner ha confermato.
