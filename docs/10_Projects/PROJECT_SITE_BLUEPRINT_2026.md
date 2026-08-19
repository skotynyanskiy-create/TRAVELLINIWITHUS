---
title: Site Blueprint 2026 — il sito perfetto per travelliniwithus
type: project
status: archived
created: 2026-06-22
owner: Rodrigo & Betta
objective: sito posseduto, a scala piena (1.251 post via IG API), che monetizza i 170K
related:
  - docs/50_Scratch/INSTAGRAM_CONTENT_SEED_2026-06-18.md
  - docs/10_Projects/RUNBOOK_INSTAGRAM_GRAPH_API.md
  - docs/AI_TOOLING_RADAR.md
area: operations
priority: p2
icebox_reason: in attesa di funnel con traffico reale
---

> **Icebox dal 2026-07-31.** Non superato: contiene feature reali mai decise.
> Va ripescato _dopo_ che il funnel ha un ingresso — vedi [[10_Projects/PROJECT_BACKLOG_UNICO_2026-07-31]] §1.
> Non è il backlog corrente.

# Site Blueprint 2026

## 1. La verità del brand (chi sei, in chiaro)

- **@travelliniwithus**: 170K follower, 1.251 post, in elenco AGCOM. Coppia
  (Rodrigo & Betta), `@travellinifamily` come thread umano (gravidanza, baby).
- Bio: **"POSTI PARTICOLARI IN TUTTO IL MONDO · ADV DM o email"**.
- Pillar reali: **food dominante** + ristoranti/locali **a tema** (Tim Burton,
  Disney, Volturi, draghi, medievale) + **alloggi insoliti** (glamping, mirror
  house, fiaba) + **esperienze insolite** (zipline, cinema a letto, parchi) +
  **relax/spa/resort** + **taglio valore/prezzo SEMPRE esplicito**.
- Voce: **hook a domanda** ("MIGLIOR SUSHI AYCE ROMA?", "DORMIRE IN UNA FIABA?")
  → cos'è in 1 frase → il dato di valore → "vale la pena? per chi" → disclosure ADV.
- Geografia: **Italia capillare** (Roma, Milano, Parma, Bologna, Verona, Padova,
  Bergamo + regioni) **+ Europa ricca** (Madrid, Praga cluster, Londra,
  Copenaghen) **+ Asia/Africa** (Malesia, Shanghai, Egitto).
- Business: **monetizzazione attiva** — ~40 venue partner taggati, ADV/invito/
  gifted/collaborazione/pubblicità/affiliazione, Linktree (sconti, assicurazioni,
  escursioni), community "travellini".

## 2. L'obiettivo (deciso dall'owner)

Un sito che **POSSIEDI**, che è il brand **vero a scala piena** (tutti i 1.251
post in automatico via IG API), e che **trasforma i 170K in soldi**. Non un
portfolio: un asset di business. Tre leve insieme: ownership + automazione +
discovery/monetizzazione.

## 3. La concorrenza (cosa fanno, cosa imparare)

Competitor italiani coppia / posti particolari:

- **Mi prendo e mi porto via** (Elisa & Luca) — _il più vicino a te_: coppia,
  alloggi insoliti, boutique hotel, esperienze design/spa/food/wine. Da studiare
  come benchmark diretto.
- **The Travelization** (Sara & Lorenzo) — coppia, travel come professione.
- **Vologratis** (Andrea & Valentina) — comfort + attenzione al budget.
- **The Lost Avocado** (Sara Izzi) — uno dei travel blog IT più forti, curiosità
  e insight originali.
- **Travel Curiosity** (Isabel Mule) — itinerari insoliti, mete poco note.

Cosa fanno i migliori travel creator (2026, ricerca):

- **Email-first**: un iscritto vede il 100% di ciò che mandi, un follower IG ~10%.
  5.000 iscritti engaged rendono più di 50.000 follower. La lista è tua,
  l'algoritmo no. → la newsletter è il 25% del reddito dei creator da $100k+.
- **Diversificazione** (creator $100k+): ~30% brand deal, 25% newsletter, 20%
  prodotti digitali, 15% affiliate, 10% merch. Mai un'unica fonte.
- **Mappe affiliate dinamiche** (Stay22 / Klook / GetYourGuide): mappa con
  alloggi/POI → commissione sulle prenotazioni.
- **UX 2026**: mappe interattive, imagery/video immersivi, **mobile-first** (la
  ricerca viaggi avviene sul telefono), personalizzazione per comportamento,
  segnali di **trust/trasparenza**.

## 4. Il sito perfetto per travelliniwithus

Principio guida: **ogni post reale diventa una pagina TUA, ricercabile, che
cattura e monetizza** — non un rimbalzo su Instagram.

### 4.1 Architettura dei contenuti

- **Pagina-posto** (`/posto/:slug`): owned, indicizzabile, con schema.org
  (Restaurant / LodgingBusiness / TouristAttraction + Place), reel embeddato
  DENTRO la pagina, dati valore (prezzo, "vale la pena? per chi"), disclosure
  ADV, CTA email + affiliate. ← il mattone che cattura la discovery.
