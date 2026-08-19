---
type: bug
area: security
severity: medium
status: done
priority: p1
owner: travellini-backend-engineer
opened: 2026-05-15
source: audit avanzato 2026-05-15
tags:
  - bug
  - security
  - firestore
---

# BUG_2026-05-15_coupons_publicly_listable

## Sintesi

Regola Firestore `coupons` è `allow read: if true`. Un attaccante può listare TUTTI i codici sconto attivi (codice, type, value, expiryDate, description) da console browser. Espone leva commerciale strategica + abusabile.

## Posizione

[firestore.rules:267-270](../../firestore.rules):

```
match /coupons/{couponId} {
  allow read: if true;
  allow write: if isAdmin() && isValidCoupon();
}
```

## Riproduzione

```js
const { getFirestore, collection, getDocs } = await import('firebase/firestore');
const snap = await getDocs(collection(getFirestore(), 'coupons'));
snap.forEach((d) => console.log(d.id, d.data()));
```

→ lista codici visibile in chiaro.

## Fix proposto

Cambiare a:

```
match /coupons/{couponId} {
  allow read: if isAdmin();
  allow write: if isAdmin() && isValidCoupon();
}
```

Dipendenza: [server.ts:670](../../server.ts) `fetchCouponByCode` usa Firestore REST senza auth. Migrare a `getFirebaseAdminDb().collection('coupons').doc(code).get()` (admin SDK bypassa le rules).

## Link

- audit avanzato sezione §13 M4

## Chiusura — 2026-07-31

Verificato sul codice durante il consolidamento del backlog: `firestore.rules:279` → `allow read: if isAdmin()`.

Nessun lavoro residuo. Vedi [[10_Projects/PROJECT_BACKLOG_UNICO_2026-07-31]] §4.
