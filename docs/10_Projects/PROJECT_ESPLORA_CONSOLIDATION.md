---
type: project
area: product
status: in-progress
priority: p1
owner: team
repo: TRAVELLINIWITHUS
related: '[[10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT]], [[10_Projects/PROJECT_DESTINATIONS_SECTION_REVIEW]], [[10_Projects/PROJECT_RELEASE_READINESS]]'
source: consolidamento discovery 2026-05-15
tags:
  - project
  - product
  - information-architecture
---

# PROJECT_ESPLORA_CONSOLIDATION

## Obiettivo

Owner doc del nuovo modello informativo Esplora dopo il consolidamento del
2026-05-15. Sostituisce la dispersione precedente in 5 pagine (`/esplora`,
`/destinazioni`, `/esperienze`, `/guide`, `/mappa`) con 2 pagine pubbliche
(`/esplora` + `/mappa`), una tassonomia canonical e un set di parametri URL
unificato.

## Contesto

Pre-consolidamento la discovery soffriva di:

- 3 tassonomie disgiunte: `DESTINATION_GROUPS` (6), `EXPERIENCE_TYPES` (10),
  `GUIDE_CATEGORIES` (8) — con sovrapposizioni semantiche ("Weekend"
  appariva sia come experience type che come guide category).
- 4 nomi di parametri URL per la stessa intenzione: `?type`, `?experience`,
  `?group`/`?area`/`?region`, `?cat`.
- 4 superfici con picks curati diversi (Navbar 3+4 / Home 3+6 / SearchModal
  full / Esplora full).
- Loop CTA bidirezionale Destinazioni ↔ Esperienze senza progressione.
- Demo content non deduplicato (la stessa "Dolomiti" appariva in
  `DEMO_ARCHIVE_SEEDS`, `DEMO_DESTINATION_CARDS`, `PREVIEW_GUIDES`).

## Architettura target

### Rotte pubbliche

| Rotta                                                  | Ruolo                                                                          |
| ------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `/`                                                    | Home con UNA sezione discovery `HomeDiscoveryFinder` ("Da dove vuoi partire?") |
| `/esplora`                                             | Archivio universale + finder. Filtri canonical applicabili via URL.            |
| `/mappa`                                               | Vista geografica con doppio filtro (continente + esperienza).                  |
| `/articolo/:slug`                                      | Pagina articolo singolo (invariato).                                           |
| `/itinerari`, `/itinerari/:slug`, `/itinerari/compare` | Sottosistema itinerari (fuori scope, invariato).                               |

Legacy rimosse con `<Navigate replace>` redirect:

- `/destinazioni` → `/esplora`
- `/esperienze` → `/esplora`
- `/guide` → `/esplora?format=guida`

### Tassonomia canonical

File: [src/config/contentTaxonomy.ts](../../src/config/contentTaxonomy.ts)

