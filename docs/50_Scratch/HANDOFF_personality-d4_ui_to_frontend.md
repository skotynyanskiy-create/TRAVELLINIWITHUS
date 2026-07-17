---
title: HANDOFF_personality-d4_ui_to_frontend
status: open
created: 2026-07-18
from: travellini-ui-designer (workflow personality-briefs)
to: travellini-frontend-builder
slug: personality-d4
expires: 2026-08-01
type: handoff
area: delivery
---

# Brief bloccato — Direzione 4: il verdetto come firma (Il Timbro) su pagina-posto e articoli

> Verificato dal garante di coerenza 2026-07-18: nessun conflitto con i brief
> D3/D5 (superfici disgiunte). Implementare DOPO D3, in qualunque ordine
> rispetto a D5.

## Perché

La critica ui-designer 2026-07-17 ha isolato due difetti che si aggravano a vicenda. Primo: il voto /10 è l'artefatto-dato più ownable del brand ma nel `ReviewBlock` è renderizzato come numerone serif nudo (`text-5xl` + `/10` + verdict inline) — "un altro numero grande", indistinguibile da un rating e-commerce. Secondo: su `Posto.tsx` l'ordine DOM mette l'utility (Salva/Condividi, card Info pratiche con Indicazioni) sopra il carattere (ReviewBlock a posizione 6). La soluzione tiene insieme i due vincoli non negoziabili: (a) trattamento a timbro riconoscibile (NON stelle, NON badge), (b) verdetto sopra l'utility SENZA spingere "Indicazioni" sotto la piega (North Star `place_directions_click >= 15%`). Modifica DOM chirurgica: anticipazione-timbro compatta a ridosso dell'h1 (posizione 2), card Info pratiche invariata (posizione 4), `ReviewBlock` completo resta dopo la descrizione ma apre col timbro in scala grande.

## Decisioni bloccate (design law)

- **Un'identità-timbro, due rendering.** DNA condivisa: numerale **Fraunces** + anello hairline + "su 10"/"/10" + **nessuna stella**. Autorità ink + parola-verdetto terracotta. Questa è "Il Timbro".
- **`VerdictSeal` (nuovo componente) = medaglione circolare**, il momento-firma. Usato in: (a) cluster header di `Posto.tsx` (size `md`), (b) lead del `ReviewBlock` (size `lg`, in Posto e Articolo). Solo su superfici sand.
  - Contenitore: `relative inline-flex shrink-0 items-center justify-center rounded-full border border-[var(--color-ink)]/25 bg-[var(--color-surface)]`. `md` = `h-14 w-14 md:h-16 md:w-16`; `lg` = `h-20 w-20 md:h-24 md:w-24`.
  - Doppio anello concentrico (il tell da timbro-notarile): span interno `aria-hidden` `pointer-events-none absolute inset-[3px] rounded-full border border-[var(--color-ink)]/12`.
  - Numero: `font-serif text-[var(--color-ink)]`, `md` = `text-xl md:text-2xl`, `lg` = `text-3xl md:text-4xl`, `leading-none`. Virgola italiana (`formatScore`).
  - Sotto il numero, dentro il cerchio: `mt-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted-fg)]` con testo **`su 10`** (NON "/10").
  - **Nessuna icona dentro. Nessuna ombra. Nessun fill colore. Nessun gradient. Flat, solo hairline.**
  - Non interattivo. `role="img"` + `aria-label="Voto della redazione {X,X} su 10"`; contenuto visivo `aria-hidden`.
  - `if (overall == null) return null` — mai un cerchio-placeholder.
- **`RatingPill` (restyle) = token inline** per liste dense e hero scuro. Regola di superficie: **medaglione su header sand calmi, pill su meta-row dense/scure**.
  - Elimina la `Star` e il fill `--color-accent-soft`. Diventa: pill hairline + numerale Fraunces + `/10`, `inline-flex items-baseline gap-0.5 rounded-full border px-2.5 py-1`.
  - Nuovo prop `tone?: 'light' | 'dark'` (default `light`). Light: `border-[var(--color-ink)]/15 bg-[var(--color-surface)] text-[var(--color-ink)]`, slash `text-[var(--color-muted-fg)]`. Dark: `border-white/25 bg-white/5 text-white`, slash `text-white/55`.
  - Numero `font-serif text-sm font-medium leading-none`; slash `/10` `text-[10px] font-medium leading-none`. `role="img"` + aria-label invariato.
