---
title: HANDOFF_dormire-posti-sembrano-inventati_frontend_to_gate
status: consumed
created: 2026-08-18
from: travellini-frontend-builder
to: travellini-quality-auditor
slug: dormire-posti-sembrano-inventati
expires: 2026-09-15
type: handoff
area: delivery
---

# Handoff: gate del pillar «Posti che sembrano inventati» — quality-auditor + browser-auditor in parallelo

## Why this work matters

È l'unico articolo in produzione e il primo che il brand pubblica davvero. Se
esce con un prezzo che nessuno ha pagato, una disclosure mancante o un link che
atterra su una scheda vuota, il danno non è SEO: è la promessa del brand — «noi
ci siamo stati» — smentita dalla pagina stessa.

## Decisions already made (locked)

- `published: false`. Il gate **non pubblica**: certifica che è pubblicabile.
- Nessun `[VERIFY]`, nessun prezzo non presente in `value.price`, nessuna data di
  visita non confermata.
- Ogni voce cita la sua disclosure a parole nel corpo.
- Cover e immagini sono `real-frame` da `/images/reels/`.

## Chi fa cosa

**`travellini-quality-auditor`** — statico:

- `npm run typecheck`
- `npm run audit:ui` — un solo `h1`, copy italiano, CTA specifica, token CSS
- `npm run audit:provenance` — errore non negoziabile su asset senza regola
- `npm run audit:obsidian` — la content note ha `type`/`status` ammessi
- `npm run publish:article -- dormire-posti-sembrano-inventati --publish` in
  **dry-run**: deve uscire senza problemi. Riporta parole, caratteri excerpt e
  cover che stampa.
- **Controllo fatti, riga per riga** (è il vero lavoro qui):
  - ogni struttura citata esiste in `src/data/content-seed.json` con quell'`id`
  - ogni prezzo scritto nell'articolo è **testualmente** il `value.price` della
    scheda, non un arrotondamento
  - ogni disclosure nell'articolo coincide con `partnership.kind` della scheda
  - ogni `/posto/:id` punta a una scheda con `isPlaceholder: false`
  - nessun numero, nome di partner o metrica che non sia nel repo
- **Anti-slop**: nessun superlativo generico, nessun paragrafo che
  potrebbe stare in un articolo su qualunque altro posto.

**`browser-auditor`** — reale:

- 375 / 768 / 1280 px: zero overflow orizzontale, gerarchia leggibile
- Console pulita (gli errori Firestore senza credenziali sono attesi: dichiarali
  come tali invece di contarli come difetti)
- Tastiera: `:::domande` apre e chiude con `<details>` nativi, i link dei posti
  sono raggiungibili in tab order, il bottone play del reel ha una label
  leggibile
- **LCP mobile 4G**: la cover è l'elemento LCP. Target ≤ 2,0 s. Se sfora,
  **non correggere**: passa a `travellini-perf-engineer` con la misura
- CLS ≤ 0,1 (è bloccante in CI) e a11y ≥ 0,95
- Nessun video parte da solo; i poster hanno `srcset`

## Context the receiver needs

- Content note: `docs/13_Content/ARTICLE_dormire-posti-sembrano-inventati.md`
- Seed: `src/data/articles/dormire-posti-sembrano-inventati.seed.ts`
- Registro: `src/data/content-seed.json`
- Spec blocchi:
  `docs/50_Scratch/HANDOFF_editorial-blocks-v2_ui-designer_to_frontend-builder.md`
- **Limite noto della verifica**: la pagina legge Firestore. Senza il documento
  scritto (`--commit`, credenziali owner) il browser vede la pagina con il
  fallback, non l'articolo. Dichiara **cosa hai potuto misurare e cosa no**.
  Un gate che tace su ciò che non ha visto è peggio di un gate rosso.

## What the receiver should produce

Un verdetto in tre righe — **passa / passa con riserve / non passa** — seguito
da:

- l'elenco dei comandi lanciati con l'esito reale (non «tutti verdi»)
- ogni difetto con severità, file e riga
- per ogni affermazione di impatto: `[MISURATO: comando o file:riga]` oppure
  `[DEDOTTO]` con la riga `Si smentisce se:`
- cosa **non** è stato verificato e perché

## Out of scope (do NOT touch)

- Non correggere il copy né il codice: il gate diagnostica, non ripara. I fix
  tornano a `travellini-frontend-builder` o `travellini-editorial-writer`.
- Non pubblicare, non lanciare `--commit`, non toccare `published`.
- Non lanciare `firebase deploy`, non toccare DNS.
- `travellini-security-auditor` **non è in questa sequenza, deliberatamente**:
  l'articolo non tocca checkout, lead capture, webhook né segreti. Se durante il
  gate emerge un endpoint, una chiave o un form nuovo, **fermati e chiamalo**.

## Open questions / decisions for the user

