---
title: HANDOFF_futuro-art-direction_ui-designer_to_frontend-builder
status: consumed
created: 2026-06-23
from: travellini-ui-designer
to: travellini-frontend-builder
slug: futuro-art-direction
expires: 2026-07-07
---

# Handoff: art direction "Atlante Notturno" per il prototipo full-fidelity su /futuro

## Why this work matters

L'owner ha rigettato il DNA calmo sabbia-inchiostro: lo trova spento e non suo.
Decisione presa: ridisegnare l'esperienza (il motore dati resta) su una rotta
nuova /futuro, estetica awwwards-level, vibrante ma premium. Questo handoff
blocca la direzione visiva così il prototipo si costruisce senza reinventare.

## Decisions already made (NON relitigare)

- Direzione: "Atlante Notturno". North star: planetario dei posti che valgono —
  buio cinematico, luce dal contenuto, voce "vale la pena? per chi".
- Fondo = void caldo #0B0A09 (NON sand, NON #000). Superfici #16130F / #211C16,
  bordi #2E2820. Testo crema #F4EEE3 / dim #B7AE9F / faint #6E665A.
- UN solo accento saturo nel chrome: ember #FF5B2E (hover #FF7A52). Oro #E8B04B
  per prezzo/verdetto pieno. Semaforo verdetto: yes #3FBF7F, maybe #E8B04B, no #E5523E.
- Regola anti-caos: una sola fonte di colore saturo per schermata = la foto;
  un solo display-hero per schermata; movimento solo se informativo.
- Tipografia: display = Fraunces Black optical; UI = grottesca con carattere
  (raccomando Hanken Grotesk variable, no Inter); dati duri = una mono (Geist Mono).
- 3 componenti-firma obbligatori: barra "Chiedi", badge verdetto
  (VALE/DIPENDE/SALTA con pallino semaforo), badge prezzo mono esplicito.
- Disclosure ADV sempre presente ed elegante (ADV/INVITO/GIFTED/AFFILIAZIONE/
  ORGANICO) — requisito AGCOM, trattata come asset di fiducia.
- Mappa = riusare Mapbox dark-v11 già nello stack (DESIGN.md decision), ri-stilizzato
  monocromo caldo. Sync mappa-card. Bottom-sheet su mobile.
- Motion: motion (Framer) + GSAP/ScrollTrigger + Lenis. Tutto sotto
  prefers-reduced-motion e reduced-data. CLS = 0. Intro skippabile.
- Transizione-firma: card -> scheda-posto via shared element (layoutId), badge che
  viaggiano. Concierge: il match "spegne" i pin non rilevanti e fa volare le card
  (il movimento E la risposta), niente spinner.

## Context the receiver needs

- Brand reale (usa questo, non il sito attuale): docs/50_Scratch/INSTAGRAM_CONTENT_SEED_2026-06-18.md
  - memory brand_real_content. Food dominante, locali a tema, alloggi insoliti,
    prezzo SEMPRE esplicito, hook a domanda, internazionale (Italia + Praga/Madrid/
    Egitto/Shanghai/Londra). 170K, AGCOM.
- Dati reali pronti: src/data/content-seed.json (40 ContentItem) via
  src/config/contentLibrary.ts. Reel reali: src/config/reels.ts.
- Tassonomia esistente da riusare: src/config/contentTaxonomy.ts.
- Token attuali da superare (non cancellare, isolare per /futuro): src/index.css @theme.
- Layout: /futuro e full-bleed (no PageLayout), come Home/Mappa.

## What the receiver should produce (PRIMO SLICE)

Prototipo navigabile su rotta /futuro, full-bleed, Atlante Notturno:

- Home cinematica: intro leggera -> hero-concierge con barra "Chiedi", griglia
  asimmetrica di posti reali (dal seed), teaser atlante/mappa, manifesto verdetto.
- Esperienza concierge ask->risposta (l'AI puo essere stub nel prototipo: input ->
  filtra i ContentItem reali per tipo/zona/prezzo e "fa volare" le card matchate).
- I 3 componenti-firma + disclosure ADV + (dove c'e) reel inline 9:16.
- Mobile-first 375px: barra Chiedi sticky thumb-zone, card edge-to-edge, zero
  overflow orizzontale, intro <1.2s.

## Out of scope (do NOT touch)

- server.ts, firestore.rules, src/config/admin.ts.
- Le rotte/DNA esistenti: /futuro e additiva, non tocca le pagine live.
- Copy IT definitivo dei verdetti -> seo-strategist. Crop cover/peso img -> asset-curator.

## Open questions / decisions for the user

- Font UI/mono: Hanken Grotesk + Geist Mono raccomandati; confermare o display a
  pagamento (Sohne/Suisse) se budget lo consente.
- WebGL per la costellazione: partire canvas 2D/CSS (CWV-safe), WebGL solo se le
  metriche reggono.

## Notes

- Riferimenti vibe: Igloo Inc (buio+stelle), Apple (scroll disciplinato), Airbnb
  (mappa-card, bottom-sheet), The Pudding (narrazione-dati), Linear (craft chrome).
- Rigetti: gradient blob, glassmorphism oltre scrim, KPI card, contatori finti,
  hero stock generico, animazione decorativa senza informazione.
