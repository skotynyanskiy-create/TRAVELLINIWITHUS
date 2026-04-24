---
type: reference
area: firebase
status: active
owner: team
tags:
  - firebase
  - firestore
  - schema
---

# Firestore Schema

## Admin e sicurezza

- L'accesso admin e autorizzato solo da Firebase Auth custom claim `admin=true`.
- Il campo `users/{uid}.role` e informativo: non concede permessi nelle rules.
- Prima del go-live assegnare il claim con `npm run admin:grant -- <email>` o lo script equivalente documentato in `docs/20_Decisions/DECISION_ADMIN_CUSTOM_CLAIMS.md`.

## Collections pubbliche

### `articles`

Source of truth per contenuti editoriali `pillar`, `guide`, `itinerary`.

Campi obbligatori per create/update admin:

- `title`: string
- `slug`: string kebab-case
- `type`: `pillar | guide | itinerary`
- `content`: string
- `authorId`: uid admin autore

Campi richiesti per pubblicazione editoriale tramite CMS:

- `description` o `excerpt`
- `coverImage` o `image`
- `verifiedAt`
- `disclosureType`: `none | affiliate | sponsored | gifted | partner`
- `country`/`location` coerenti
- CTA primaria e related content gestiti dal template pubblico

Campi opzionali supportati:

- tassonomia: `category`, `country`, `region`, `city`, `continent`, `experienceTypes`, `tripIntents`
- planning: `period`, `budget`, `budgetBand`, `duration`, `readTime`
- trust/commerciale: `featuredPlacement`, `hotels`, `shopCta`
- contenuto strutturato: `tips`, `packingList`, `gallery`, `highlights`, `itinerary`, `costs`, `seasonality`, `hiddenGems`, `localFood`, `mapUrl`, `mapMarkers`, `mapCenter`, `mapZoom`, `videoUrl`

Indici consigliati:

- `published ASC, slug ASC`
- `published ASC, type ASC`
- `published ASC, country ASC`
- `published ASC, featuredPlacement ASC`

### `hotels`

Source of truth per `/dove-dormire/:slug`.

Campi minimi:

- `title` o `name`
- `slug`
- `country`
- `fit`
- `editorialNote`
- `published`

Campi consigliati:

- `description` o `summary`
- `region`, `area`, `destination`, `destinationSlug`, `destinationHref`
- `category`, `heroImage` o `image`, `gallery`
- `bookingUrl`, `priceHint`, `budgetBand`, `rating`, `badge`
- `idealFor`, `pros`, `cons`
- `affiliateDisclosure`, `verifiedAt`
- `relatedGuideHref`, `relatedArticles`, `mapLabel`

Indici consigliati:

- `published ASC, slug ASC`
- `published ASC, country ASC`
- `published ASC, destinationSlug ASC`

### `products`

Source of truth shop. Lo shop resta secondario finche non esistono almeno 3 prodotti reali.

Campi minimi:

- `name`
- `slug`
- `price`
- `category`
- `published`

Campi opzionali:

- `description`, `imageUrl`, `isDigital`, `downloadUrl`, `isBestseller`, `features`, `gallery`, `specifications`, `relatedProductIds`, `reviews`

### `resources`

Toolkit pubblico/affiliate.

Campi minimi:

- `name`
- `description`
- `link`
- `category`
- `published`

Campi opzionali: `tags`, `badge`, `partner`, `isPartner`, `order`.

## Collections operative

- `siteContent`: copy CMS per home, navigation, planning, collaborations, footer. Public read, admin write.
- `settings`: statistiche pubbliche. Public read, admin write.
- `leads`: newsletter/contact/media-kit. Public create temporaneo con validazione, admin read/delete.
- `orders`: create/update solo admin o server Admin SDK; public read solo per owner autenticato.
- `coupons`: public read, admin write.
- `logs`: admin read/create, nessuna update/delete pubblica.

## Regole di rilascio

- Ogni nuovo campo va aggiornato in type, editor/admin, normalizer, service, Firestore rules e docs.
- Nessun contenuto demo deve essere pubblicato senza `noindex` o marker visivo.
- Le write pubbliche devono passare preferibilmente da API server con rate limit.
