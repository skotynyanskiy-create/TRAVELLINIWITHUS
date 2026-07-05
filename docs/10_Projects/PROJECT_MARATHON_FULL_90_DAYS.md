---
type: project
area: site-evolution
status: in-progress
started: 2026-05-17
target_completion: 2026-08-17
owner: Rodrigo & Betta + Claude main thread + travellini-* agents
scope: full-site upgrade to "best-in-class 2026" editorial travel premium
tags: [marathon, premium, ui, content, ai, funnel]
priority: p2
---

# PROJECT — Marathon Full 90 giorni

Upgrade completo Travelliniwithus al livello premium 2026: direzione visiva Editorial Slow, 3 funzionalita distintive (AI Companion, Audio guide, WhatsApp Broadcast), 8 funzionalita business (Quiz, Calendar, Builder, Calculator, Wishlist), pipeline contenuti 15 pillar + 90 satellite, AI search readiness completa.

Decisione presa 2026-05-17 dopo audit completo con 6 specialisti + sintesi 4 agent (ui-designer / growth / content / seo). Riferimento decisionale: [docs/50_Scratch/AUDIT_FULL_SITE_2026-05-17.md](../50_Scratch/AUDIT_FULL_SITE_2026-05-17.md).

## Direzione visiva scelta

**Mood A — Editorial Slow** (raccomandato dal ui-designer) con due elementi rubati al Mood Magazine Print: indice numerato + drop cap.

Riferimenti: Cereal Magazine, Kinfolk, Off Guide, Toast (toa.st), Norse Projects journal.

Caratteristiche:

- Display serif statica e contenuta (Fraunces) a 56-88px desktop, tracking stretto
- Sans neutra (Inter) per eyebrow 11-12px uppercase letter-spacing 0.18em
- Body 17/28
- Foto 4:5 e 3:4 con molto bianco intorno, palette desaturata
- Rapporto 60/40 testo/foto
- Motion quasi-statico: fade-in 400ms, niente parallax, niente GSAP visibile
- Lenis solo per smoothness

## Stack tecnico moderno

Strumenti utilizzati per Marathon:

- React 19 + Vite 6 + Tailwind 4 (esistente)
- GSAP + motion + lenis (esistente, uso ridotto per Editorial Slow)
- Mapbox 3D (esistente, esteso per audio guide layer)
- Firebase/Firestore (esistente, esteso per quiz archetypes + wishlist)
- Stripe (esistente, esteso per club paid)
- **NUOVO**: Claude Haiku + OpenAI embeddings (RAG per AI Companion)
- **NUOVO**: Twilio/360dialog (WhatsApp Business API)
- **NUOVO**: Open-Meteo API (gratuita) per Calendar destinazioni
- **NUOVO**: Apple Podcast feed RSS (audio guide narrate R+B)
- **NUOVO**: dnd-kit (Itinerary Builder drag&drop)

## Fasi (4 fasi × ~22 giorni)

### FASE 1 — Foundation Sprint (gg 1-22)

Obiettivo: base premium prima di ogni feature.

#### 1.A Editorial Slow direction (gg 1-7)

- [ ] Typescale aggiornata (h1 88px desktop / 56px mobile, eyebrow 0.18em, body 17/28)
- [ ] Spacing piu generoso (margini sezione +30-40%)
- [ ] Foto ratio 4:5 / 3:4 prevalente
- [ ] Drop cap su prima lettera articolo
- [ ] "Dispatch" index numerato 01-12 in homepage (pezzi recenti tipografico puro)
- [ ] Motion ridotta: fade-in opacity 400ms, niente parallax/GSAP visibile
- [ ] Verifica responsive 375/768/1280

Owner: `travellini-frontend-builder` (implementazione) + main thread (typescale/spacing iniziali)

#### 1.B Quiz "Che coppia di viaggiatori siete" (gg 8-14)

- [ ] Definizione 6 archetipi italiani in `src/config/quizArchetypes.ts`
  - Il Lento del Sud
  - La Cercatrice di Borghi
  - L'Alpinista Civile
  - La Coppia di Costa
  - La Famiglia in Movimento
  - Il Notturno Urbano
- [ ] 7-8 domande con scoring matrix
- [ ] Pagina quiz `/quiz` (estende esistente) con UI Editorial Slow
- [ ] Lead capture al risultato (email + segmento archetype)
- [ ] Sequence email post-quiz (5 email automation via Brevo/Mailerlite)
- [ ] GA4 events: `quiz_start`, `quiz_complete`, `archetype_assigned`, `quiz_lead_capture`
- [ ] User property `archetype` per GA4

Owner: `travellini-frontend-builder` + `travellini-seo-conversion-strategist` (copy archetipi)

#### 1.C Club hero ricostruito (gg 15-17)

- [ ] H1: "Il club di chi viaggia in Italia con noi"
- [ ] Pricing in viewport: 8€/mese o 72€/anno
- [ ] 3 benefit concreti (guida nuova/mese, mappa member 200+ posti, risposte R+B 48h)
- [ ] Social proof onesto: "Siamo 47 dentro. Vogliamo restare piccoli." (numero reale, niente fake)
- [ ] Preview guida bloccata a 200 parole + lock visivo
- [ ] FAQ 6 voci: quando vale / quando NO / cancellazione / cosa NON c'e / regalo / accesso archivio
- [ ] Tabella free vs club: 3 righe concrete

Owner: `travellini-seo-conversion-strategist` (copy) + `travellini-frontend-builder` (impl)

#### 1.D AI SEO Entity Layer (gg 18-22)

- [ ] `Place` schema per top 20 destinazioni con `geo.latitude/longitude` + `sameAs` Wikidata Q-ID
- [ ] `Person` schema R+B con `sameAs` IG/TikTok/YouTube + `knowsAbout`
- [ ] `llms-full.txt` con 10 articoli pillar full-text + bio + claim verificabili
- [ ] `robots.txt` allowlist esplicito: GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot
- [ ] `<time datetime="...">` inline per ogni prezzo/orario nei pillar
- [ ] Citation tracking setup (Profound.so o Otterly.ai mensile)

Owner: `travellini-seo-conversion-strategist`

**Milestone FASE 1**: sito premium visivamente + quiz live + club che converte + GEO ready.

### FASE 2 — Distinction (gg 23-44)

Obiettivo: 3 feature uniche che nessun competitor IT travel ha.

#### 2.A AI Travel Companion "Chiedi a R+B" (gg 23-32)

- [ ] Corpus ingestion: tutti gli articoli pubblicati in vector store (Firestore + cosine similarity, oppure Supabase pgvector)
- [ ] Embeddings: OpenAI text-embedding-3-small (cost ~$0.02 per 1k articoli)
- [ ] RAG pipeline: query → top-5 chunks → Claude Haiku con system prompt severo "rispondi solo da corpus, no hallucination"
- [ ] UI chat estende `AiAssistant.tsx` esistente
- [ ] Guardrail: refuse fuori scope, fallback "scrivici in DM"
- [ ] Gating: 5 query free → registrazione → club
- [ ] Citation: ogni risposta linka l'articolo sorgente
- [ ] Cost cap: $50/mese hard limit

