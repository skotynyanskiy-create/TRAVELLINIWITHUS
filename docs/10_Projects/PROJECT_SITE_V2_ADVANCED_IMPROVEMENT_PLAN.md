---
type: project
area: product
status: archived
priority: p0
owner: team
repo: TRAVELLINIWITHUS
related: '[[10_Projects/PROJECT_TRAVELLINIWITHUS_SITE]]'
source: V2 advanced improvement planning
tags:
  - project
  - product
  - strategy
  - v2
superseded_by: PROJECT_BACKLOG_UNICO_2026-07-31
---

> **Superato il 2026-07-31.** Questo piano non è più "cosa fare".
> Il lavoro ancora vivo è confluito in [[10_Projects/PROJECT_BACKLOG_UNICO_2026-07-31]]; la direzione è in `PROJECT_BACKLOG_UNICO_2026-07-31`.
> Resta leggibile come storico — non aggiungerci voci nuove.

# PROJECT_SITE_V2_ADVANCED_IMPROVEMENT_PLAN

## Missione V2

Portare Travelliniwithus da V1 editoriale/commerciale a una piattaforma travel piu avanzata:

- piu utile per chi cerca idee viaggio concrete
- piu credibile per partner, hotel, enti e brand
- piu misurabile per lead, newsletter, affiliati e prodotti digitali
- piu solida tecnicamente su performance, accessibilita, SEO e release

La V2 non deve sembrare un template o una demo. Deve sembrare la casa digitale di Rodrigo e Betta:
persone reali, esperienza reale, criteri chiari, strumenti pratici.

## North Star

Un visitatore deve capire in meno di 10 secondi:

- chi sono Rodrigo e Betta
- che tipo di viaggi selezionano
- dove iniziare a esplorare
- perche fidarsi

Un lettore deve trovare una buona idea viaggio in meno di 60 secondi.

Un partner deve capire se c'e fit e richiedere il media kit in meno di 2 minuti.

## Principi di prodotto

- Utilita prima dell'effetto: ogni innovazione deve aiutare una scelta, una scoperta o una conversione.
- Proof reali prima dei claim: foto, articoli, luoghi, dati social e case study devono sostituire placeholder e preview.
- Editoriale, non enciclopedia: le pagine devono aiutare a decidere, non solo accumulare informazioni.
- Personalizzazione leggera: preferiti, board e newsletter segmentata senza creare un social network.
- Commerciale dichiarato: affiliazioni, shop e collaborazioni devono essere trasparenti e coerenti con il tono.
- Accessibilita come standard: target pratico WCAG 2.2 AA.
- Performance come feature: proteggere LCP hero, INP sulle interazioni e CLS durante immagini/mappe/form.

## Non-obiettivi

- Non fare un redesign decorativo scollegato dal brand.
- Non aggiungere AI pubblica che inventa consigli di viaggio non verificati.
- Non lanciare lo shop con prodotti demo acquistabili.
- Non far diventare la home una dashboard.
- Non spingere partnership a scapito dell'esperienza lettore.

## Diagnosi attuale

### Punti forti

- Stack moderno: React 19, TypeScript, Vite, Tailwind 4, Firebase, Stripe, Playwright.
- Architettura gia orientata a funnel: Home, Esplora, Risorse, Collaborazioni, Media Kit, Contatti.
- `docs/` e gia sistema operativo: progetto, release, marketing, contenuti, bug e decisioni.
- V1.1 ha gia introdotto `Newsletter`, `FinalCtaSection`, preview controllate e noindex dove serve.
- Build e audit UI hanno una base gia funzionante, con warning ma senza errori bloccanti nelle ultime verifiche locali.

### Debolezze da risolvere

- Troppi elementi sono ancora preview/demo o asset AI invece di prova reale.
- Sitemap dinamica non valorizza ancora articoli/prodotti reali in build senza credenziali Firestore.
- Mappa e discovery hanno potenziale alto, ma non sono ancora il centro dell'esperienza.
- Preferiti esistono, ma non sono ancora una vera travel board utile.
- Shop e prodotti digitali sono correttamente prudenti, ma non ancora monetizzabili.
- Partner funnel e lead analytics devono essere piu granulari.
- Performance visiva da verificare su hero, motion, mapbox, immagini e route chunk.

