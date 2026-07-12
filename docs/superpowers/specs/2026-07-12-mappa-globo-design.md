# /mappa → globo MapLibre — design spec

Status: approved by owner 2026-07-12. Ready for implementation plan.

## Contesto e obiettivo

Il proprietario ha chiesto una vista 3D immersiva per esplorare le destinazioni Travelliniwithus, pensata per scalare da poche decine a centinaia di posti nel tempo. Dopo un giro di brainstorming che ha esplorato una direzione grafica alternativa (sand/atlante da collezione), il proprietario ha corretto la rotta osservando la pagina `/mappa` già esistente e funzionante: quella è l'identità visiva giusta (dark, marker terracotta, card editoriali curate, filtri continente/esperienza). L'obiettivo diventa quindi **evolvere `/mappa`**, non sostituirla — proiezione globe, clustering vero, camera cinematografica, gerarchia marker, promozione a voce di nav principale — mantenendo intatta l'identità visiva già validata.

Durante l'indagine è emerso e **già risolto** un bug bloccante indipendente: `react-map-gl/maplibre` non era in `optimizeDeps.include` di Vite, causando crash ciclici "Invalid hook call" sul componente Map (fix in [vite.config.ts](../../../vite.config.ts), stesso pattern già usato per three.js/R3F).

## Cosa NON cambia

- Palette dark/ink + terracotta, nessun nuovo colore.
- Le due righe di filtri chip (continente + esperienza) e i loro handler.
- Le 3 card "Percorsi suggeriti" editoriali curate.
- Il popup React su click marker (card con foto, categoria, CTA).
- Il banner "anteprime editoriali" quando `usingDemo` è true.
- La CTA "Apri archivio" verso `/esplora`.
- File ad alto rischio (`server.ts`, `firestore.rules`, `src/config/admin.ts`) — nessuna di queste modifiche li tocca.

## Modifiche

### 1. Proiezione globe

File: `src/components/map/MapboxWorldMap.tsx`, componente `<Map>` (riga ~670).