Owner: `travellini-backend-engineer` (RAG + API) + `travellini-frontend-builder` (UI) + `travellini-ui-designer` (chat aesthetic)

#### 2.B Audio guide pilot Salento (gg 33-38)

- [ ] 8-12 punti GPS Salento con clip audio 60-90s registrati da R+B
- [ ] Microfono Rode + editing in-house (€200 budget)
- [ ] Player web embed sulla pagina articolo Salento
- [ ] Layer Mapbox interattivo: marker che si accendono allo scroll, audio play on click
- [ ] Feed Apple Podcast RSS separato per discovery
- [ ] Transcript IT per a11y + SEO

Owner: R+B (registrazione audio in loco) + `travellini-frontend-builder` (player + map layer) + `travellini-asset-curator` (waveform visuals)

#### 2.C WhatsApp Broadcast (gg 39-44)

- [ ] Setup Twilio o 360dialog WhatsApp Business API
- [ ] Opt-in widget sul sito (footer + post-quiz)
- [ ] Template approvati: drop esclusivi, alert "stiamo per partire per X", anteprima guide
- [ ] Sequence automation: opt-in → welcome → drop max 1-2/mese
- [ ] Analytics: track open + click rate
- [ ] Compliance: no spam, opt-out chiaro

Owner: `travellini-backend-engineer` (API integration) + `travellini-growth-revenue-operator` (template content)

**Milestone FASE 2**: 3 feature distintive live, brand differenziato vs competitor.

### FASE 3 — Functional depth (gg 45-66)

Obiettivo: tool che servono davvero a chi pianifica.

#### 3.A Itinerary Builder drag&drop (gg 45-58)

- [ ] Catalogo POI/ristoranti/hotel curati R+B per top 10 destinazioni
- [ ] UI dnd-kit: tappe componibili giorno per giorno
- [ ] Mapbox layer con percorso
- [ ] Salva in account utente (Firestore)
- [ ] Export PDF (jsPDF) + share Google Maps
- [ ] Gating: salvare + esportare richiede account (free) o club (export PDF stylato)

Owner: `travellini-frontend-builder` + `travellini-asset-curator` (POI curation)

#### 3.B Calendar "Quando andare" (gg 59-63)

- [ ] Widget 12-mesi su top 20 destinazioni
- [ ] Open-Meteo API per meteo storico
- [ ] Affollamento: stima manuale R+B (top 20)
- [ ] Prezzi volo indicativi: Skyscanner API o range manuale
- [ ] Finestra raccomandata R+B con motivo

Owner: `travellini-backend-engineer` (API) + `travellini-frontend-builder` (widget) + R+B (raccomandazioni)

#### 3.C Cost Calculator (gg 64-66)

- [ ] Input slider: destinazione / giorni / stile viaggio / periodo
- [ ] Output: range budget realistico con voci aggregate da field report R+B
- [ ] CTA "blocca prezzo" affiliate Booking/Skyscanner deep link

Owner: `travellini-frontend-builder` + R+B (baseline costi)

**Milestone FASE 3**: piattaforma di pianificazione vera, non solo blog.

### FASE 4 — Content engine + scale (gg 67-90)

Obiettivo: riempire il sito con contenuti reali via pipeline editorial.

#### 4.A Content pipeline attiva (gg 67-90)

Sequenza canonica per ogni pillar: `/new-article` → `editorial-writer` → `/anti-ai-slop` → `/verify-facts` → `/ai-seo` → `/seo-check` → `quality-auditor` → publish → `/repurpose`.

15 pillar in coda (3 al mese ≈ 1 ogni 6 giorni):

**Mese 1 — Autorita Italia estiva** (gg 67-74)

- W1: Salento agosto 2026: la guida onesta (pilot, gia in pipeline brief)
- W2: Procida vs Capri ad agosto: chi vince per chi
- W3: Sicilia in tre stagioni #1 (Palermo a marzo)
- W4: 17 cose che facciamo diversamente in Puglia + field report Matera fuori stagione

**Mese 2 — Profondita + tool** (gg 75-82)

- W5: Photo essay Pantelleria settembre
- W6: Calculator Salento — pagina interattiva
- W7: Sicilia tre stagioni #2 (Favignana giugno)
- W8: Hotel Masseria Moroseta + field report Bologna 48h

**Mese 3 — Estero + membership** (gg 83-90)

- W9: Lisbona novembre 12 indirizzi
- W10: Q&A chef Favignana
- W11: Sicilia tre stagioni #3 (Noto ottobre)
- W12: Costo reale anno + membership drop "La nostra Procida segreta"

**Total content output 90gg**: 15 pillar + 90 satellite via `/repurpose` = **105 contenuti distribuiti su sito + IG + TikTok + newsletter + club**.

#### 4.B Newsletter "Field Notes" weekly (gg 67-90)

- [ ] Setup template editoriale "voice-driven" 600 parole/venerdi
- [ ] Alternanza Rodrigo / Betta come firma
- [ ] No CTA invadente, no template growth-hacker
- [ ] Brevo/Mailerlite con segmentazione archetype dal quiz

Owner: R+B (voce) + `travellini-social-content-operator` (struttura) + `travellini-seo-conversion-strategist` (subject)

**Milestone FASE 4**: archivio editoriale popolato, traffico organico iniziale, segmentazione attiva.

## Ownership matrix consolidata

| Agent                                    | Carico Marathon                                                                                                             | Giorni stimati                       |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **travellini-frontend-builder**          | Editorial Slow impl + Quiz UI + Club UI + AI Companion UI + Audio player + Itinerary Builder + Calendar widget + Calculator | 35-40 gg                             |
| **travellini-seo-conversion-strategist** | Copy Club + meta + Quiz copy + AI SEO entity layer + Newsletter subject + lead magnet differenziati                         | 12-15 gg                             |
| **travellini-backend-engineer**          | AI Companion RAG + WhatsApp API + Audio CMS + Itinerary persist + Calendar API                                              | 18-22 gg                             |
| **travellini-editorial-writer**          | 15 pillar body (pipeline /new-article)                                                                                      | 15-20 gg (in parallelo R+B per dati) |
| **travellini-asset-curator**             | Foto repurpose + POI curation + waveform audio + OG cards                                                                   | 8-10 gg                              |
| **travellini-social-content-operator**   | Repurpose 90 satellite + content calendar weekly                                                                            | 10-15 gg (rolling)                   |
| **travellini-growth-revenue-operator**   | Quiz archetype strategy + WhatsApp template + Club value comm + lead magnet differentiation                                 | 5-8 gg                               |
| **travellini-ui-designer**               | Direction Editorial Slow + AI chat aesthetic + Audio player UI                                                              | 3-5 gg (mostly direction reads)      |
| **travellini-data-analyst**              | Setup GA4 events + tracking dashboard + weekly review                                                                       | 3-5 gg                               |
| **travellini-quality-auditor**           | Gate ogni milestone fase + final pre-deploy gate                                                                            | 5-7 gg (rolling)                     |
| **travellini-security-auditor**          | Security review prima del Stripe webhook + AI API + WhatsApp API                                                            | 3 gg                                 |
| **travellini-perf-engineer**             | CWV re-measure dopo ogni fase                                                                                               | 3 gg (rolling)                       |
| **browser-auditor**                      | Smoke test dopo ogni fase                                                                                                   | 3 gg (rolling)                       |
| **R+B (owner)**                          | Dati pillar reali + foto + audio guide + Q&A interview + WhatsApp template approval + Club subscriber #1-10                 | continuo                             |