## Visione V2

La V2 diventa un sistema a 4 superfici:

1. **Scoperta**: home, destinazioni, esperienze, guide, mappa, ricerca.
2. **Decisione**: articolo, guida, itinerario, luogo, risorsa, prodotto.
3. **Relazione**: newsletter, preferiti, travel board, social bridge.
4. **Conversione**: media kit, collaborazioni, contatti, shop, affiliazioni.

## Pilastri Strategici

### 1. Brand trust reale

Obiettivo: sostituire qualsiasi sensazione di demo con presenza reale.

Deliverable:

- foto reali Rodrigo e Betta per hero, chi siamo, media kit
- reel Instagram reale configurato in `src/config/site.ts`
- proof block sobrio con follower, reach, community e metodo editoriale
- pagina `Chi Siamo` con timeline essenziale e criteri di selezione
- 2-3 micro case study appena disponibili

File principali:

- `src/components/home/HeroSection.tsx`
- `src/components/home/CoupleIntro.tsx`
- `src/pages/ChiSiamo.tsx`
- `src/pages/Collaborazioni.tsx`
- `src/pages/MediaKit.tsx`
- `src/config/site.ts`

Metriche:

- CTR hero verso `Destinazioni`
- CTR hero verso `Ultime storie`
- CTR Home verso `Collaborazioni`
- scroll depth fino a `CoupleIntro`

### 2. Discovery engine editoriale

Obiettivo: far trovare idee viaggio per intenzione, non solo per archivio.

Deliverable:

- nuova sezione "Da dove vuoi partire?" in home
- finder leggero con 4-6 ingressi: weekend, food, hotel, insolito, relax, road trip
- ricerca unificata tra pagine, articoli, guide, esperienze, risorse e prodotti
- risultati con motivazione editoriale: "perche te lo consigliamo"
- filtri persistenti in URL e leggibili

File principali:

- `src/components/home/HomeDiscoveryCards.tsx`
- `src/components/SearchModal.tsx`
- `src/utils/discoveryQuery.ts`
- `src/pages/Destinazioni.tsx`
- `src/pages/Esperienze.tsx`
- `src/pages/Guide.tsx`

Metriche:

- search open rate
- search result click rate
- no-results rate
- filter usage
- destination/experience card click rate

### 3. Mappa V2

Obiettivo: trasformare la mappa da feature laterale a strumento di esplorazione.

Deliverable:

- marker editoriali con stato: pubblicato, preview, in arrivo
- filtri per luogo, esperienza, stagione, budget, durata
- card luogo collegate ad articoli, guide, prodotti e preferiti
- fallback senza Mapbox token gia presente, ma piu utile e brandizzato
- mappa teaser in home che porta a un percorso reale

File principali:

- `src/pages/Mappa.tsx`
- `src/components/map/MapboxWorldMap.tsx`
- `src/components/InteractiveMap.tsx`
- `src/components/home/HomeMapTeaser.tsx`
- `src/config/demoContent.ts`

Metriche:

- map open rate
- marker click rate
- favorite-from-map rate
- article click from map

### 4. Articoli, guide e itinerari modulari

Obiettivo: passare da contenuto preview a contenuto utilizzabile, aggiornabile e SEO-ready.

Deliverable:

- template articolo con blocchi standard: in breve, per chi e, quando andare, budget, itinerario, mappa, cosa evitare, risorse utili
- guide destinazione con schema editoriale coerente
- itinerari con giorni, tappe, tempi, alternative e CTA salvataggio
- stato contenuto: draft, preview, published, needs-update
- checklist editoriale prima della pubblicazione

File principali:

- `src/pages/Articolo.tsx`
- `src/components/article/*`
- `src/pages/Guide.tsx`
- `src/config/previewContent.ts`
- `src/config/demoContent.ts`
- `src/config/contentTaxonomy.ts`

