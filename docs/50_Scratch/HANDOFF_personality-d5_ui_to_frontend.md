---
title: HANDOFF_personality-d5_ui_to_frontend
status: open
created: 2026-07-18
from: travellini-ui-designer (workflow personality-briefs)
to: travellini-frontend-builder
slug: personality-d5
expires: 2026-08-01
type: handoff
area: delivery
---

# Brief bloccato — Direzione 5: il motion-firma a maschera-riga sugli h2 serif

> **Nota di provenienza:** il brief originale del designer è arrivato troncato
> nella prima parte; le sezioni "Perché/Decisioni/File" qui sotto sono
> ricostruite dai vincoli lockati del designer (presenti nel testo integrale
> ricevuto: Stati/Cosa NON fare/Criterio di verifica, riportati fedeli) e dal
> riferimento vivente `CoupleIntro.tsx:89-101`. In caso di dubbio
> implementativo, il riferimento vivente vince.
>
> **Correzione del garante di coerenza (2026-07-18):** lo scope è SOLO: titoli
> resi da `Section`, `ZoneBand`, `MetodoBand`. L'h2 di `ReelStrip` è ESCLUSO
> (header di proprietà del brief-indice D3, resta statico). Implementare D5
> per ULTIMO, a D3 e D4 già in pagina.

## Perché

Oggi Section.tsx (y:16), MetodoBand.tsx (y:12), ZoneBand.tsx (y:8), Esplora.tsx (y:24) usano lo stesso fade-in-up — invisibile, non firma niente. L'unico motion con carattere già nel sito: la traccia WebGL dell'hero, lo spring dell'ArrowRight, e il reveal a maschera-riga di CoupleIntro (data-couple-line, yPercent 110→0 in overflow-hidden). Questo brief porta QUEL reveal come gesto-firma degli h2 serif, mantenendo il fade calmo per tutto il resto. UN gesto, non tre varianti.

## Decisioni bloccate (design law)

- **Nuovo componente `src/components/RevealHeading.tsx`** (motion/react, NON GSAP): rende un `<h2>` (tag configurabile se serve, default h2) le cui righe sono `<span className="block overflow-hidden"><motion.span className="block">…` — maschera in-flow che riserva l'altezza naturale (zero CLS).
- **API**: prop `lines: ReactNode[]` — ogni elemento è una riga (permette span colorati/corsivi per riga, come ZoneBand e MetodoBand). Le righe sono testo reale, MAI aria-hidden; l'ordine di lettura resta il titolo completo. Se il titolo è una riga sola, `lines` con un solo elemento.
- **Valori**: `y: '110%' → 0`, `duration 0.8`, `ease [0.22, 1, 0.36, 1]`, `stagger 0.1` tra righe, `whileInView` con `once: true`, `viewport margin` coerente col resto del sito.
- **reduced-motion**: `RevealHeading` rende l'h2 statico (righe in `<span className="block">`, nessuna maschera né motion). Usare l'hook `useReducedMotion` già presente nel repo.
- **`Section.tsx`**: l'entrata del CONTENITORE passa da `opacity+y:16` a **opacity-only** (il movimento verticale ora è compito solo del titolo); con reduced-motion `initial={false}` (contenuto visibile subito, mai `opacity:0` permanente). Il title reso da Section usa `RevealHeading`.
- **`ZoneBand.tsx`**: l'h2 due-parti ("Vicino a casa," / "e dall'altra parte del mondo.") passa a `RevealHeading` con 2 lines; `id="zone-band-title"` resta sull'h2 (aria-labelledby continua a funzionare).
- **`MetodoBand.tsx`**: h2 main + riga accent → `RevealHeading` con 2 lines.

## Stati e accessibilità (testo fedele del designer)

- reduced-motion: `RevealHeading` rende `<h2>` statico, righe in `<span className="block">`, nessuna maschera né motion; il contenitore `Section` con reduced usa `initial={false}` (contenuto visibile subito, mai `opacity:0` permanente). Verificare con DevTools → Rendering → "Emulate prefers-reduced-motion: reduce".
- Screen reader: le `lines` sono testo reale (mai `aria-hidden`), lette in ordine → titolo completo accessibile. `id="zone-band-title"` resta sull'`<h2>` reso da `RevealHeading`.
- Hover/focus-visible: il gesto è solo entrata (once), nessuno stato hover/focus sull'h2. Il micro-spring dell'ArrowRight (`cubic-bezier(0.34,1.56,0.64,1)`) resta invariato — è una firma-hover separata, non toccarla.
- CLS: `y:'110%'` è transform, non altera il box; la maschera in-flow riserva l'altezza naturale. `Section` passa a opacity-only → nessuno spostamento verticale del blocco.

## Cosa NON fare (testo fedele del designer)

- Non introdurre GSAP in `Section`, `RevealHeading`, `ZoneBand`, `MetodoBand`.
- Non applicare `RevealHeading` a h1, h3, card, eyebrow, body, blockquote.
- Non creare una seconda variante di reveal "per la sezione X". Una sola.
- Niente split per-carattere, niente parallax/scrub, niente `staggerChildren > 0.1` né `duration > 0.85`.
- Non rimettere la `y` sul contenitore `Section` per renderlo "più incisivo".
- Non convertire `CoupleIntro` a motion/react, non toccare `Esplora.tsx:798`.
- Nessun gradient/riempimento colore-categoria sul titolo; l'accento resta solo su `text-[var(--color-accent-text)]`/`text-muted-fg-2`.
- (Coerenza) Non toccare l'h2 di `ReelStrip`.

## Criterio di verifica browser (testo fedele del designer, con correzione scope)

1. Home, scroll sezione per sezione: gli h2 serif IN SCOPE (titoli da `Section`, ZoneBand, MetodoBand) salgono da un filo di taglio invisibile (clip), le due righe sfalsate ~100ms, ~0.8s, once; il blocco intorno fa solo fade opaco (nessuna salita di 16px). L'h2 di ReelStrip resta statico.
2. ZoneBand: "Vicino a casa," entra, poi "e dall'altra parte del mondo." dopo lo stagger.
3. MetodoBand: riga main poi riga accent sfalsate; nessun doppio movimento verticale sull'h2.
4. `prefers-reduced-motion: reduce`: h2 statici, interruzioni di riga corrette, zero clipping di discendenti/corsivo.
5. CLS ≈ 0 (gate ≤0.1), nessun overflow orizzontale a 375px.
6. Il gesto nuovo è indistinguibile all'occhio da quello di CoupleIntro (invariato).

File: src/components/RevealHeading.tsx (nuovo), src/components/Section.tsx, src/components/home/atlante/ZoneBand.tsx, src/components/home/atlante/MetodoBand.tsx. Riferimento vivente: src/components/home/CoupleIntro.tsx:89-101.
