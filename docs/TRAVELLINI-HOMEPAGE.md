---
title: TRAVELLINIWITHUS Homepage — Diario delle meraviglie vere
type: reference
status: active
updated: 2026-07-22
area: product
---

# Homepage — Diario delle meraviglie vere

La home pubblica `/` è un taccuino editoriale digitale per Rodrigo e Betta. La direzione nasce
dal campione Instagram documentato in [[13_Content/INSTAGRAM_CONTENT_AUDIT_2026-07-21]]: il
magnete del brand è la **meraviglia concreta**, cioè posti che sembrano inventati ma vengono
raccontati con prova, prezzo, periodo e un giudizio personale.

## Promessa

> Posti che sembrano inventati. Ma esistono davvero.

Il sito completa ciò che un Reel non contiene: contesto, limiti, periodo giusto e una strada
chiara verso mappa, diario e collaborazione.

## Sequenza narrativa (evoluzione Atlante, 2026-07-22)

1. **Sembra impossibile** — promessa di brand + **scheda di verifica** del posto
   in evidenza (disclosure col timbro: dove/prezzo/per chi/verdetto/trasparenza,
   dati da `content-seed`, link alla scheda completa `/posto/:slug`).
2. **Il registro** — indice vivo dei posti provati (6 voci reali da
   `content-seed`, tipografico, stato scheda dichiarato onestamente). Pagina
   statica, non sticky: un registro lungo verrebbe coperto dallo stack sticky.
3. **Vale davvero?** — metodo: prova, dati pratici e verdetto sincero.
4. **Noi** — Rodrigo e Betta, metodo e trasparenza, CTA verso `/chi-siamo`.
5. **Prossima traccia** — mappa, lead magnet ("Ricevi la prossima traccia",
   lite-guarded), collaborazioni.

Le vecchie pagine "Altrove, vicino" e "Dentro una storia" (2 delle 3 visuali
ImageGen) sono state assorbite dal registro: i loro contenuti-destinazione ora
passano dalle voci reali dell'indice.

## Interazione

- scroll browser-native, senza hijacking;
- pagine sticky con una lieve prospettiva Motion su desktop;
- indicatore `Pagina NN / 05` sincronizzato via Intersection Observer;
- testata, rilegatura e indice laterale persistenti;
- mobile verticale intenzionale, senza 3D né pieghe fragili;
- `prefers-reduced-motion` disattiva trasformazioni e transizioni non essenziali.

## Implementazione

- entry page: `src/pages/AtlanteHome.tsx`;
- esperienza: `src/components/home/cinematic/CinematicHomepage.tsx`
  (+ `HomeIndiceVivo.tsx` per il registro);
- layer atlante riusabile: `src/styles/atlante.css` + tokens `--color-atlante-*`
  in `src/index.css` @theme (i `--journal-*` locali ora sono alias dei globali);
- componenti atlante condivisi con `/posto`: `src/components/atlante/`
  (`PostoStamp`, `SchedaVerifica`, `AtlanteCard`);
- dati registro/scheda: `src/data/content-seed.json` via
  `getRegistroItems`/`getContentById` (`src/config/contentLibrary.ts`);
- stili home-specifici: blocco `.journal-*` in `src/index.css`;
- asset: `public/images/home-journal/` in AVIF, WebP e sorgente PNG;
- reference approvata: `docs/30_Design/references/home-journal-target-2026-07-21.png`;
- verifica visuale: `design-qa.md`.

## Asset e trasparenza

Regola di provenienza ratificata il 2026-07-22:
`docs/20_Decisions/DECISION_IMAGERY_TRUTH_RULE_2026-07-22.md` (ruoli
referenziali → solo foto/frame reali con etichetta per asset; generazione solo
craft non-referenziale).

Stato home: delle tre visuali dichiarate ImageGen, **due sono uscite dalla
composizione** (`altrove-vicino`, `dentro-storia` — assorbite dal registro
tipografico); resta `hero-impossible`, la cui provenienza è **in certificazione
owner** (i docs la dichiarano ImageGen ma coincide con la cover del reel reale
The Burton Juice, title-card inclusa). Finché non è certificata, il posto
`campania-burton-juice` resta `isPlaceholder: true` (noindex) e nessuna nuova
superficie la adotta come prova.

## Vincoli rispettati

- un solo H1 e contenuto HTML indicizzabile;
- nessuna nuova dipendenza;
- immagini AVIF/WebP e lazy loading fuori dall'hero;
- CTA su route pubbliche esistenti;
- nessuna modifica a backend, Firebase, Stripe o file ad alto rischio;
- nessun dato social inventato in pagina.

## Verifica 2026-07-21

- typecheck e build produzione: pass;
- audit UI: zero errori;
- visual smoke: 14/14 pass;
- matrice responsive: 320/375/768/1024/1536 senza overflow;
- axe WCAG 2A/AA/2.1AA: zero violazioni homepage;
- console browser: zero errori.

## Verifica 2026-07-22 (evoluzione Atlante)

- typecheck, lint (0 warning), unit 71/71, build: pass;
- audit:size: home-route 12,5 KB / 110 KB;
- e2e Playwright: 34/34 (desktop + Mobile Chrome);
- Lighthouse `/`: performance 97 · accessibility 100 · best-practices 100 ·
  CLS 0.000 · LCP 1,10 s (tutte le 6 rotte del gate passano);
- browser reale: scheda copertina e flip `/posto` verificati a 555/1280/375,
  console pulita;
- bug pre-esistente scoperto e tracciato:
  `docs/14_Bugs/BUG_2026-07-22_posto_routes_http_404.md` (fix gated su
  `server.ts`, Fase 6 del piano).

## Prossimo incremento

Certificare la provenienza di `hero-impossible` (owner) e completare la prima
scheda verificata end-to-end (prezzo/voto reali di R+B sul Burton Juice) →
primo posto `isPlaceholder: false` indicizzabile, dopo il fix del bug 404 di
`/posto` (server.ts, Fase 6).
