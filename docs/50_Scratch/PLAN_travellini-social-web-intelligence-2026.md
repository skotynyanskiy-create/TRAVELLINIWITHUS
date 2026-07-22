---
title: PLAN_travellini-social-web-intelligence-2026
type: plan
status: done
area: marketing
created: 2026-07-21
blocked_by: none for the agreed public sample
---

# Piano — Social & Web Intelligence Travelliniwithus

## Obiettivo

Audit verificabile dell'ecosistema Travelliniwithus: profili e contenuti, posizionamento, pillar, hook/CTA, formati, identità visiva, collaborazioni pubbliche e funnel social→sito. Nessun dato viene dichiarato “completo” senza fonte, data e perimetro.

## Confini dati

- **Pubblici verificabili:** bio e metadati profilo, feed/Reel/caption visibili, pinned/highlight, conteggi visibili, disclosure e partner taggati, sito/link-in-bio, press mention e footprint pubblico.
- **Owner-only necessari:** export Insights/Meta Business Suite e TikTok Analytics, reach/view/watch time/retention, saves/shares, audience aggregata, profile/link actions, top content, GA4/UTM e performance campagne aggregate.
- **Privati non necessari:** password/token in chat, DMs, elenco follower/commentatori, PII, pagamenti, documenti fiscali, contratti integrali, indirizzi privati.

## Sequenza custom

1. Registro fonti e inventario canali: Instagram, TikTok, sito, bio hub, newsletter, Telegram, press; `@travellinifamily` resta adiacente finché l'owner non decide il rapporto.
2. Audit pubblico via browser reale e ricerca web, con claim→URL→timestamp→stato di verifica.
3. Per l'audit completo l'owner farebbe login e scaricherebbe export ufficiali. Il 2026-07-21 e stato invece concordato un audit pubblico di 30 elementi, senza dati Insights.
4. Social operator classifica intero corpus disponibile: pillar, hook, CTA, formati, geografie, organic/ADV, frequenza, pattern vincenti e anomalie.
5. UI designer + asset curator analizzano identità visuale usando solo fotografia reale; growth + SEO mappano collaborazioni, funnel social→owned, contenuti da trasformare in Tracce e proof B2B.
6. Sintesi con matrice evidenze, limiti, raccomandazioni e backlog prioritizzato; owner approva prima di aggiornare documenti definitivi.

## Strumenti

Già sufficienti: Playwright/browser autenticato manualmente, web research, documenti locali, `npm run import:instagram` e adapter Graph API, agenti data/social/growth/SEO/UI/asset. Nessun nuovo plugin necessario. Il token Graph API è opzionale per sync ripetibile, va solo in `.env`; l'import attuale copre media/caption, non Insights. Per una tantum bastano export ufficiali. TikTok non richiede integrazione API per l'audit iniziale.

## Archivio durevole proposto

- raw export/screenshot: cartella locale fuori Git o nuova cartella esplicitamente gitignored;
- commit solo aggregati e dati pubblici in `docs/13_Content/`;
- aggiornare dopo approvazione `BRAND_PUBLIC_SNAPSHOT`, `CONTENT_PILLARS`, `CONTENT_PROOF_LIBRARY`, `MARKETING_OPERATIONS_HUB` e la decisione sulla fonte metriche;
- ogni metrica conserva piattaforma, definizione, periodo, fonte, data osservazione e freshness.

## Decisioni da bloccare

1. Audit una tantum o sync permanente (raccomandato: audit/export prima, automazione dopo).
2. Perimetro canali e ruolo di `@travellinifamily`.
3. Finestra: 90 giorni operativa + 365 strategica + catalogo lifetime.
4. Dove conservare raw export sensibili; mai committarli.
5. Quali dati commerciali aggregati includere nel proof partner.

## Esito 2026-07-21

- TikTok escluso per scelta owner: il contenuto e ritenuto simile e non serve alla baseline corrente.
- Accesso eseguito con un normale account Instagram del viewer, non con l'account owner.
- Rilevati 264 URL pubblici; raccolta fermata a 30 contenuti su richiesta owner.
- Dossier: [[13_Content/INSTAGRAM_CONTENT_AUDIT_2026-07-21]].
- Dati owner-only e sync permanente rinviati: non bloccano la homepage alternativa.