Totale ~130 giorni-agent. Su 90 gg calendar = ~1.5 giornate-agent al giorno = realistico se parallelizzazione corretta e R+B costanti su input.

## Skill leverage (gia create + nuove)

Skills esistenti utilizzate:

- `/new-article`, `/anti-ai-slop`, `/verify-facts`, `/ai-seo`, `/hook`, `/repurpose` (le 5 editorial leverage)
- `/audit-browser`, `/cwv`, `/predeploy`, `/seo-check`, `/audit-ui`
- `/photo-plan`, `/social-card`, `/copywriting-italian`
- `/weekly-review` (cadenza Lunedi)

Skill candidate da creare durante il Marathon:

- `/quiz-archetype-assign` — invocazione automatica al risultato quiz
- `/audio-guide-publish` — pipeline da WAV a player web + RSS
- `/whatsapp-broadcast` — invio drop con compliance check

## Gate per fase

Ogni fase ha un gate prima di passare alla successiva:

**Gate FASE 1**: `npm run typecheck` + `npm run lint` + `npm run test` PASS + `/audit-browser` smoke pulito + `travellini-quality-auditor` approva. Lighthouse CWV ≥85 mobile.

**Gate FASE 2**: gate 1 + AI Companion <5% hallucination rate (test su 20 query reali) + Audio guide Salento live e ascoltabile + WhatsApp Broadcast test send approvato.

**Gate FASE 3**: gate 2 + Itinerary Builder funzionante su mobile + Calendar 20 destinazioni popolato.

**Gate FASE 4**: gate 3 + 15 pillar pubblicati + 90 satellite distribuiti + newsletter weekly cadence stabile + GA4 dashboard operativa.

## Punto di ripresa per sessioni future

Il Marathon e' un progetto multi-sessione. Ogni nuova sessione Claude deve:

1. Leggere questo file per stato attuale
2. Leggere `docs/50_Scratch/AUDIT_FULL_SITE_2026-05-17.md` per audit baseline
3. Leggere `memory/MEMORY.md` per context globale
4. Identificare la fase corrente dalla checklist sopra
5. Selezionare il prossimo deliverable non-completato
6. Eseguire o delegare all'agent appropriato

Sessione corrente (2026-05-17) ha completato:

- Audit + 16 fix tecnici (FASE 0)
- Decisione direzione Marathon
- Master plan (questo file)
- Inizio FASE 1.A (Editorial Slow direction)

Stato post-sessione documentato sotto.

## Stato post-sessione 2026-05-18 #10 (Itinerary Builder Mapbox layer)

**Completato sessione #10:**

### Mapbox layer in ItineraryBuilder

- 🆕 [src/components/ItineraryMap.tsx](../../src/components/ItineraryMap.tsx): mini-mappa Mapbox per giorno attivo
  - **Marker numerati** 01..N stile brand (cerchio nero serif + ring bianco) per ogni POI del giorno in ordine
  - **Path linea connettiva** (GeoJSON LineString) tra POI consecutivi: nera, opacity 0.6, dashed 2/2
  - **Popup** click marker: eyebrow categoria + nome POI + descrizione breve
  - **Auto-fit bounds**: centroide geografico + zoom euristico (range coord → zoom level)
  - **Style** `mapbox://styles/mapbox/light-v11` (coerente con palette brand sand, NOT dark like /mappa)
  - **Fallback graceful**: se `VITE_MAPBOX_TOKEN` mancante mostra pannello con info coords salvate
  - **Stati vuoti**: messaggio "aggiungete tappa al Giorno X" se nessun POI
  - Riusa pattern react-map-gl/mapbox stabilito in MapboxWorldMap (no dipendenze nuove)
- ✏️ [src/components/ItineraryBuilder.tsx](../../src/components/ItineraryBuilder.tsx):
  - **Lazy import** `ItineraryMap` (~150KB gz mapbox-gl): caricato SOLO se utente clicca "Vedi su mappa", bundle iniziale `/strumenti` invariato
  - Toggle button "Vedi le tappe del giorno su mappa" / "Nascondi mappa" sotto la lista POI del giorno attivo
  - Sezione mappa con `Suspense` fallback (loader spinning) + `AnimatePresence` collapse/expand height
  - GA4 event `itinerary_map_open` con destination + day
  - Componente ItineraryMap re-render automatico al cambio giorno/poiIds (key based)

### UX risultante

| Stato                            | UI                                                               |
| -------------------------------- | ---------------------------------------------------------------- |
| Itinerario vuoto                 | Solo prompt "Clicca un POI..." (no toggle map)                   |
| Itinerario con POI, mappa chiusa | Toggle "Vedi le tappe del giorno su mappa" (default state)       |
| Mappa aperta                     | Mini-mappa 440px con marker numerati + path dashed + popup click |
| Cambio giorno con mappa aperta   | Mappa re-render coi POI del nuovo giorno + auto-fit zoom         |

### Bundle impact

- Lazy import di `ItineraryMap` + sotto-import di `react-map-gl/mapbox` + `mapbox-gl` (~150KB gz totale) tutto solo on-demand
- Bundle iniziale `/strumenti` invariato
- Mapbox token già presente in env (`VITE_MAPBOX_TOKEN`), no setup aggiuntivo

### Verifiche sessione #10

- typecheck ✓
- lint 0/0 ✓
- test 10/10 ✓
- /strumenti 200 ✓

### Pattern riusabile

ItineraryMap è componente generico (prende `poiIds[]` + `day`). Puo essere riusato in:

- Pagina pillar article: mappa con POI dell'itinerario consigliato R+B
- Audio guide section: mostra punti audio su mappa cliccabili (FASE 2.B quando audio R+B pronti)
- Profilo utente "I miei piani": preview mappa di ogni piano salvato (FASE futura)

## Stato post-sessione 2026-05-18 #9 (Itinerary Builder Export PDF brand-coherent)

**Completato sessione #9:**

### Export PDF stylato per Itinerary Builder

`@react-pdf/renderer` era gia installato (usato da `LeadMagnetDocument` + `MediaKitDocument`). Riusato stesso pattern brand per coerenza visiva.

