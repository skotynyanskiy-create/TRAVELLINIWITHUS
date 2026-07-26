---
title: HANDOFF_place-tools_seo_to_ui
status: consumed
created: 2026-07-15
from: travellini-seo-conversion-strategist
to: travellini-ui-designer
slug: place-tools
expires: 2026-07-29
type: handoff
area: delivery
---

# Handoff: microcopy IT + schema-map per i blocchi P0 della pagina-posto (Dove / Prenota / Condividi / Salva)

## Why this work matters

Sotto un reel da 63K like / 918 commenti la domanda dominante e' una sola: "DOVE si
trova?". La pagina-posto deve diventare la risposta definitiva a "dove / come ci
arrivo / prenoto / condivido / salvo", delegando il dato canonico a Google e senza
mai scivolare nel tono coupon/e-commerce. Qui ci sono le etichette e i microcopy IT
gia' scritti, coerenti col registro calmo del brand, pronti da mettere in layout.

## Decisions already made

Bloccate dal growth-operator (`docs/50_Scratch/TOOLS_INTEGRATIONS_STRATEGY_2026-07-15.md`),
non rilitigare:

- "Dove" e' priorita' 1, sopra la piega.
- Orari/prenota/telefono si **delegano a Google** finche' l'owner non fornisce il dato.
  Nessun database orari/telefoni proprietario. Nessun dato inventato nei placeholder.
