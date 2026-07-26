---
type: bug
area: security
severity: high
status: done
priority: p0
owner: travellini-backend-engineer
opened: 2026-05-15
fixed: 2026-05-15
source: audit avanzato 2026-05-15
tags:
  - bug
  - security
  - firestore
  - revenue
resolution: |
  Schema split implementato:
  - firestore.rules: nuova collezione `match /productAssets/{productId}` con
    `allow read,write: if false` (solo Admin SDK).
  - server.ts: funzione `fetchProductAssets()` legge downloadUrl via Admin SDK
    da productAssets; webhook Stripe inietta il valore in `orders/{sessionId}.items[].downloadUrl`
    al completion. isValidProduct() rules non include piu' downloadUrl nelle
    allowed fields (client non puo' scriverlo).
  - src/services/firebaseService.ts: rimosso il client-read di downloadUrl da
    products (normalizzato a '' con commento esplicativo).
  - src/pages/MieiAcquisti.tsx: lettura corretta da `order.items[].downloadUrl`
    (unico path autorizzato post-pagamento).
  TODO follow-up: admin editor product needs new endpoint per scrivere
  productAssets/{id} via Admin SDK (oggi scrittura silenziosa deny via rules).
---

# BUG_2026-05-15_products_downloadurl_public_read

## Sintesi

`products.downloadUrl` è leggibile da qualsiasi visitatore anonimo via Firebase Web SDK senza checkout. Chiunque apra DevTools sulla pagina Shop o usi `getDoc(doc(db, 'products', id))` può ottenere il link al PDF/template digitale e scaricarlo senza pagare. Bypassa completamente Stripe.

## Riproduzione

1. Aprire `/shop` in modalità anonima.
2. Aprire DevTools → Console.
3. Eseguire:
   ```js
   const { getFirestore, collection, getDocs } = await import('firebase/firestore');
   const docs = await getDocs(collection(getFirestore(), 'products'));
   docs.forEach((d) => console.log(d.data().downloadUrl));
   ```
4. Risultato atteso: lista di `downloadUrl` di tutti i prodotti pubblicati visibile in console.

## Posizione

- [firestore.rules:231-236](../../firestore.rules) — `match /products/{productId} { allow read: if resource.data.published == true || isAdmin(); }`
- [firestore.rules:148-161](../../firestore.rules) — `isValidProduct()` include `downloadUrl` nei campi consentiti
- [src/services/firebaseService.ts:77](../../src/services/firebaseService.ts) — `fetchProducts` legge tutti i campi
- [server.ts:985-1000](../../server.ts) — webhook usa `product.downloadUrl` da `fetchProductById` (server-side, OK in se, ma la stessa stringa è leggibile lato client)

## Severity rationale

**HIGH** — blocker pre go-live shop digitale. Non c'è exfiltration di dati personali ma c'è furto di prodotto. Una volta che lo shop reale apre, ogni `downloadUrl` reso pubblico è un PDF/template venduto a zero.

## Fix proposto

Spostare `downloadUrl` fuori da `products`:

1. Creare nuova collezione `productAssets/{productId}` con:
   ```
   allow read: if false;
   allow write: if false; // solo Admin SDK lato server
   ```
2. Rimuovere `downloadUrl` da `isValidProduct()` rules.
3. In [server.ts](../../server.ts), aggiungere `fetchProductAssets(productId)` che usa `getFirebaseAdminDb().collection('productAssets').doc(productId).get()`.
4. Nel webhook handler (`/api/webhook` post `saveStripeOrder`), per ogni item arricchire `downloadUrl` da `productAssets`, non da `products`.
5. Aggiungere script migrazione `scripts/migrate-product-downloadurl.mjs` da eseguire una tantum lato owner.

## TODO migrazione (owner)

- [ ] Eseguire `scripts/migrate-product-downloadurl.mjs` su environment di prod dopo deploy del fix (sposta `downloadUrl` esistenti da `products/{id}.downloadUrl` a `productAssets/{id}.downloadUrl`).
- [ ] Verificare che il primo ordine reale post-fix consegni correttamente il link.

## Link

- audit completo: `docs/10_Projects/PROJECT_ADVANCED_FULL_SITE_AUDIT_2026_05_15.md` (sezione §13 H1)
- [[PROJECT_RELEASE_READINESS]]
