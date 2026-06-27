---
title: Runbook — Instagram Graph API (importare i 1.251 post)
type: runbook
status: owner-action-required
created: 2026-06-22
owner: Rodrigo & Betta
related:
  - src/services/instagramContentAdapter.ts
  - docs/50_Scratch/INSTAGRAM_CONTENT_SEED_2026-06-18.md
---

# Runbook — Instagram Graph API

Obiettivo: portare in automatico tutta la libreria `@travelliniwithus` (1.251
post) dentro al sito come `ContentItem`, senza trascrizione manuale.

Prerequisito già soddisfatto: account **Business/Creator** collegato a una
**Pagina Facebook**. Bene — è la condizione che abilita la Graph API (la vecchia
Instagram Basic Display API è stata dismessa, si usa la Instagram Graph API via
Pagina FB).

## Aggiornamento 2026-06-24 — percorso più semplice (consigliato)

Verificato su doc Meta correnti: per importare i PROPRI media non serve più il
giro con la Pagina FB. Si usa **"Instagram API with Instagram Login"**:

- Endpoint: `GET https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token={token}` (paginato).
- Token: long-lived (60 giorni), rinfrescabile con
  `GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token={token}`.
- `thumbnail_url` arriva solo per VIDEO/reel; per le foto è `media_url`.

**Codice già pronto:** `scripts/import-instagram.ts` (comando `npm run import:instagram`)
legge `IG_GRAPH_TOKEN` da `.env`, scarica tutti i media, li mappa+arricchisce
(`enrichInstagramFeed`) e scrive `src/data/instagram-import.json` (file di review,
non tocca `content-seed.json`). Appena hai il token, l'import è un comando solo.

## Passi (owner — una tantum)

1. **App Meta**: https://developers.facebook.com → _Crea app_ → tipo **Business**.
2. **Collega gli asset**: nell'app, aggiungi il prodotto _Instagram Graph API_ e
   collega la **Pagina FB** associata a `@travelliniwithus`.
3. **Permessi token**: genera un _User access token_ con almeno
   `instagram_basic`, `pages_show_list`, `business_management`
   (aggiungi `instagram_manage_insights` se vuoi anche le metriche per post).
4. **Trova l'IG User ID**: chiama
   `GET /{page-id}?fields=instagram_business_account` → restituisce l'ID
   dell'account IG business.
5. **Token long-lived**: scambia il token breve con uno a 60 giorni
   (`GET /oauth/access_token?grant_type=fb_exchange_token&...`). Va poi
   rinfrescato periodicamente (job lato server).
6. **Consegna a me** (in modo sicuro, NON in chat/Git): l'**IG User ID** e il
   **token long-lived**. Li metto in env server (`IG_GRAPH_TOKEN`,
   `IG_USER_ID`), mai nel repo o nel client.

## Cosa costruisco io dopo (Track 1)

- Adapter reale in `src/services/instagramContentAdapter.ts`:
  `GET /{ig-user-id}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp`
  con paginazione → mappa su `ContentItem` (campi raw).
- Step di **enrichment**: parsing caption → hook, prezzo, partner, disclosure
  ADV (kind), tassonomia zone/types (admin o euristiche).
- Persistenza: i media in Firestore (collezione content), refresh token
  schedulato. `content-seed.json` resta come fallback/bootstrap.

## Vincoli di sicurezza (non negoziabili)

- Il token è un **secret**: solo env server, mai `VITE_*`, mai client, mai Git.
- L'integrazione tocca `server.ts` → è lavoro di `travellini-backend-engineer`
  con conferma owner, non del frontend.
- Le `media_url` di IG scadono: per le cover conviene ricopiarle/ottimizzarle
  localmente (pipeline immagini esistente) invece di hot-linkare.

## Nota di accuratezza

Endpoint e nomi-permesso della Graph API cambiano spesso: prima di scrivere
l'adapter verifico i dettagli correnti sulla doc Meta ufficiale.