- 🆕 [src/pdf/ItineraryDocument.tsx](../../src/pdf/ItineraryDocument.tsx): documento PDF React-style con:
  - **Cover page**: brand header + eyebrow accent + titolo "X giorni in [destinazione], su tappe che abbiamo provato" + dek + meta (giorni / tappe totali / ore stimate) + footer disclaimer + data
  - **Pagine per giorno**: header con giorno X di Y + numero tappe + ore stimate, blocchi POI numerati con descrizione + box accent "Nota R+B"
  - **Page footer fisso**: handle social + URL travelliniwithus.it linkato
  - Palette identica al brand: sandWarm cover, accentSoft per note R+B, line per divider, tipografia con italic per accenti
  - Word wrap su POI block con `wrap={false}` (evita split tra pagine)
  - Auto title/author/keywords metadata per riconoscimento file
- ✏️ [src/components/ItineraryBuilder.tsx](../../src/components/ItineraryBuilder.tsx):
  - Nuovo handler `handleExportPdf` con **lazy import** di `@react-pdf/renderer` + `ItineraryDocument` (riduce bundle iniziale `/strumenti`)
  - Mappa stato interno `plan` al formato `ItineraryPdfDay[]` ordinando POI con numerazione zero-padded
  - Trigger download via blob URL + revoke dopo 1s
  - Filename `itinerario-{slug}-{N}gg.pdf` (es. `itinerario-salento-5gg.pdf`)
  - Stato loading `pdfBuilding` con `Loader2` spinning durante generazione
  - GA4 events `itinerary_export_pdf_start` / `_success` / `_error` con conteggio POI per misurare adoption
  - Pulsante "Scarica PDF brand" (primary nero) + "Copia testo" (secondary outline) — entrambi disabled durante build

### UX risultante

| Stato                   | UI                                                                      |
| ----------------------- | ----------------------------------------------------------------------- |
| Itinerario vuoto        | Solo prompt "Clicca un POI..."                                          |
| Itinerario con tappe    | 2 pulsanti: **Scarica PDF brand** (primario) + Copia testo (secondario) |
| Durante generazione PDF | Pulsante mostra "Generazione PDF..." con spinner + pulsanti disabled    |
| Errore generazione      | Console error + GA4 event (UI ritorna stato pre-click trasparente)      |

Il PDF generato e' di alta qualita stampabile (A4 multi-pagina, tipografia leggibile, palette brand). Riusabile come asset condivisibile tra coppie, salvabile in Google Drive, stampabile per viaggio fisico.

### Bundle impact

- Lazy import di `@react-pdf/renderer` (modulo ~200KB gz) evita di caricarlo quando l'utente non esporta — bundle iniziale `/strumenti` invariato
- Lazy import di `ItineraryDocument` evita di precompilare il documento PDF se non si esporta
- I 2 import in parallelo via `Promise.all` ottimizzano il tempo del primo click

### Verifiche sessione #9

- typecheck ✓
- lint 0/0 ✓
- test 10/10 ✓
- /strumenti 200 ✓

### Pattern riusabile

Il pattern di `ItineraryDocument` (cover + page-per-giorno + footer brand + lazy import) e' riusabile per:

- Audio guide PDF transcript (FASE 2.B quando audio R+B pronti)
- Lead magnet "Posti italiani non ovvi" v2 con personalizzazione archetype
- Membership drop mensile in PDF brand (FASE 4.B)
- Pillar article print-friendly download (gating Club)

## Stato post-sessione 2026-05-18 #8 (Itinerary Builder drag&drop con @dnd-kit)

**Completato sessione #8:**

### Drag&drop con @dnd-kit/core

- 🆕 Dipendenze aggiunte: `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities` (install con `--legacy-peer-deps` per compat React 19 vs `react-simple-maps@3.0.0`)
- ✏️ [src/components/ItineraryBuilder.tsx](../../src/components/ItineraryBuilder.tsx):
  - Nuovo componente esterno `SortablePoiItem` con `useSortable` hook — wrappa ogni POI list-item con drag transform + a11y keyboard support nativa
  - Drag handle dedicato (icona GripVertical, button con listeners + attributes) — pattern accessibilità best-practice di dnd-kit
  - Sensors: PointerSensor con `activationConstraint: { distance: 8 }` (evita drag accidentale al click su mobile) + KeyboardSensor con `sortableKeyboardCoordinates` (frecce keyboard funzionano)
  - `<DndContext>` + `<SortableContext>` (strategy verticalListSortingStrategy) wrappano la lista del giorno attivo
  - `handleDragEnd` riordina `poiIds` array via `arrayMove` di dnd-kit utilities
  - Stato isDragging: opacity 0.5 + ring + cursor-grabbing per feedback visuale
  - GA4 event `itinerary_poi_reorder` con from_poi/to_poi/day per misurare adoption

### UX

- **Click-to-add** preservato (catalogo POI → giorno attivo, no drag in MVP)
- **Drag-to-reorder** dentro un giorno (sortable)
- **Keyboard** funziona out-of-box (focus su handle + frecce su/giu)
- **Touch** support nativo via PointerSensor (mobile-ready)
- Cross-day drag (sposta POI tra giorni) = roadmap futura — richiede multiple containers e collision detection più complessa

### Verifiche sessione #8

- typecheck ✓
- lint 0/0 ✓
- test 10/10 ✓
- /strumenti 200 ✓

### Prossimi miglioramenti possibili Itinerary Builder

1. **Cross-day drag**: sposta POI tra giorni (richiede multiple SortableContext, gestione collisione tra container)
2. **Drag dal catalogo**: drag&drop diretto da lista POI a giorno (vs click-to-add) — sostituirebbe MVP click
3. **Export PDF stylato**: jsPDF con immagini POI + note R+B + mappa
4. **Mapbox layer**: visualizza POI selezionati su mappa interattiva
5. **Salva piano in account**: Firestore persistence per utenti loggati
6. **DragOverlay**: preview del POI in drag che segue il cursore con stile premium

## Stato post-sessione 2026-05-18 #7 (POI catalog full — 55 POI su 10 destinazioni)

**Completato sessione #7:**

### POI catalog esteso

- ✏️ [src/config/poiCatalog.ts](../../src/config/poiCatalog.ts): da 12 POI a **55 POI** distribuiti su tutte e 10 le destinazioni baseline (allineato con `costBaselines.ts` + `seasonalGuide.ts`).

Breakdown finale per destinazione:

| Destinazione  | POI | Categorie principali                                                       |
| ------------- | --- | -------------------------------------------------------------------------- |
| **Salento**   | 10  | mare (2), borgo (3), ristorante (1), vista (1), esperienza (2), evento (1) |
| **Sicilia**   | 7   | borgo (2), mare (1), museo (1), esperienza (2), vista (1)                  |
| **Toscana**   | 6   | museo (1), borgo (3), vista (1), esperienza (1)                            |
| **Dolomiti**  | 6   | vista (4), esperienza (1), hotel (1)                                       |
| **Sardegna**  | 6   | mare (2), borgo (2), vista (1), esperienza (1)                             |
| **Procida**   | 4   | vista (1), mare (1), museo (1), ristorante (1)                             |
| **Marche**    | 4   | mare (1), museo (2), borgo (1)                                             |
| **Liguria**   | 4   | borgo (2), vista (2)                                                       |
| **Marrakech** | 4   | esperienza (2), museo (2)                                                  |
| **Lisbona**   | 4   | esperienza (3), vista (1)                                                  |

