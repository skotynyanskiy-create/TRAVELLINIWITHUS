---
title: HANDOFF_diario-narrativo_ui-designer_to_frontend-builder
status: consumed
created: 2026-07-19
from: travellini-ui-designer
to: travellini-frontend-builder
slug: diario-narrativo
expires: 2026-08-02
type: handoff
area: delivery
---

# Handoff: variante "Diario" narrativa del template Articolo (registro emotivo sopra l'itinerario logistico)

## Why this work matters

Il funnel del sito (scopro -> vivo la storia -> esploro -> scelgo destinazione -> leggo il diario -> guardo i reel -> collaboro) ha un solo anello mancante: il "leggo il diario". Oggi da destinazione si salta dritti in logistica ("Itinerario leggibile"), senza il registro emotivo che crea affezione ed è il vantaggio del brand contro le DMO patinate.

## Decisions already made

- È una VARIANTE del template esistente `src/pages/Articolo.tsx`, NON una nuova route né una nuova pagina. Attivata da un flag di contenuto sull'articolo (es. `article.narrativeMode` / `diary: true` — nome a tua scelta, tipizzato).
- Il Diario vive SOPRA o ACCANTO all'"Itinerario leggibile" (Articolo.tsx righe ~960-988), NON lo sostituisce. Diario = "perché ci sei affezionato"; Itinerario leggibile = "come lo rifai tu". Convivono.
- Massimo 3-4 beat narrativi per pezzo. Ogni beat = un titolo concreto + una foto vera + testo breve. Niente griglia densa, niente card-in-card: ritmo magazine, calmo, foto-led.
- Vincolo di naming dei beat: titoli SPECIFICI del viaggio reale. Vietate le etichette da stock ("Partenza / Strada / Tramonto / Sosta / Arrivo"): sono cliché generici.
  - Esempio concreto (Volterra/Volturi), shape da seguire: "L'attesa dei Volturi" -> "La città alle 6 del mattino" -> "Cosa non ti dicono" -> "Se ci torni".
- Primi 2-3 articoli flagship che useranno il Diario (contenuto reale già esistente): Egitto/Mar Rosso, Volterra/Volturi, Batu Caves (Malesia).

> **CORREZIONE 2026-07-19 (post-verifica Firestore, main thread):** questa premessa era sbagliata. Verificato con `travellini-data-analyst` interrogando `articles` in Firestore: **0 dei 3 sono pubblicati**, sono solo voci del catalogo reel (`content-seed.json`, `isPlaceholder:true`, nessun corpo lungo). Il sitemap conferma: zero rotte `/articolo/` live. L'unico con un corpo redazionale scritto reale è **Burton Juice** (`src/data/articles/burton-juice-ristorante-tim-burton.seed.ts`) — ma resta bloccato, non pubblicato, perché la sua sezione recensione aspetta voto/pro/contro reali di Rodrigo & Betta (contenuto owner-only, non fabbricabile). Conseguenza operativa: costruisci e verifica il componente Diario **in isolamento**, usando il corpo narrativo reale del seed Burton Juice come fixture di sviluppo (non la sezione recensione, quella resta placeholder) — NON puntare al gate "reso su un flagship pubblicato in preview", oggi irrealizzabile. La pubblicazione di un vero articolo è un passo successivo, separato, che dipende da contenuto owner + `travellini-backend-engineer`.

- La mappa resta la MapLibre/Mapbox funzionale già presente ("Mappa del viaggio", Articolo.tsx righe ~991-1023): il Diario NON la tocca. Una eventuale mappa disegnata a mano (da asset-curator) sarà un asset editoriale DECORATIVO interno al Diario, aggiuntivo, non sostitutivo.
- Palette e materiali invariati: sand #faf8f4, terracotta #c2410c, Fraunces serif, icone lucide, foto REALI. Nessuna imagery AI.

## Context the receiver needs

- Source files: [src/pages/Articolo.tsx](src/pages/Articolo.tsx) (Itinerario leggibile righe ~960-988; Mappa del viaggio righe ~991-1023; ReviewBlock/"Il Timbro" righe ~956-958 — il Diario deve convivere anche con questo).
- Related docs: [docs/10_Projects/PROJECT_CINEMATIC_REBUILD_HOME_2026.md](docs/10_Projects/PROJECT_CINEMATIC_REBUILD_HOME_2026.md) (per capire che il "capitolo immersivo" è già la HOME e NON va duplicato), [DESIGN.md](DESIGN.md), [docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md](docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md).
- Brand / voice notes specific to this piece: il Diario è il registro caldo/personale della coppia (people-led). Copy italiano, warm ma specifico, niente buzzword ("scopri", "esplora il mondo", "unico"). Il testo definitivo dei beat NON è compito tuo: è editoriale — usa placeholder chiaramente segnati [VERIFY con editorial-writer] se servono, non inventare dettagli del viaggio.

