---
type: project
area: product
status: archived
priority: p2
owner: team
repo: TRAVELLINIWITHUS
date: 2026-06-08
related: '[[10_Projects/PROJECT_VISUAL_COPY_CONTENT_AUDIT]]'
tags:
  - project
  - ui
  - motion
  - modernization
  - roadmap
icebox_reason: in attesa di funnel con traffico reale
---

> **Icebox dal 2026-07-31.** Non superato: contiene feature reali mai decise.
> Va ripescato _dopo_ che il funnel ha un ingresso — vedi [[10_Projects/PROJECT_BACKLOG_UNICO_2026-07-31]] §1.
> Non è il backlog corrente.

# PROJECT_MODERNIZATION_PLAN

Piano per portare Travelliniwithus a versioni più moderne, **a ondate**, senza
snaturare il brand. Nasce dall'audit [[PROJECT_VISUAL_COPY_CONTENT_AUDIT]].

## Cosa intendiamo per "moderno" (principio guida)

Moderno qui = **editoriale premium contemporaneo** (riferimenti: magazine digitali
di fascia alta, editorial travel da Awwwards), **non** trendy-generico. Vincoli
invariati da `DESIGN.md`: niente SaaS, niente gradient blob, niente fake control,
calm hierarchy. La modernità si esprime su 5 leve:

1. **Motion con intenzione** — un sistema unico di easing/durate, non animazioni
   sparse copincollate componente per componente.
2. **Transizioni di pagina** — il sito deve "fluire", non ricaricare a scatti.
3. **Tipografia espressiva e fluida** — scala coerente, momenti display forti.
4. **Trattamento immagini** — caricamento elegante (LQIP/blur), art direction.
5. **Storytelling allo scroll** — l'articolo come esperienza, non come muro di testo.

## Baseline — cosa è già moderno (da NON rifare)

- Stack aggiornato: React 19, `motion` 12, GSAP 3.15, `lenis` 1.3 (smooth scroll),
  Tailwind 4 + CSS vars, React Router 7, Vite 6.
- Primitive premium già presenti ma **sotto-sfruttate**: `TiltCard`,
  `MagneticWrapper`, `AnimatedCounter`, `ScrollProgressBar`, `SmoothScrollProvider`.
- **View Transitions API** già cablata: `viewTransitionName` su
  [ArticleHero.tsx](../../src/components/article/ArticleHero.tsx) e
  [ArchiveCard.tsx](../../src/components/discovery/ArchiveCard.tsx) — manca il
  trigger a livello di route per renderla visibile.
- Immagini AVIF/WebP responsive via `OptimizedImage`, code-splitting per route.

**Conseguenza strategica:** il salto di modernità è soprattutto _messa a sistema +
attivazione_ di ciò che esiste, non riscrittura. Costo/rischio molto più bassi del previsto.

---

## Wave 1 — Polish moderno (SICURO, zero decisioni, nessuna foto)

> **Stato 2026-06-08: parzialmente IMPLEMENTATA.** Scoperto durante l'esecuzione che
> gran parte di Wave 1 era _già presente_ nel codebase (segno di maturità):
>
> - **1.1 Motion system** → **fatto**: easing canonico `REVEAL_EASE` + `revealUp` +
>   `DURATION` consolidati in [src/lib/animations.ts](../../src/lib/animations.ts);
>   rimossi i duplicati inline in `HomeFeaturedDestinations` e `HomeEditorialPromise`.
>   Single source of truth per il motion. typecheck/build PASS.
> - **1.5 Card hover** → **fatto**: [ProductCard.tsx:86](../../src/components/ProductCard.tsx)
>   il velo piatto `bg-black/20` permanente su mobile → gradiente dal basso + azioni
>   ancorate in fondo (immagine pulita in alto, bottoni leggibili). Desktop invariato.
> - **1.3 Focus-visible** → **già presente** ([index.css:438](../../src/index.css), ring
>   `accent-text` WCAG AA). No-op.
> - **1.2 Type scale** → token clamp `--text-h1/h2/h3` + `.text-display-*` **già presenti**;
>   le incoerenze H2 peggiori erano già state sistemate nell'audit (S1). Nessun mass-rewrite
>   (rischio/churn non giustificato).
> - **1.4 Spacing rhythm** → esiste `.section-editorial` + `--space-section-y`; conversione
>   di massima delle sezioni ad-hoc rimandata (churn). DEFERRED.
> - **1.6 Eyebrow** → esiste già `.text-eyebrow`; i componenti home usano una variante
>   accent/0.3em deliberata. Unificare è una scelta di direzione visiva → DEFERRED (non
>   forzato per non scavalcare un pattern intenzionale).
>
> **Conclusione Wave 1:** il footprint reale era piccolo perché il design system era già
> maturo. Il vero salto "moderno" è **Wave 2.1 (page transitions)**, ora sbloccata.

