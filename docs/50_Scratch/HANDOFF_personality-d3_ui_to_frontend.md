---
title: HANDOFF_personality-d3_ui_to_frontend
status: consumed
created: 2026-07-18
from: travellini-ui-designer (workflow personality-briefs)
to: travellini-frontend-builder
slug: personality-d3
expires: 2026-08-01
type: handoff
area: delivery
---

# Brief bloccato — Indice d'edizione: il colore-categoria come firma "sommario da rivista"

> **Correzioni del garante di coerenza (2026-07-18) — applicare così:**
>
> 1. Il riferimento "eyebrow attuale `Le storie`" è stantio: il testo attuale è
>    `Coi nostri occhi` (cambiato oggi dal pass voce D2). Il target resta
>    `In questo numero` — su questa singola stringa il brief-indice SUPERA la
>    scelta D2, perché l'eyebrow è load-bearing per la metafora del sommario
>    (conteggio "5 storie" + rubriche = il numero della rivista).
> 2. "non toccare Section" in Cosa NON fare = questo brief non modifica Section
>    (limite di scope per te), NON un divieto per il successivo brief D5 che
>    invece modificherà Section.

## Perché

La critica ui-designer del 2026-07-17 ha rilevato che il colore-categoria è oggi _sussurrato_ (dot 1.5px sui reel, top-border 3px sui pill) e che la numerazione 01-05 esiste già su ReelStrip senza un contesto che la spieghi. Nel frattempo `.dispatch-index-number` (src/index.css:315) è pronta ma inutilizzata. Questa direzione trasforma quei frammenti sparsi in **un unico gesto tipografico**: una riga-indice che chiude la sezione reel legando categoria→colore su un conteggio reale, e un filo numerico coerente (rail chiaro + strip scura) che fa leggere la home come "il sommario di questo numero". Il colore resta accento/indice, mai campo; il gesto è statico (nessuna motion), quindi zero rischio CLS e reduced-motion neutro.

## Decisioni bloccate (design law)

- **Sede del device**: dentro ReelStrip.tsx, come _regola d'indice_ aggiunta in coda al blocco header esistente (dopo eyebrow/h2/subcopy). NON è una band autonoma tra sezioni (eviterebbe il tono "legenda da dashboard"). Appare una sola volta sulla home.
- **Eyebrow**: cambia in `In questo numero`, invariata la classe `text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-accent)]`. h2 e subcopy restano identici.
- **Regola d'indice**: hairline superiore `border-t border-white/10 pt-5 mt-8`, poi riga `flex flex-wrap items-center gap-x-5 gap-y-2`. Ordine: **conteggio reale prima**, poi le rubriche colorate. Nessun separatore verticale (wrap-safe, meno dashboard).
- **Conteggio**: derivato da `reels.length`, mai hardcoded, con guardia singolare/plurale (`storia`/`storie`). Micro-label muta, stessa scala delle rubriche (NON un numero KPI grande).
- **Rubriche (chiave categoria→colore)**: derivate dinamicamente dai reel renderizzati, solo i tipi **mappati** in `CAT_COLOR`, dedup in ordine di apparizione. Con i dati attuali: `Relax` (`#4cb2be`) · `Food` (`#fe6d73`) · `Insolito` (`#c0afff`). "Posti particolari" (Batu Caves) NON entra nella chiave colore (non ha colore), ma resta nella strip con il suo dot neutro.
- **Label brevi**: nuovo export `CAT_SHORT_LABEL` co-locato con `CAT_COLOR` in src/config/categoryColors.ts (i tipi lunghi wrappano male in uppercase 10px su mobile).
- **Numeri sui reel**: gli 01-05 esistenti passano a `.dispatch-index-number` + nuovo modificatore `.dispatch-index-number--invert` (sabbia su fondo ink). Stessa scala di prima, ma ora usano la classe canonica.
- **CategoryPill si aggancia**: ogni pill riceve l'ordinale 01-05 con `.dispatch-index-number` base (muted-fg-2 su surface = contrasto corretto — è l'uso su fondo chiaro per cui la classe era nata). Il colore resta su top-border 3px + icona (invariati). Nessun campo pieno.
- **PezzoForte NON si tocca**: è la cover-story tra rail e strip, porta già l'affermazione-colore più forte (rule 3px + drop-cap). Un solo gesto-firma: non moltiplicare i device.

## File e modifiche

### src/config/categoryColors.ts — aggiungi export

```ts
export const CAT_SHORT_LABEL: Partial<Record<ContentType, string>> = {
  'Food & Ristoranti': 'Food',
  Insolito: 'Insolito',
  'Relax, terme e spa': 'Relax',
  "Borghi e città d'arte": 'Borghi',
  'Passeggiate panoramiche': 'Panorami',
};
```

### src/index.css — subito dopo `.dispatch-index-number` (stesso `@layer utilities`)

