---
type: article
article_type: pillar
status: idea
priority: p1
area: content
pillar: ''
destination: ''
keyword_primaria: ''
keyword_secondarie: []
route: '/articolo/[slug]'
published_at: ''
author: 'Rodrigo & Betta'
related: []
source: ''
tags:
  - pillar
  - guida-completa
---

# [Destinazione] — Guida completa

> **Template pillar**: una guida deve superare 1500 parole e contenere almeno 5 heading. La differenza con un articolo standard non è solo la lunghezza, ma la completezza decisionale per il lettore: leggendola deve poter pianificare il viaggio senza altri tab aperti.

## Requisiti tecnici (prima di scrivere)

- [ ] `type: 'pillar'` nell'admin editor
- [ ] `hotels[]` con almeno 2-3 strutture curate (nome, immagine, URL Booking, rating, priceHint, badge "Nostra scelta" sul top pick)
- [ ] `shopCta` collegata a un prodotto reale (Google Maps location, preset, ebook)
- [ ] Mappa con `mapMarkers` o `mapUrl`
- [ ] 3+ highlights in `highlights[]`
- [ ] 1+ voci in `tips[]` e `packingList[]`
- [ ] `verifiedAt` impostato, `disclosureType` esplicita
- [ ] `featuredPlacement: 'hub-destination'` se candidata a hub

## Scheletro editoriale consigliato

### Perché andarci

Apertura emotiva. Cosa rende questo posto diverso dagli altri simili. 2-3 paragrafi.

### Quando andare

Finestra migliore per mesi, meteo, presenza turisti, luce fotografica. Suggerimento concreto (non "tutto l'anno").

### Come arrivare

Aeroporti/stazioni di riferimento, opzioni di trasporto dentro la destinazione, mobility tips.

### Dove dormire

Breve intro al blocco `HotelRecommendations`. Le tre strutture selezionate devono coprire fasce prezzo diverse (economico / medio / premium) o zone diverse.

### Cosa vedere (itinerario ragionato)

Da 3 a 7 tappe con giorno e descrizione. Ogni tappa ha un perché concreto, non solo lista.

### Cosa mangiare

Piatti tipici, locali/ristoranti consigliati, uno street food suggestion, una colazione/aperitivo memorabile.

### Budget

Stime onesti in fasce (alloggio, cibo, trasporti, attività). Esempio concreto su N giorni.

### Hidden gems

2-4 posti che i blog generici non citano. Questi giustificano il tempo che il lettore ha speso leggendo.

### Link utili

Rimanda a:

- Articoli correlati sullo stesso continente/paese (3-5 link interni)
- Pagina `/dove-dormire/[destinazione]` se esiste
- Risorse di viaggio rilevanti (eSIM, assicurazione, esperienze via GetYourGuide)

## SEO

- **Keyword primaria**: (formato: "destinazione cosa fare" / "destinazione in N giorni" / "destinazione guida")
- **Keyword secondarie**: 3-5 long tail con intent pianificazione
- **Meta description**: 140-155 caratteri. Apre con valore concreto, non con "In questa guida scoprirai".
- **OG image**: 1200×630 reale, non stock generico
- **Schema**: `articleSection` diventa automaticamente "Guida completa — [categoria]" grazie al flag pillar

## Link interni minimi

- [ ] Link alla landing destinazione (`/destinazioni?group=...`)
- [ ] Link alla tipologia esperienza pertinente (`/esperienze?type=...`)
- [ ] Link a 2 articoli correlati dello stesso continente
- [ ] Link a `/dove-dormire` o `/risorse` quando rilevante

## QA prima di pubblicare

- [ ] Admin editor: validator non mostra errori bloccanti (warning accettabili se coerenti)
- [ ] Meta title ≤ 60 caratteri, description 140-155
- [ ] Cover image 1600×900 min, LCP sotto 2.5s
- [ ] Nessun link rotto (controlla affiliate Booking e link interni)
- [ ] Disclosure dichiarata coerente con realtà del viaggio

## Link

- [[PROJECT_TRAVELLINIWITHUS_SITE]]
- [[PROJECT_DOVE_DORMIRE]]