Metriche:

- articoli pubblicati reali
- pagine indicizzabili
- CTR da guide verso articoli
- newsletter signup da articolo
- affiliate click da articolo

### 5. Travel board e preferiti evoluti

Obiettivo: rendere i preferiti una micro-area personale utile.

Deliverable:

- preferiti divisi per articoli, luoghi, prodotti, risorse
- "Travel board" con salvataggi e note leggere lato browser/account
- CTA newsletter collegata ai salvataggi
- stato vuoto utile con suggerimenti editoriali
- futura esportazione o condivisione raccolta

File principali:

- `src/pages/Preferiti.tsx`
- `src/context/FavoritesContext.tsx`
- `src/components/ProductCard.tsx`
- `src/components/discovery/*`
- `src/components/article/*`

Metriche:

- save rate
- return rate su `Preferiti`
- newsletter signup da preferiti
- click verso contenuti salvati

### 6. Funnel partner V2

Obiettivo: rendere il percorso B2B piu qualificato e tracciabile.

Deliverable:

- pagina `Collaborazioni` piu selettiva e orientata al fit
- media kit dinamico con PDF aggiornato e form qualificante
- form con campi: tipo partner, periodo, budget range, destinazione, obiettivo
- tracking separato per click media kit, download PDF, form submit, WhatsApp, email
- lead status interno: new, qualified, contacted, won, lost
- case study appena disponibili

File principali:

- `src/pages/Collaborazioni.tsx`
- `src/pages/MediaKit.tsx`
- `src/pages/Contatti.tsx`
- `src/pdf/MediaKitDocument.tsx`
- `src/lib/email.ts`
- `src/lib/leadFallback.ts`
- `src/services/firebaseService.ts`

Metriche:

- media kit CTA CTR
- media kit form completion
- qualified lead rate
- lead source attribution
- response time

### 7. Monetizzazione sobria

Obiettivo: rendere shop e affiliazioni credibili, non aggressive.

Deliverable:

- 2-4 prodotti digitali reali prima di sbloccare checkout
- schede prodotto con promessa, per chi e, cosa include, quando non comprarlo
- Stripe reale solo quando consegna e supporto sono pronti
- affiliate widgets contestuali negli articoli
- disclaimer affiliazioni chiaro e linkato dove serve

File principali:

- `src/pages/Shop.tsx`
- `src/pages/ProductPage.tsx`
- `src/components/CartDrawer.tsx`
- `src/components/AffiliateBox.tsx`
- `src/components/AffiliateWidget.tsx`
- `src/config/demoContent.ts`
- `server.ts`

Metriche:

- product page CTR
- add-to-cart rate
- checkout start rate
- purchase conversion
- affiliate click rate

Nota: `server.ts` e file high-risk. Ogni modifica deve essere piccola, letta con attenzione e verificata con audit Stripe/predeploy.

### 8. SEO tecnico e contenuti indicizzabili

Obiettivo: far indicizzare solo cio che e reale, utile e canonicalizzato bene.

Deliverable:

- sitemap dinamica con articoli/prodotti pubblicati reali
- canonical chiari su pagine filtro e contenuti
- route SEO dedicate per categorie prioritarie quando esistono contenuti minimi
- JSON-LD per Organization, WebSite, Article, BreadcrumbList, CollectionPage, Product dove appropriato
- OG image per home, articoli, guide, media kit e prodotti
- audit Search Console post deploy

File principali:

- `scripts/generate-sitemap.js`
- `src/components/SEO.tsx`
- `src/pages/Destinazioni.tsx`
- `src/pages/Esperienze.tsx`
- `src/pages/Guide.tsx`
- `src/pages/Articolo.tsx`
- `src/pages/ProductPage.tsx`

Metriche:

- pagine valide in sitemap
- pagine indicizzate
- impressions e CTR Search Console
- rich result validi
- pagine escluse per noindex atteso