- **Nuovo ordine DOM colonna sinistra `Posto.tsx`**:
  1. `h1` — invariato
  2. **Cluster verdetto (NUOVO, sostituisce l'attuale riga luogo+RatingPill):** `VerdictSeal md` + blocco { parola-verdetto (terracotta) / luogo (MapPin + placeLabel, link a destUrl) }
  3. riga Salva / Condividi — invariata
  4. card "Info pratiche" (Indicazioni primario) — invariata, sopra la piega
  5. descrizione — invariata
  6. `ReviewBlock` (nuovo lead a timbro `lg`) — stessa posizione
  7. riga CTA reel — invariata
- **Fallback senza review:** `VerdictSeal` rende `null`, la parola-verdetto non appare, il cluster degrada alla sola riga luogo. Nessun buco visivo.
- **Articoli:** hero scuro (`ArticleHero`) → `RatingPill tone="dark"` nella meta-row; `VerdictSeal lg` dentro il `ReviewBlock` (superficie sand).
- **Copy invariato.** Resta l'eyebrow `La nostra scheda`. Il peso di firma è VISIVO.

## File e modifiche

**`src/components/VerdictSeal.tsx`** — NUOVO. Presentational, props `{ overall?: number; size?: 'md' | 'lg' }`, `return null` se `overall == null`. Anatomia esatta sopra.

**`src/utils/formatScore.ts`** — NUOVO (consigliato): estrai l'unica `formatScore` (`value.toFixed(1).replace('.', ',')`) e importala in RatingPill, ReviewBlock, VerdictSeal.

**`src/pages/Posto.tsx`** — sostituisci il blocco riga luogo + RatingPill con il cluster header:

```tsx
<div className="mt-4 flex items-center gap-4">
  <VerdictSeal overall={item.review?.overall} size="md" />
  <div className="min-w-0">
    {item.review?.verdict && (
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-accent-text)]">
        {item.review.verdict}
      </p>
    )}
    {destUrl ? (
      <Link
        to={destUrl}
        className="mt-1 inline-flex items-center gap-2 rounded text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-text)] underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
      >
        <MapPin size={14} /> {placeLabel}
      </Link>
    ) : (
      <p className="mt-1 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-text)]">
        <MapPin size={14} /> {placeLabel}
      </p>
    )}
  </div>
</div>
```

Rimuovi `import RatingPill` (se non più usato in questo file), aggiungi `import VerdictSeal`. Nient'altro cambia in pagina. NOTA: leggi prima il file — il blocco attuale potrebbe differire leggermente dal riferimento del brief; adatta preservando la sostanza (seal + verdetto + luogo).

**`src/components/ReviewBlock.tsx`** — sostituisci il lead `overall != null` (numerone `text-5xl` + `/10` + verdict inline) con:

```tsx
{
  overall != null && (
    <div className="mt-4 flex items-center gap-4">
      <VerdictSeal overall={overall} size="lg" />
      {verdict && (
        <span className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-accent-text)]">
          {verdict}
        </span>
      )}
    </div>
  );
}
```

`summary`, barre `criteria`, `pros`/`cons` invariati.

**`src/components/RatingPill.tsx`** — restyle completo come da design law (no Star, prop `tone`).

**`src/components/article/ArticleHero.tsx`** — `<RatingPill overall={article.review.overall} tone="dark" />`.

**Card che NON cambiano markup** (`ContentCard`, `ArchiveCard`, `QuickViewDrawer`): ereditano il restyle light. Verifica leggibilità nella meta-row.

## Stati e accessibilità

- Seal e pill non interattivi: `role="img"` + aria-label, contenuto visivo `aria-hidden`. Nessun focus/hover.
- Link luogo nel cluster: ring focus-visible esplicito (colma gap a11y preesistente).
- reduced-motion: nessuna animazione. CLS: dimensioni fisse.
- Contrasto: verifica leggibilità pill dark su cover chiare nell'hero.

## Cosa NON fare

- Niente stella, niente icona lucide dentro il seal.
- Niente fill accent/accent-soft, gradient, texture ceralacca, ombra: solo doppio hairline ink.
- Niente colore-categoria sul seal.
- Niente rotazione/sticker, niente entrata animata, niente parallax.
- NON spostare Info pratiche/Indicazioni sotto il ReviewBlock completo; NON portare il ReviewBlock completo sopra Info pratiche.
- Non tenere il vecchio numerone `text-5xl` accanto al seal: il seal lo SOSTITUISCE.
- Non forzare il medaglione nella meta-row dell'ArticleHero: lì va la pill dark.
- Nessun voto placeholder: render solo con `overall != null`.

## Criterio di verifica browser

- `/posto/<slug con review>` (es. dolomiti in preview non ha posto — usare un posto reale con review se esiste, altrimenti temp-inject-then-revert): medaglione sotto l'h1 a fianco di verdetto+luogo, PRIMA di Salva/Condividi e Info pratiche.
- "Indicazioni" resta sopra la piega a 1280px e a 375px.
- ReviewBlock apre col medaglione grande, poi summary/criteri/pro-contro.
- Nessuna Star su alcun marcatore. Card/quick-view leggibili col nuovo pill light.
- `/articolo/dolomiti-rifugi-design`: pill dark leggibile nella meta-row; ReviewBlock col medaglione grande.
- Posto/articolo senza review: nessun seal, nessuna pill, nessun cerchio vuoto.
- 375px: nessun overflow; axe pulito; reduced-motion: nulla si anima.
- `npm run typecheck` + `npm run audit:ui` puliti.