- Aggiungere `projection="globe"` sul componente `<Map>`. Verificato direttamente nei typing installati (`node_modules/@vis.gl/react-maplibre/dist/components/map.d.ts:39`): il prop accetta `ProjectionSpecification | "mercator" | "globe"`. **Correzione rispetto a una ricerca precedente**: `"globe"` e `"vertical-perspective"` sono ENTRAMBI valori validi ma con comportamento diverso (documentato in `node_modules/maplibre-gl/dist/maplibre-gl.d.ts:10136-10151`) — `"globe"` è uno sferoide che si appiattisce automaticamente in proiezione Mercator quando lo zoom si avvicina al livello via (comportamento standard "Google Earth"); `"vertical-perspective"` resta sfera anche a zoom ravvicinato e non è accessibile come stringa breve sul componente `<Map>` (richiederebbe l'oggetto completo `{ type: 'vertical-perspective' }`). Dato che `focusArticle` fa già `flyTo` fino a zoom 5.2 su singole destinazioni, `"globe"` è la scelta corretta: la mappa torna a comportarsi normalmente (piatta, leggibile) una volta zoomati su un posto.
- Impostare esplicitamente `sky={{ 'atmosphere-blend': 0.8, 'sky-color': '#0a0a0a', 'fog-color': '#1a1a1a', 'horizon-fog-blend': 1.0 }}` per allineare l'atmosfera di default (procedurale, attiva automaticamente in globe mode) al brand dark invece di lasciare il default MapLibre.
- Lo stile remoto (`https://tiles.openfreemap.org/styles/dark`) non richiede modifiche: la proiezione è impostata client-side.
- `initialViewState` resta invariato come punto di partenza (longitude 12.5, latitude 42.0, zoom 3.5, pitch 45) — nessuna nuova sequenza d'apertura cinematica in questa iterazione: la priorità è la proiezione + il clustering, non una coreografia d'ingresso.

### 2. Clustering nativo (fix del groviglio di marker)

File: `src/components/map/MapboxWorldMap.tsx`, memo `pins` (righe 431-485).

Causa del bug visibile oggi: ogni articolo è un `<Marker>` React individuale senza aggregazione; con più contenuti sullo stesso paese lo jitter di ±0.3° (riga 385) non basta a separarli visivamente a bassi zoom.

Approccio scelto: **clustering nativo GeoJSON di MapLibre** (`Source` con `cluster={true}` + layer cerchio + layer numero), non Supercluster via npm.

Motivazione: zero nuove dipendenze, e permette di mantenere intatti i `Marker` React esistenti (popup, `focusArticle`, hover, `aria-label`) per i punti sopra una soglia di zoom, aggiungendo il layer cluster nativo solo sotto quella soglia. A 40-70 punti attuali (target: centinaia) è sufficiente; Supercluster resta un'opzione futura solo oltre ~500 punti con drill-down multi-livello.

Dettagli implementazione:

- Nuovo memo `articlesGeoJSON` che converte `filteredArticles` in `FeatureCollection`.
- Nuovo `Source` con `cluster`, `clusterMaxZoom`, `clusterRadius` (valori da calibrare in build sul dataset reale).
- Due `Layer`: cerchio cluster (palette terracotta/ink esistente, nessun nuovo colore) + numerale.
- Gate condizionale: sotto la soglia di zoom mostra il layer cluster nativo; sopra, torna ai `Marker` React esistenti (comportamento invariato per popup/hover/focus).
- Click su cluster → zoom-to-bounds dei figli (non uno zoom fisso).
- `aria-label` con conteggio sul layer cluster, scritto contestualmente (non rimandato) dato che il clustering entra in questo stesso intervento.

### 3. Camera choreography (minima)

File: `src/components/map/MapboxWorldMap.tsx`, `focusArticle` (riga 344).

- `flyTo` esistente resta la base; aggiornare l'easing a una curva più cinematografica (non lineare) per il salto da cluster/marker a destinazione.
- **Gate obbligatorio su `prefersReducedMotion`** (bug a11y reale, vedi §4.1): con reduced-motion attivo, `flyTo` diventa `jumpTo` istantaneo.

Non introduciamo in questa iterazione una sequenza d'apertura elaborata (multi-step con stagger, ecc.): resta fuori scope per tenere il PR piccolo e verificabile; è un'estensione naturale futura una volta che il globo di base è stabile in produzione.

### 4. Fix UX/accessibilità inclusi in questo intervento

Selezionati con criterio: solo impatto reale già presente nel codice, non ipotetico, e compatibili con l'evoluzione a globo (non un redesign a parte).

| #   | Fix                                                                                  | Riga    | Motivo                                                                                                                                                                      |
| --- | ------------------------------------------------------------------------------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `flyTo` non gated su `prefersReducedMotion`                                          | 344-349 | WCAG 2.1 A (2.3.3) — priorità alta: il globo aggiunge movimento camera, va gated prima di estenderlo.                                                                       |
| 2   | Marker senza `role`/`tabIndex`/`onKeyDown`                                           | 440-482 | WCAG 2.1 A (2.1.1), bloccante per navigazione solo-tastiera. Le card della mini-lista sotto (riga 807) sono già `motion.button` corrette — incoerenza da sanare sui marker. |
| 3   | Touch target marker mobile 36px (`h-9 w-9`)                                          | 464     | Sotto soglia 44px (WCAG/Apple/Android). Fix: `h-10 w-10`/`h-11 w-11` o hit-area estesa via pseudo-elemento.                                                                 |
| 4   | Popup overflow potenziale su 375px (`maxWidth 320px` fisso + card `w-[300px]` fissa) | 700-701 | `maxWidth="min(320px, calc(100vw - 32px))"`.                                                                                                                                |
| 5   | Hover `scale-110` su marker non gated reduced-motion                                 | 452     | WCAG A minore, incluso perché il file è comunque toccato in questo intervento.                                                                                              |

Scartati esplicitamente (con motivo, per non perdere la decisione):

- Spinner di loading non gated reduced-motion (riga 494) — impatto trascurabile, non blocca interazione, rimandabile a passata cosmetica separata.
- Warning console `Image "circle-11" could not be loaded"` — rumore, nessuna citazione nel codice sorgente del componente, causa probabile lato tileset OpenFreeMap esterno, non un problema frontend risolvibile qui.
- `LITE_MODE` — nessun gap reale rilevato nell'audit.

### 5. Gerarchia marker (featured/partner)

I marker con `isPartner: true` mantengono il trattamento verde/stella già esistente (righe 465-479) — nessun cambiamento qui, era già una gerarchia funzionante. Nessuna nuova categoria "signature" viene introdotta in questa iterazione: la direzione "Boutique curatoriale" col campo dato `curated`/`featured` esplorata nel brainstorming resta un'estensione futura, non necessaria per sbloccare il globo.

### 6. Promozione in nav principale

File: `src/components/Navbar.tsx`.

- Aggiungere `{ name: 'Mappa', href: '/mappa' }` come voce standalone nell'array `navItems` (righe 151-175), posizionata dopo "Esplora" e prima di "Racconti".
- Icona `Globe` da `lucide-react`, coerente con la nuova proiezione.
- Estendere `isItemActive()` (righe 177-206) con il case `path === '/mappa'`.
- Il drawer mobile la eredita automaticamente (righe 541, 622-632) — nessuna voce senza `subLinks` richiede markup dedicato.
- **[DA VERIFICARE IN BUILD]** eventuale pattern di tracking click sulle voci nav esistente in `TransitionLink.tsx`, da replicare per coerenza analytics — non confermato nell'audit.

## Fuori scope (esplicito)

- Nessuna nuova direzione visiva/palette (la direzione "Atlante da collezione" sand esplorata nel brainstorming è stata scartata dal proprietario).
- Nessuna sequenza d'apertura cinematografica elaborata.
- Nessun campo dato `curated`/`featured` nuovo su `DestinationNode`.
- Nessuna vista Globo separata sulla pagina Destinazioni (`src/pages/Destinazione.tsx`) — `/mappa` resta l'unica esperienza mappa/globo ufficiale del sito.
- Nessun tocco a `server.ts`, `firestore.rules`, `src/config/admin.ts`.

## Testing

- `npm run typecheck` dopo ogni modifica TS.
- Vitest esistente su `MapboxWorldMap` se presente, altrimenti nessun nuovo test unitario obbligatorio (componente principalmente di integrazione MapLibre).
- Playwright/browser-auditor: smoke su `/mappa` (proiezione globe visibile, filtri funzionanti, click cluster fa zoom, click marker apre popup, nav "Mappa" raggiungibile e attiva), viewport 375/768/1280, tastiera (tab fino a un marker, Enter apre popup), `prefers-reduced-motion` (nessun flyTo animato).
- `npm run audit:ui` per coerenza CSS-vars/a11y generale.

## Rischi noti

- Discrepanza di nome API (`vertical-perspective` vs `globe` generico) da confermare a compile-time (typecheck fallirà subito se sbagliato — rischio basso).
- Comportamento zoom alto in globe mode non documentato con certezza — verificare empiricamente in dev prima di considerare il lavoro concluso.
- Tuning `clusterMaxZoom`/`clusterRadius` richiede calibrazione visiva sul dataset reale, non solo teorica.