Eseguibile subito. Tutto reversibile, nessun impatto strategico.

| #   | Intervento                                                                                                                                                        | Dove                    | Perché "moderno"                                   | Rischio |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | -------------------------------------------------- | ------- |
| 1.1 | **Motion system unico**: estrarre easing/durate/varianti ricorrenti (`REVEAL_EASE`, stagger, fade-up duplicati in 8+ componenti) in `src/lib/motion.ts` condiviso | home/_ , article/_      | coerenza = sensazione "progettato", non assemblato | basso   |
| 1.2 | **Type scale fluida sistematica**: completare i token `--text-h1/h2/h3` con `clamp()` e applicarli ovunque (oggi H2 vanno da `md:text-4xl` a `md:text-6xl`)       | `index.css` + sezioni   | ritmo tipografico da rivista                       | basso   |
| 1.3 | **Focus-visible system**: ring di focus coerente e moderno su tutti gli interattivi (token unico)                                                                 | `index.css`, Button     | a11y + finitura premium                            | basso   |
| 1.4 | **Spacing rhythm**: scala verticale sezioni unificata (oggi `py-16/20/24/28` mista)                                                                               | sezioni public          | respiro editoriale costante                        | basso   |
| 1.5 | **Card hover moderne**: sostituire i veli `bg-black/20` permanenti (ProductCard mobile) con reveal su interazione; uniformare hover (scale/translate sobri)       | ProductCard, card varie | togliere il look "datato" da overlay statico       | basso   |
| 1.6 | **Eyebrow/label system**: componente `<Eyebrow>` unico (oggi tracking 0.18–0.36em arbitrari)                                                                      | nuovo + sezioni         | micro-coerenza percepita                           | basso   |

## Wave 2 — Motion & interazione (MEDIO, qualche micro-scelta)

Dà la sensazione "il sito è vivo". Usa primitive già installate.

