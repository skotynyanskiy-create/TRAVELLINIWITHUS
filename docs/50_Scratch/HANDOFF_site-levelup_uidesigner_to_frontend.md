---
title: HANDOFF_site-levelup_uidesigner_to_frontend
status: consumed
created: 2026-07-05
from: travellini-ui-designer
to: travellini-frontend-builder
slug: site-levelup
expires: 2026-07-19
type: handoff
area: delivery
---

## Implementation note (travellini-frontend-builder, 2026-07-05)

P0.1-P0.4 + P1.1-P1.4 implemented across 13 files (index.css token +
Shop/ProductCard/demoGuides, Navbar, MonetizationTeaser/CommercialBlock/
HomeEditorialPromise/HomePartnerSignal/NewsletterFeature, Esplora,
Destinazione, ContentCard). typecheck/eslint/audit:ui all clean.

Scope decisions (not relitigating, just recording):

- Contrast map (P0.3) applied to the named confirmed offenders plus any
  matching instance found within the exact block already being edited for
  another reason (e.g. same dark card). Did NOT sweep files not otherwise
  touched (Esplora.tsx / CommercialBlock.tsx keep other black/40-55,
  white/30-40 instances outside the named lines) — candidate for a
  follow-up contrast pass if the axe-core audit surfaces them.
- Guida.tsx left untouched: removing `isBestseller: true` from
  demoGuides.ts already makes its Bestseller badge dead code (condition is
  always false), satisfying the "0 nodi Bestseller su /guide/\*" criterion
  without touching a file outside the spec's list.

Next: browser-auditor (audit:a11y + 375/1440 screenshots) +
travellini-quality-auditor, per the handoff's own "Next hand-off" section.

# Handoff: implementa la remediation LOCKED TIER 1 (trust + a11y + eyebrow)

## Why this work matters

Sono i trust-killer + a11y del pavimento di livello: finché sono live nessun altro
lavoro alza il percepito. Remediation, NON redesign. DNA locked: Fraunces + sand
#faf8f4 + terracotta #c2410c + foto reali + lucide.

## Decisions already made (LOCK — non ridiscutere)

- NUOVO TOKEN in src/index.css @theme (additivo, DNA-safe):
  `--color-accent-on-dark: #e8834e;` — accent testo AA (~6:1) su ink/ink-deep.
  `--color-accent` (#c2410c) resta solo per display ≥24px, filetti, icone.

### P0.1 Shop fake-bestseller (trust killer)

- Shop.tsx L252: `isBestseller={product.isBestseller || isLarge}` → `isBestseller={false}`.
- ProductCard.tsx L67-74: rimuovi il blocco JSX badge "Bestseller". "Lista d'Attesa" (L76-82) resta.
- demoGuides.ts L33: rimuovi `isBestseller: true`.
- Shop.tsx L112 sort: NON toccare (dato, non claim).
- Accept: 0 nodi "Bestseller" su /shop e /guide/\*; prima card mostra solo "Lista d'Attesa".

### P0.2 Navbar 9px

- Floor: label ≥11px, counter ≥10px. Navbar.tsx L398→text-[11px], L465-466→text-[11px], L413→text-[10px].
- Accept: grep "text-\[9px\]" Navbar.tsx = 0; no overflow 375.

### P0.3 Contrasti ≥4.5:1

- Su scuro: body floor white/70; eyebrow accent → --color-accent-on-dark; mai --color-accent testo <18px su scuro.
- Su chiaro: no opacità nero/ink per testo. Map:
  black/40|45 + ink/50 → --color-muted-fg-2; black/50|55 → --color-ink-2 (body) o --color-muted-fg-2;
  --color-muted testo → --color-muted-fg-2; white/40|42|45|48 → white/70.
- Offender confermati: Shop.tsx L278, MonetizationTeaser L60, CommercialBlock L113,
  HomeEditorialPromise L49, Esplora L125, Navbar L367, nav feature eyebrow L329.
- Accept: npm run audit:a11y = 0 violazioni contrasto su /, /destinazione, /esplora, /shop,
  /chi-siamo, /collaborazioni, /media-kit. Admin escluso.

### P0.4 Destinazioni tile senza foto → "targa editoriale"

- Destinazione.tsx DestinationsHub L101-129: tile senza cover NON più bg-ink-deep.
  Variante targa: bg-surface-2, stesso aspect/radius/posizione; watermark iniziale Fraunces
  o glyph lucide in text-[var(--color-border)]; filetto terracotta h-px w-8 in alto-sx;
  nome font-serif text-3xl ink; count text-[11px] tracking-[0.2em] muted-fg-2 + ArrowRight.
  Tile con cover invariate. Hero sand fallback DestinationWorld (L221-246) invariato.
- Accept: nessun rettangolo scuro vuoto su /destinazione; no img finta/AI; no overflow 375.

### P1.1 Eyebrow vocabulary (5 device, ≤1 KICKER-ACCENT/pagina, adiacenti diversi)

- A KICKER-ACCENT: .text-eyebrow + accent-text (scuro: accent-on-dark) — solo sopra h1.
- B FILETTO+LABEL: h-px w-8 bg-accent + .text-eyebrow muted-fg-2.
- C NUMERALE: font-serif text-[2.75rem] text-border + titolo.
- D PILL: PezzoForte L103 (border-border rounded-full px-3.5 py-1.5 text-[11px] uppercase tracking-[0.2em]).
- E OCCHIELLO-SERIF: font-serif text-lg italic ink-2.
- Assegnazione: /destinazione hub→A; DestinationWorld→A+B; LegacyRegion→A+D+B; Shop→A+B;
  Home EditorialPromise→A(on-dark), PartnerSignal→D, NewsletterFeature→B, MonetizationTeaser→A.
- Migra eyebrow hand-rolled a .text-eyebrow (11px/0.18em).

### P1.2 Small-text floor: pubblico ≥11px, badge/counter ≥10px.

ProductCard L62 9px→10px; ContentCard L90/L94 9px→10px.

### P1.3 ContentCard fallback: sostituisci TYPE_GRADIENT saturi (L17-28) con targa

ink-deep + colore-categoria tokenizzato (--color-cat-\*) come filo/dot; hook bianco. No raw-hex.

### P1.4 Ritmo sezioni: mt-20 md:mt-24; occhiello→titolo mb-3; titolo→body mt-4/5. No nuovi valori.

## Out of scope (do NOT touch)

- Palette core (solo aggiunta accent-on-dark). Foto reali/crop (TIER 2 asset-curator).
- Copy/meta (seo). Home Sentiero (Home.tsx) e Atlante (TIER 3). server.ts/firestore.rules/admin.ts.
- src/pages/admin/**, src/components/admin/**. Shop.tsx L112 sort. Footer white/55 (passa).

## Open questions / decisions for the user

- Nessuna che blocchi. `--color-accent-on-dark` è additivo; se l'owner lo rifiuta,
  fallback degenerato = text-white/80 per gli eyebrow su scuro (perde terracotta).

## Next hand-off

- Next: browser-auditor (audit:a11y 0 violazioni; screenshot 375+1440) + travellini-quality-auditor
  (audit:ui, grep "nessun Bestseller residuo", grep small-text). Poi TIER 2 asset-curator
  (popola le cover reali nelle targhe Destinazioni).
- Trigger: P0.1-P0.4 implementati e verificati in browser.