### 9. Performance e Core Web Vitals

Obiettivo: esperienza percepita premium anche su mobile reale.

Target:

- LCP p75 <= 2.5s
- INP p75 <= 200ms
- CLS p75 <= 0.1
- nessun overflow orizzontale a 320, 375, 390, 768, 1024, 1440

Deliverable:

- hero media audit: poster, preload corretto, dimensioni e formati
- immagine reale ottimizzata con `srcset`/dimensioni dove possibile
- lazy loading rigoroso sotto la piega
- mapbox isolato alla route mappa
- motion/GSAP ridotti su mobile e rispettosi di reduced motion
- bundle report periodico

File principali:

- `src/components/home/HeroSection.tsx`
- `src/components/home/HeroBackdrop.tsx`
- `src/components/OptimizedImage.tsx`
- `src/components/SmoothScrollProvider.tsx`
- `vite.config.ts`
- `src/App.tsx`

Metriche:

- Lighthouse mobile
- Playwright visual quality
- bundle sizes build
- field metrics via analytics quando configurati

### 10. Accessibilita e qualita UX

Obiettivo: V2 usabile da tastiera, screen reader e mobile stretto.

Deliverable:

- focus states visibili e non coperti dalla navbar sticky
- target touch coerenti su nav, menu, filtri, form
- alt text utile su immagini reali
- search modal con ruoli e gestione focus solida
- form con errori leggibili e annunciabili
- test riduzione movimento

File principali:

- `src/components/Navbar.tsx`
- `src/components/SearchModal.tsx`
- `src/components/Newsletter.tsx`
- `src/pages/Contatti.tsx`
- `src/pages/MediaKit.tsx`
- `src/components/ConsentBanner.tsx`

Metriche:

- audit a11y senza blocker
- keyboard flow completabile
- form completion mobile
- nessun testo tagliato o sovrapposto

### 11. Analytics, consent e growth loop

Obiettivo: sapere cosa funziona senza tracciare in modo invasivo.

Deliverable:

- event taxonomy stabile
- tracking consent-gated gia presente, da completare con funnel V2
- dashboard eventi: discovery, saves, newsletter, partner, shop
- UTM capture per campagne e partner lead
- source attribution nei lead salvati

Eventi minimi:

- `home_discovery_click`
- `search_open`
- `search_result_click`
- `map_marker_click`
- `favorite_add`
- `newsletter_submit_attempt`
- `newsletter_signup`
- `media_kit_cta_click`
- `media_kit_download`
- `partner_form_submit`
- `affiliate_click`
- `checkout_start`
- `purchase_success`
- `place_directions_click` (nuovo, 2026-07-15 — vedi `/posto/:slug` sotto)
- `place_google_listing_click`
- `place_booking_click`
- `place_phone_click`
- `place_share_click`
- `place_reel_click`
- `nearby_search_use`
- `telegram_community_click`

File principali:

- `src/services/analytics.ts`
- `src/components/Button.tsx`
- `src/components/Newsletter.tsx`
- `src/pages/MediaKit.tsx`
- `src/pages/Contatti.tsx`
- `src/components/CartDrawer.tsx`

### 12. Admin e contenuti

Obiettivo: rendere facile pubblicare contenuti veri senza rompere il sito.

Deliverable:

- admin content editor con stati e checklist
- anteprima contenuto non indicizzabile
- validazione campi SEO prima publish
- gestione asset con alt text, credit e dimensioni
- controllo demo globale piu visibile
- seed reale minimo per lancio V2

File principali:

- `src/pages/admin/ArticleEditor.tsx`
- `src/pages/admin/ProductEditor.tsx`
- `src/pages/admin/SiteContentEditor.tsx`
- `src/components/MediaManager.tsx`
- `src/config/siteContent.ts`

## Roadmap operativa

### Sprint 0 - Baseline e governance V2

Durata stimata: 1-2 giorni.

Obiettivo: bloccare il punto di partenza e impedire regressioni.

Task:

- creare questa nota V2 e collegarla agli hub
- catturare screenshot baseline desktop/mobile delle route principali
- rieseguire `typecheck`, `lint`, `test`, `build`, `audit:ui`
- definire metriche e naming eventi
- aprire bug note per eventuali blocker trovati

Done:

- piano V2 attivo in `docs/10_Projects/`
- baseline QA disponibile
- checklist release aggiornata

Status 2026-05-05: completato in [[10_Projects/PROJECT_SITE_V2_SPRINT_0_BASELINE]].

Esito: `typecheck`, `lint`, `test`, `build`, `audit:ui`, `audit:firebase`, `audit:stripe`,
`audit:agents`, `audit:visual` e `predeploy` passano. Risolto overflow mobile su
`/destinazioni` e `/collaborazioni`.

### Sprint 1 - Trust reale e Home V2

Durata stimata: 1 settimana.

Obiettivo: rendere la prima impressione piu reale, utile e distintiva.

Task:

- sostituire asset hero/couple con foto reali approvate
- configurare `FEATURED_REEL.url` o rimuovere il fallback generico
- rifinire la home intorno a un discovery prompt forte
- ridurre eventuale copy ripetitiva
- assicurare CTA primarie: `Scopri destinazioni`, `Trova un'idea`, `Media kit`
- verificare LCP hero

Done:

- home non comunica piu demo
- mobile 375/390 senza overflow
- hero LCP verificato
- progetto home aggiornato

### Sprint 2 - Discovery V2 e ricerca

Durata stimata: 1-2 settimane.

Obiettivo: far diventare `Esplora` il cuore del sito.

Task:

- progettare finder per intenzione viaggio
- potenziare `SearchModal` con risultati raggruppati
- migliorare filtri su destinazioni/esperienze
- collegare guide e articoli reali alla discovery
- introdurre messaggi no-results utili

Done:

- utente trova un contenuto da home/search in meno di 60 secondi
- tracking discovery attivo
- nessun filtro rompe canonical o navigazione

### Sprint 3 - Mappa e Travel Board

Durata stimata: 1-2 settimane.

Obiettivo: rendere la scoperta piu visuale e personale.

Task:

- migliorare marker e card mappa
- collegare marker ad articoli e preferiti
- evolvere `Preferiti` in travel board
- aggiungere stati vuoti curati
- testare mappa con e senza Mapbox token

Done:

- mappa usabile anche senza token
- preferiti hanno valore pratico
- salvataggio contenuti tracciato

### Sprint 4 - Editoriale pubblicabile

Durata stimata: 2 settimane.

Obiettivo: sostituire preview con contenuti veri.

Task:

- pubblicare minimo 5 articoli reali
- pubblicare minimo 3 guide destinazione/esperienza
- impostare checklist contenuto
- generare sitemap dinamica con contenuti pubblicati
- verificare SEO, canonical, OG e structured data

Done:

- dynamic sitemap > 0
- pagine preview non indicizzate
- pagine reali indicizzabili

### Sprint 5 - Partner funnel e media kit dinamico

Durata stimata: 1 settimana.

Obiettivo: aumentare qualita e tracciabilita dei lead B2B.

Task:

- rifinire form media kit
- tracciare eventi partner
- aggiornare PDF media kit con asset e dati reali
- verificare email/Firestore/local fallback
- definire lead status e follow-up operativo

Done:

- roundtrip lead verificato
- PDF aggiornato
- dashboard lead pronta per uso operativo

### Sprint 6 - Shop reale e monetizzazione

Durata stimata: 1-2 settimane.

Obiettivo: attivare monetizzazione solo quando prodotti e delivery sono reali.

Task:

- selezionare 2-4 prodotti digitali V2
- sostituire prodotti demo
- completare checkout Stripe e consegna
- aggiornare policy/disclaimer dove serve
- testare acquisto end-to-end in ambiente sicuro

Done:

- no prodotti demo acquistabili
- Stripe audit passa
- checkout e delivery verificati

### Sprint 7 - Performance, accessibilita, release

