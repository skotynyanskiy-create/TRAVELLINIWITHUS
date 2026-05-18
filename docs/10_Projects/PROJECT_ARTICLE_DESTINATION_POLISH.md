---
title: PROJECT_ARTICLE_DESTINATION_POLISH
status: shipped
started: 2026-05-18
shipped: 2026-05-18
slug: article-destination-polish
owner: Rodrigo
type: ui-polish
risk: low
---

# Article + Destination + ArchiveCard — Polish chirurgico premium

## Obiettivo

Portare il template `/articolo/[slug]` (che ospita pillar e pagine-destinazione) + le ArchiveCard di /esplora + la MobileBottomBar a livello editoriale premium credibile, mantenendo l'architettura attuale. **Polish chirurgico, NON redesign.**

## Trigger

Screenshot utente del 2026-05-18 su `/articolo/puglia-trulli-masserie` con sidebar destra collassata carattere-per-carattere, box "In breve" che saturava il primo screen, breadcrumb in conflitto col navbar, bottoni sidebar che si rompevano in colonne di lettere.

## Sequenza eseguita

1. **travellini-ui-designer** (opus) — direzione visiva completa, lockata in [HANDOFF_article-destination-polish_ui-designer_to_frontend-builder.md](../50_Scratch/HANDOFF_article-destination-polish_ui-designer_to_frontend-builder.md) (status: `consumed`).
2. **travellini-frontend-builder fase 1** — bloccanti + serious ad alto impatto.
3. **browser-auditor fase 1** — 0 regressioni, verdetto `proceed-with-phase-2`.
4. **travellini-frontend-builder fase 2+3** — tutto il rimanente low/mid.
5. **browser-auditor fase 2+3** — verdetto `ship`.
6. **npm run audit:ui** — 0 nuovi warning introdotti (i WARN restanti sono pre-esistenti su file non toccati).
7. **npm run typecheck** — clean.

## Decisioni lockate (le 4 confermate dall'owner)