> **Stato 2026-06-08: 2.1 IMPLEMENTATA.**
>
> - **Page transitions globali** → **fatto**: tutti i `Link` interni passano da
>   [TransitionLink.tsx](../../src/components/TransitionLink.tsx), che usa
>   `document.startViewTransition` per le navigazioni SPA standard e degrada al
>   comportamento React Router normale per browser non supportati, click modificati,
>   link esterni, `reloadDocument` e `prefers-reduced-motion`.
> - **Shared-element card→articolo** → **fatto**: le cover delle
>   [ArchiveCard.tsx](../../src/components/discovery/ArchiveCard.tsx) verso `/articolo/*`
>   usano lo stesso `viewTransitionName` dell'hero in
>   [ArticleHero.tsx](../../src/components/article/ArticleHero.tsx).
> - **CSS transition tokens** → già presenti in [index.css](../../src/index.css):
>   crossfade root 220-280ms + no animation con `prefers-reduced-motion`.
> - **Verifiche**: `npm run typecheck` PASS, `npm run build` PASS, `npm run audit:ui`
>   PASS con 0 errori / 92 warning preesistenti, smoke browser PASS su desktop/mobile
>   (`document.startViewTransition` registrato 1 volta su navigazione desktop).
>
> **Stato 2026-06-08: 2.2 IMPLEMENTATA.**
>
> - **Reading progress articolo** → **fatto**: hook dedicato
>   [useArticleReadingProgress.ts](../../src/hooks/useArticleReadingProgress.ts) calcola
>   percentuale e sezione attiva tra le sezioni TOC visibili.
> - **TOC animata / attiva** → **fatto**: [TableOfContents.tsx](../../src/components/article/TableOfContents.tsx)
>   riceve `activeId` + `readingProgress`; desktop, inline mobile e overlay mobile mostrano
>   stato corrente con `aria-current`.
> - **Sidebar editoriale** → **fatto**: [ArticleSidebar.tsx](../../src/components/article/ArticleSidebar.tsx)
>   mostra percentuale, barra e sezione corrente ("Ora: ...").
> - **Mobile** → **fatto**: [MobileBottomBar.tsx](../../src/components/article/MobileBottomBar.tsx)
>   mostra progresso e label corrente sopra le azioni Salva / Indice / Condividi.
> - **Verifiche**: `npm run typecheck` PASS, `npm run build` PASS, `npm run audit:ui`
>   PASS con 0 errori / 96 warning (4 nuovi inline transform per barre progresso),
>   smoke browser su `vite preview` PASS desktop/mobile su `/articolo/dolomiti-rifugi-design`
>   (TOC visibile, percentuale visibile, `aria-current`, nessun overflow, nessun errore console).
>
> **Stato 2026-06-09: 2.5 IMPLEMENTATA.**
>
> - **LQIP/blur-up immagini** → **fatto**: [OptimizedImage.tsx](../../src/components/OptimizedImage.tsx)
>   applica uno stato `img-lqip` con placeholder SVG brand-neutral prima del load, poi
>   transizione a immagine nitida tramite `is-loaded`.
> - **Compatibilità handler** → **fatto**: `onLoad` e `onError` passati dai consumer
>   vengono composti con la logica interna invece di poter sovrascrivere lo stato del
>   componente.
> - **CSS loading image** → **fatto**: [index.css](../../src/index.css) rimuove lo
>   scale del vecchio blur-up per non interferire con hover/cover card, mantiene
>   compatibilità con `.img-blur-up` legacy e rispetta `prefers-reduced-motion`.

| #   | Intervento                                                                                                                                                                    | Dove                                                               | Perché                                        | Rischio                                                               |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------- | --------------------------------------------------------------------- |
| 2.1 | **Page transitions globali** via View Transitions API + React Router 7 (`startViewTransition` su navigazione): crossfade morbido tra pagine, **shared-element** card→articolo | `TransitionLink`, `ArchiveCard`, `ArticleHero`, `index.css`        | è LA feature che fa sentire un sito "2025/26" | **implementato**; resta test Safari/iOS reale                         |
| 2.2 | **Reading progress + TOC animata** sugli articoli (riusa `ScrollProgressBar`)                                                                                                 | `Articolo`, `TableOfContents`, `ArticleSidebar`, `MobileBottomBar` | standard editoriale moderno                   | **implementato**; resta test su articoli reali lunghi                 |
| 2.3 | **Scroll-reveal coerente**: stagger system unico, parallax sobrio su immagini hero/section (rispettando `useReducedMotion`)                                                   | sezioni, hero                                                      | profondità contemporanea                      | medio                                                                 |
| 2.4 | **Micro-interazioni mirate**: `MagneticWrapper`/`TiltCard` su CTA primari e cover card (con parsimonia)                                                                       | hero CTA, featured cards                                           | premium tattile                               | basso/medio                                                           |
| 2.5 | **LQIP/blur-up immagini**: placeholder brand-neutral in `OptimizedImage`                                                                                                      | OptimizedImage, index.css                                          | caricamento elegante image-led                | **implementato**; resta verifica visiva su gallery/pagine media-heavy |

## Wave 3 — Editorial storytelling & feature (ALTO, decisioni owner / contenuti)