Durata stimata: 3-5 giorni.

Obiettivo: chiudere V2 con criteri misurabili.

Task:

- `npm run audit:quality`
- Playwright visual desktop/mobile
- Lighthouse mobile sulle route principali
- controllo WCAG 2.2 AA pratico
- audit Search Console post deploy
- release note e rollback plan

Done:

- nessun blocker release
- nessun overflow mobile
- Core Web Vitals target confermati o con remediation plan

## Backlog per route

### `/`

- home piu orientata a discovery
- hero con asset reali
- CTA B2C e B2B bilanciate
- mappa teaser piu utile
- newsletter non generica

### `/destinazioni`

- contenuti reali minimi per gruppi prioritari
- filtri piu leggibili
- card con proof e motivazione editoriale
- canonical e sitemap per pagine realmente utili

### `/esperienze`

- esperienze come intenzioni di viaggio
- route dedicate solo quando c'e contenuto sufficiente
- cross-link con guide e shop sobrio

### `/guide`

- biblioteca pratica indicizzabile
- preview nascoste o marcate
- moduli per checklist, itinerari, budget e stagionalita

### `/articolo/:slug`

- template modulare definitivo
- related content piu intelligente
- salvataggio e newsletter contestuale
- structured data robusto

### `/posto/:slug`

Decisione 2026-07-15 (vedi `docs/50_Scratch/TOOLS_INTEGRATIONS_STRATEGY_2026-07-15.md`):
la domanda dominante degli utenti reali (918 commenti sul reel pinned Burton
Juice + Google Suggest) e "dove si trova / come ci arrivo / come prenoto" —
la pagina-posto deve rispondervi sopra la piega, prima di ogni altra feature.

Contratto informativo minimo (P0, tutto derivato, zero dato owner richiesto):

- riga indirizzo leggibile + bottone **Indicazioni** (Google Maps deep-link
  da coordinate o nome+citta) — oggi il bottone porta alla `/mappa` generica,
  non al pin del posto
- **"Vedi su Google"** (Business Profile deep-link) per prenota/contatti/orari
  finche l'owner non fornisce dati nativi
- **Condividi** (Web Share API, fallback copia-link) accanto a **Salva nei
  preferiti** (gia esiste via FavoritesContext, va esposto con CTA esplicita
  sulla pagina-posto)

Campi opzionali da aggiungere a `ContentPlace` (pattern render-solo-se-presente,
come `review`/`deal`): `address`, `hours`, `phone`, `website`, `bookingUrl`,
`googlePlaceQuery`.

Non fare: motore prenotazione interno, database orari/telefoni proprietario,
WhatsApp booking instradato su Rodrigo & Betta, affiliate fuori contesto
(assicurazione su un ristorante locale).

Metrica primaria: `place_directions_click` >= 15% dei visitatori pagina-posto
(kill <5% dopo traffico reale sufficiente).

### `/mappa`

- mappa come discovery tool
- marker reali
- no black map senza token
- performance e fallback curati

### `/risorse`

- toolkit editoriale
- risorse affiliate con trasparenza
- non sembrare pagina coupon

### `/shop`

- prodotti reali
- noindex finche demo
- checkout e delivery testati

### `/collaborazioni`

- filtro lead piu netto
- proof reali
- case study quando disponibili
- CTA verso media kit piu misurata

### `/media-kit`

- form qualificante
- PDF aggiornato
- evento download
- tracciamento fonte

### `/contatti`

- percorsi piu chiari per richiesta generica, partner, stampa, community
- errori form piu accessibili
- lead fallback e Firestore verificati

## Metriche V2

### Brand e discovery

- Home CTA CTR >= 8%
- search result click rate >= 35%
- destination/experience card CTR >= 12%
- scroll depth home fino a sezione editoriale >= 50%

### Relazione

- newsletter conversion da home >= 2%
- newsletter conversion da articolo >= 3%
- favorite add rate >= 4% sui contenuti visitati
- return to favorites >= 10% degli utenti che salvano

### Partner