- Se l'LCP sfora e la causa è la cover, la scelta è fra ricomprimere il
  fotogramma (asset-curator) e cambiarne uno (che cambia l'apertura del pezzo).
  È una decisione editoriale, non tecnica: portala all'owner con i due numeri.

## Next hand-off

- Next: owner. Il gate produce il verdetto, la pubblicazione è una decisione con
  credenziali Admin.
- Trigger: verdetto scritto e difetti bloccanti chiusi.

## Notes

Il sito non è pubblico: `travelliniwithus.it` risponde da un proxy Aruba con
marker WordPress e le functions non sono deployate. «Verde al gate» qui
significa **pubblicabile**, non **pubblicato** e non **visibile**. Non scrivere
la seconda cosa nel verdetto.

## Stato reale al 2026-08-18 (travellini-frontend-builder)

Questo handoff era stato pre-scritto dall'orchestratore prima che il lavoro
iniziasse (vedi addendum in
`HANDOFF_dormire-posti-sembrano-inventati_asset_to_frontend.md`). Ora il
lavoro è fatto, non solo pianificato:

- Seed completo: H1/meta title, excerpt (151 caratteri), tags, corpo (2.945
  parole contate dallo stesso contatore di `publish-article-seed.mjs`, 7/8
  blocchi) — `src/data/articles/dormire-posti-sembrano-inventati.seed.ts`.
- Hero + 5 section photo collegate (`coverImage`/`imageAlt` nel seed; il
  plumbing seed→Firestore→`ArticleData` per `imageAlt`/`ogImage` non esisteva
  ed è stato completato in `scripts/publish-article-seed.mjs`,
  `src/utils/articleData.ts`, `src/components/article/types.ts`,
  `src/pages/Articolo.tsx`).
- OG card fotografica composta: `/og/dormire-posti-sembrano-inventati.jpg`
  (+`.webp`), scrim sul terzo sinistro, testo "Posti che sembrano inventati",
  wordmark. `article.ogImage` la usa invece della coverImage grezza.
- I tre rimedi dell'addendum implementati: `article_place_click` su ogni link
  `/posto/:id` del corpo (direttiva o prosa, non solo i 3 blocchi) +
  `article_partner_cta_click` sul link a `/collaborazioni`, entrambi via
  `trackAnalyticsEvent` — nuovo `ArticlePlaceTrackingContext` +
  `MarkdownLink` in `ArticleMarkdownBody.tsx`, click handler in
  `directives/posto.tsx`; `ItemList` JSON-LD dai 10 riferimenti `/posto/:id`
  (non dai soli 3 blocchi), emesso lato client dal chunk lazy
  (`ArticleMarkdownBody`, via `<Helmet>` annidato — non aumenta il bundle
  eager `Articolo-*.js`); ramo `articoloMeta()` in
  `scripts/generate-route-html.js` (legge il seed in repo, non Firestore).
- `InlineFigure` **non** aggiornato a `<picture>` — decisione confermata,
  invariata.
- Verifiche eseguite: `npm run typecheck` ✓, `npm run lint` ✓,
  `npm run format:check` ✓, `npx vitest run --project unit` (381/381) ✓,
  `npm run audit:provenance` (0 errori nuovi) ✓, `npm run audit:ui` (0 errori)
  ✓, `npm run publish:article -- dormire-posti-sembrano-inventati --publish`
  in **dry-run** (nessun `--commit`) senza problemi ✓, lint editoriale
  (`lintEditorialMarkdown`, blocchi/segnaposto) 0 problemi ✓.
- **Non verificato da me**: LCP/CWV/console reale in browser (nessun tool
  browser disponibile in questa sessione) — resta per `browser-auditor`, come
  già previsto sopra.


## Verdetto quality-auditor (2026-08-18): passa con riserve — riserve CHIUSE dal main thread in giornata

0 blocker, 2 serious, nessuno nel seed stesso:

1. `stato:check` in DRIFT (7 seed vs 6 nel doc) — CHIUSO: `npm run stato` rieseguito, `stato:check` ora verde.
2. La correzione fact-check «villa trecentesca» non era arrivata a `content-seed.json:3022` / `reels.ts:881` (pagina /posto visibile dal click dell'articolo, meta description, schema Review) — CHIUSO: entrambe le occorrenze corrette in «Villa trecentesca», typecheck verde, nessun test referenziava la stringa.

Tutto il resto verificato pulito dal quality-auditor: corpo identico byte-per-byte alla content note; disclosure/prezzi/date coerenti col registro su tutte le 12 voci; `trackAnalyticsEvent` su entrambi gli eventi con test dedicato verde; ordine position 1-10 corretto; `published: false`; dry-run publish 0 problemi; typecheck/lint/test 394/394/audit:ui/provenance/obsidian tutti verdi.

Browser: il Playwright MCP era bloccato (lock profilo Chrome) — regressione verificata dal main thread col browser pane su :5173: home, /articolo/dolomiti-rifugi-design, /posto/novara-emotional-grand-motel tutte OK, h1 unico, overflow 0 a 375px, un solo 404 in console su tutte le rotte (chiamate /api con Express spento: ambientale). NON misurati: LCP/CWV reali del pillar, hero/TOC/JSON-LD del pezzo nuovo (serve il documento Firestore, --commit dell'owner).
