---
type: spec
area: seo
status: implemented
priority: p0
owner: team
repo: TRAVELLINIWITHUS
route:
  - /
  - /posto/:slug
created: 2026-07-26
source: analisi a occhi nuovi 2026-07-26, misurata su dist/ e firebase.json
related:
  - '[[10_Projects/PROJECT_HOME_RICOMPOSIZIONE_2026-07-26]]'
  - '[[14_Bugs/BUG_LEAD_MAGNET_ROUTES_RETURN_404]]'
tags:
  - spec
  - seo
  - social
  - build
---

# SPEC — Meta per rotta in produzione (2026-07-26)

**Stato: IMPLEMENTATA il 2026-07-26.** Owner ha approvato: approccio A,
placeholder esclusi, 301 sui legacy. Non committata, non deployata.

## 0. Esito

|                                           |                                                                      |
| ----------------------------------------- | -------------------------------------------------------------------- |
| File HTML in `dist/`                      | da **2** a **47**                                                    |
| Pagine con `og:title` proprio             | **46/46**                                                            |
| `og:title` / `og:image` / canonical unici | **46 / 46 / 46**                                                     |
| `og:image` referenziate ma mancanti       | **0**                                                                |
| Card OG generate                          | da **8** a **100** (1200×630 brand-coherent)                         |
| Redirect 301                              | **8**, verificati con un server che replica la priorità di Hosting   |
| Gate                                      | `typecheck` ✅ · **120 test su 26 file** ✅ · `audit:ui` 0 errori ✅ |

File toccati: `scripts/generate-route-html.js` (nuovo),
`scripts/generate-og-images.mjs`, `src/config/routeMeta.ts` (nuovo),
`src/config/routeMeta.test.ts` (nuovo), `src/pages/family/FamilyConsigli.tsx`,
`firebase.json`, `package.json`.

### Difetti trovati durante l'implementazione, non previsti dalla spec

1. **Lo script non era idempotente.** La rotta `/` scrive su `dist/index.html`,
   che è anche il template: una seconda esecuzione senza rebuild usava come base
   un file già iniettato e produceva tag Open Graph **duplicate** su ogni pagina.
   Gli scraper leggono la prima, quindi la card avrebbe mostrato la home su ogni
   URL. Risolto con sentinel `route-meta:start/end` rimossi **in ciclo**.
2. **Primo tentativo di fix sbagliato in due modi.** Il sentinel contiene `(`,
   `)` e `.`: passato a `new RegExp()` diventava un gruppo di cattura e non
   matchava mai i literal → ricerca per stringa. E rimuovere **un** blocco per
   esecuzione creava un punto fisso (N in ingresso → N-1 → N in uscita): lo
   script risultava idempotente sull'hash e continuava a emettere duplicati.
   Lezione: l'hash stabile non dimostra il contenuto corretto.
3. **Guardia sul template inquinato.** Le tag arrivate per vie diverse dai
   sentinel non sono rimovibili: ora lo script **fallisce** se `dist/index.html`
   contiene `property="og:` e chiede di rigenerarlo con `vite build`.
4. **Suffisso di brand doppio** su `/family/consigli`: il title della pagina
   conteneva già `| Travellini Family` e `fullTitle()`/`SEO.tsx` aggiungevano
   `| Travelliniwithus`. Corretto su entrambi i lati, con un test che lo blocca.

### Interazione col service worker (verificata, accettata)

Il plugin PWA gira **dentro** `vite build`; `generate-route-html.js` gira **dopo**
e riscrive `dist/index.html`. Da questa sequenza discendono due fatti letti in
`dist/sw.js`, entrambi accettabili:

1. **Le pagine per-rotta non sono precacheate**, e le navigazioni non le usano.
   Il SW registra
   `NavigationRoute(createHandlerBoundToURL("/index.html"), { denylist: [/^\/_/, /\/[^/?]+\.[^/]+$/] })`:
   `/posto/<id>` non matcha nessuna delle due denylist, quindi a un utente con SW
   attivo viene servita la app shell dalla cache, non il file emesso. **Non è un
   problema**: React renderizza il contenuto e le meta corrette a runtime, e gli
   scraper non eseguono service worker. Le pagine emesse servono esattamente il
   loro pubblico — primo accesso e crawler.

2. **La `revision` di `index.html` nel manifest descrive il file pre-iniezione.**
   Impatto pratico nullo nel caso normale: all'install Workbox scarica
   `/index.html` dalla rete e mette in cache la versione iniettata; la revision è
   solo un marcatore di versione. Un caso limite esiste: `routeMeta.ts` è
   importato solo dagli script, non dal bundle, quindi cambiare title o
   description della **home** non muove nessun hash di asset → stessa revision →
   un utente con SW attivo conserva la vecchia `index.html` in cache. Riguarda le
   sole meta della home per utenti di ritorno, che a runtime vengono comunque
   sovrascritte da React.

   Se un giorno contasse, la correzione è generare il SW **dopo** questo script
   (o passare le pagine emesse a `injectManifest`), non riordinare a caso la
   build.