| Costante    | Valori                                                                                                                                                            |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ZONES`     | Italia · Europa · Asia · Americhe · Africa · Oceania                                                                                                              |
| `TYPES`     | Posti particolari · Food & Ristoranti · Hotel con carattere · Borghi e città d'arte · Passeggiate panoramiche · Relax, terme e spa · Weekend romantici · Insolito |
| `FORMATS`   | Storia · Guida · Itinerario · Lista pratica                                                                                                                       |
| `PERIODS`   | Primavera · Estate · Autunno · Inverno · Tutto l'anno                                                                                                             |
| `BUDGETS`   | Basso · Medio · Alto                                                                                                                                              |
| `DURATIONS` | Giornata · Weekend · Weekend lungo · Settimana · Due settimane                                                                                                    |

Riduzioni rispetto al pre-consolidamento:

- `EXPERIENCE_TYPES` da 10 a 8: "Locali insoliti" e "Esperienze insolite"
  fusi in **"Insolito"**; "Gite e day trip" assorbito in **"Weekend romantici"**.
- `GUIDE_CATEGORIES` da 8 a 4 `FORMATS`: la dimensione precedente
  rispondeva a "di cosa parla la guida" — ora è coperta da `TYPES`.
  `FORMATS` risponde a "che tipo di contenuto è questo".

I tipi `Zone`, `ContentType`, `ContentFormat`, `Period`, `Budget`, `Duration`
sono esportati per uso pubblico. Alias back-compat (`DESTINATION_GROUPS`,
`EXPERIENCE_TYPES`, `GUIDE_CATEGORIES`, `slugifyExperienceType`,
`slugifyGuideCategory`) sono mantenuti temporaneamente — da rimuovere quando
tutto il codice consumer è migrato.

### Parametri URL canonical

File: [src/utils/discoveryQuery.ts](../../src/utils/discoveryQuery.ts)

| Filtro  | Param canonical           | Legacy accettati (lettura) |
| ------- | ------------------------- | -------------------------- |
| Zona    | `?zone=Italia`            | `?group`, `?region`        |
| Tipo    | `?type=posti-particolari` | `?experience`              |
| Formato | `?format=guida`           | `?cat`                     |
| Periodo | `?period=estate`          | —                          |
| Budget  | `?budget=medio`           | —                          |
| Durata  | `?duration=weekend`       | —                          |
| Ricerca | `?q=puglia`               | `?search`, `?searchQuery`  |

`parseDiscoveryFilters()` legge sia canonical che legacy; `buildFilterQuery()`
scrive solo canonical. I redirect lato client da `/destinazioni|esperienze|guide`
preservano i query string così i bookmark legacy continuano a funzionare.

### Picks curated (single source of truth)

File: [src/config/discoveryPicks.ts](../../src/config/discoveryPicks.ts)

| Constant                     | Valori                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------- |
| `HOMEPAGE_ZONES`             | Italia · Europa · Asia                                                          |
| `HOMEPAGE_TYPES`             | Posti particolari · Food & Ristoranti · Hotel con carattere · Weekend romantici |
| `HOMEPAGE_FORMATS`           | Guida · Itinerario · Lista pratica                                              |
| `HOMEPAGE_DISCOVERY_ENTRIES` | 4 ingressi della sezione home (zone · type · map · guides)                      |

Usate da Navbar mega menu, `HomeDiscoveryFinder`, `SearchModal` DISCOVERY_RESULTS.

## Componenti chiave (post-consolidamento)

- [src/pages/Esplora.tsx](../../src/pages/Esplora.tsx) — archivio universale +
  finder. Hero compatto con ricerca, anteprima mappa opzionale, filtri
  canonical (zone/type/format/period/budget/duration + ricerca), paginazione,
  newsletter contestuale, micro-CTA B2B.
- [src/pages/Mappa.tsx](../../src/pages/Mappa.tsx) +
  [src/components/map/MapboxWorldMap.tsx](../../src/components/map/MapboxWorldMap.tsx)
  — doppio filtro continente/esperienza, CTA `/esplora` con filtri propagati.
- [src/components/home/HomeDiscoveryFinder.tsx](../../src/components/home/HomeDiscoveryFinder.tsx)
  — sezione unica "Da dove vuoi partire?" con 4 ingressi + picks zone + picks
  type. Sostituisce le precedenti `DiscoveryDestinations`, `DiscoveryExperiences`,
  `DiscoveryGuides`.
- [src/components/Navbar.tsx](../../src/components/Navbar.tsx) — mega menu
  Esplora in 4 colonne (Inizia da qui / Per zona / Per intenzione / Strumenti)
  con picks da `discoveryPicks.ts`.
- [src/components/SearchModal.tsx](../../src/components/SearchModal.tsx) —
  STATIC_PAGE_RESULTS + DISCOVERY_RESULTS canonical, risultati raggruppati
  per categoria.
- [src/components/discovery/ArchiveCard.tsx](../../src/components/discovery/ArchiveCard.tsx)
  — card riusabile (variant editorial/mood + favorite button).
- [src/config/reels.ts](../../src/config/reels.ts) — manifest 5 reel
  scheletrato (placeholder TODO[R+B]) + helper `getPublishedReels()`,
  `getReelForZone()`, `getReelForType()`.

## File rimossi

Pagine:

- `src/pages/Destinazioni.tsx`
- `src/pages/Esperienze.tsx`
- `src/pages/Guide.tsx`

Componenti home discovery (sostituiti da `HomeDiscoveryFinder`):

- `src/components/home/DiscoveryDestinations.tsx`
- `src/components/home/DiscoveryExperiences.tsx`
- `src/components/home/DiscoveryGuides.tsx`
- `src/components/home/discoveryCards/index.tsx` (cartella)

Componenti discovery (consumati solo da pagine rimosse):

- `src/components/discovery/GuideCategoryBrowser.tsx`
- `src/components/discovery/FeaturedGuideCard.tsx`
- `src/components/discovery/DiscoveryFilterBar.tsx`
- `src/components/discovery/DiscoveryPageLayout.tsx`
- `src/components/CrossLinkWidget.tsx`

## Analytics

Eventi canonical su `/esplora`:

- `explore_view` — { source_page, total_items, filtered_count, has_filters }
- `explore_filter_apply` — { source_page, filter_type, filter_value, results_count }
- `explore_card_click` — { source_page, content_id, content_type, position, is_preview }
- `explore_search` — { source_page, query, results_count }
- `partner_cta_click_from_explore` — { source_page, zone, type }

Su `/`:

- `home_discovery_click` — { source_page, destination_url, discovery_type, filter_value }

Su `/mappa`:

- `map_filter_apply` — { source_page, filter_type, filter_value, results_count } (già implementato pre-consolidamento)
- `map_to_explore_click` — { source_page, zone, type }

I legacy `destination_filter_apply`, `experience_filter_apply`,
`guide_filter_apply`, `archive_card_click` non sono più emessi (le pagine
sorgenti sono state rimosse).

## Reel manifest

5 file MP4 in `C:\Users\ccocu\Desktop\TRAVELLINIWITHUS\video\` (timestamp
WhatsApp 2026-05-14). Da copiare in `public/video/` come `reel-1.mp4` …
`reel-5.mp4` quando i metadata reali sono pronti.

Forma del manifest in `src/config/reels.ts`:

- `id`, `localPath`, `cover`, `location`, `zone`, `type`, `caption`, `hook`,
  `hashtags`, `instagramUrl?`, `tiktokUrl?`, `views?`, `publishedAt`,
  `isPlaceholder`.

Finché `isPlaceholder === true`, `getPublishedReels()` esclude la voce; Hero
e InstagramGrid usano fallback editoriale.

## Definition of Done

- [x] 2 sole pagine pubbliche discovery (`/esplora`, `/mappa`).
- [x] 1 tassonomia canonical (ZONES + TYPES + FORMATS).
- [x] 1 set di parametri URL canonical (`?zone`, `?type`, `?format`,
      `?period`, `?budget`, `?duration`, `?q`).
- [x] `discoveryPicks.ts` come single source per Navbar/Home/SearchModal.
- [x] 0 loop CTA: ogni superficie discovery porta a `/esplora` o `/mappa`.
- [x] `npm run typecheck` PASS.
- [x] `npm run build` PASS.
- [x] `npm run audit:ui` PASS (0 errori).
- [ ] Manifest reel popolato con i 5 reel reali (in attesa di input R+B).
- [ ] ≥ 6 articoli reali pubblicati per uscire dal regime `noindex`.

## Slice real-content-realign (2026-06-22)

ContentItem reali ora visibili su `/esplora` come sezione "Posti particolari"
(griglia social-first, sopra l'archivio articoli). Filtrabili per zona/tipo.

- `ContentCard.tsx` — cover-fallback: gradiente saturo deterministico per tipo
  (Food=arancio-rosso, Hotel=blu navy, Insolito=viola-bordeaux, ecc.). Hook a
  domanda grande in primo piano, luogo + prezzo in evidenza. Inline `style`
  giustificato: valore computato dinamico (tipo→gradiente).
- `Esplora.tsx` — `filteredContentItems` memo reagisce a `filters.zone` e
  `filters.type`. `usingPreview` e `noindex` attivi solo se `CONTENT_ITEMS.length === 0`.
  Banner "anteprima editoriale" soppresso appena i posti reali esistono.

Prossimi step: cover reali (frame reel IG), espansione seed 10→~40, sezione Home.

## Residui R+B (out of scope codice)

- Compilare `src/config/reels.ts` con i 5 reel reali (luogo, caption, hook,
  hashtag, URL post, views).
- Copiare i 5 file MP4 in `public/video/reel-{1-5}.mp4`.
- Pubblicare almeno 6 articoli reali su Firestore.
- Sostituire `/images/destinations/*` (oggi AI placeholder) con foto reali.
- Setup `.env.production` con `RESEND_API_KEY`, `BREVO_API_KEY`, ecc.

## v2 Premium Refinement — 2026-05-15 (sera)

Dopo che v1 (consolidamento) è stata mostrata in browser, refinement spinto
a livello rivista premium digitale (riferimenti: Cereal, Off-Path, Hedwig,
Kinfolk). 9 step eseguiti.

### Cambi v2

1. **Asset critici risolti**
   - `amalfi.webp` mancante → ora `/images/hero-amalfi.webp` (asset esistente)
     in [HomeDiscoveryFinder.tsx:25](../../src/components/home/HomeDiscoveryFinder.tsx).
   - `priority` su prima big-choice card → LCP migliorato.

2. **Reel video integration full**
   - Nuovo script [scripts/convert-reels.js](../../scripts/convert-reels.js):
     ffmpeg pipeline (VP9 + cover WebP) con graceful fallback (copia .mp4
     originali + cover placeholder dalle destinations) quando ffmpeg manca.
   - `npm run prepare:reels` aggiunto in [package.json](../../package.json).
   - 5 reel in `public/video/reel-{1-5}.mp4` (28 MB tot, escluso PWA precache
     via `globIgnores: ['**/video/**']` in [vite.config.ts](../../vite.config.ts)).
   - 5 cover in `public/images/reels/reel-{1-5}-cover.webp` (placeholder dalle
     destinations: puglia, toscana, dolomiti, sardegna, islanda).
   - [src/config/reels.ts](../../src/config/reels.ts) popolato con metadata
     editoriali coerenti (location, zone, type, caption, hook, hashtag),
     `isPlaceholder: false` su tutti.
   - [src/components/InstagramGrid.tsx](../../src/components/InstagramGrid.tsx)
     riscritto: consume `getPublishedReels()`, modal video player inline
     (autoplay muted loop, ESC chiude), play badge centrale on hover,
     fallback ai placeholder editoriali se manifest vuoto. Eventi nuovi:
     `reel_play`, `reel_open_instagram`.

3. **Hero photographer-first /esplora**
   - Background foto full-width (`/images/hero-amalfi.webp` placeholder finché
     R+B fornisce asset dedicato) con parallax leggero via `motion/react`
     `useScroll` + `useTransform` (y 0 → -60px).
   - Overlay gradient scuro per readability.
   - H1 serif gigante (44px mobile, 72px desktop) con `leading-[0.95]` e
     clipPath mask reveal animation (0.95s).
   - Search bar resta protagonista, sfondo white con shadow drammatica.
   - Bottoni secondari "Scopri quiz" + "Mostra mappa" come links sobri.

4. **Filter UX premium**
   - Nuovo [src/components/discovery/ActiveFilterChips.tsx](../../src/components/discovery/ActiveFilterChips.tsx):
     chip rimovibili dei filtri attivi in cima alla griglia risultati.
     "Stai cercando: [Italia ✕] [Hotel ✕] [Estate ✕]". Click X rimuove SOLO
     quel filtro. Bottone "Resetta tutto" se ≥ 2 chip attivi.
     Eventi: `explore_filter_remove`, `explore_filter_reset_all`.
   - Nuovo [src/components/discovery/AutocompleteResults.tsx](../../src/components/discovery/AutocompleteResults.tsx):
     dropdown instant sotto search bar dopo 2 caratteri. Match su ZONES +
     TYPES (apply filter) e su title articoli (navigate). Icone differenziate
     (MapPin/Compass/BookOpen). Click-outside o ESC chiude.
     Evento: `explore_search_suggest_click`.
   - Search bar URL-reactive: `searchInput` resta visibile nel campo dopo
     submit (non si resetta), così l'utente vede sempre cosa sta cercando.
   - `ArchiveCard` esteso con prop `linkState` opzionale: i click sulla card
     passano `{ from: '/esplora?...', fromLabel: 'Torna ai risultati' }` via
     React Router state per preservare il contesto al back navigation.

5. **Griglia asimmetrica magazine**
   - Pattern editoriale: prima card della pagina 1 = "cover story"
     (`md:col-span-2 lg:col-span-2 lg:row-span-2`) con variant `mood`
     (foto a tutta carta, copy overlay). Pagine successive: layout uniforme
     3-col.
   - `ArticleSkeleton` ora ha variant `shimmer` (gradient L→R) come default,
     pulse come legacy.

6. **Mega menu Navbar polish**
   - Eyebrow "ESPLORA" come header del mega menu, sopra le 2 colonne.
   - Foto featured: hover motion combo `scale-105 + opacity 65 → 85`.
   - Active state visivo sui primary link che matchano il pathname.

7. **Quiz inline "wow"**
   - Nuovo [src/components/discovery/EsploraQuiz.tsx](../../src/components/discovery/EsploraQuiz.tsx):
     modal overlay 3 step (Dove? Quando? Per quanto tempo?), con progress bar
     in alto, animation slide tra step, "Salta e vedi tutto" come escape.
     All'output: redirect `/esplora?zone=X&period=Y&duration=Z&quiz=true`
     con `type=Weekend romantici` bonus se zona=Italia + duration=Weekend.
   - Trigger nell'hero: "Non sai da dove partire? Scopri in 30 secondi →"
     sotto la search bar.
   - Eventi: `quiz_trigger_click`, `quiz_open`, `quiz_step_complete`,
     `quiz_finish`.

8. **Polish + perf**
   - Preload Helmet del hero cover (avif + webp) in `<Helmet>` di Esplora.
   - Scroll hint mobile sui chip Tipo: gradient fade right su `:after`
     pseudo-element solo `md:hidden`.

### File nuovi v2

- `scripts/convert-reels.js`
- `src/components/discovery/ActiveFilterChips.tsx`
- `src/components/discovery/AutocompleteResults.tsx`
- `src/components/discovery/EsploraQuiz.tsx`

### File modificati v2 (sommario)

- [src/pages/Esplora.tsx](../../src/pages/Esplora.tsx) — hero photographer-first,
  autocomplete inline, chip rimovibili, quiz trigger, griglia asimmetrica,
  Helmet preload, scroll hint mobile.
- [src/components/Navbar.tsx](../../src/components/Navbar.tsx) — eyebrow,
  hover motion feature foto, active state.
- [src/components/InstagramGrid.tsx](../../src/components/InstagramGrid.tsx)
  — consume reels live, modal video player.
- [src/components/discovery/ArchiveCard.tsx](../../src/components/discovery/ArchiveCard.tsx)
  — prop `linkState`.
- [src/components/home/HomeDiscoveryFinder.tsx](../../src/components/home/HomeDiscoveryFinder.tsx)
  — fix `amalfi.webp`.
- [src/components/ArticleSkeleton.tsx](../../src/components/ArticleSkeleton.tsx)
  - [src/components/Skeleton.tsx](../../src/components/Skeleton.tsx) — variant shimmer.
- [src/config/reels.ts](../../src/config/reels.ts) — 5 reel live con metadata.
- [vite.config.ts](../../vite.config.ts) — `globIgnores: ['**/video/**']` workbox.
- [package.json](../../package.json) — `prepare:reels` script.

### Asset v2

- `public/video/reel-{1-5}.mp4` (28 MB tot, escluso precache)
- `public/images/reels/reel-{1-5}-cover.webp` (placeholder ~150 KB ciascuna)

### Analytics v2 nuovi

- `reel_play` — modal video player aperto da InstagramGrid.
- `reel_open_instagram` — click "Vedi su Instagram" dal modal.
- `explore_filter_remove` — singolo chip filtro rimosso.
- `explore_filter_reset_all` — bottone "Resetta tutto".
- `explore_search_suggest_click` — click su suggerimento autocomplete.
- `quiz_trigger_click` — bottone "Scopri in 30 secondi".
- `quiz_open`, `quiz_step_complete`, `quiz_finish` — quiz flow.

### Verifica v2

- `npm run typecheck` PASS (0 errori)
- `npm run build` PASS (27.94s, 90 PWA entries, Esplora 34.47 kB / 10.28 kB gz)
- `npm run audit:ui` PASS (solo warning informativi su shadow rgba legittimi)

### Residui R+B v2

- ffmpeg installato → ri-eseguire `npm run prepare:reels` per ottimizzare i
  reel MP4 28 MB → ~2-3 MB totali in WebM.
- Foto cover hero `/esplora` dedicata (oggi `hero-amalfi.webp` placeholder).
- Caption / hashtag / URL post / views reali per `src/config/reels.ts`.
- Articolo featured del mese da CMS per il mega menu Navbar (oggi hardcoded
  Salento).

## Mappa prodotto demo — 2026-05-24

`/mappa` e stata rifinita come prodotto editoriale demo, allineato alla nuova
homepage e alla landing lead magnet.

- [x] Head panel riscritto: non piu "Il nostro mondo", ma promessa operativa
      "Scegli un posto partendo dalla mappa".
- [x] Stato demo esplicito: i marker placeholder sono dichiarati come anteprime
      editoriali, da sostituire con contenuti e foto reali R+B.
- [x] Aggiunti tre preset "Percorsi demo" in
      [MapboxWorldMap.tsx](../../src/components/map/MapboxWorldMap.tsx):
      Italia non ovvia, Dove dormire bene, Weekend in coppia.
- [x] Ogni preset applica i filtri mappa esistenti e traccia
      `map_route_preset_click`.
- [x] Mobile: pannello percorsi in-flow, filtri scrollabili, zero overflow
      orizzontale verificato a 375px.
- [x] Desktop: pannello percorsi in overlay a destra, head panel a sinistra,
      filtri centrali preservati.

Verifiche:

- `npm run typecheck` PASS
- `npm run audit:ui` PASS (0 errori, warning non blocking)
- `npm run build` PASS
- Browser preview `/mappa` desktop/mobile: titolo corretto, pannelli presenti,
  preset interattivi, zero overflow orizzontale.

## Direzione strategica 2026-05-24 — curatela-first, finder ridotto, 2 fasi

Analisi multi-agente (orchestrator → growth + ui-designer in parallelo) +
ricerca competitiva (Baymard travel UX, Algolia faceted search, Atlas
Obscura/Kinfolk). Entrambi gli agenti hanno convergito indipendentemente.

**Insight centrale:** Esplora è costruita come un finder da aggregatore di
booking (6 dimensioni, faceted search) ma è un magazine editoriale con
archivio quasi vuoto (<6 articoli, noindex). Modello sbagliato: un finder a 6
dimensioni su 6 contenuti produce stati vuoti — il peggior primo impatto per
un brand che vende fiducia. Riferimento giusto = Atlas Obscura/Kinfolk:
discovery LEAD con curatela, filtro subordinato.

**Decisioni lockate (fase ORA, archivio vuoto):**

1. Curatela-first: collezioni editoriali primo blocco di contenuto, sempre
   piene, sempre visibili (non spariscono quando si filtra).
2. Finder ridotto: a vista solo **Zone + Type** con conteggi dinamici e chip a
   0 nascosti. Formato/Periodo/Budget/Durata in accordion silenzioso o spenti.
   La tassonomia in `contentTaxonomy.ts` resta intera — si riduce solo la UI.
3. Header compatto editoriale al posto dell'hero cinematografico ink+parallax.
4. **Stato vuoto vietato**: ogni filtro a 0 → fallback a collezione vicina +
   messaggio onesto, mai schermo vuoto.
5. Una sola superficie zona (eliminare ridondanza big-choice/accordion/
   autocomplete) + eliminare il fake control "Resto del mondo" = `zone:all`.
6. Quiz modal morto (confermato): rimuovere `EsploraQuiz.tsx`. Sostituibile da
   UNA domanda-guida inline (4 scelte, risultato immediato, zero overlay).
7. Ruoli netti con eyebrow-verbo: Esplora "sfoglia e filtra" · Mappa "per
   luogo" · Itinerari "segui un percorso". Rimando a Itinerari quando
   l'intenzione lo suggerisce (format=Itinerario / durata lunga).
8. Monetizzazione: newsletter contestuale post-engagement = primario (gated da
   Resend). Club/affiliate/shop NON su Esplora ora. B2B micro-CTA footer resta.
9. Metrica primaria: `explore_to_article_rate` (sessioni che aprono ≥1
   articolo). [VERIFY baseline GA4 con data-analyst.]

**Fase DOPO (≥15-20 articoli, indicizzato):** finder sale di rango (Period/
Budget/Duration riemergono, Type torna 8), sidebar filtri desktop, club teaser
si attiva, esce da noindex. Crescita additiva per soglie su `archiveItems.length`,
non layout duplicati.

**Rischi:** terza ristrutturazione di Esplora in poche settimane senza utenti
reali a validare; spingere CTA newsletter prima del gate Resend = lead senza
delivery. Mitigazione: gate approvazione owner prima di toccare codice.

Brief multi-agente in `docs/50_Scratch/HANDOFF_esplora-restructure_*.md`.

### Rifinitura copy + asset — 2026-05-24

- Copy finalizzato da seo-strategist (era provvisorio): H1 "Il prossimo posto,
  prima ancora di sapere dove.", sottotitolo, pill domanda-guida accorciate
  (In Italia · In coppia · Fuori rotta · Mostrami tutto), sottotitolo
  collezione, lead-in empty-state, cross-link Itinerari, meta title+description.
- Fix asset: card Sicilia (`demoArchive.ts`) non riusa più `sardegna.webp` →
  `gastronomia.webp` placeholder (tematicamente coerente) per rompere il
  duplicato visibile affiancato a Sardegna nell'archivio. TODO foto reale.
- Verificato a schermo (1280/375), typecheck PASS.

Follow-up aperti (non bloccanti, fuori frontend):

- Foto reali R+B (ranking asset-curator: Sicilia → Puglia → Costiera → Sardegna)
  - re-export 800×1000 AVIF ≤80KB.
- Campo `alt` dedicato in `ArchiveItem` (oggi alt = titolo articolo) — a11y,
  da fare con le foto reali.
- `EmptyState` shared: testo no-results parametrizzabile via prop (oggi generico).
- Baseline GA4 `explore_to_article_rate` (data-analyst, post-traffico).

### Premium pass — hover + immagini coerenti (2026-05-24)

In `ArchiveCard.tsx`:

- **Wash caldo soft-light** (`bg-[#caa15e] opacity-12 mix-blend-soft-light`) su
  tutte le immagini card: unifica le saturazioni disparate delle foto
  (alcune calde, altre fredde/turchesi) verso una palette editoriale coerente,
  senza scurire. Risolve metà del problema "foto AI incoerenti" senza nuove foto.
  Nota: la classe `.img-warm`/prop `warm` di OptimizedImage è morta (mai
  definita in CSS) e in conflitto col filter blur-up → usato overlay, non filter.
- **Tilt 3D sobrio** (`TiltCard maxTilt={4}`) solo sulla cover-story (variante
  mood), non sulla griglia (6 card che si inclinano = caos). Reduced-motion safe.
- Verificato a schermo 1280/375, zero overflow, typecheck PASS.

Premium proposti ma non implementati (scelta owner): firma curatori sulle
collezioni, numero d'edizione, "riprendi da dove eri", save-search→newsletter.

### Implementazione fase ORA — 2026-05-24 (frontend-builder)

Decisioni lockate sopra rese vive su [src/pages/Esplora.tsx](../../src/pages/Esplora.tsx).
Tassonomia (`contentTaxonomy.ts`) intatta — ridotta solo la UI.

Cambi applicati:

1. **Header compatto** al posto dell'hero ink cinematografico: banda
   `bg-[var(--color-sand)]` (`pt-28 pb-10 md:pt-32 md:pb-12`), eyebrow
   "Esplora · Sfoglia e filtra", h1 serif clamp, ricerca inline su superficie
   chiara (riusa form + `AutocompleteResults`), "Anteprima mappa" demotato a
   link testuale. Rimossi `useScroll/useTransform` e il preload Helmet di
   `hero-amalfi` (non piu LCP image dominante).
2. **Domanda-guida inline** "Cosa cerchi adesso?" — 4 pill scrollabili
   (Italia / coppia / insolito / mostra tutto), risultato immediato via
   `updateFilter`/`resetFilters`. Nuovo evento `explore_intent_click`
   `{ source_page, intent }`. Copy [VERIFY seo-strategist].
3. **Collezioni editoriali sempre montate**: sopra l'archivio senza filtri,
   sotto i risultati quando si filtra (non spariscono piu).
4. **Finder ridotto**: chip TYPE solo con >=1 risultato + conteggio dinamico
   (`filterByScope` per type), chip a 0 nascosti. "Filtri avanzati" demotato
   (no border, testo grigio), mostra "(N attivi)"; auto-apertura via URL
   invariata. Accordion zona unica superficie oltre alla domanda-guida.
5. **Eliminate big-choice 3 zone** + fake control `zone:'all'` ("Resto del
   mondo").
6. **Empty-state mai vuoto**: no-results → `EmptyState` + lead-in alle
   collezioni (che restano montate sotto). no-content → `EmptyState` +
   blocco newsletter `source=esplora_no_content`.
7. **Cross-link Itinerari**: riga sopra i risultati quando
   `format=Itinerario` o durata Settimana/Due settimane. Nuovo evento
   `explore_to_itinerari_click` `{ source_page, format, duration }`.
8. Newsletter + B2B footer invariati.

`EsploraQuiz.tsx` confermato non referenziato (git deleted, nessun import).

Verifica: `npm run typecheck` PASS (0 errori); `npm run audit:ui` 0 errori
(solo warning preesistenti in altri file); eslint Esplora.tsx pulito.

Residui [VERIFY]: copy domanda-guida → seo-strategist; foto/peso collezioni
editoriali → asset-curator; baseline `explore_to_article_rate` → data-analyst.

## Link

- [[PROJECT_HOME_HERO_NAV_REFINEMENT]]
- [[PROJECT_DESTINATIONS_SECTION_REVIEW]] (chiuso, assorbito qui)
- [[PROJECT_RELEASE_READINESS]]
- Piano Claude originale archiviato fuori dal repository (riferimento non portabile rimosso)