- media kit CTA CTR da Collaborazioni >= 12%
- form media kit completion >= 35%
- qualified lead rate >= 30%
- lead source attribution >= 95%

### Monetizzazione

- product detail CTR da shop >= 20%
- add-to-cart >= 5% su prodotti reali
- checkout completion target da definire dopo primo traffico reale
- affiliate click rate da articoli >= 2%

### Qualita tecnica

- LCP p75 <= 2.5s
- INP p75 <= 200ms
- CLS p75 <= 0.1
- `npm run audit:quality` PASS prima del deploy V2
- zero errori `audit:ui`
- warning UI ridotti e motivati

## Release Gate V2

Non raccomandare deploy V2 se una di queste condizioni e vera:

- contenuti demo indicizzabili restano pubblici
- shop demo acquistabile
- media kit PDF non aggiornato
- lead form non salva ne invia fallback
- Mapbox token mancante senza fallback pulito
- `typecheck`, `build`, `audit:ui`, `audit:firebase`, `audit:stripe`, `audit:agents` falliscono
- visual QA mostra overflow, testo sovrapposto o CTA non leggibili
- privacy/consent non coprono analytics e marketing pixel

## Checks richiesti per grandi milestone

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run audit:ui
npm run audit:firebase
npm run audit:stripe
npm run audit:agents
npm run audit:visual
npm run predeploy
```

Per pre-release completo:

```bash
npm run audit:quality
```

## Standard esterni da seguire

- Google Search Central: architettura logica, canonical, contenuti utili e organizzati.
- Google Search Central structured data: JSON-LD valido e coerente con contenuto visibile.
- web.dev Core Web Vitals: LCP, INP e CLS come metriche p75.
- W3C WCAG 2.2: target pratico AA, con attenzione a focus, target size, input, testo alternativo e navigazione da tastiera.

## Rischi

### Rischio: innovazione visiva senza utilita

Mitigazione: ogni nuova sezione deve avere metrica, CTA o funzione editoriale.

### Rischio: contenuti reali insufficienti

Mitigazione: tenere preview noindex e pubblicare V2 per blocchi, non tutta insieme.

### Rischio: performance peggiorata da mappa, video e motion

Mitigazione: lazy load, route splitting, reduced motion, audit LCP/INP/CLS.

### Rischio: shop prematuro

Mitigazione: no checkout reale finche prodotto, delivery e supporto sono pronti.

### Rischio: partner funnel troppo aggressivo

Mitigazione: B2B visibile ma secondario rispetto al lettore nelle pagine editoriali.

## Decisioni aperte

- Quali 5 articoli reali devono sostituire le preview per il primo rilascio V2?
- Quali foto reali sono approvate per hero e media kit?
- La mappa deve restare Mapbox o avere una modalita statica premium per fallback?
- Quali prodotti digitali sono abbastanza pronti per lo shop V2?
- Quale dashboard analytics verra usata per leggere eventi e funnel?

## Prossima azione consigliata

Partire da Sprint 0 e Sprint 1:

1. baseline QA completa
2. asset reali
3. home V2 discovery
4. tracking CTA principali
5. aggiornamento release readiness

La V2 deve essere costruita in modo incrementale: prima fiducia e scoperta, poi personalizzazione, poi monetizzazione.

## Riferimenti

- [[10_Projects/PROJECT_TRAVELLINIWITHUS_SITE]]
- [[10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT]]
- [[10_Projects/PROJECT_DESTINATIONS_SECTION_REVIEW]]
- [[10_Projects/PROJECT_EDITORIAL_SYSTEM_V1_1]]
- [[10_Projects/PROJECT_RELEASE_READINESS]]
- [[MARKETING_OPERATIONS_HUB]]
- [[BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS]]

## Fonti esterne

- Google Search Central SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google Search Central Structured Data Guidelines: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- web.dev Core Web Vitals thresholds: https://web.dev/articles/defining-core-web-vitals-thresholds
- W3C WCAG 2.2: https://www.w3.org/TR/wcag/