Qui si alza davvero il livello, ma serve input owner e/o contenuti reali.

| #   | Intervento                                                                                                                        | Dove                  | Dipendenza                         |
| --- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------- |
| 3.1 | **Template Articolo "scrollytelling"**: full-bleed image breaks, pull-quote, blocchi dato, mappa inline, sticky "in questa guida" | Articolo + article/\* | decisione layout + contenuti reali |
| 3.2 | **Destinazione come pagina immersiva** (cover editoriale, capitoli, mappa integrata)                                              | Destinazione          | contenuti reali per regione        |
| 3.3 | **Momento hero "signature"** (kinetic type sobria o micro-video)                                                                  | HeroSection           | **foto/video reali R+B**           |
| 3.4 | **Mappa editoriale potenziata** (cluster, filtri animati, schede ricche)                                                          | Mappa/Mapbox          | contenuti reali                    |
| 3.5 | **Dark/light editorial moments** alternati come ritmo narrativo                                                                   | sezioni               | direzione visiva owner             |

## Wave 4 — Tech & performance modern (TRASVERSALE)

| #   | Intervento                                                                                                         | Perché                            |
| --- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| 4.1 | Sfruttare **React 19**: `useOptimistic` sui form (newsletter/contatti/lead), `<Suspense>` streaming più aggressivo | UX form moderna, INP migliore     |
| 4.2 | **INP/CWV pass** dopo l'aggiunta di motion (budget animazioni, `content-visibility`)                               | non barattare "moderno" con lento |
| 4.3 | **Variable font** Fraunces a pieno (assi optical size) già self-hosted                                             | tipografia viva                   |
| 4.4 | Audit accessibilità motion (`prefers-reduced-motion` su tutte le nuove animazioni)                                 | inclusività + qualità             |

---

## Sequenza consigliata

1. **Wave 1** subito (sicura, alza la coerenza percepita — base per tutto il resto).
2. **Wave 2.1 (page transitions)** come singolo intervento ad alto impatto/basso costo
   (le primitive ci sono già): è il cambio che più "moderna" la sensazione del sito.
3. **Wave 2.2–2.5** a seguire.
4. **Wave 3** solo dopo decisioni owner su layout + arrivo di asset reali.
5. **Wave 4** in parallelo come guardrail di qualità.

## Cosa serve da te (gate decisionali)

- **Ambizione**: polish coerente (W1+W2) o anche redesign editoriale degli articoli (W3)?
- **Asset**: W3.3 (hero signature) resta bloccata finché non ci sono foto/video reali R+B.
- **Direzione visiva**: per W3 conviene prima un giro di `design-research` (riferimenti
  editorial/travel premium) per lockare la direzione prima di costruire.

## Note di rischio

- Le page transitions e il parallax vanno testati su Safari/iOS e con
  `prefers-reduced-motion` (degrado pulito a crossfade/nessun motion).
- Ogni wave passa per `typecheck` + `build` + `audit:ui` + verifica browser reale,
  come l'audit precedente.
- Nessun intervento tocca file high-risk (`server.ts`, `firestore.rules`, `admin.ts`).

---

## Direzione visiva — Design Research (2026-06-08, LOCKED)

Brief: lockare la direzione "moderna" per editorial/travel premium people-led, prima di
implementare le Wave. Fonti consultate: Awwwards (collezioni Editorial Layout / Typography
/ Page Transitions), rassegne editorial long-form (vev.design), cataloghi scrollytelling
(shorthand, maglr), benchmark magazine (Cereal, Kinfolk, Monocle, Condé Nast Traveller).

### Insight che cambia il piano

**La palette non si tocca.** Sand/ink + terracotta è _già_ esattamente la direzione
warm-neutral editoriale di Cereal/Kinfolk, oggi più on-trend che mai. Modernizzare NON
significa cambiare colori: significa **espressione tipografica + motion + transizioni +
trattamento immagini + ritmo di layout**. Questo conferma e restringe il piano: zero
rischio palette, tutto sull'esperienza.