- Niente WhatsApp/prenotazione instradati su R+B.
- **Regola di contesto affiliate**: su un ristorante/food locale IT NON compaiono
  assicurazione/eSIM/voli. Su questa pagina-posto: solo Indicazioni, Vedi su Google,
  Condividi, Salva (+ `bookingUrl`/`deal` reale se l'owner lo fornisce). Non aggiungere
  widget commerciali fuori contesto.

Decisioni copy che aggiungo io (SEO/conversion), gia' allineate ai pattern esistenti:

- Il **Salva** riusa `useFavorites()` (`toggleFavorite`/`isFavorite`, slug = `item.id`).
  NON reinventare il context. Stesso aria-pattern di `ArchiveCard.tsx`
  ("Salva nei preferiti" / "Rimuovi dai preferiti", `aria-pressed`), icona `Heart`.
- Il **Condividi** riusa il pattern di `Articolo.tsx`: `navigator.share` nativo (mobile);
  fallback `navigator.clipboard.writeText` + stato "copiato" per ~2s (desktop). Silenzioso
  su cancel/errore dello share sheet (come oggi).
- Registro: verbi corti e caldi nei bottoni ("Indicazioni", "Vedi su Google", "Salva",
  "Condividi"), una sola riga di contesto calda per il cluster share/save. Zero esclamativi
  da promo, zero "PRENOTA ORA / approfitta".

## What the receiver should produce

Layout dei quattro blocchi P0 col registro calmo (no banner spammosi), usando **queste
stringhe esatte**. I blocchi gated (dato owner) si mostrano solo se il campo esiste.

### Blocco 1 — "Dove si trova" (obbligatorio, sopra la piega)

| Elemento                          | Stringa IT                                               | Note                                                                      |
| --------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------- |
| Eyebrow blocco                    | `Dove si trova`                                          | uppercase tracking come "Prezzo indicativo"                               |
| Riga luogo                        | _(derivata, gia' esiste)_ `nome — citta, regione, paese` | dato reale, mai inventato                                                 |
| Bottone primario                  | `Indicazioni`                                            | icona `Navigation` o `MapPin`; apre Google Maps                           |
| aria-label bottone                | `Apri le indicazioni su Google Maps`                     |                                                                           |
| Bottone interno secondario (opz.) | `Apri sulla mappa`                                       | deve puntare al **pin del posto** su `/mappa`, non alla `/mappa` generica |

- URL consigliato Indicazioni (frontend costruisce): con coordinate
  `https://www.google.com/maps/dir/?api=1&destination=<lat>,<lng>`; senza coordinate
  `...&destination=<encodeURIComponent(`${name}, ${city}`)>`. La label "Indicazioni" resta
  identica nei due casi (la differenza vive solo nella prop analytics `has_coordinates`).
- Evento: `place_directions_click` con `{ place_id, has_coordinates }`.

### Blocco 2 — "Orari e contatti" (minimo delegato a Google + progressive enhancement)

| Elemento               | Stringa IT                                                               | Stato                                                    |
| ---------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------- |
| Eyebrow blocco         | `Orari e contatti`                                                       | sempre                                                   |
| Bottone primario       | `Vedi su Google`                                                         | sempre (fallback canonico)                               |
| aria-label bottone     | `Apri la scheda Google del posto`                                        | sempre                                                   |
| Micro-disclaimer       | `Orari, telefono e prenotazione sono aggiornati direttamente da Google.` | sempre (sotto il bottone, testo muted piccolo)           |
| Blocco nativo telefono | label `Chiama` + numero reale                                            | gated: solo se `place.phone`                             |
| Blocco nativo prenota  | `Prenota un tavolo` (Food) / `Prenota` (altro)                           | gated: solo se `place.bookingUrl`                        |
| Blocco nativo orari    | render del valore reale (es. `Mar-Dom 19:00-23:00`)                      | gated: solo se `place.hours` — **mai placeholder finto** |

- URL "Vedi su Google": `https://www.google.com/maps/search/?api=1&query=<encodeURIComponent(`${name} ${city}`)>`
  (o `place.googlePlaceQuery` se l'owner fornisce un override). Apre la scheda dove Google
  espone gia' orari/telefono/Prenota/recensioni.
- Il disclaimer serve a due cose: onesta' verso l'utente e protezione brand (non ci
  rendiamo responsabili di orari terzi che invecchiano). Tenerlo calmo e piccolo, non un alert.
- Eventi: `place_google_listing_click {place_id}`, `place_phone_click {place_id}`,
  `place_booking_click {place_id, provider}`.

### Blocco 3 — Condividi (obbligatorio)

| Elemento                               | Stringa IT                  | Note                                                                                   |
| -------------------------------------- | --------------------------- | -------------------------------------------------------------------------------------- |
| Bottone (stato base)                   | `Condividi`                 | icona `Share2`                                                                         |
| aria-label                             | `Condividi questo posto`    |                                                                                        |
| Conferma desktop (fallback copia-link) | `Link copiato`              | il bottone diventa `Link copiato` + icona `CheckCircle` per ~2s, poi torna `Condividi` |
| Mobile (share sheet nativo)            | _(nessuna conferma in-app)_ | l'OS gestisce; su cancel resta silenzioso come in `Articolo.tsx`                       |

- Riga di contesto calda per il cluster Salva+Condividi (una sola, sopra o sotto i due
  bottoni): `Salvalo, o mandalo a chi ci deve venire.` — copre entrambe le intenzioni
  (pianificazione + tag-a-friend) in tono brand, senza filler.
- Nota consistenza: `Articolo.tsx`/`MobileBottomBar.tsx` usano `Copiato!`. Sulla pagina-posto
  consiglio `Link copiato` (piu' chiaro: non c'e' un codice/altro da copiare). Se si vuole
  parita' stretta col resto del sito, `Copiato!` e' accettabile — vedi Risks.
- Evento: `place_share_click` con `{ place_id, method: 'native' | 'copy' }`.

### Blocco 4 — Salva nei preferiti (CTA esplicita in pagina-posto)

| Stato       | Label visibile | aria-label              | Icona             |
| ----------- | -------------- | ----------------------- | ----------------- |
| Non salvato | `Salva`        | `Salva nei preferiti`   | `Heart` (outline) |
| Salvato     | `Salvato`      | `Rimuovi dai preferiti` | `Heart` (fill)    |

- `aria-pressed` = stato salvato. Riusa `useFavorites()`; slug = `item.id`; nessun nuovo store.
- Evento: `place_favorite_add` con `{ place_id, source: 'posto' }` — **solo alla transizione
  verso salvato** (l'evento e' `_add`; sul remove nessun evento, coerente col contratto doc).

### Schema.org — SOLO quando il dato owner esiste (non scrivere ora)

`Posto.tsx` gia' emette `Restaurant`/`LodgingBusiness`/`TouristAttraction` con `address`,
`geo`, `review`, `offers`. Quando arriveranno i campi opzionali owner, aggiungere al
`placeJsonLd` con lo **stesso pattern render-solo-se-presente**, mai valori inventati:

| Campo owner (nuovo, opzionale) | Proprieta' schema.org                                           | Formato richiesto                                                                   |
| ------------------------------ | --------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `place.phone`                  | `telephone`                                                     | stringa, preferibile E.164 (`+39...`)                                               |
| `place.hours`                  | `openingHoursSpecification` (o `openingHours` testo)            | **codici giorno EN + 24h** (`Tu-Su 19:00-23:00`), separato dalla stringa display IT |
| `place.website`                | `sameAs: [website]`                                             | il sito ufficiale del posto (`url` resta la pagina-posto canonica)                  |
| `place.bookingUrl`             | `potentialAction: { @type: ReserveAction, target: bookingUrl }` | link ufficiale/TheFork                                                              |
| deep-link Google Maps          | `hasMap`                                                        | URL scheda Google                                                                   |

- Vincolo: emettere `telephone`/`openingHours` **solo se owner-verificato e accurato**. Se manca,
  resta il link "Vedi su Google" come fonte canonica — non riempire lo schema per completezza.
  (Nessun `aggregateRating`: gia' escluso in `Posto.tsx`, resta cosi'.)

## Out of scope (do NOT touch)

- Layout/estetica finale, scelta icone, spaziature: e' il tuo lavoro, io do solo le stringhe.
- Deep-link builder, wiring eventi, nuovi campi `ContentPlace`, JSON-LD reale: sono di
  `travellini-frontend-builder`. Qui li indico solo perche' la label sia coerente col link.
- `server.ts`, `firestore.rules`, `admin.ts`.
- Nessun widget assicurazione/eSIM/voli su questa pagina-posto (regola di contesto).
- Il pillar Burton Juice e i suoi file: fuori da questo handoff.

## Open questions / decisions for the user

- Conferma copia-link: `Link copiato` (mio consiglio) vs `Copiato!` (parita' col resto del sito)?
- L'owner fornira' `phone`/`hours`/`bookingUrl` per alcuni posti pilota? Finche' no, tutto
  resta sul fallback Google (nessun blocco nativo, nessuno schema `telephone`/`openingHours`).

## Next hand-off

- Next agent: `travellini-frontend-builder` (dopo il layout ui-designer).
- Trigger: layout dei 4 blocchi approvato; il frontend implementa deep-link derivati,
  campi opzionali `ContentPlace`, eventi `place_*` e (solo se dato owner) il JSON-LD esteso.
- Gate finale: `travellini-quality-auditor` + `browser-auditor` (a11y, no overflow mobile,
  link corretti, eventi che sparano).

## Notes

- Analytics gia' definiti nel doc growth, tutti consent-gated dal `trackEvent` esistente:
  `place_directions_click`, `place_google_listing_click`, `place_phone_click`,
  `place_booking_click`, `place_share_click`, `place_favorite_add`, `place_reel_click`.
- Metrica primaria dell'intera decisione: `place_directions_click` >= 15% dei visitatori
  pagina-posto. Le label "Indicazioni" e "Vedi su Google" devono essere le azioni piu'
  leggibili del blocco DOVE per non affossare quella metrica.
- Il CTA reel "Guarda il reel" e la scheda recensione restano come sono (rispondono gia'
  a "cosa aspettarsi").
