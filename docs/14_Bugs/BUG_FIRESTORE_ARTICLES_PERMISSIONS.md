---
title: BUG — FirebaseError "Missing or insufficient permissions" su articoli reali Firestore
status: done
priority: P0
type: bug
owner: skotxx
related-projects:
  - [[PROJECT_FULL_SITE_MARKETING_TECH_AUDIT]]
  - [[PROJECT_RELEASE_READINESS]]
created: 2026-05-14
fixed: 2026-05-15
discovered-via: browser-auditor Playwright audit 2026-05-14
resolution: |
  Fix applicato in src/services/firebaseService.ts fetchArticleBySlug fallback:
  il deny atteso per articoli con published != true viene ora trattato come
  silent "not found" (no console error). Errori non-permesso continuano a essere
  loggati in DEV per debug. Le rules restano correctly restrictive senza weakening.
area: engineering
---

# BUG — FirebaseError permissions su articoli reali

## Sintomo

Navigando a `http://localhost:3000/articolo/<slug-non-mock>` (es. `dolomiti-rifugi-coppia`), la console mostra:

```
Failed to load resource: 404 Not Found @ /articolo/dolomiti-rifugi-coppia
Error fetching article by slug fallback for "dolomiti-rifugi-coppia": FirebaseError: Missing or insufficient permissions.
Error fetching article by slug fallback for "dolomiti-rifugi-coppia": FirebaseError: Missing or insufficient permissions.
```

La pagina mostra fallback 404 ("Pagina non trovata"). Doppia chiamata Firebase fallisce.

## Impatto

**P0 content discovery + funnel editoriale.**

- Qualsiasi articolo Firestore che non sia preview/mock e' irraggiungibile.
- Il funnel editoriale (Home → discovery → articolo → newsletter / related / share) e' rotto per i contenuti reali.
- Se non risolto prima del deploy, qualsiasi articolo pubblicato su Firestore in prod sara' bloccato per visitatori anonimi.
- Effetto secondario: link interni da `/destinazioni`, `/itinerari`, `/correlati`, search modal — tutti puntano a articolo Firestore e cadono in 404.

## Riproduzione

1. `npm run dev`
2. Apri `http://localhost:3000/articolo/dolomiti-rifugi-coppia` (o qualsiasi slug non-mock)
3. Apri DevTools → Console → osserva 2 errori `FirebaseError: Missing or insufficient permissions`
4. Pagina renderizza la 404 ("Pagina non trovata")
5. Confronta con `http://localhost:3000/articolo/guida-bali` (mock preview) — carica perche e' in `src/config/previewContent.ts`, non da Firestore.

## Probabile causa

Tre ipotesi (ordinate per probabilita):

1. **Firestore rules troppo restrittive:** `firestore.rules` accetta `allow read if resource.data.published == true` ma se la collezione `articles` ha record SENZA `published` field, il check fallisce per resource undefined.
2. **Auth state non risolto al primo fetch:** `fetchArticleBySlug` viene chiamato prima che onAuthStateChanged abbia emesso `null` (utente anonimo). La rule che presuppone `request.auth` non e' soddisfatta. Doppia chiamata = retry pattern che fallisce comunque.
3. **Collezione `articles` vuota in dev senza credentials Firestore admin:** dev mode non ha permessi per leggere produzione, e localemulator non e' configurato. Da verificare se `firebase emulators:start` cambia comportamento.

## Soluzione consigliata

**Step 1 — diagnosi rules**

Leggere [firestore.rules](../../firestore.rules) e verificare:

```
match /articles/{articleId} {
  allow read: if resource.data.published == true;
  // ^ se manca il fallback per resource.data == null, qualsiasi doc legacy senza field fallisce
}
```

Aggiungere fallback esplicito:

```
match /articles/{articleId} {
  allow read: if resource == null || resource.data.published == true;
}
```

**Step 2 — diagnosi auth**

In `src/services/firebaseService.ts` (riga ~131 secondo audit), verificare che il fetch articoli NON dipenda da `request.auth.uid` nel match. Articoli pubblicati devono essere leggibili da utenti anonimi.

**Step 3 — verifica con emulator**

```
npm install -g firebase-tools
firebase emulators:start --only firestore,auth
# In .env.local: VITE_USE_FIREBASE_EMULATOR=true
# Aggiungere connectFirestoreEmulator in src/services/firebaseInit.ts
```

Caricare un articolo mock con `published: true` e verificare lettura anonima.

**Step 4 — fix retry pattern**

La doppia chiamata che vede l'audit (`Error fetching article by slug fallback` x2) suggerisce che `fetchArticleBySlug` tenta retry quando fallisce. Verificare che il retry non amplifica permissions errors. Logging strutturato con `console.error('articleFetch.firestore.permissionDenied', { slug })` aiuta diagnostica.

## Verifica fix

1. Pubblicare almeno 1 articolo Firestore con `published: true` (via admin editor `/admin/editor`).
2. Logout (per garantire stato anonimo).
3. Aprire `/articolo/<slug>` — body articolo deve renderizzare senza console errors.
4. `npm run audit:firebase` PASS.
5. `npm run audit:visual` PASS.

## File coinvolti

- [firestore.rules](../../firestore.rules) — verificare rule `articles/{id}` per match e read condition
- [src/services/firebaseService.ts](../../src/services/firebaseService.ts) riga ~131 (fetchArticleBySlug + fallback retry)
- [src/services/firebaseInit.ts](../../src/services/firebaseInit.ts) — verificare connessione emulator opzionale
- [.env.example](../../.env.example) — documentare `VITE_USE_FIREBASE_EMULATOR`
- [src/pages/Articolo.tsx](../../src/pages/Articolo.tsx) — gestione errore visiva (oggi cade in 404 silenzioso)

**ATTENZIONE — file high-risk:** [firestore.rules](../../firestore.rules) richiede review owner prima di modifica. Vedi CLAUDE.md.

## Decisioni aperte

- [ ] Owner: confermo modifica rules `articles` con fallback per resource null.
- [ ] Owner: vogliamo Firestore emulator in dev workflow?
- [ ] R+B: 1 articolo reale (Salento pillar) entro 5 giorni per validare fix end-to-end.

## Riferimenti

- Browser audit transcript — task `a46e638c829a438e1`
- [docs/10_Projects/PROJECT_FULL_SITE_MARKETING_TECH_AUDIT.md](../10_Projects/PROJECT_FULL_SITE_MARKETING_TECH_AUDIT.md) sezione 5 #2
- [docs/10_Projects/PROJECT_RELEASE_READINESS.md](../10_Projects/PROJECT_RELEASE_READINESS.md) — gate finale