```css
.dispatch-index-number--invert {
  color: color-mix(in srgb, var(--color-sand) 88%, transparent);
}
```

### src/components/home/atlante/ReelStrip.tsx

1. Import: `import { CAT_COLOR, CAT_SHORT_LABEL, catColor } from '@/src/config/categoryColors';` + `import type { ContentType } from '@/src/config/contentTaxonomy';` (verifica i nomi export reali in categoryColors.ts prima — se il modulo usa nomi diversi, adattali senza cambiare la sostanza).
2. Dopo `if (reels.length === 0) return null;`, deriva le rubriche:

```tsx
const rubriche = reels.reduce<ContentType[]>((acc, reel) => {
  if (CAT_COLOR[reel.type] && !acc.includes(reel.type)) acc.push(reel.type);
  return acc;
}, []);
```

3. Eyebrow: `Coi nostri occhi` → `In questo numero`.
4. Avvolgi l'header esistente (`mb-10 flex flex-wrap ...`) togliendo `mb-10` dal flex e portandolo su un wrapper `<div className="mb-10">`; aggiungi la regola d'indice come sibling sotto il flex:

```tsx
<div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-5">
  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
    {reels.length} {reels.length === 1 ? 'storia' : 'storie'}
  </span>
  {rubriche.map((type) => (
    <span key={type} className="inline-flex items-center gap-1.5">
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: catColor(type) }}
      />
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
        {CAT_SHORT_LABEL[type] ?? type}
      </span>
    </span>
  ))}
</div>
```

5. Numero per-card (attuali 01-05) → sostituisci le classi:

```tsx
<span
  aria-hidden="true"
  className="dispatch-index-number dispatch-index-number--invert absolute right-3.5 top-3 text-right"
>
  {String(index + 1).padStart(2, '0')}
</span>
```

### src/components/home/atlante/CategoryPill.tsx

1. `CategoryPillProps`: aggiungi `index: number;` e destrutturalo.
2. `<Link>` className: anteponi `relative`.
3. Primo figlio dentro `<Link>`:

```tsx
<span aria-hidden className="dispatch-index-number absolute right-4 top-4">
  {String(index + 1).padStart(2, '0')}
</span>
```

### src/pages/AtlanteHome.tsx — map delle categorie

```tsx
{
  CATEGORIES.map((cat, i) => (
    <CategoryPill
      key={cat.type}
      index={i}
      label={cat.label}
      fullLabel={cat.fullLabel}
      type={cat.type}
      icon={cat.icon}
      to={`/esplora?type=${slugifyType(cat.type)}`}
    />
  ));
}
```

## Stati e accessibilità

- Il conteggio (`5 storie`) e le label rubrica sono testo reale (screen reader li legge come sommario). I dot colorati sono `aria-hidden`. Gli ordinali su card e pill restano `aria-hidden`.
- Contrasto: label rubrica `text-white/80` e conteggio `text-white/70` su `--color-ink`; ordinali card sabbia 88%; ordinali pill `--color-muted-fg-2` su surface. Se axe segnala contrasto sul conteggio, sali a `text-white/80`.
- focus-visible: nessun elemento interattivo nuovo; il ring focus di CategoryPill resta intatto e non coperto dall'ordinale.
- reduced-motion: device interamente statico — nessuna transition/motion sui nuovi nodi.
- CLS: contenuto sincrono, zero shift.

## Cosa NON fare

- Niente background colorato pieno o gradient sulla riga-indice o sui pill: solo dot + top-border.
- Niente conteggi per-categoria stile KPI (`Food (2)`): solo il totale onesto `N storie`.
- Niente numero d'edizione fittizio (`N.01`, `Vol.1`).
- Non includere tipi non mappati nella chiave colore; NON nascondere il reel relativo.
- Non hardcodare `5`: sempre `reels.length`.
- Non usare `.dispatch-index-number` base sul fondo scuro senza `--invert`.
- Niente GSAP/parallax/motion su questi nodi; questo brief non modifica PezzoForte, HeroCopertina, Section, server.ts.

## Criterio di verifica browser

1. Desktop `/`: header ReelStrip con eyebrow `In questo numero`, h2 e subcopy invariati, hairline e sotto la riga `5 STORIE · ● RELAX · ● FOOD · ● INSOLITO` con dot `#4cb2be`, `#fe6d73`, `#c0afff`. Batu Caves con dot neutro, non in chiave.
2. Ogni card reel: 01-05 in alto a destra, tinta sabbia (non bianco puro).
3. Rail categorie: 5 pill con 01-05 (muted), top-border e icona colorati preservati, focus ring visibile.
4. Mobile 375px: riga-indice a capo pulita, nessuno scroll orizzontale.
5. reduced-motion: nessuna animazione sui nuovi elementi.
6. CLS ≤ 0.1 invariato; axe senza nuove violazioni.