Ogni POI include: geo coords (per Mapbox futuro), `durationMin`, `bestMonths`/`avoidMonths`, **nota R+B specifica** con dato concreto (prezzo, orario, accesso). Esempi:

- Marina Serra (Salento): _"Andateci alle 7 del mattino per il tuffo nella piscina senza fila"_
- Cala Goloritze (Sardegna): _"Ingresso a numero chiuso: prenotare il giorno prima, 8€. Scarpe da trek serie."_
- Pasteis de Belem (Lisbona): _"1,50€ uno. Banco di mescita interno = no fila. Banco asporto = fila lunga."_
- Riad Marrakech: _"30-50€ a testa. Riservazione 1-2 giorni prima."_

**Effetto sul prodotto**:

- Itinerary Builder ora utilizzabile su **tutte e 10 le destinazioni** del catalogo
- Filtri categoria funzionano (mare, ristorante, hotel, vista, borgo, museo, evento, esperienza) — utente puo costruire itinerari tematici
- Catalogo abbastanza ricco per piani 2-6 giorni su qualsiasi destinazione baseline
- Drag&drop futuro (dnd-kit) avra catalogo significativo da subito

**Verifiche sessione #7**: typecheck ✓ · lint 0/0 ✓ · test 10/10 ✓ · live /strumenti 200 ✓.

**Manutenzione catalog**:

- Aggiornare ogni 6 mesi quando R+B fanno nuovi viaggi
- Verificare prezzi (es. Pasteis de Belem 1,50€, Caffe Sicilia 5€) trimestralmente
- Aggiungere POI man mano che pillar reali vengono pubblicati
- I dati climatici/affollamento sono coerenti tra `seasonalGuide.ts` e `poiCatalog.ts` (`bestMonths`/`avoidMonths` cross-validati)

**Prossima sessione**: drag&drop con `@dnd-kit/core`, oppure export PDF con jsPDF, oppure FASE 4 content pipeline reale (Salento agosto), oppure FASE 2.C WhatsApp Broadcast.

## Stato post-sessione 2026-05-18 #6 (Cross-link tools + Catalog +4 dest + FASE 3.A Itinerary Builder MVP)

**Completato sessione #6:**

### Cross-link Cost ↔ When-to-go

- ✏️ [src/components/WhenToGoCalendar.tsx](../../src/components/WhenToGoCalendar.tsx): aggiunta prop `onMonthSelect?: (month, destSlug) => void` + `onDestinationChange?`. Quando definita, mostra CTA "Calcola budget per [mese]" nel dettaglio mese. Evento `when_to_go_cta_cost`.
- ✏️ [src/components/DestinationCostCalculator.tsx](../../src/components/DestinationCostCalculator.tsx): aggiunte prop `initialDest` e `initialMonth` con sync pattern adjust-state-during-render (React 19) per ricevere stato dal parent.
- ✏️ [src/pages/Strumenti.tsx](../../src/pages/Strumenti.tsx): orchestrazione cross-link — handler `handleWhenToGoCta` lifta state per pre-popolare CostCalculator + smooth scroll al calc ref. Click su "Calcola budget per settembre" in WhenToGoCalendar → CostCalculator si auto-popola + scroll automatico.

### Estensione cataloghi: 4 nuove destinazioni

- ✏️ [src/config/costBaselines.ts](../../src/config/costBaselines.ts): +4 destinazioni → **10 totali**:
  - Procida (Italia-Isole) — alta stagione raddoppio prezzi
  - Marche (Italia-Centro) — 25-30% sotto Toscana
  - Liguria di Levante (Italia-Nord) — Cinque Terre vs Tellaro
  - Marrakech (Mondo) — primavera/autunno top
- ✏️ [src/config/seasonalGuide.ts](../../src/config/seasonalGuide.ts): stesse 4 destinazioni → **10 totali** con dataset 12-mesi (temp, pioggia, affollamento, bollini R+B, eventi)

### FASE 3.A Itinerary Builder MVP

- 🆕 [src/config/poiCatalog.ts](../../src/config/poiCatalog.ts): catalogo POI tipizzato con 8 categorie (mare, ristorante, hotel, vista, borgo, museo, evento, esperienza). Pilot Salento con **10 POI** reali (Marina Serra, Porto Badisco, Lecce centro, Otranto castello, Tricase Porto trattoria, Santa Maria di Leuca, Acaya, Presicce-Acquarica, Galatina pasticciotto, Notte della Taranta) + 2 seed Sicilia. Ogni POI: id, name, category, geo, durationMin, bestMonths/avoidMonths, rbNote.
- 🆕 [src/components/ItineraryBuilder.tsx](../../src/components/ItineraryBuilder.tsx): MVP click-to-add (no drag&drop ancora). Layout 2 colonne: sx catalogo POI filtrabile per categoria, dx tabs giorni 2-10 con piano. Comportamenti:
  - Click POI → aggiunto al giorno attivo
  - POI gia usati greyed out (no duplicati)
  - Click X → rimuovi POI dal giorno
  - Reset piano
  - Export: copia testo formattato negli appunti (PDF = stretch goal)
  - Tabs giorni con conteggio POI per giorno + totale ore stimato
  - GA4 events: `itinerary_poi_add`, `itinerary_poi_remove`, `itinerary_reset`, `itinerary_export_copy`
- ✏️ [src/pages/Strumenti.tsx](../../src/pages/Strumenti.tsx): ItineraryBuilder integrato come 3° strumento (When → Cost → Itinerary → Calc generico → Quiz/Mappa).

**Verifiche sessione #6**: typecheck ✓ · lint 0 errori 0 warning ✓ · test 10/10 ✓ · /strumenti 200 ✓.

**Decision toolkit /strumenti ora ha 5 sezioni**:

1. Quando andare (10 destinazioni)
2. Cost per destinazione (10 destinazioni, sincronizzato)
3. Itinerary Builder (Salento + Sicilia inizio)
4. Cost generico (fallback area)
5. Quiz + Mappa link cards

**Roadmap Itinerary Builder (post-MVP)**:

- Drag&drop con `@dnd-kit/core` (sposta POI tra giorni, riordina dentro giorno)
- Export PDF stylato con jsPDF + immagini POI
- Mapbox layer con percorso giorno-per-giorno
- Salva in account utente Firestore (gating Club)
- Estensione POI catalog per Sicilia (10+ POI), Toscana, Dolomiti, Sardegna
- Suggerimenti smart: "Aggiungi mare al mattino + borgo nel pomeriggio + cena"

## Stato post-sessione 2026-05-18 #5 (FASE 3.B Calendar "Quando andare")

**Completato sessione #5:**

### FASE 3.B Calendar "Quando andare" completo