### Reference 1 — Cereal Magazine (readcereal.com)

- **Cosa rubare:** whitespace generosissimo, una sola idea per schermata, serif display
  grande su pochissimo testo, immagini full-bleed che "respirano", zero decorazione.
- **Palette:** warm off-white / ink / un accento tenue — **già la nostra**.
- **Type:** serif display ampio + body piccolo e arioso, molto leading.
- **Motion:** quasi nullo, solo fade/reveal lenti. La calma È il lusso.
- **Verdict:** **applicabile** — è il nostro vicino di brand più prossimo.
- **Cosa NON portare:** è quasi _troppo_ statico; noi vogliamo motion sobrio, non zero.
- **Traduzione → codice:** rinforza Wave 1.2 (type scale fluida) e Wave 1.4 (spacing
  rhythm). Aumentare il leading del body editoriale e la scala dei display H1/H2.

### Reference 2 — Scrollytelling editoriale (Condé Nast Traveller / NYT / pattern shorthand)

- **Cosa rubare:** dentro l'articolo lungo — **media pinnato** mentre scorre il testo,
  **break full-bleed** di immagine tra i capitoli, **pull-quote** a tutta larghezza,
  **TOC sticky** "in questa guida", reveal di testo su scroll. Il pattern ricorrente nei
  9 esempi shorthand: lo scroll _serve la narrazione_, non è spettacolo fine a sé.
- **Type:** display per i capitoli, citazioni in serif italic grande.
- **Motion:** scroll-driven con `prefers-reduced-motion` rispettato.
- **Verdict:** **applicabile con adattamenti** — è il cuore di Wave 3.1.
- **Cosa NON portare:** data-viz pesante, 3D, animazioni-spettacolo (fuori brand).
- **Traduzione → codice:** Wave 3.1 sul template `src/components/article/*` +
  `src/pages/Articolo.tsx`; riusare `ScrollProgressBar`, aggiungere componenti
  `FullBleedBreak`, `PullQuote`, `StickyToc`.

### Reference 3 — Page/shared-element transitions (Awwwards "Page Transitions" + View Transitions API)

- **Cosa rubare:** la **continuità**. Card della griglia → hero dell'articolo come
  _shared element_ (l'immagine "vola" e si espande), crossfade morbido tra pagine. È il
  singolo segnale che fa leggere un sito come "2025/26".
- **Motion:** 300–500ms, easing morbido, mai bouncy su transizioni di pagina.
- **Verdict:** **applicabile** — Wave 2.1, e abbiamo già i `viewTransitionName` cablati.
- **Cosa NON portare:** transizioni lunghe/teatrali che rallentano la navigazione; vanno
  testate su Safari/iOS con fallback a crossfade.
- **Traduzione → codice:** trigger `startViewTransition` a livello di route
  (React Router 7) in `App.tsx`/`Layout.tsx`; i nomi condivisi esistono già in
  `ArticleHero.tsx` e `ArchiveCard.tsx`.

### Sintesi finale (direzione consigliata)

Per Travelliniwithus la direzione moderna è **"Cereal che si muove"**: la calma
editoriale warm-neutral che già avete, resa contemporanea da (a) tipografia display più
espressiva e fluida, (b) transizioni di pagina con shared-element, (c) articolo come
scrollytelling sobrio, (d) immagini che caricano con eleganza (LQIP). Nessun cambio di
palette, nessun effetto-spettacolo. Questo valida le Wave del piano e ne abbassa il
rischio: si lavora su esperienza e ritmo, non su identità.

Direzione **LOCKED** → si può procedere con Wave 1 (polish) e Wave 2.1 (page transitions)
senza ulteriore esplorazione visiva. Wave 3 (articolo/destinazione) usa Reference 2.

## Link

- [[PROJECT_VISUAL_COPY_CONTENT_AUDIT]]
- [[PROJECT_HOME_HERO_NAV_REFINEMENT]]
- [[DESIGN]]
