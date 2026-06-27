---
type: project
area: design
status: completed
priority: p1
owner: team
repo: TRAVELLINIWITHUS
related: '[[10_Projects/PROJECT_RELEASE_READINESS]]'
source: graphic audit + competitive benchmark 2026-06-04
tags:
  - project
  - audit
  - design
  - marketing
  - benchmark
---

# PROJECT_GRAPHIC_COMPETITIVE_AUDIT_2026-06-04

## Obiettivo

Audit grafico, UX e marketing del sito Travelliniwithus in full mode, con confronto su creator travel italiani, travel editorial premium e gallerie design. Obiettivo pratico: individuare cosa migliorare per rendere il sito più coerente con Rodrigo & Betta, più credibile per partner/media kit e più efficace per lead, shop e club senza fare un redesign scollegato da `DESIGN.md`.

## Executive verdict

**Verdetto:** buono stato di base, nessun blocker visuale/mobile critico, ma il sito ha ancora un debito di coerenza: troppe sezioni usano la stessa grammatica "rounded card + glass + shadow + gradient", mentre il brand dovrebbe sembrare più editoriale, people-led e selettivo.

**Score complessivo:** 3.8 / 5

| Dimensione                         | Score | Lettura                                                                                             |
| ---------------------------------- | ----: | --------------------------------------------------------------------------------------------------- |
| Coerenza brand Rodrigo & Betta     |   4.1 | Posizionamento chiaro; serve più presenza umana reale e meno UI generica.                           |
| Qualità visuale premium/editoriale |   3.7 | Buona base, ma troppi pattern card/glass ripetuti.                                                  |
| Conversione lead/partner/revenue   |   3.4 | Funnel presente; CTA mobile e priorità commerciale da rendere più nette.                            |
| Mobile experience                  |   4.0 | Zero overflow e H1 corretti; CTA above-fold assente su varie pagine a 320/375.                      |
| Accessibilità automatica           |   4.8 | Axe 0 violazioni sulle pagine core testate.                                                         |
| Performance/sistema                |   3.9 | Gate bundle e CWV stabilizzati; initial JS ridotto, home migliorata, resta LCP appena sopra soglia. |
| Differenziazione competitor        |   3.8 | Più forte dei blog classici sul sistema, meno forte dei magazine sulla direzione editoriale.        |

## Audit eseguiti