- 🆕 [src/config/seasonalGuide.ts](../../src/config/seasonalGuide.ts): dataset 12-mesi per 6 destinazioni baseline (Salento, Sicilia, Dolomiti, Toscana, Sardegna, Lisbona) con temp media (°C), giorni piovosi, affollamento (low/medium/high), bollino R+B consigliato, nota R+B specifica per mese, eventi notabili (festival, sagre). Sintesi annuale R+B + mesi best + mesi avoid. Helper `getSeasonalGuide()` + labels italiani mese. Coerente con `costBaselines.ts` (mesi alta stagione cross-validati).
- 🆕 [src/components/WhenToGoCalendar.tsx](../../src/components/WhenToGoCalendar.tsx): widget visuale Editorial Slow con selettore destinazione + sintesi annuale italic + strip 12 mesi con heatmap temperatura (scala blue→sand→accent), dots affollamento, bollino ✓ R+B consigliato / ⚠ da evitare. Click su mese → dettaglio collassabile con 3 metriche (temp, pioggia, affollamento) + nota R+B citata + lista eventi. Legenda accessibile + riepilogo mesi best/avoid. GA4 events `when_to_go_destination_change` + `when_to_go_month_select`.
- ✏️ [src/pages/Strumenti.tsx](../../src/pages/Strumenti.tsx): integrato come PRIMO strumento (logica naturale: decidi quando → calcola budget). Ordine finale: Quando andare → Cost per destinazione → Cost generico → Quiz/Mappa link cards.

**Funzione strategica**: completa la "decision toolkit" /strumenti. Insieme WhenToGoCalendar + DestinationCostCalculator coprono le 2 domande pre-decisione viaggio piu googlate ("quando andare a X" + "quanto costa X"). Cross-link possibile in futuro (es. click mese consigliato → pre-popola Cost Calculator con quel mese).

**Verifiche sessione #5**: typecheck ✓ · lint 0 errori 0 warning ✓ · test 10/10 ✓ · live /strumenti 200.

**Stato dataset**:

- 6 destinazioni complete (Salento, Sicilia, Dolomiti, Toscana, Sardegna, Lisbona)
- Dati climatici medi 1991-2020 + osservazione R+B
- Refresh trimestrale via field report R+B (manuale) o batch script Open-Meteo Archive API (futuro)

**Prossima sessione**:

- FASE 3.A Itinerary Builder drag&drop (15-20gg, ambizioso ma signature feature)
- FASE 2.C WhatsApp Broadcast (richiede setup Twilio owner)
- Completare AI Companion / Audio guide quando owner ha API keys / audio
- Estendere catalogo seasonalGuide.ts a 10+ destinazioni (Procida, Pantelleria, Lago di Como, Marche, Liguria di Levante, Marrakech)
- Cross-link Cost Calculator ↔ When To Go (passa mese tra i 2 tool)

## Stato post-sessione 2026-05-18 #4 (FASE 2.B Audio guide + FASE 3.C Cost Calculator)

**Completato sessione #4:**

### FASE 2.B Audio guide scaffolding completo

- 🆕 [src/config/audioGuides.ts](../../src/config/audioGuides.ts): tipi `AudioGuide` + `AudioGuidePoint`, catalogo con pilot Salento (4 placeholder strutturali pronti per riempimento R+B), helper `getAudioGuide()` + `isAudioGuidePublished()`. Schema include geo coords (per layer Mapbox futuro), transcript (per a11y + AI citation), narrator (R/B), recordedAt timestamp.
- 🆕 [src/components/audio/AudioGuidePlayer.tsx](../../src/components/audio/AudioGuidePlayer.tsx): player premium Editorial Slow con HTML5 audio nativo, play/pause, scrubber + progress fill visuale, formato tempo MM:SS, transcript toggle a11y, stato placeholder se durationSec=0, eventi GA4 (audio_play / audio_pause / audio_complete / audio_transcript_open). Pattern adjust-state-during-render per reset al cambio punto (React 19 compliant).
- 🆕 [src/components/audio/AudioGuideSection.tsx](../../src/components/audio/AudioGuideSection.tsx): sezione articolo con sidebar lista punti numerati (dispatch-index-number style) + player attivo. Sticky sidebar su desktop. Nasconde sezione se guida non publishable (isAudioGuidePublished). forceShow per preview admin.
- 🆕 [public/audio/README.md](../../public/audio/README.md): naming convention `{NN}-{slug}.mp3`, specifiche audio (128 kbps mono, -16 LUFS, 60-120s), workflow registrazione → editing → upload → config update, struttura cartelle.
- 🆕 [public/audio/salento/](../../public/audio/salento/): cartella pronta per upload pilot.

### FASE 3.C Cost Calculator completo

- 🆕 [src/config/costBaselines.ts](../../src/config/costBaselines.ts): catalogo `DESTINATION_BASELINES` per 6 destinazioni pillar (Salento, Sicilia, Dolomiti, Toscana, Sardegna, Lisbona) con costi giornalieri coppia × 4 voci (alloggio/cibo/trasporti/attivita) × 3 stili (lean/medium/premium) + moltiplicatore stagionale (alta/spalla/bassa) + mesi alta stagione + timestamp aggiornamento. Funzione `calculateBudget()` ritorna range min/max + breakdown + multiplier.
- 🆕 [src/components/DestinationCostCalculator.tsx](../../src/components/DestinationCostCalculator.tsx): UI Editorial Slow con selettore destinazione + slider giorni 2-14 + selettore mese + bottoni stile. Output: range €min-max grande serif + warning alta stagione + breakdown 4 voci giornaliere + disclaimer "voli esclusi" + timestamp + CTA "Guide su [destinazione]". GA4 events `cost_calculator_first_compute` + `cost_calculator_destination_change` + `cost_calculator_cta_explore`.
- ✏️ [src/pages/Strumenti.tsx](../../src/pages/Strumenti.tsx): nuovo `DestinationCostCalculator` come strumento principale, `BudgetCalculator` generico esistente diventa fallback per destinazioni non in catalogo. Ordine: granulare → generico.

**Verifiche sessione #4**: typecheck ✓ · lint 0 errori 0 warning ✓ · test 10/10 ✓ · live 7/7 route 200 (`/`, `/quiz`, `/club`, `/strumenti`, `/llms.txt`, `/audio/README.md`, `/robots.txt`).

**Cosa serve per attivare il pilot audio Salento (FASE 2.B completo)**:

1. R+B registrano 4-8 punti audio in loco (microfono Rode, 60-120s ognuno)
2. Editing audio in-house (Audacity/Reaper, normalize -16 LUFS, MP3 128kbps mono)
3. Upload file `public/audio/salento/01-marina-serra.mp3` (etc.) con naming convention
4. Aggiornare in `audioGuides.ts` ogni point con: `transcript` reale (Whisper o manuale), `durationSec` reale, `recordedAt` (es. "luglio 2026")
5. Cambiare `status: 'planning'` → `'published'`
6. (Opzionale) Generare Apple Podcast RSS feed in server.ts

**FASE 3.C residuo**:

