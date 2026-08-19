---
# Era l'unica area senza copertura path-scoped, ed e' quella dove un errore
# costa di piu': misurato il 2026-08-14, nessuno dei tre glob preesistenti
# prendeva `src/server/apiRoutes.ts`, `functions/src/index.ts`, `server.ts`,
# `firestore.rules`, `firebase.json` o `src/config/admin.ts`.
paths:
  - 'src/server'
  - 'functions'
  - 'server.ts'
  - 'firebase.json'
  - '.firebaserc'
  - 'firestore.rules'
  - 'firestore.indexes.json'
  - 'src/config/admin.ts'
---

# Backend e produzione

Hai aperto un file che serve la produzione. **La tabella dei file ad alto rischio
resta in `CLAUDE.md`**, perché serve per decidere _se_ aprire — cioè un passo
prima di qui. Questa regola porta il dettaglio.

## Dove gira davvero il codice

- **Firebase Hosting serve `dist/` come file statici.** Solo `/api/**` viene
  riscritto verso la Cloud Function. **`server.ts` non viene mai eseguito in
  produzione**: è il server di sviluppo (`npm run dev`) e del self-host
  (`npm start`). Non contiene SSR.
- Le meta pubbliche vengono da `scripts/generate-route-html.js` al build: 134
  HTML per rotta, ciascuno con i suoi OG. Una rotta nuova che manca dalle card
  social va aggiunta lì, **non** in `server.ts`.
- `src/server/apiRoutes.ts` è importato **sia** da `server.ts` **sia** da
  `functions/src/index.ts`. Toccarlo cambia la produzione; toccare il resto di
  `server.ts` no.
- Il webhook Stripe vive in `apiRoutes.ts` (`/api/webhook`). **Non cambiare mai
  il suo mount, il CORS o il rate limiter senza dichiararlo esplicitamente.**
- `functions/src/index.ts` gira con l'Admin SDK, che **scavalca
  `firestore.rules`**. Una regola stretta non ti protegge da un errore lì.

## Debito misurato che riguarda questi file

`functions/package.json` dichiara solo `firebase-admin` e `firebase-functions`,
ma `functions/src/index.ts` importa **`express` e `stripe`**, ed `esbuild`
costruisce il bundle. Nessuno dei tre è dichiarato lì: arrivano dal
`package.json` della radice e da una dipendenza transitiva di Vite. Quindi
`functions/package-lock.json` dà un pinning **illusorio** sulle versioni che
finiscono davvero in produzione, e il giorno in cui Vite cambia bundler il build
della function si rompe per una causa che nessuno collegherà.

## Cancelli

Qualunque modifica a `server.ts`, `src/server/apiRoutes.ts` o `functions/`:

```bash
npm run typecheck && npm run e2e
```

`npm run e2e` va in timeout sul webServer se un dev server gira già — il
conflitto è sulla porta HMR 24678, non sulla 3000, e il messaggio non lo dice.
Ferma il preview, poi riusa il server già in piedi.

`firestore.rules` e `src/config/admin.ts` sono bloccati su **due** livelli
indipendenti: l'hook `config_protection.py` e una regola `deny` in
`.claude/settings.json`. Servono entrambi gli sblocchi dell'owner, e la `deny`
non è rimovibile da dentro la sessione. Il lavoro qui passa da
`travellini-backend-engineer`.