| Check                    | Esito            | Note                                                                                                                                                          |
| ------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run audit:ui`       | PASS             | 0 errori, 134 warning. Warning concentrati su raw color, inline style e pattern non normalizzati.                                                             |
| `npm run audit:visual`   | PASS             | 14/14 Playwright: home, esplora, mappa, collaborazioni, media kit, shop, contatti su desktop/mobile.                                                          |
| Responsive matrix custom | PASS con warning | 60 check su 12 route x 5 viewport. Zero overflow, H1 unico ovunque, 0 immagini senza alt.                                                                     |
| `npm run audit:a11y`     | PASS             | 0 violazioni axe su `/`, `/collaborazioni`, `/media-kit`, `/chi-siamo`.                                                                                       |
| `npm run audit:size`     | PASS             | Gate aggiornato: misura JS iniziale + vendor/route lazy critici con budget raw/gzip.                                                                          |
| `npm run audit:cwv`      | PASS con warning | 6 route core misurate: `/`, `/esplora`, `/chi-siamo`, `/collaborazioni`, `/media-kit`, `/shop`. Warning su home performance/LCP e collaborazioni performance. |

Artifact:

- Responsive matrix JSON: `.audit-screenshots/graphic-audit-2026-06-04/responsive-matrix.json`
- Screenshot matrix: `.audit-screenshots/graphic-audit-2026-06-04/*.png`
- Playwright HTML report: `playwright-report/`

## Responsive matrix

Route testate: `/`, `/esplora`, `/mappa`, `/risorse`, `/shop`, `/club`, `/collaborazioni`, `/media-kit`, `/contatti`, `/vieni-con-noi`, `/articolo/dolomiti-rifugi-design`, `/guide/weekend-catania`.

Viewport: 320, 375, 768, 1024, 1440.

| Risultato             | Stato                                                                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Horizontal overflow   | 0 casi                                                                                                                                   |
| H1                    | 1 H1 su tutte le route e viewport                                                                                                        |
| Immagini senza alt    | 0 casi                                                                                                                                   |
| Console/page errors   | Solo `/guide/weekend-catania`: React duplicate key per `/images/destinations/sardegna.webp`                                              |
| CTA above-fold mobile | Mancante a 320/375 su `/esplora`, `/mappa`, `/risorse`, `/shop`, `/club`, `/collaborazioni`, `/media-kit`, `/contatti`, articolo e guida |

Nota CTA: lo script rileva CTA visibili nel primo viewport. Alcune pagine possono avere azioni subito dopo il fold, ma per conversione mobile questo resta un warning importante, soprattutto su Media Kit, Collaborazioni, Shop/Club e Risorse.

## Benchmark competitivo

Fonti consultate:

- Design gallery: [Siteinspire](https://www.siteinspire.com/), [Awwwards Travel](https://www.awwwards.com/websites/travel/), [Godly](https://godly.website/info)
- Editorial travel: [Condé Nast Traveller](https://www.cntraveller.com/), [Condé Nast Traveler](https://www.cntraveler.com/)
- Creator/blog italiani: [Patatofriendly](https://patatofriendly.com/chi-siamo/), [iGiramondo](https://igiramondo.it/), [Viaggia con Matte](https://www.viaggiaconmatte.it/), [BeBorghi](https://beborghi.com/)
- Market scan creator: [Heepsy travel Italy, June 2026](https://www.heepsy.com/top-instagram/travel/italy)

| Riferimento                     | Cosa rubare                                                                                       | Cosa adattare                                                              | Cosa evitare                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Siteinspire / Awwwards          | Coraggio tipografico, ritmo visivo, layout meno standard.                                         | Solo micro-pattern: hero, grid, motion trattenuto.                         | Esperienze troppo sperimentali o pesanti per utenti che cercano info viaggio. |
| Condé Nast Traveller / Traveler | Gerarchia editoriale, articoli image-led, categorie chiare, partnership integrate come contenuto. | "Magazine rhythm" per home, articoli, risorse e collaborazioni.            | Tono luxury freddo o impersonale.                                             |
| Patatofriendly                  | Tassonomia profonda, disclosure affiliazioni, contatti/media kit visibili.                        | Architettura informativa robusta ma più pulita e premium.                  | Mega-menu troppo enciclopedico o blog-like.                                   |
| iGiramondo                      | Coppia travel creator esplicita e tono accessibile.                                               | People-led positioning: Rodrigo & Betta devono comparire prima e meglio.   | Visual troppo semplice da blog personale.                                     |
| Viaggia con Matte               | Doppia CTA chiara: viaggi/community + collabora.                                                  | Separare subito lettori e partner senza creare confusione.                 | Tono troppo evento/creator individuale se non coerente con R+B.               |
| BeBorghi                        | Autorità personale, anni di esperienza, viaggi di gruppo.                                         | Proof editoriali e case study partner quando disponibili.                  | Home troppo blog tradizionale.                                                |
| Heepsy market scan              | Il mercato travel creator è affollato e aggiornato mensilmente.                                   | Differenziarsi con metodo, archivio proprietario, media kit e lead magnet. | Competere solo su follower count.                                             |

## Finding prioritizzati

### P0 — Nessun blocker grafico critico

Non sono emersi casi di overflow mobile, H1 multipli, immagini senza alt o errori browser diffusi che blocchino la navigazione pubblica.

### P1 — Da sistemare nel prossimo pass

1. **CTA mobile non abbastanza alta nella pagina.**  
   Diverse pagine operative non mostrano un'azione primaria nel primo viewport a 320/375. Priorità: `/media-kit`, `/collaborazioni`, `/shop`, `/club`, `/risorse`, `/esplora`.

2. **Template guida con warning React duplicate key.**  
   `/guide/weekend-catania` emette 2 console error per chiave duplicata `/images/destinations/sardegna.webp`. Fix: deduplicare preview images oppure usare key composta `image + index` nel mapping.

3. **Performance home ancora sotto target.**  
   Dopo la stabilizzazione dei gate, la home resta il punto da ottimizzare: Performance 76/100 e LCP 2.78s contro soglia warning 2.5s.

4. **Debito design-system visibile.**  
   `audit:ui` passa ma segnala 134 warning. Per la parte pubblica i cluster più rilevanti sono raw rgba negli scrim, inline style per motion/clipPath, social raw colors su Contatti, pattern glass/card ripetuti.

5. **Troppe sezioni sembrano "premium UI kit".**  
   Chi siamo, Collaborazioni, Club, Product/Shop e Mappa usano spesso card arrotondate, blur e shadow come soluzione base. Va ridotto per ottenere ritmo editoriale più maturo.

### P2 — Miglioramenti editoriali e conversione

1. **Home:** buona direzione image-led, ma il pass successivo deve aumentare il segnale Rodrigo & Betta e ridurre qualunque sensazione da template.

2. **Esplora:** archivio solido; serve CTA mobile più chiara e un'intestazione più "decision helper", non solo catalogo.

3. **Mappa:** esperienza differenziante; su mobile il controllo è funzionale ma ancora molto "dark glass tool". Va resa più editoriale con istruzioni minime e CTA verso archivio più anticipata.

4. **Risorse:** disclosure presente; migliorare gerarchia fra strumenti realmente consigliati, link affiliati e non affiliati.

5. **Shop/Club:** corretti in pre-lancio, ma graficamente dovrebbero sembrare waitlist/editorial product, non e-commerce vuoto.

6. **Collaborazioni/Media Kit:** buon funnel; aumentare prova sociale verificabile, casi d'uso e micro-proof appena disponibili.

## Roadmap implementativa

### Quick wins — 0.5/1 giorno

- Fixare duplicate key in `src/pages/Guida.tsx`.
- Aggiungere/anticipare CTA mobile above-fold su `/media-kit`, `/collaborazioni`, `/shop`, `/club`, `/risorse`.
- Normalizzare 5-8 raw color pubblici più visibili usando token CSS già esistenti.
- Ridurre una prima ondata di `rounded-3xl + backdrop-blur + shadow-premium` dove non serve: sezioni non card devono tornare layout editoriali full-width.
- Rendere le CTA più specifiche: "Richiedi il media kit", "Entra in lista Club", "Vedi risorse selezionate", "Apri archivio" invece di etichette generiche.

### Sprint 1 — Coerenza visuale premium

- Creare un sistema di sezioni editoriali riutilizzabile: hero compatto, editorial band, image-led feature, proof line, CTA strip mobile.
- Refactor mirato di ChiSiamo, Collaborazioni e Club per ridurre la ripetizione card/glass.
- Standardizzare mobile hero: H1, promessa, proof line, CTA primaria sempre entro il primo viewport quando la pagina ha obiettivo conversione.
- Rivedere la Mappa mobile: meno pannelli scuri sovrapposti, più lettura guidata e accesso diretto all'archivio.
- Aggiornare `DESIGN.md` con regola esplicita "glass/card budget": consentito solo per overlay, tool framed e card ripetute, non per ogni sezione.

### Sprint 2 — Conversione e asset reali

- Inserire asset people-led reali R+B nelle superfici chiave: home, chi siamo, media kit, collaborazioni, lead magnet.
- Aggiungere proof verificabili: screenshot insight, case study micro, partner format reali, risultati contenuti.
- Evolvere Shop/Club in waitlist premium: meno catalogo, più manifesto prodotto + esempi di contenuto + lista d'attesa.
- Rivedere Risorse come pagina "consigliati davvero": priorità editoriale, disclosure chiara, monetizzazione non invasiva.
- Ottimizzare performance percepita: LCP home, main-thread iniziale e audit separato della mappa Mapbox.

### Non ora

- Figma/Stitch mockup completo prima dei quick wins.
- Effetti Awwwards/3D nuovi.
- Redesign totale della homepage.
- Nuove palette o font fuori dal sistema attuale.

## Acceptance criteria per il prossimo pass

- `npm run audit:ui` resta 0 errori e warning pubblici ridotti.
- `npm run audit:visual` passa 14/14.
- Responsive matrix: CTA primary above-fold su pagine conversione a 320/375.
- `/guide/weekend-catania` senza console error.
- `npm run audit:a11y` ancora 0 violazioni.
- `npm run audit:size` resta PASS con gate su JS iniziale e chunk lazy espliciti.
- `npm run audit:cwv` produce report stabile sulle 6 route core e non include `/mappa`, da misurare con audit Mapbox separato.

## Prossimo intervento consigliato

Partire da un pass "Visual Coherence Sprint 1" con scope ristretto:

1. CTA mobile above-fold su pagine conversione.
2. Fix console error template guida.
3. Riduzione pattern card/glass su ChiSiamo, Collaborazioni e Club.
4. Standardizzazione componenti editoriali per sezioni pubbliche.
5. Re-run audit visuale, a11y, size e browser matrix.

Questo è il percorso più pragmatico: migliora subito percezione premium e conversione senza aprire un redesign rischioso.

## Implementation pass — Visual Coherence Sprint 1

Eseguito subito dopo l'audit, con scope ristretto e senza redesign totale.

### Cambi implementati

- Fix console warning su `/guide/weekend-catania`: thumbnail preview ora usa key composta `image + index`, quindi la cover duplicata non genera più duplicate key.
- CTA mobile immediate su pagine operative: `/esplora`, `/mappa`, `/risorse`, `/shop`, `/club`, `/collaborazioni`, `/media-kit`, `/contatti`, `/guide/:slug`.
- Sticky CTA allineate al funnel:
  - Esplora/Mappa → "Apri archivio"
  - Risorse → "Vedi risorse"
  - Shop → "Vedi prodotto"
  - Club/Guida demo → "Avvisami al lancio"
  - Collaborazioni/Media Kit → "Richiedi il media kit"
  - Contatti → "Scrivici ora"
- Prima riduzione visual debt su ChiSiamo, Collaborazioni, Club e Shop: meno `backdrop-blur`, `shadow-premium`, card arrotondate e hover lift; più righe editoriali, border-top/border-left e gerarchia tipografica.

### Verifiche post-implementazione

| Check                                    | Esito                                                         |
| ---------------------------------------- | ------------------------------------------------------------- |
| `npm run typecheck`                      | PASS                                                          |
| `npm run lint`                           | PASS                                                          |
| `npm run audit:ui`                       | PASS — 0 errori, 134 warning noti                             |
| `npm run audit:visual`                   | PASS — 14/14                                                  |
| Browser mobile 320/375 su pagine toccate | PASS — zero overflow, H1 unico, CTA above-fold dove richiesta |
| `/guide/weekend-catania` console         | PASS — 0 console error                                        |

### Residui

- Articolo editoriale lasciato senza CTA above-fold forzata: non è pagina primaria di conversione e non va trasformato in landing.
- `audit:size` e `audit:cwv` affrontati nello sprint performance/tooling successivo.

## Implementation pass — Performance Tooling Sprint

Eseguito dopo il pass visuale per chiudere i due blocker di verifica emersi dall'audit iniziale.

### Cambi implementati

- `scripts/check-size.mjs` ora distingue:
  - JS iniziale realmente referenziato da `dist/index.html`;
  - vendor/route lazy critici (`firebase-firestore`, `mapbox`, `react-pdf`, `charts`);
  - budget raw + gzip per i chunk dove il raw da solo non rappresenta bene il costo percepito.
- Il totale JS di tutti i chunk resta stampato come informazione, ma non è più il gate principale: include export PDF, Mapbox, admin/editor e route lazy non caricate al primo paint.
- `lighthouserc.json` ora misura 6 route core con 1 run deterministico:
  `/`, `/esplora`, `/chi-siamo`, `/collaborazioni`, `/media-kit`, `/shop`.
- CWV/Lighthouse non include più `/mappa` nel gate generale: Mapbox in headless ha causato blocco della raccolta. La mappa resta da auditare con test dedicato.
- CWV misura performance, accessibilità e best-practices. SEO resta fuori da `audit:cwv` perché alcune route demo sono intenzionalmente `noindex`; SEO va verificato con `seo-check`/audit dedicato.

### Verifiche post-performance

| Check                | Esito                        |
| -------------------- | ---------------------------- |
| `npm run build`      | PASS                         |
| `npm run audit:size` | PASS                         |
| `npm run audit:cwv`  | PASS con warning controllati |

Baseline `audit:size`:

| Budget                    |                        Valore |
| ------------------------- | ----------------------------: |
| Initial JS                |  717.0 KB raw / 231.8 KB gzip |
| `react-core`              |   284.2 KB raw / 90.2 KB gzip |
| `firebase-firestore-lazy` |   389.0 KB raw / 90.6 KB gzip |
| `mapbox-lazy-route`       | 1687.6 KB raw / 466.9 KB gzip |
| `react-pdf-lazy-export`   | 1519.6 KB raw / 506.9 KB gzip |

Baseline `audit:cwv`:

| Route             | Perf | A11y | Best practices |     LCP |   CLS |    TBT |
| ----------------- | ---: | ---: | -------------: | ------: | ----: | -----: |
| `/`               |   76 |   96 |            100 | 2785 ms | 0.000 | 141 ms |
| `/esplora`        |   87 |   97 |            100 | 2004 ms | 0.000 |  85 ms |
| `/chi-siamo`      |   87 |   97 |            100 | 1939 ms | 0.020 |  15 ms |
| `/collaborazioni` |   84 |  100 |            100 | 2332 ms | 0.000 |  63 ms |
| `/media-kit`      |   89 |   98 |            100 | 1849 ms | 0.004 |  22 ms |
| `/shop`           |   87 |   97 |            100 | 1935 ms | 0.005 |  56 ms |

### Residui performance dopo tooling

- **P1:** home LCP a 2.78s, sopra soglia warning 2.5s. Prossimo intervento: hero image preload/sizing, riduzione lavoro iniziale motion/GSAP e verifica se tutti i modulepreload iniziali sono necessari.
- **P1:** `/collaborazioni` performance 84, appena sotto target 85. Probabile impatto da immagini/sezioni animate; ottimizzazione mirata prima del deploy.
- **P2:** audit dedicato `/mappa` con Mapbox fuori da LHCI generale, includendo tempo di interazione e peso lazy del chunk.

## Implementation pass — Performance Optimization Sprint

Eseguito dopo la stabilizzazione dei gate per ridurre il costo iniziale della home e migliorare la soglia LCP.

### Cambi implementati

- Home sotto-fold ora usa mount progressivo con `IntersectionObserver`: le sezioni pesanti non vengono renderizzate/scaricate appena la route monta.
- `HomeDiscoveryFinder`, `CoupleIntro`, `HomeLeadMagnet`, `HomeTrustStrip`, `HomeEditorialPromise`, `HomePartnerSignal`, `LatestArticles`, `InstagramGrid`, `NewsletterFeature`, `MonetizationTeaser`, `HomeCollaborationCta` sono lazy e montate quando si avvicinano alla viewport.
- `SmoothScrollProvider` non importa più staticamente `lenis`, `gsap` e `ScrollTrigger`; li carica dopo 3.2s, fuori dalla finestra LCP.
- Hero home: rimosso il wipe iniziale `clip-path` sull'immagine LCP e reso l'H1 statico immediato.
- `/collaborazioni`: preload AVIF dell'immagine hero e `OptimizedImage priority` con `sizes`/dimensioni esplicite.

### Verifiche post-ottimizzazione

| Check                | Esito                        |
| -------------------- | ---------------------------- |
| `npm run typecheck`  | PASS                         |
| `npm run lint`       | PASS                         |
| `npm run audit:size` | PASS                         |
| `npm run audit:cwv`  | PASS con warning controllati |

Baseline `audit:size` aggiornata:

| Budget     |                        Prima |                         Dopo |
| ---------- | ---------------------------: | ---------------------------: |
| Initial JS | 717.0 KB raw / 231.8 KB gzip | 585.6 KB raw / 181.7 KB gzip |
| Home route |   40.7 KB raw / 10.8 KB gzip |    16.0 KB raw / 5.5 KB gzip |

Baseline `audit:cwv` aggiornata:

| Route             | Perf | A11y | Best practices |     LCP |   CLS |   TBT |
| ----------------- | ---: | ---: | -------------: | ------: | ----: | ----: |
| `/`               |   82 |  100 |            100 | 2624 ms | 0.000 | 74 ms |
| `/esplora`        |   85 |   97 |            100 | 2207 ms | 0.000 | 80 ms |
| `/chi-siamo`      |   84 |   97 |            100 | 2316 ms | 0.000 | 26 ms |
| `/collaborazioni` |   85 |  100 |            100 | 2293 ms | 0.000 | 17 ms |
| `/media-kit`      |   89 |   98 |            100 | 1824 ms | 0.004 | 29 ms |
| `/shop`           |   84 |   97 |            100 | 2294 ms | 0.000 | 90 ms |

### Residui performance aggiornati

- **P1:** home LCP 2.62s: migliorato da 2.78s ma ancora appena sopra soglia 2.5s. Il collo di bottiglia residuo è render/main-thread, non overflow o CLS.
- **P2:** `/chi-siamo` e `/shop` hanno performance 84 nell'ultimo run, ma con LCP sotto soglia. Da monitorare per varianza Lighthouse e main-thread.
- **P2:** `/mappa` resta fuori dal gate LHCI generale; serve audit Mapbox dedicato con interazione reale.

## Implementation pass — Mapbox Critical Path & Mappa Audit

Eseguito per chiudere il residuo `/mappa` e rimuovere il CSS Mapbox dal critical path iniziale.

### Cambi implementati

- `MapboxWorldMap` non importa più `mapbox-gl.css` come side effect CSS.
- Il CSS Mapbox viene risolto come asset `?url` e aggiunto con `<link rel="stylesheet">` solo quando la pagina mappa monta.
- `dist/index.html` finale non contiene più `mapbox-gl` tra gli stylesheet iniziali; resta solo `index-*.css`.
- Corretto H1 accessibile di `/chi-siamo`: `Come scegliamo i posti che consigliamo` non viene più letto come parola concatenata.

### Verifiche finali

| Check                          | Esito                                                     |
| ------------------------------ | --------------------------------------------------------- |
| `npm run typecheck`            | PASS                                                      |
| `npm run lint`                 | PASS                                                      |
| `npm run build`                | PASS, con warning CSS minify noto su classe `[file:line]` |
| `npm run audit:size`           | PASS                                                      |
| `dist/index.html` critical CSS | PASS — nessun `mapbox-gl.css` iniziale                    |
| Localhost                      | PASS — `http://localhost:3000` risponde 200               |

Baseline `audit:size` finale:

| Budget                  |                        Valore |
| ----------------------- | ----------------------------: |
| Initial JS              |  585.3 KB raw / 181.7 KB gzip |
| Home route              |     15.9 KB raw / 5.5 KB gzip |
| `react-core`            |   284.2 KB raw / 90.2 KB gzip |
| `mapbox-lazy-route`     | 1687.6 KB raw / 466.9 KB gzip |
| `react-pdf-lazy-export` | 1519.6 KB raw / 506.9 KB gzip |

### CWV e performance browser

`npm run audit:cwv` post-Mapbox ha prodotto 3 report validi, poi si è fermato per un errore operativo Lighthouse/Windows:
`EPERM, Permission denied` durante cleanup della cartella temporanea Chrome. Non sono emersi errori applicativi.

Report LHCI validi prima del crash:

| Route        | Perf | A11y | Best practices |     LCP |   CLS |   TBT |
| ------------ | ---: | ---: | -------------: | ------: | ----: | ----: |
| `/`          |   85 |  100 |            100 | 2277 ms | 0.000 | 75 ms |
| `/esplora`   |   88 |   97 |            100 | 1935 ms | 0.000 | 59 ms |
| `/chi-siamo` |   81 |   97 |            100 | 2488 ms | 0.000 | 45 ms |

Fallback Playwright production con `PerformanceObserver` su 1440px:

| Route             |     FCP |     LCP |    CLS | Console | Overflow |
| ----------------- | ------: | ------: | -----: | ------: | -------- |
| `/`               | 1048 ms | 1708 ms | 0.0000 |       0 | No       |
| `/esplora`        |  916 ms | 1456 ms | 0.0003 |       0 | No       |
| `/chi-siamo`      |  884 ms | 1596 ms | 0.0176 |       0 | No       |
| `/collaborazioni` |  888 ms | 1732 ms | 0.0000 |       0 | No       |
| `/media-kit`      |  880 ms | 1568 ms | 0.0047 |       0 | No       |
| `/shop`           |  864 ms | 1564 ms | 0.0008 |       0 | No       |

Nota: i due JSON Lighthouse singoli per `/media-kit` e `/shop` salvati in `.audit-screenshots` non sono usati come baseline perché contaminati dallo stesso crash `EPERM`.

### Audit dedicato `/mappa`

Browser audit reale su `http://localhost:3000/mappa`:

| Viewport  | Console | Overflow | Map canvas | CSS Mapbox runtime | CTA/filtri |
| --------- | ------: | -------- | ---------- | ------------------ | ---------- |
| 375x812   |       0 | No       | Visibile   | Sì                 | Presenti   |
| 1440x1000 |       0 | No       | Visibile   | Sì                 | Presenti   |

Screenshot salvati:

- `.audit-screenshots/mappa-mobile-375.png`
- `.audit-screenshots/mappa-desktop-1440.png`

### Residui finali

- **P1:** rendere `audit:cwv` più robusto su Windows/Firestore listen. Opzioni: disattivare listener realtime in preview audit, usare mock dati per LHCI, o separare CWV da Firebase live.
- **P2:** rimuovere il warning CSS minify generato da classe/testo `[file:line]`.
- **P2:** valutare se `motion` deve restare nei modulepreload iniziali o può essere ulteriormente differito senza peggiorare UX.

## Implementation pass — Quality Gate Stabilization & Visual Coherence Sprint 2

Eseguito per chiudere i residui P1/P2 emersi nel pass precedente: gate CWV instabile, warning CSS Tailwind, caricamento anomalo di Mapbox fuori rotta e debito visuale su sezioni pubbliche.

### Cambi implementati

- `src/index.css`: Tailwind v4 passa a `@import 'tailwindcss' source(none)` con `@source` espliciti. Il warning CSS minify su `[file:line]` non compare più in build.
- `src/config/auditMode.ts`: aggiunta modalità audit via `VITE_TWU_AUDIT_MODE=true` o query `?twu_audit=1`.
- `useSiteContent` e `firebaseService`: in audit mode usano contenuti demo/default locali, evitando dipendenza da Firestore live durante LHCI.
- `scripts/lhci-preview.mjs`: preview Vite dedicata per LHCI con ready marker `LHCI_READY`.
- `lighthouserc.json`: URL audit con `?twu_audit=1`, upload locale `filesystem` in `.lighthouseci/reports`, niente dipendenza da temporary public storage.
- `vite.config.ts`: il Vite preload helper è isolato in `vite-preload-helper` e non viene più emesso dentro il chunk `mapbox`.
- `dist/index.html`: nessun preload/import iniziale di `mapbox-*`; Mapbox resta un chunk lazy della sola rotta mappa.
- `src/components/discovery/ArchiveCard.tsx`: ridotti raw color, glass e badge blur; card più editoriale e meno "effetto app".
- `src/pages/Contatti.tsx`: contact/social/form cards ripulite da glass e raw colors; WhatsApp/Instagram passano a token brand.
- `src/pages/ChiSiamo.tsx`: sezioni valori/pubblico/timeline rese più editoriali, meno card arrotondate annidate e meno decorazione blur.

### Verifiche finali

| Check                  | Esito                                          |
| ---------------------- | ---------------------------------------------- |
| `npm run lint`         | PASS                                           |
| `npm run typecheck`    | PASS                                           |
| `npm run build`        | PASS, senza warning CSS Tailwind `[file:line]` |
| `npm run audit:ui`     | PASS, 0 errori, 133 warning residui            |
| `npm run audit:size`   | PASS                                           |
| `npm run audit:visual` | PASS, 14/14                                    |
| `npm run audit:cwv`    | PASS, 0 assertion warning finali               |
| Localhost dev          | PASS, `http://localhost:3000` risponde 200     |

Baseline `audit:size` finale:

| Budget                |                        Valore |
| --------------------- | ----------------------------: |
| Initial JS            |  586.5 KB raw / 182.3 KB gzip |
| Home route            |     15.9 KB raw / 5.5 KB gzip |
| Shop route            |     16.6 KB raw / 5.4 KB gzip |
| Media kit route       |     25.9 KB raw / 6.8 KB gzip |
| Collaborazioni route  |     23.0 KB raw / 7.3 KB gzip |
| Mapbox lazy route     | 1686.5 KB raw / 466.4 KB gzip |
| React PDF lazy export | 1519.6 KB raw / 506.9 KB gzip |

Baseline `audit:cwv` finale, ultimo run dopo isolamento helper Vite/Mapbox:

| Route             | Perf | A11y | Best practices |    FCP |     LCP |    CLS |   TBT |
| ----------------- | ---: | ---: | -------------: | -----: | ------: | -----: | ----: |
| `/`               |   92 |  100 |            100 | 743 ms | 1750 ms | 0.0001 | 15 ms |
| `/esplora`        |   94 |   97 |            100 | 773 ms | 1446 ms | 0.0005 |  1 ms |
| `/chi-siamo`      |   94 |   97 |            100 | 787 ms | 1339 ms | 0.0001 | 58 ms |
| `/collaborazioni` |   94 |  100 |            100 | 776 ms | 1431 ms | 0.0001 | 34 ms |
| `/media-kit`      |   95 |   98 |            100 | 786 ms | 1317 ms | 0.0072 | 31 ms |
| `/shop`           |   92 |   97 |            100 | 775 ms | 1533 ms | 0.0001 | 79 ms |

### Risultato operativo

- Il sito ora ha gate locali ripetibili per CWV senza dipendere da Firebase live o storage temporaneo esterno.
- Le sei pagine prioritarie entrano sopra performance 90 nel run finale, con LCP sotto 1.8s e CLS ampiamente sotto soglia.
- Il debito visuale pubblico è più basso su contatti, chi siamo e card archivio: meno vetro, meno shadow premium, più struttura editoriale.
- Mapbox resta disponibile sulla pagina mappa ma non contamina più il critical path di shop/home/landing pubbliche.

### Residui aggiornati

- **P1:** ottimizzare immagini responsive per `puglia.webp` e `dolomiti.webp` con varianti `srcset`/AVIF nel mega menu e nelle card prodotto/destinazione.
- **P1:** continuare riduzione warning `audit:ui` su raw colors/inline style, partendo da componenti pubblici prima dell'admin.
- **P2:** valutare differimento di `motion` nei percorsi più statici, solo se non peggiora la fluidità percepita.
- **P2:** definire un sistema card pubblico unico: editoriale, product, business proof, media-kit metric.

## Implementation pass — Responsive Images & Public Card System

Eseguito per chiudere il residuo P1 sulle immagini destinazione sovradimensionate e continuare la riduzione del debito visuale pubblico senza redesign invasivo.

### Cambi implementati

- `scripts/optimize-images.mjs`: genera varianti responsive `320/480/768` in AVIF e WebP per `public/images/destinations/*`.
- `OptimizedImage`: aggiunta prop `responsiveWidths` per usare le varianti locali generate dal pipeline immagini.
- `vite.config.ts`: le varianti responsive `*-320/*-480/*-768` sono escluse dal PWA precache, quindi restano disponibili a runtime senza aumentare l'install iniziale del service worker.
- `Navbar`: il visual del mega menu Esplora usa `OptimizedImage` con `srcset` locale.
- `ProductCard`: passa a `OptimizedImage`, usa `srcset` per prodotti con immagini destinazione e riduce glass/backdrop/shadow pesanti.
- `ArchiveCard`: usa `srcset` locale per immagini destinazione e rimuove un raw shadow `rgba` dal pattern card pubblico.
- `HomeFeaturedDestinations`: usa `srcset` locale sulle card destinazione in home.

### Verifiche finali

| Check                  | Esito                       |
| ---------------------- | --------------------------- |
| `npm run lint`         | PASS                        |
| `npm run typecheck`    | PASS                        |
| `npm run build`        | PASS                        |
| `npm run audit:ui`     | PASS, 0 errori, 132 warning |
| `npm run audit:size`   | PASS                        |
| `npm run audit:visual` | PASS, 14/14                 |
| `npm run audit:cwv`    | PASS, 0 assertion warning   |

Baseline `audit:size` post-immagini:

| Budget            |                        Valore |
| ----------------- | ----------------------------: |
| Initial JS        |  588.9 KB raw / 183.3 KB gzip |
| Home route        |     16.0 KB raw / 5.5 KB gzip |
| Shop route        |     16.7 KB raw / 5.4 KB gzip |
| Mapbox lazy route | 1686.5 KB raw / 466.4 KB gzip |
| PWA precache      |      99 entries / 2641.74 KiB |

Baseline `audit:cwv` finale:

| Route             | Perf | A11y | Best practices |    FCP |     LCP |    CLS |    TBT | Responsive image saving |
| ----------------- | ---: | ---: | -------------: | -----: | ------: | -----: | -----: | ----------------------: |
| `/`               |   93 |  100 |            100 | 804 ms | 1560 ms | 0.0001 |  71 ms |                 179 KiB |
| `/esplora`        |   95 |   97 |            100 | 663 ms | 1373 ms | 0.0005 |  38 ms |                 156 KiB |
| `/chi-siamo`      |   92 |   97 |            100 | 742 ms | 1284 ms | 0.0203 | 130 ms |                  88 KiB |
| `/collaborazioni` |   92 |  100 |            100 | 797 ms | 1416 ms | 0.0001 |  77 ms |                  93 KiB |
| `/media-kit`      |   92 |   98 |            100 | 766 ms | 1332 ms | 0.0039 | 145 ms |                   0 KiB |
| `/shop`           |   94 |   97 |            100 | 811 ms | 1356 ms | 0.0001 |  69 ms |                  18 KiB |

### Risultato operativo

- Il problema più visibile su `/shop` è rientrato: performance 94 e saving immagini residue quasi azzerato.
- Home, Esplora e card destinazione servono varianti più leggere quando lo slot visuale è piccolo.
- Il PWA precache non cresce nonostante le nuove immagini.
- Il sistema card pubblico è più coerente: meno glass effect, meno raw shadow, più bordi/token e struttura editoriale.

### Residui aggiornati

- **P1:** completare `srcset` locale anche per immagini brand/hero usate in sezioni sotto-fold ad alta visibilità.
- **P1:** ridurre warning `audit:ui` nei componenti pubblici home (`HomeDiscoveryFinder`, `HomeLeadMagnet`, `MonetizationTeaser`, `CoupleIntro`).
- **P2:** valutare varianti `1200/1440` solo per hero full-bleed, mantenendole fuori dal precache.
- **P2:** estrarre utility condivisa per decidere quando passare `responsiveWidths` a `OptimizedImage`.

## Implementation pass — Home Editorial Coherence & Brand Images

Eseguito per portare la homepage più vicino alla direzione `DESIGN.md`: premium editoriale, calda, people-led, con meno pattern "glass + gradient + shadow" e più uso sistematico di token/utility condivise.

### Cambi implementati

- `scripts/optimize-images.mjs`: le immagini `public/images/brand/*` ora generano varianti responsive `320/480/768` in AVIF e WebP, oltre alle destinazioni.
- `src/index.css`: aggiunte utility condivise per scrim editoriali, hero scrim, bottom scrim, mappa, dot grid e marquee mask; il keyframe marquee è stato centralizzato.
- `HomeDiscoveryFinder`: rimosse overlay gradient inline/raw e aggiunti `srcset` responsive per le immagini destinazione.
- `HomeLeadMagnet`: copertina e box newsletter meno glass, con shadow/radius da token.
- `MonetizationTeaser`: pannello e mappa più coerenti con token, marker e route SVG senza raw color/shadow.
- `CoupleIntro`: immagini brand servite con `OptimizedImage`, rimosso transform inline dalle polaroid e ridotto l'effetto glass nei method card.
- `HomeCollaborationCta`: immagine collaborazione servita con `OptimizedImage`, pannello più asciutto e tipografia allineata ai token display.
- `HeroSection`: scrim hero/bottom centralizzati, CTA con shadow token e H1 senza tracking negativo.
- `HomeEditorialPromise`: rimosso elemento decorativo orb e sostituito background inline con utility.
- `PartnerLogosStrip`: mask e animazione marquee spostate nel sistema CSS.
- `Navbar`: shadow sticky allineata a `--shadow-lg`.

### Verifiche finali

| Check                     | Esito                                                 |
| ------------------------- | ----------------------------------------------------- |
| `npm run optimize:images` | PASS, generate varianti brand `320/480/768` AVIF/WebP |
| `npm run lint`            | PASS                                                  |
| `npm run typecheck`       | PASS                                                  |
| `npm run build`           | PASS                                                  |
| `npm run audit:ui`        | PASS, 0 errori, 102 warning                           |
| `npm run audit:size`      | PASS                                                  |
| `npm run audit:visual`    | PASS, 14/14                                           |
| `npm run audit:cwv`       | PASS con warning leggero su `/shop` TBT 204 ms        |

Baseline `audit:size` post-pass:

| Budget                  |                        Valore |
| ----------------------- | ----------------------------: |
| Initial JS              |  588.9 KB raw / 183.3 KB gzip |
| React core              |   284.2 KB raw / 90.2 KB gzip |
| Firebase Firestore lazy |   389.0 KB raw / 90.6 KB gzip |
| Mapbox lazy route       | 1686.5 KB raw / 466.4 KB gzip |
| React PDF lazy export   | 1519.6 KB raw / 506.9 KB gzip |
| Home route              |     15.7 KB raw / 5.4 KB gzip |
| Shop route              |     16.7 KB raw / 5.4 KB gzip |
| Media kit route         |     25.9 KB raw / 6.8 KB gzip |
| Collaborazioni route    |     23.0 KB raw / 7.3 KB gzip |
| PWA precache            |      99 entries / 2638.29 KiB |

Baseline `audit:cwv` finale:

| Route             | Perf | A11y | Best practices |    FCP |     LCP |   CLS |    TBT |
| ----------------- | ---: | ---: | -------------: | -----: | ------: | ----: | -----: |
| `/`               |   92 |  100 |            100 | 782 ms | 1550 ms | 0.000 |  85 ms |
| `/esplora`        |   95 |   97 |            100 | 716 ms | 1360 ms | 0.000 |  20 ms |
| `/chi-siamo`      |   91 |   97 |            100 | 754 ms | 1315 ms | 0.000 | 134 ms |
| `/collaborazioni` |   92 |  100 |            100 | 732 ms | 1423 ms | 0.003 |  70 ms |
| `/media-kit`      |   94 |   98 |            100 | 794 ms | 1330 ms | 0.004 |  91 ms |
| `/shop`           |   87 |   97 |            100 | 716 ms | 1454 ms | 0.000 | 204 ms |

### Risultato operativo

- Il debito UI misurato è sceso da 132 a 102 warning, con la maggior parte dei residui ora concentrata su admin, strumenti, mappe/PDF e componenti motion dove alcuni inline style sono intenzionali.
- Le sezioni pubbliche home coinvolte dal pass sono uscite dal registro warning principale di `audit:ui`.
- La homepage mantiene performance 90+ nonostante il miglioramento visuale e le nuove varianti responsive.
- Il sistema visuale è più coerente: gli effetti ricorrenti sono utility riusabili invece di gradienti/shadow raw ripetuti nei componenti.

### Residui aggiornati

- **P1:** riportare `/shop` sopra 90 performance nel prossimo run, partendo da TBT e lavoro main-thread. **Risolto nel pass successivo.**
- **P1:** proseguire il debito UI sui componenti pubblici rimasti: `VieniConNoi`, newsletter/exit intent, mappa e strumenti.
- **P2:** valutare varianti responsive `1200/1440` per `hero-amalfi` solo se il prossimo CWV mostra saving immagini sopra soglia.
- **P2:** normalizzare i colori semantic admin in token dedicati senza confonderli con la palette brand pubblica.

## Implementation pass — Shop TBT & Public UI Debt

Eseguito per chiudere il warning CWV su `/shop` e ridurre altri warning pubblici senza cambiare il modello commerciale della pagina.

### Cambi implementati

- `Shop`: rimosso `motion/react` dal critical path della pagina. Il modal pagamento e la pill categoria attiva usano markup/CSS standard.
- `Shop`: la newsletter sotto-fold ora è lazy-loaded con `React.lazy`/`Suspense`, così il form complesso e le sue animazioni non pesano sulla prima interazione della route.
- `ProductCard`: rimossa animazione `motion.div` di ingresso; la card mantiene hover/focus CSS e resta più prevedibile lato performance.
- `StickyMobileCTA`: rimosso inline style, shadow raw e render extra per CTA sempre visibile; il reveal usa data attribute e classi Tailwind.
- `Newsletter`: honeypot spostato da inline style a classe Tailwind.

### Verifiche finali

| Check                  | Esito                      |
| ---------------------- | -------------------------- |
| `npm run lint`         | PASS                       |
| `npm run typecheck`    | PASS                       |
| `npm run build`        | PASS                       |
| `npm run audit:ui`     | PASS, 0 errori, 99 warning |
| `npm run audit:size`   | PASS                       |
| `npm run audit:visual` | PASS, 14/14                |
| `npm run audit:cwv`    | PASS, 0 assertion warning  |

Baseline `audit:size` post-pass:

| Budget               |                       Valore |
| -------------------- | ---------------------------: |
| Initial JS           | 589.0 KB raw / 183.4 KB gzip |
| Home route           |    15.7 KB raw / 5.4 KB gzip |
| Shop route           |    16.9 KB raw / 5.4 KB gzip |
| Product route        |    12.1 KB raw / 3.8 KB gzip |
| Media kit route      |    25.9 KB raw / 6.8 KB gzip |
| Collaborazioni route |    23.0 KB raw / 7.3 KB gzip |
| PWA precache         |     99 entries / 2638.74 KiB |

Baseline `audit:cwv` finale:

| Route             | Perf | A11y | Best practices |    FCP |     LCP |   CLS |    TBT |
| ----------------- | ---: | ---: | -------------: | -----: | ------: | ----: | -----: |
| `/`               |   92 |  100 |            100 | 781 ms | 1550 ms | 0.000 |  84 ms |
| `/esplora`        |   92 |   97 |            100 | 745 ms | 1415 ms | 0.000 | 127 ms |
| `/chi-siamo`      |   91 |   97 |            100 | 807 ms | 1329 ms | 0.020 | 131 ms |
| `/collaborazioni` |   90 |  100 |            100 | 715 ms | 1378 ms | 0.003 | 153 ms |
| `/media-kit`      |   93 |   98 |            100 | 793 ms | 1296 ms | 0.004 | 124 ms |
| `/shop`           |   94 |   97 |            100 | 763 ms | 1329 ms | 0.000 |  79 ms |

### Risultato operativo

- `/shop` passa da performance 87 / TBT 204 ms a performance 94 / TBT 79 ms.
- Tutte le route CWV core passano senza warning assertion.
- Il debito UI scende da 102 a 99 warning; i residui principali restano concentrati su admin, componenti motion intenzionali, mappa/PDF e `VieniConNoi`.
- La pagina shop resta coerente con lo stato "boutique in apertura": un prodotto prioritario, checkout demo disabilitato e newsletter carica fuori dal critical path.

### Residui aggiornati

- **P1:** proseguire su `VieniConNoi`, perché ha ancora raw gradient/inline style pubblici e impatta un percorso commerciale ad alta intenzione.
- **P1:** pulire `ExitIntentPopup` e `AutocompleteResults`, piccoli componenti pubblici con raw shadow/rgba.
- **P2:** distinguere i warning intenzionali di motion (`MagneticWrapper`, `TiltCard`, `ScrollProgressBar`) dai warning effettivamente da eliminare.
- **P2:** valutare un budget specifico per TBT route commerciale (`/shop`, `/media-kit`, `/collaborazioni`) sotto 150 ms, non solo sotto 200 ms.

## Implementation pass — Public UI Debt: VieniConNoi / ExitIntent / Autocomplete

Eseguito per chiudere i due residui P1 lasciati aperti dal pass "Shop TBT": raw gradient/inline style su `VieniConNoi` e raw shadow/rgba su `ExitIntentPopup` + `AutocompleteResults`.

### Cambi implementati

- `VieniConNoi`: scrim cover raw `linear-gradient(90deg,rgba(17,17,17,...))` sostituito con utility condivisa `.twu-cover-scrim` (già definita in `index.css`); honeypot anti-spam da `style={{ left: '-10000px' }}` a classe Tailwind `-left-[10000px]`, allineato al pattern già usato in `Newsletter`.
- `ExitIntentPopup`: shadow raw del CTA download (`0 12px 28px rgba(0,0,0,0.1)` / hover `0 16px 32px rgba(0,0,0,0.16)`) mappate sui token `--shadow-lg` / `--shadow-xl`.
- `AutocompleteResults`: shadow raw del dropdown (`0 24px 60px -30px rgba(17,17,17,0.35)`) mappata su `--shadow-xl`.

### Verifiche finali

| Check               | Esito                                                        |
| ------------------- | ------------------------------------------------------------ |
| `npm run typecheck` | PASS                                                         |
| `npm run lint`      | PASS                                                         |
| `npm run audit:ui`  | PASS — i 4 target (7 righe WARN su 3 file) non compaiono più |

### Residui aggiornati

- **P2:** distinguere i warning intenzionali di motion (`MagneticWrapper`, `TiltCard`, `ScrollProgressBar`) dai warning effettivamente da eliminare.
- **P2:** valutare un budget specifico per TBT route commerciale (`/shop`, `/media-kit`, `/collaborazioni`) sotto 150 ms, non solo sotto 200 ms.