### Restano aperti

- `FamilyShop.tsx:26` e `Club.tsx:144` hanno lo stesso suffisso manuale. Fuori
  perimetro qui: `/family/shop` è `preview` e `/account/acquisti` è `private`,
  quindi nessuna delle due è nel sitemap. Il difetto è però reale a runtime.
- `/articolo/*` e `/shop/*` da Firestore non hanno meta a build time: lo script
  le segnala come warning senza bloccare (far fallire il deploy perché è stato
  pubblicato un articolo sarebbe peggio del difetto).
- Validazione su Facebook Sharing Debugger e anteprima WhatsApp reale: **richiede
  il deploy**, non è verificabile in locale.

## 1. Il difetto, misurato

In produzione **ogni URL serve lo stesso `index.html`, senza una sola meta tag
social.**

| Evidenza             | Valore                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| `firebase.json`      | `"public": "dist"`, unico rewrite `**` → `/index.html`, nessun rewrite Cloud Run/Functions       |
| `npm run build`      | nessuno step di prerender (`generate:*` → `optimize:images` → `generate-sitemap` → `vite build`) |
| file HTML in `dist/` | **2**                                                                                            |
| `dist/index.html`    | `<title>Travelliniwithus</title>`, **zero** tag `og:` / `twitter:` / `description`               |
| URL nel sitemap      | **46**, di cui **29** `/posto/*`                                                                 |
| card OG generate     | 4 uniche (`dist/og/`), nessuna referenziata per-pagina                                           |

### Perché costa più di ogni altro difetto

WhatsApp, Instagram DM, Facebook, LinkedIn e Telegram **non eseguono
JavaScript**. Ogni condivisione di un articolo o di un posto produce una card
intitolata "Travelliniwithus", senza descrizione e senza immagine. Per un brand
la cui distribuzione _è_ Instagram, il canale principale di acquisizione mostra
una scatola vuota.

Il `<title>` corretto che si vede nel browser arriva da React a runtime: lo
vedono gli utenti e (di norma) Googlebot, **non** gli scraper social.

### Corollario: `server.ts` non gira in produzione

Tutto l'SSR in `server.ts` — `injectMetaTags`, lo schema Article, la lista
`STATIC_APP_ROUTES` e i fix di routing dei commit recenti — vive **solo** sul dev
server. Conseguenze da registrare:

- i 404 su `/posto/*` e `/articolo/*` osservati in locale sono un **artefatto del
  dev server**, non un bug di produzione: Hosting risponde 200 via rewrite;
- manutenere `STATIC_APP_ROUTES` non produce alcun effetto sul sito pubblico;
- nessun redirect è un vero 301: `/italia-nascosta`, `/blog`, `/atlante` sono
  `<Navigate>` client-side, e `/vieni-con-noi` (URL di campagna pubblicato, oggi
  rinominato `/guida-in-regalo`) non ha redirect affatto → soft 404.

## 2. Approcci considerati

|       | Approccio                                                  | Pro                                                                                         | Contro                                                                                                                  |
| ----- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **A** | **HTML per rotta a build time** (raccomandato)             | nessuna dipendenza nuova, nessun runtime, nessun file ad alto rischio, build +pochi secondi | non dà contenuto renderizzato ai crawler, solo meta corrette                                                            |
| B     | Prerender headless (`react-snap`, `vite-plugin-prerender`) | HTML completo, indipendente da JS                                                           | build lenta e fragile con maplibre/three; rischio di catturare lo splash screen (già accaduto agli screenshot di audit) |
| C     | Hosting → Cloud Run con `server.ts`                        | riusa l'SSR già scritto                                                                     | infrastruttura nuova, costo, cold start, tocca `server.ts` (alto rischio + conferma owner)                              |

**Si sceglie A.** Il difetto misurato è l'assenza di meta per gli scraper, e A lo
risolve interamente. B risolve un problema che non è stato dimostrato (Google
esegue JS). C è la scelta giusta solo se in futuro servirà SSR vero, e resta
possibile dopo A senza buttare nulla.

## 3. Architettura

Due script, entrambi estensioni di infrastruttura che **esiste già**.

### 3.1 `scripts/generate-og-images.mjs` — estensione

Oggi genera card **1200×630 WebP** brand-coherent da un template SVG, guidato da
un array `ARTICLES` hardcoded (da cui le sole 4 card esistenti).