- **Hub regione/città** (`/destinazione/:regione`, e città tipo Praga/Madrid):
  aggregano i posti per zona/intenzione (Mangiare/Dormire/Esperienze/Vedere).
- **Esplora** (`/esplora`): discovery social-first, griglia + filtri + mappa.
- **Mappa mondo**: pin dei posti reali, con layer affiliate (alloggi prenotabili).

### 4.2 Monetizzazione (5+ flussi, come i creator da $100k+)

1. **Lista email** (priorità ownership): cattura su ogni pagina-posto + lead
   magnet REALE (i tuoi posti, non inventati) + welcome flow.
2. **Affiliate**: link tracciati sui posti (Booking/alloggi, assicurazioni,
   GetYourGuide esperienze) + mappa affiliate dinamica.
3. **Partnership/ADV**: pagina collaborazioni + media kit che converte i ~40
   partner reali; disclosure AGCOM credibile per tipo.
4. **Prodotti digitali**: guide premium / itinerari a pagamento (long-tail dei
   posti già raccontati).
5. **Community / membership** (futuro): area iscritti "travellini".

### 4.3 Discovery (Google + AI ti trovano)

- Pagine-posto + schema → Google indicizza TE, non Instagram.
- Entity/claim citabili → Perplexity / AI Overviews ti citano (vedi `/ai-seo`).
- Sitemap completa dei posti; togliere il `noindex` residuo da `/destinazione`.
- llms.txt + autorship strutturata (E-E-A-T: ci siete stati davvero).

### 4.4 UX / esperienza

- **Mobile-first** reale (la tua audience arriva da IG, da telefono).
- Mappa interattiva + imagery immersiva (le cover reali dei reel).
- Hook-domanda come lingua del sito (coerenza IG ↔ web).
- Trust: prezzo esplicito, disclosure ADV trasparente, "ci siamo stati".

## 5. Sequenza (token-free ora, pieno quando arrivano le chiavi)

1. **Predisposizione pipeline IG** (ora, senza chiavi): adapter + parser caption
   - fixture che imita la risposta API → il sito è configurato "come se" i 1.251
     post fossero già dentro. Si accende col token.
2. **Pagina-posto + schema + sitemap/noindex fix** (Discovery — leva scelta).
3. **Cattura email forte** + lead magnet reale (ownership).
4. **Affiliate + media kit** (revenue diretto).
5. **IG Graph API live** (quando l'owner fornisce token) → backend-engineer.

## 6. Build vs Buy — esistono soluzioni già pronte? (ricerca 2026)

Verdetto: **nessun prodotto turnkey copre i tuoi 3 obiettivi insieme; il sito
custom resta la scelta giusta.** Ma alcuni componenti NON vanno costruiti: si
innestano i migliori sul mercato. Hub posseduto custom + componenti best-in-class.

Cosa dice la ricerca, per categoria:

- **Link-in-bio / storefront** (Stan, Beacons, Komi, Linktree, Pietra): _"distruggono
  il tuo potenziale SEO — Google non indicizza le tue pagine; il cliente vede il
  brand della piattaforma, non il tuo"_. È l'esatto opposto di "possedere +
  farsi trovare". **No** come casa principale.
- **Embed feed IG** (Taggbox, POWR, EmbedSocial, Curator, SociableKit): auto-sync
  del feed in un widget. Mostrano i post, ma restano **embed non indicizzabili**:
  risolvono "mostra il feed", non "possiedi la discovery". Utile solo come
  **stopgap** per far vedere il feed oggi mentre la pipeline Graph API è in build.
- **Thatch** (la piattaforma travel-creator più vicina al caso): **acquisita da
  Mindtrip e fusa in un AI trip planner** — non è più una casa creator
  indipendente, e diversi creator si sono lamentati del cambio. Lezione: la
  dipendenza da piattaforma è un rischio (ti cambiano sotto i piedi). **Hotspot**
  è il successore per _vendere mappe/guide_ (tieni il 90%) — utile come componente.
- **Builder generici** (Squarespace, Wix, Payhip, Kajabi): own-ish, con paywall
  ed email integrate, ma UX generica, lock-in di piattaforma, e dovresti
  ricostruire dentro i loro limiti sia il modello-contenuto IG sia il brand
  premium. Più una scorciatoia che la destinazione.

### Stack consigliato (hybrid): hub custom + componenti comprati

- **Sito/hub + pagine-posto + discovery**: **custom** (questo repo). È l'unico
  modo per possedere SEO, brand e i 1.251 post come pagine tue.
- **Email/newsletter**: **non costruire** — integra Beehiiv / Kit (ConvertKit) /
  Substack. Best-in-class per deliverability e crescita lista.
- **Mappe affiliate**: **Stay22** (mappa con alloggi prenotabili → commissione).
- **Vendere guide/itinerari**: **Hotspot** o lo **Stripe già nello stack**.
- **Stopgap feed IG**: eventuale embed widget finché la Graph API non è live.

Regola: compra le _capability commodity_ (email infra, mappa affiliate, checkout),
costruisci l'_asset differenziante_ (il sito che possiedi e il contenuto reale).

## Note

- Token IG = secret, solo server (vedi RUNBOOK). Mai client/Git.
- Niente contenuto inventato: i campi mancanti restano `[VERIFY]` / placeholder.