1. `FinalCtaSection` rimosso dal template articolo (duplicava Newsletter).
2. Label card archivio "Scopri" → "**Leggi**" (DESIGN.md vieta `scopri/esplora` come buzzword).
3. ArchiveCard aspect `4:5` su /esplora (16:10 mantenuto su RelatedArticles a fondo articolo perche' in 2-col strette).
4. ReadingMode kbd ESC hint: visibile solo `md+`, su mobile "Tap × per tornare al sito.".

## Modifiche per file

### Pagina template articolo

- [src/pages/Articolo.tsx](../../src/pages/Articolo.tsx)
  - Sidebar grid breakpoint `lg:` → `xl:` (era la causa #1 del collasso 1024-1279px).
  - Filler `hidden xl:block`.
  - "Torna alla sezione": backdrop pill scuro `bg-black/25 backdrop-blur-md` per contrasto AA.
  - Box "In breve" → lead serif italic con `border-l-2 accent`, no card colorata.
  - Sezione "Pratico" → spec sheet editoriale (border-r desktop / border-b mobile, icone inline 14px, color `muted-fg`).
  - Mappa: `h-[320px] md:h-[420px]`.
  - Risorse CTA: `flex-col md:flex-row` mobile.
  - Chiusura riordinata: AuthorBio → RelatedArticles → Newsletter (FinalCtaSection rimosso).
  - ArticleBody markdown: h2 `mt-10 md:mt-14`, h3 `mt-8 md:mt-10`, p `text-[17px] md:text-lg leading-[1.65] md:leading-[1.7] text-[var(--color-ink-2)]`, li icona 16px gap-2.5.

### Componenti article

- [src/components/article/ArticleHero.tsx](../../src/components/article/ArticleHero.tsx)
  - h1 `text-[clamp(2.25rem,6vw,3rem)] md:text-7xl lg:text-8xl tracking-tight`, container `max-w-4xl`.
  - FAB salva/condividi: `hidden md:flex` (no duplicazione con MobileBottomBar).
- [src/components/article/ArticleSidebar.tsx](../../src/components/article/ArticleSidebar.tsx)
  - Visibility `xl:block` (era `lg:block`).
  - Bottone "Modalita lettura" full-width, font ridotto.
  - h4 "Condividi l'ispirazione" → "Condividi".
- [src/components/article/ShareButtons.tsx](../../src/components/article/ShareButtons.tsx)
  - Cerchi 48px → 36px, gap `gap-2`.
- [src/components/article/TableOfContents.tsx](../../src/components/article/TableOfContents.tsx)
  - IntersectionObserver inline per `data-active` sezione corrente.
  - Stato attivo: `text-[var(--color-ink)] font-semibold` + tratto `w-8 bg-accent`.
- [src/components/article/MobileBottomBar.tsx](../../src/components/article/MobileBottomBar.tsx)
  - 3 azioni (Salva | Indice | Condividi), Pinterest rimosso.
  - Safe-area iOS: `bottom-[max(1.5rem,env(safe-area-inset-bottom))]`.
  - Icona `Menu` → `List`.
  - Label "Salva" fissa (cambia solo colore icona quando saved).
- [src/components/article/AuthorBio.tsx](../../src/components/article/AuthorBio.tsx)
  - Avatar `w-16 h-16 md:w-20 md:h-20`.
  - CTA `flex-col md:flex-row gap-2 md:gap-3`.
- [src/components/article/RelatedArticles.tsx](../../src/components/article/RelatedArticles.tsx)
  - h3 `text-3xl md:text-4xl font-serif`.
  - Rimosso "5 min" hardcoded (campo non esiste su RelatedArticleSummary).
- [src/components/article/ReadingMode.tsx](../../src/components/article/ReadingMode.tsx)
  - kbd ESC hint `hidden md:inline-flex`, mobile "Tap × per tornare al sito.".

### Componenti shared

- [src/components/Breadcrumbs.tsx](../../src/components/Breadcrumbs.tsx)
  - `text-[11px] tracking-[0.18em]`, ultimo item `overflow-hidden text-ellipsis whitespace-nowrap min-w-0`, intermedi `shrink-0`.

### Card archivio

- [src/components/discovery/ArchiveCard.tsx](../../src/components/discovery/ArchiveCard.tsx)
  - Aspect `16:10` → `4:5` (solo variant `editorial`).
  - Lift hover `-translate-y-1` → `-translate-y-0.5`.
  - Eyebrow pill `bg-white/92` → `bg-white/88`.
  - Footer label "Scopri" → "Leggi".

## NON modificati (per design)

- `server.ts`, `firestore.rules`, `admin.ts`.
- `Newsletter*`, `InteractiveMap`, `SEO`, `DemoContentNotice`, `FinalCtaSection` (a parte rimozione dall'import del template articolo).
- Schema markdown / `ReactMarkdown` plugin.
- Palette / CSS vars / font / nuovi token.
- `RelatedCard` aspect 16:10 (intenzionalmente diverso da ArchiveCard 4:5 per il contesto 2-col stretta).
- `index.html` preload (gia' scoped via Helmet su Home/Esplora — il warning fugace non e' un preload globale).

## Verifica

| Check                    | Risultato                                                                         |
| ------------------------ | --------------------------------------------------------------------------------- |
| `npm run typecheck`      | Clean                                                                             |
| `npm run audit:ui`       | 0 nuovi warning introdotti                                                        |
| browser-auditor fase 1   | `proceed-with-phase-2`, 0 regressioni                                             |
| browser-auditor fase 2+3 | `ship`, 0 errori console su 6 combinazioni pagina×viewport                        |
| Viewport coperti         | 375 / 768 / 1280                                                                  |
| Pagine auditate          | `/articolo/puglia-trulli-masserie`, `/articolo/salento-agosto-coppia`, `/esplora` |

## Lascito / next

- 1 warning preload `hero-amalfi.avif` su /esplora (minor perf, non bloccante). Gira a `travellini-perf-engineer` quando si rivede l'hero di /esplora.
- Slug `salento-agosto` citato nel brief originale era sbagliato — quello reale e' `salento-agosto-coppia`. Brief consumato, niente fix codice necessario.
- L'IntersectionObserver TOC e' inline nel componente, no nuova lib. Se in futuro serve riusarlo (es. landing lunghe), candidato all'estrazione in `useActiveSection` hook.