## What the receiver should produce

- Output: la variante Diario resa nel template Articolo (componente/i riusabili, props tipizzate con interface esplicita, nessun `any`), gate dietro il flag di contenuto; degrada in modo pulito se il flag è assente (l'articolo resta quello attuale). Reuse di PageLayout/Section/OptimizedImage/componenti esistenti prima di inventarne.
- Mobile 375px: nessun overflow orizzontale, gerarchia preservata, un solo h1, foto non schiacciate.
- Where it lands: modifiche a `src/pages/Articolo.tsx` (+ eventuali componenti in `src/components/article/`); aggiornare `docs/10_Projects/PROJECT_CINEMATIC_REBUILD_HOME_2026.md` o la nota articolo pertinente con lo stato quando implementato.

## Out of scope (do NOT touch)

- Home cinematografica (già fatta — non duplicare il concept "capitolo immersivo" lì).
- `/mappa` e la MapLibre/Mapbox (owner ha confermato che va bene così).
- Globo 3D (respinto — già risolto).
- Shop (`src/pages/Shop.tsx`) e pagina Collaborazioni (`src/pages/Collaborazioni.tsx`): restano come sono.
- File high-risk (`server.ts`, `firestore.rules`, `src/config/admin.ts`): mai.

## Open questions / decisions for the user

- Il flag di contenuto attiva il Diario su TUTTO l'articolo o solo sopra l'itinerario? (Proposta: sezione Diario in cima al corpo, itinerario resta dov'è.)
- I 3-4 beat vengono da un campo strutturato nel content model o da markdown? (Preferibile strutturato per controllo del layout.)

## Next hand-off

- Next agent: travellini-quality-auditor + browser-auditor (a implementazione finita).
- Trigger: typecheck + build + audit:ui verdi e Diario reso su almeno 1 dei 3 flagship in preview -> gate reale su desktop e mobile.

## Notes

- L'asset fotografico "imperfetto/backstage" e la mappa disegnata a mano arrivano in parallelo da asset-curator (handoff gemello). Non bloccarti su di essi: struttura prima con foto reali già presenti, poi sostituisci quando gli asset curati sono pronti.
- La coppia deve essere presente nel Diario (people-led): almeno un beat con Rodrigo & Betta reali nel frame.

## Status — 2026-07-19 (frontend-builder, consumato)

- Costruito: `DiaryBeat` type + campo opzionale `article.diary` in `src/components/article/types.ts` (flag di contenuto: array assente/vuoto = degrado pulito, articolo invariato). Componente `src/components/article/Diary.tsx` (sezione + beat alternati foto/testo, motion `revealUp` esistente, reduced-motion rispettato). Cablato in `src/pages/Articolo.tsx`: sezione `id="diario"` subito sopra "Itinerario leggibile" (dopo ReviewBlock/Il Timbro — convivono, nessuno dei due sostituito), voce TOC condizionale aggiunta.
- Verifica: NON su un flagship pubblicato (nessuno dei 3 originari è live, vedi CORREZIONE sopra). Verificato invece in isolamento con una fixture dev-only che usa il corpo narrativo reale del seed Burton Juice (esclusa la sezione recensione, ancora bloccata) diviso in 4 beat con titoli specifici — non i cliché vietati. Pagina: `src/pages/dev/DiarioPreview.tsx`, rotta `/_dev/diario-preview` registrata in `src/App.tsx` solo dietro `import.meta.env.DEV` (assente dal build di produzione, non in nav, `noindex,nofollow`).
- Foto: nessuna foto reale di Burton Juice esiste ancora in repo. La fixture usa foto reali già presenti sul sito (couple-travel/about-editorial/collab-work) come segnaposto dichiarati in caption — da sostituire quando arriva il photo plan dedicato dell'asset-curator.
- Gate: `npm run typecheck` pulito, `npm run audit:ui` 0 errori (0 warning sui file toccati).
- Next hand-off aggiornato: la pubblicazione di un vero articolo con Diario resta un passo successivo separato (contenuto owner + eventuale `travellini-backend-engineer` per Firestore). Quando un flagship reale sarà pubblicato con `diary` popolato, allora `travellini-quality-auditor` + `browser-auditor` fanno il gate reale desktop/mobile su quell'URL pubblico — non su questa fixture dev-only.
