---
type: runbook
area: content
status: active
tags:
  - instagram
  - content
  - import
  - runbook
---

# Instagram Import Runbook

Percorso per portare i 1.268 post reali di @travelliniwithus dentro il sito.
La pipeline codice esiste già ed è testata: manca solo il token.

## Stato pipeline (verificato 2026-07-15)

- Script: `scripts/import-instagram.ts` (`npm run import:instagram`)
- API: Instagram API with Instagram Login — `graph.instagram.com/me/media`
  (percorso corretto post-deprecazione Basic Display)
- Adapter: `src/services/instagramContentAdapter.ts` (enrichment caption
  testato in `src/services/instagramCaptionEnrichment.test.ts`)
- Output: `src/data/instagram-import.json` — file di REVIEW, non tocca
  `content-seed.json`; la curatela dei ~40 posti resta intatta
- Env: `IG_GRAPH_TOKEN` in `.env` (documentata in `.env.example`,
  shape-check in `scripts/check-env-safety.mjs`)

## Requisiti account (già soddisfatti)

- Account IG Professional (Creator o Business): @travelliniwithus è
  Meta-verified e professionale — OK
- Account pubblico — OK

## Come ottenere il token — percorso consigliato (app in Development)

Con l'app Meta in **Development mode** e l'account aggiunto come
**Instagram Tester** non serve App Review: per un import interno a uso
singolo account è il percorso più veloce e legittimo.

1. [developers.facebook.com](https://developers.facebook.com) → My Apps →
   Create App → use case "Other" → tipo **Business**.
2. Nella dashboard dell'app: Add product → **Instagram** → "API setup with
   Instagram Login" (Business Login).
3. App Roles → Instagram Testers → invita `@travelliniwithus`.
4. **Compito di Rodrigo (5 minuti, una volta sola):** accettare l'invito
   tester (Instagram → Impostazioni → Sito web e app → Inviti tester) e poi
   fare il Business Login sull'URL di autorizzazione che gli passi tu.
5. Scambio server-side del code → short-lived token → long-lived token
   (60 giorni). Il generator nella dashboard Meta ("Generate token" accanto
   all'account tester) produce direttamente il long-lived: è la via rapida.
6. Incolla il token in `.env` → `IG_GRAPH_TOKEN=IG...` (mai `VITE_`,
   mai committato).
7. `npm run import:instagram` → review di `src/data/instagram-import.json`
   → promozione manuale dei campi curati (zone/types/luogo) in
   `content-seed.json`.

## Alternativa (accesso stabile di agenzia)

Farsi aggiungere come **partner su Meta Business Suite** dell'account:
più attrito per Rodrigo, ma dà anche Insights e non dipende da inviti
tester. Da preferire se la collaborazione si allarga (ads, pixel, metriche).

## Manutenzione

- Il long-lived token dura **60 giorni**; refresh con
  `GET graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token`
  (token ancora valido e più vecchio di 24h). Mettere un promemoria a ~50
  giorni dall'emissione.
- Se il token scade, l'import fallisce con `Instagram API 190`: rigenerare
  dal generator della dashboard.

## Dati pubblici verificati (og-meta profilo, 2026-07-15)

- 172K follower · 306 seguiti · **1.268 post**
- Bio: "VIAGGIA CON NOI — POSTI PARTICOLARI IN TUTTO IL MONDO — ADV DM O
  EMAIL — IN ELENCO AGCOM — SCONTI/ATTIVITÀ/ASSICURAZIONE IN BIO"
- Il link-in-bio promuove già sconti/attività/assicurazione → le categorie
  affiliate del sito (assicurazione, attività, eSIM) sono coerenti con ciò
  che l'audience già si aspetta.
- Footprint web fuori da Instagram quasi nullo (TikTok murato ai non
  loggati, nessuna presenza indicizzata rilevante): il sito è di fatto
  l'unica casa owned — rafforza la strategia import → archivio → SEO.