Cambio: alimentarlo anche dai **29 posti reali** di `content-seed.json`
(`isPlaceholder: false`), usando `place.name`, `place.city` e `hook`. Il template
e la pipeline restano quelli.

Output: `public/og/posto-<id>.webp` + `.jpg` (fallback per scraper che non
leggono WebP — Facebook lo fa).

### 3.2 `scripts/generate-route-html.mjs` — nuovo

Gira **dopo `vite build`** (gli serve `dist/index.html` come template).

Sorgenti, tutte già in repo e già usate da `generate-sitemap.js`:

- `src/config/surfaces.ts` → `sitemapPaths()`, `isIndexable()` — verità unica su
  quali superfici esistono e sono indicizzabili;
- `src/data/content-seed.json` → titolo, `hook`, `cover`, `place` per posto;
- una tabella locale di title/description per le rotte statiche.

Per ogni rotta: legge `dist/index.html`, inietta nel `<head>`

- `<title>` e `<meta name="description">` (italiano);
- `og:title`, `og:description`, `og:image` (URL **assoluto**), `og:url`, `og:type`,
  `og:locale=it_IT`;
- `twitter:card=summary_large_image`;
- `<link rel="canonical">`;
- JSON-LD `Place` per i `/posto/*`, con `geo` da `place.coordinates`;

e scrive `dist/<rotta>/index.html`.

Firebase Hosting serve un file statico corrispondente **prima** di applicare il
rewrite `**`, quindi `dist/posto/madrid-storyland-disney/index.html` risponde a
`/posto/madrid-storyland-disney` senza toccare `firebase.json`.

### 3.3 Perimetro delle rotte

**Solo i 29 posti reali**, stesso filtro `!isPlaceholder` che
`generate-sitemap.js:195` già applica. I 33 placeholder non ricevono pagina, non
entrano nel sitemap e restano fuori dall'indice: 32 su 33 non hanno nemmeno una
`cover`.

## 4. Cosa NON fa

- Non tocca `server.ts`, `firestore.rules`, `src/config/admin.ts`.
- Non tocca `firebase.json`.
- Non introduce SSR né prerendering di contenuto.
- Non risolve i redirect legacy (`/vieni-con-noi`, `/italia-nascosta`, `/blog`,
  `/atlante`): con Hosting statico un vero 301 richiede `firebase.json` →
  **spec separata**, decisione owner.
- Non aggiunge dipendenze npm.

## 5. Rischi

| Rischio                                             | Mitigazione                                                                                                                                                                                                      |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gli asset in `dist/index.html` sono hashati da Vite | Gli URL sono assoluti (`/assets/…`): copiare il file per rotta è sicuro. Nessuna riscrittura di path.                                                                                                            |
| Meta duplicate: HTML statico + React a runtime      | React sovrascrive lo stesso `<title>`/`og:` a idratazione: l'utente vede il valore giusto, lo scraper legge quello statico. Nessun conflitto visibile. Da verificare che `SEO.tsx` non produca doppioni nel DOM. |
| `og:image` 9:16 dai reel                            | Non si usa la `cover` grezza: si usa la card 1200×630 generata da §3.1.                                                                                                                                          |
| Divergenza fra sitemap e pagine emesse              | Entrambi partono da `sitemapPaths()` + lo stesso filtro `!isPlaceholder`. Un test asserisce che i due insiemi coincidono.                                                                                        |
| Crescita di `dist/`                                 | 29 posti + ~16 statiche ≈ 45 file da ~8 KB = ~360 KB. Irrilevante.                                                                                                                                               |

## 6. Definition of done

- [ ] `npm run build` emette una pagina per ogni URL del sitemap;
- [ ] per ogni rotta emessa, `curl` mostra `og:title`, `og:description`,
      `og:image` **specifici della rotta** (non i default);
- [ ] `og:image` risolve 200 ed è 1200×630;
- [ ] validazione su Facebook Sharing Debugger e su un'anteprima WhatsApp reale
      per: home, un `/posto/*`, `/guida-in-regalo`, `/media-kit`;
- [ ] i 33 placeholder non hanno pagina emessa né voce sitemap;
- [ ] test che asserisce `insieme(pagine emesse) == insieme(URL sitemap)`;
- [ ] `npm run typecheck`, `npx vitest run`, `npm run audit:ui` verdi;
- [ ] nessuna regressione LCP sulla home (le meta non toccano il critical path).

## 7. Approvazioni richieste

- [ ] ok all'approccio A invece di prerender o Cloud Run;
- [ ] ok a escludere i 33 placeholder dalle pagine emesse;
- [ ] decisione separata sui redirect legacy: `/vieni-con-noi` è un URL già
      pubblicato in bio — va consolidato con un 301 verso `/guida-in-regalo`?
