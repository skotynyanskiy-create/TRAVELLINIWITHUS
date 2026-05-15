---
type: bug
area: backend
severity: medium
status: in-progress
priority: p1
owner: travellini-backend-engineer
opened: 2026-05-15
source: audit avanzato 2026-05-15
tags:
  - bug
  - firestore
  - rules
---

# BUG_2026-05-15_resources_collection_missing_rule

## Sintesi

`fetchResources()` interroga la collezione Firestore `resources` ma `firestore.rules` non ha alcun `match /resources/{...}` — la default rule è deny-all, quindi la query è sempre rifiutata. La pagina `/risorse` cade silenziosamente in fallback statico.

## Posizione

- [firestore.rules](../../firestore.rules) — nessun match `/resources` presente
- [firestore.indexes.json:19-26](../../firestore.indexes.json) — index `resources` definito (suggerisce intent di usare la collection)
- [src/services/firebaseService.ts:563-574](../../src/services/firebaseService.ts) — `fetchResources` chiama Firestore
- [src/pages/Risorse.tsx:181](../../src/pages/Risorse.tsx) — usa hook che chiama `fetchResources`

## Fix proposto

Aggiungere in `firestore.rules` sotto `match /coupons`:

```
match /resources/{resourceId} {
  allow read: if resource.data.published == true || isAdmin();
  allow create, update: if isAdmin() && isValidResource();
  allow delete: if isAdmin();
}
```

Definire `isValidResource()` validator allineato al modello (titolo, categoria, link affiliato, published flag, createdAt).

## Severity rationale

**MEDIUM** — la pagina /risorse è funzionalmente OK in fallback statico, ma il design del progetto prevede risorse editabili da admin via Firestore. Senza la rule, l'admin editor scrive ma il client non legge mai.

## Link

- audit avanzato sezione §3 #5