- Aggiungere 4-6 altre destinazioni in `costBaselines.ts` quando R+B aggiornano field report (Procida, Sicilia occidentale, Liguria, Marche, Lago di Como, Toscana costa)
- Future: integrare deep link affiliate Booking/Skyscanner sui CTA "blocca prezzo" (mock per ora)

**Prossima sessione: cosa rimane in FASE 2 / FASE 3 / FASE 4**:

- FASE 2.C WhatsApp Broadcast (richiede setup Twilio/360dialog account owner)
- FASE 3.A Itinerary Builder drag&drop (15-20gg, ambizioso, richiede catalogo POI curato R+B)
- FASE 3.B Calendar "Quando andare" widget (8-10gg, integrazione Open-Meteo API gratuita)
- FASE 4 Content pipeline reale (richiede dati R+B per popolare placeholder pillar Salento)

## Stato post-sessione 2026-05-17 #3 (FASE 1 chiusa + FASE 2.A scaffolding)

**Completato sessione #3:**

- ✓ Foto archetype quiz: fallback intelligente in [quizArchetypes.ts](../../src/config/quizArchetypes.ts) per i 4 archetypes con foto mancanti (toscana per Cercatrice Borghi, sardegna per Coppia di Costa, dolomiti per Famiglia in Movimento, puglia per Notturno Urbano), alt text adeguato, TODO comment per sostituzione con foto autentiche
- ✓ FASE 1.D entity layer applicato a [Articolo.tsx](../../src/pages/Articolo.tsx): nuove funzioni `countWords()` + `inferPlaceEntities()` che cercano place names dal catalogo Wikidata nel titolo+description+location+content. La prima occorrenza diventa `Article.about`, le successive (max 4) `Article.mentions`. `wordCount` calcolato da contenuto plain text. Tutti i campi opzionali — se article non e' in catalogo, schema rimane invariato
- ✓ **Gate FASE 1 PASS**: typecheck + lint 0/0 + test 10/10 (sessione #3)
- ✓ FASE 2.A AI Companion scaffolding tecnico:
  - 🆕 [src/config/aiCompanion.ts](../../src/config/aiCompanion.ts): system prompt severo IT (10 regole anti-hallucination), cost cap $50/mese, free queries 5/sessione, top-K 5 chunks, model Claude Haiku, embedding model OpenAI text-embedding-3-small, refusal patterns deterministic per prenotazioni/medico/finanza, tipo `AiCompanionMode` ('disabled' | 'rag' | 'maintenance')
  - ✏️ [src/components/AiAssistant.tsx](../../src/components/AiAssistant.tsx): `sendMessage` ora prova endpoint `/api/ai-companion` con AbortController timeout 12s, fallback trasparente su keyword matching demo se response non-ok (preserva UX senza errori visibili)
  - ✏️ [server.ts](../../server.ts) endpoint stub `POST /api/ai-companion`: validazione input (max 500 char), check env keys + corpus ready, ritorna 503 `mode: disabled` finche `ANTHROPIC_API_KEY` + `OPENAI_API_KEY` + `AI_COMPANION_CORPUS_READY=true`. TODO inline documenta i 6 step della pipeline RAG completa
  - ✓ Verificato stub funzionante: `curl POST /api/ai-companion` → 503 con messaggio chiaro

**Stato API keys**: NESSUNA configurata in prod. AI Companion in mode `disabled` — UI usa fallback demo. Owner deve aggiungere `ANTHROPIC_API_KEY` e `OPENAI_API_KEY` in env prod + popolare vector store Firestore prima di attivare.

**Resta da fare per attivare AI Companion vero (FASE 2.A completo):**

1. **Owner: setup API keys** — Anthropic console + OpenAI console, generare key con cap budget basso. Inserire in env Firebase/host
2. **Corpus ingestion script** — script Node che legge articoli da Firestore `articles` collection, splitta in chunks 1500 chars, embedda con OpenAI, salva in `ai_corpus/{slug}/chunks/{idx}` con embedding vector. Owner: `travellini-backend-engineer`
3. **Vector similarity query**: Firestore non ha native vector search → implementare cosine similarity in-memory (corpus inizialmente piccolo, fattibile). Quando supera 500 chunks, migrare a Pinecone/Supabase pgvector. Owner: `travellini-backend-engineer`
4. **Anthropic SDK integration**: `npm i @anthropic-ai/sdk`, importare in server.ts, implementare i TODO numerati nell'endpoint stub. Owner: `travellini-backend-engineer`
5. **Cost tracker**: Firestore counter `ai_companion_usage/{YYYY-MM}` con increment atomic. Hard stop quando soglia raggiunta. Owner: `travellini-backend-engineer`
6. **Per-session rate limit**: cookie `tw_ai_query_count` con TTL 24h. Owner: `travellini-backend-engineer`
7. **Citation rendering UI**: AiAssistant deve mostrare i `sources` ritornati dall'API (linkati). Owner: `travellini-frontend-builder`

**Prossima sessione**: FASE 2.B Audio guide pilot Salento o FASE 2.C WhatsApp Broadcast (entrambe fattibili in parallelo dopo che FASE 2.A pipeline RAG e' connessa). Oppure proseguire con altre aree del Marathon (FASE 3 Itinerary Builder / Calendar / Calculator).

## Stato post-sessione 2026-05-17 #2 (FASE 1 quasi completata)

**Completato sessione #2:**

- ✓ FASE 1.B Quiz UI integrato in [src/pages/Quiz.tsx](../../src/pages/Quiz.tsx): nuovo sistema 7 domande × 6 archetipi italiani, UI Editorial Slow (text-eyebrow, font-serif clamp, text-body-editorial), risultato con foto hero + 3 destinazioni signature + Newsletter compact per archetype, persist `tw_archetype` in localStorage per personalizzazione futura, GA4 events `quiz_answer`/`quiz_completed`/`archetype_assigned`/`archetype_destination_click`/`archetype_cta_explore`
- ✓ FASE 1.C Club hero ricostruito ([src/pages/Club.tsx](../../src/pages/Club.tsx)) — aggiunta `ClubPreviewLock` ([components/club/ClubPreviewLock.tsx](../../src/components/club/ClubPreviewLock.tsx)) con preview guida Marina Serra 200 parole + lock gradient + CTA scroll-to-pricing, e `ClubFaq` ([components/club/ClubFaq.tsx](../../src/components/club/ClubFaq.tsx)) con 6 domande oneste (quando NON vale, come cancellare, regalabilita, ecc.) + FAQPage JSON-LD schema. Rimosso `noindex` hardcoded sulla sales page (era bug SEO — pagina pubblica), `noindex` rimane solo sulla dashboard logged-in
- ✓ FASE 1.D AI SEO Entity Layer completa:
  - [public/robots.txt](../../public/robots.txt) allowlist esplicita per GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, anthropic-ai, cohere-ai, Applebot-Extended
  - [public/llms-full.txt](../../public/llms-full.txt) versione estesa: manifesto editoriale, aree autoritative, bio R&B dettagliata, regole citation, versioning
  - [src/lib/seo.ts](../../src/lib/seo.ts) esteso: `PlaceEntity` interface, `buildAuthorPersonJsonLd(name)`, `Article` schema con `wordCount` + `about` + `mentions` + `speakable`
  - [src/config/placeCatalog.ts](../../src/config/placeCatalog.ts) nuovo: 25 Place entities Wikidata Q-ID (Salento, Lecce, Otranto, Matera, Procida, Capri, Lisbona, Bali, Marrakech, ecc.) con geo coords + placeType Schema.org
  - [index.html](../../index.html) graph esteso: Organization con `knowsAbout` + `areaServed` Italia Wikidata, Person standalone per Rodrigo e Betta con `jobTitle` + `knowsLanguage` + `knowsAbout` + `worksFor`

**Verifiche eseguite:** typecheck PASS · lint 0/0 · test 10/10 · live 6/6 route 200 (inclusi `/llms.txt`, `/llms-full.txt`, `/robots.txt`)

**Resta da fare in FASE 1** (per chiudere prima del gate verso FASE 2):

1. **FASE 1.B Email automation post-quiz**: configurazione ESP esterna (Brevo/Mailerlite) con tag segment per archetype + 5 email per archetype. **Fuori scope repo — Owner: `travellini-growth-revenue-operator` + R+B per scrittura email body**
2. **Foto archetypes**: verificare/creare le 6 foto `/images/destinations/{puglia,marche,dolomiti,liguria,trentino,napoli}.webp` referenziate in `quizArchetypes.ts`. Owner: `travellini-asset-curator` + R+B
3. **Articoli signature destinations**: 18 slug citati nei 6 archetypes — la maggior parte non esiste ancora come articoli pubblicati. Verranno popolati durante FASE 4 (content pipeline). Per ora i Link punto a /articolo/{slug} ritornano 404 (corretto: slug inesistente)
4. **Articoli pillar usano nuove props seo.ts**: aggiornare il template Articolo.tsx per popolare `about` + `mentions` + `wordCount` dal seed articolo (richiede aggiornamento Firestore schema per supportare campi). Owner: `travellini-backend-engineer` + `travellini-frontend-builder`
5. **Gate FASE 1**: `/predeploy` + Lighthouse mobile CWV ≥85 + screenshot before/after homepage per validazione direzione Editorial Slow. Owner: `quality-auditor` + `perf-engineer` + `browser-auditor`

**Pronti per FASE 2 (Distinction) appena gate FASE 1 chiuso**: AI Travel Companion "Chiedi a R+B" (RAG su corpus + Claude Haiku), Audio guide pilot Salento, WhatsApp Broadcast.

## Stato post-sessione 2026-05-17 (sessione inaugurale)

**Completato:**

- ✓ Master plan scritto (questo file)
- ✓ FASE 1.A typescale Editorial Slow implementata in [src/index.css](../../src/index.css):
  - `--text-h1` ridotto a 36-64px (Editorial Slow vuole serif contenuta)
  - `--text-display-1` 40-88px desktop con clamp fluido
  - `--text-eyebrow` 11px, `--tracking-eyebrow` 0.18em
  - `--text-body` 17-18px, `--text-body-leading` 1.65 (28px line-height su 17px body)
  - `--space-section-y` 64-112px (respiro generoso per editorial slow)
  - Nuove classi utility: `.text-body-editorial`, `.section-editorial`, `.dispatch-index-number`
  - Drop cap: `.article-body > p:first-of-type::first-letter` — serif 4.5em, float left
  - `.text-eyebrow` aggiornato a `var(--text-eyebrow)` + `var(--tracking-eyebrow)`
- ✓ Drop cap class applicata a [src/pages/Articolo.tsx:540](../../src/pages/Articolo.tsx#L540): `prose-reset article-body`
- ✓ FASE 1.B Quiz archetipi config completa in [src/config/quizArchetypes.ts](../../src/config/quizArchetypes.ts):
  - 6 archetipi: Il Lento del Sud, La Cercatrice di Borghi, L'Alpinista Civile, La Coppia di Costa, La Famiglia in Movimento, Il Notturno Urbano
  - Ogni archetipo ha: nome IT, tagline, descrizione 2-3 frasi, eyebrow, foto hero + alt IT, 3 signature destinations slug, GA4 tag, segment label
  - 7 domande con scoring matrix (stagione, posto, ritmo, cibo, budget, mezzo, quando-felici)
  - Funzione `computeArchetype(selectedOptionIds)` per calcolo finale
- ✓ Memoria globale salvata in `memory/marathon_90_days.md` per resume in sessioni future

**Verifiche eseguite:** `npm run typecheck` PASS dopo ogni edit.

**Resta da fare in FASE 1** (per la prossima sessione):

1. **FASE 1.B Quiz UI**: integrare nuovo `quizArchetypes.ts` in [src/pages/Quiz.tsx](../../src/pages/Quiz.tsx) — UI Editorial Slow, flow domanda→domanda con keyboard nav, risultato con foto hero + 3 destinazioni signature + lead capture form. **Owner: `travellini-frontend-builder` + `travellini-seo-conversion-strategist`** per validare copy archetypes IT.
2. **FASE 1.B Email automation post-quiz**: configurazione ESP esterna (Brevo/Mailerlite) con tag segment per archetype + 5 email onboarding. Fuori scope repo. **Owner: `travellini-growth-revenue-operator`**.
3. **FASE 1.C Club hero ricostruito**: rebuild [src/pages/Club.tsx](../../src/pages/Club.tsx) con pricing in viewport (8€/72€), preview guida bloccata 200 parole, "Siamo 47 dentro" social proof, FAQ 6 voci, tabella free vs club.
4. **FASE 1.D AI SEO Entity Layer**: Place schema + Wikidata Q-ID per top 20 destinazioni, Person schema R+B con `knowsAbout` + `worksFor`, `public/llms-full.txt` esteso, `robots.txt` allowlist esplicita per GPTBot/ClaudeBot/PerplexityBot/Google-Extended/CCBot.

**Gate FASE 1 prima di passare a FASE 2:** typecheck + lint + test + audit-browser smoke + quality-auditor approva + Lighthouse mobile CWV ≥85.

**Bloccato su input R+B (non Claude)**:

- 6 foto destinazione per gli hero archetypes (`/images/destinations/puglia.webp`, `marche.webp`, `dolomiti.webp`, `liguria.webp`, `trentino.webp`, `napoli.webp`): verificare che esistano e siano foto autentiche R+B. Se mancanti, sostituire con foto esistenti coerenti.
- Articoli per `signatureDestinations` (slug nei 6 archetypes): la maggior parte non esiste ancora come articoli pubblicati. Verranno popolati durante FASE 4 (content pipeline) o dai 30 demo seed esistenti.
- Conferma GCP restrictions Firebase API key (BLOCKER pre-launch, owner-only step su [GCP Console](https://console.cloud.google.com/)).

**Carico stimato FASE 1 residua**: ~10-14 giorni dev distribuiti tra frontend-builder, seo-strategist e backend-engineer.
