---
title: HANDOFF_article-destination-polish_ui-designer_to_frontend-builder
status: consumed
created: 2026-05-18
from: travellini-ui-designer
to: travellini-frontend-builder
slug: article-destination-polish
expires: 2026-06-01
---

# Direzione visiva — Polish chirurgico template articolo + ArchiveCard

## Why this work matters

Il template `/articolo/[slug]` ospita sia i pillar che le pagine-destinazione (Puglia, Salento, ecc.) — e' il punto in cui un lettore che arriva da SEO o Reels decide se Travelliniwithus e' "premium o no". Oggi soffre di 4 bug di proporzione (sidebar collassata, "In breve" pesante, breadcrumb in conflitto col navbar, bottoni che si rompono carattere-per-carattere) che leggono come SaaS sciatto. Polish chirurgico per portarlo a livello editoriale credibile prima che le campagne W2-W4 spingano traffico.

## Decisioni gia' locked (non rilitigare)

- Mantenere palette `sand/ink/accent` esistente e font `Fraunces/Inter`.
- Niente componenti nuovi grossi. Niente nuove sezioni. Niente nuove route.
- Mobile e desktop pari priorita'.
- Italiano per ogni micro-copy.
- Non toccare `server.ts`, `firestore.rules`, `admin.ts`.

---

## A. ARTICLE TEMPLATE — direzione visiva

### A.1 Above the fold MOBILE (375px, primi 100vh)

**Decisione:** hero domina, breadcrumb e "In breve" SCENDONO sotto il fold.

- **Hero ratio**: `4:5` su mobile (oggi `70vh` funziona bene, mantienilo ma valuta `min(70vh, 560px)` per evitare hero da 900px su Pixel 9 Pro). Il viewport tagliente di un iPhone 13 (812px) deve mostrare hero + accenno del breadcrumb-card sottostante (15-20px di "peek" del bordo bianco arrotondato). Questo peek e' cio' che dice "qui c'e' altro, scrolla" — pura grammatica editoriale. `[mid]`
- **Hero contiene**: eyebrow categoria-pill, h1 (max 4 righe), riga meta (autore + data + readingTime). NIENT'ALTRO. I floating action buttons "salva/condividi" oggi a `bottom-10 right-10` sul mobile sono ridondanti perche' c'e' gia' la MobileBottomBar — RIMUOVERLI sotto `md`. `[low]`
- **"In breve" NON deve essere above-the-fold su mobile.** Oggi e' il primo blocco dopo il breadcrumb, occupa quasi tutto lo schermo con `text-2xl md:text-3xl`. Il lettore arriva dal feed con aspettativa narrativa, non bullet-point. **Tagliare visivamente:** convertirlo da "card colorata grossa" a **lead paragraph** sobrio (eyebrow "In breve" 11px + un solo paragrafo serif italic 1.25rem leading 1.55 su sfondo sand neutro, niente bordo accent, niente padding 40px). Diventa un'introduzione, non un riassunto-CTA. `[low]`
- **Breadcrumb**: oggi appare in alto dopo il hero. Sul mobile, ridurlo a una riga sola (`label > label > titolo-troncato`), font 11px tracking 0.18em uppercase, niente icone, niente wrap. Se va in overflow → tronca con ellipsis il titolo finale. `[low]`
- **DemoContentNotice**: spostare DOPO il lead paragraph, non prima. Oggi compete col navbar. Su slug published deve essere `null`, gia' lo e'. Sul preview deve essere `mt-6` non `mt-10`, e con weight visivo ridotto (banner sobrio sand, niente accent-soft saturato). `[low]`

### A.2 Above the fold DESKTOP (≥1280px)

**Decisione:** hero pieno, sidebar appare **al di sotto** del primo screen — non sticky-visibile from-the-start.

- **Hero**: `85vh` attuale e' corretto. Mantieni. `[no-op]`
- **Sidebar TOC**: oggi si vede gia' nel primo screen subito dopo l'hero. **Cambia comportamento:** la sidebar inizia all'altezza del lead paragraph (sotto al breadcrumb), cosi' il primo "atto" visivo e' il lead. Sticky `top-32` resta corretto **dopo** che il lettore ha scrollato e ha visto il lead. `[low]`
- **Larghezza sidebar**: `320px` e' la causa #1 del bug "carattere-per-carattere". **Nuova soglia minima: 280px** quando lo spazio e' ridotto, **300-320px** standard. MA il vero fix e' duplice:
  1. **Mostrare la sidebar solo da `xl` (1280px), non da `lg` (1024px).** Tra 1024px e 1279px il contenuto e' 1-colonna full-width (max-width 720-760px contenuto centrato) + nessuna sidebar. Sotto `xl` si usa il blocco TOC mobile-inline come fa gia' su mobile. `[mid]`
  2. **Da `xl` in su**, grid diventa `minmax(0,1fr) 320px` con `gap-12` (oggi `gap-8`). Da `2xl` opzionalmente `360px`. `[low]`
- **Conseguenza visiva positiva:** addio TOC che si spezza in colonna di lettere. Su laptop 13" il lettore vede un articolo editoriale 1-colonna pulito (come Longreads, NYT Cooking), non un dashboard a 2 colonne strette.

### A.3 Tipografia body

**h1 hero:**

- Mobile: oggi `text-5xl` (48px) leading 1.1. Troppo grosso su 375px se il titolo e' "Salento ad agosto: la guida onesta per non odiarlo". Tagliare a **clamp(2.25rem, 6vw, 3rem)** ≈ 36-48px. Max 4 righe. `tracking-tight`. `[low]`
- Desktop: `text-7xl lg:text-8xl` (72-96px) e' premium-editorial — **mantieni**. Ma `max-w-3xl` (768px) sul container va portato a `max-w-4xl` per evitare titoli a 3 righe quando 2 basterebbero a 1280-1440px. `[low]`

**h2/h3 section ritmo verticale:**

- `mt-14` (56px) su mobile e' troppo. Su 375px crea "buchi". Cambia a `mt-10 md:mt-14`. `[low]`
- `h3` `mt-10` ok desktop, su mobile `mt-8`. `[low]`

**Paragrafo body:**

- Oggi `text-lg leading-relaxed text-black/70`. Confermo `text-lg` (18px) desktop. Sul mobile **scendere a 17px** (var gia' esistente `--text-body`). `[low]`
- `text-black/70` → **usare `var(--color-ink-2)`** (oggi `#44403c`) che e' gia' il token canonico per body secondario. Piu' caldo, piu' editorial. `[low]`
- Leading desktop `1.7`, mobile `1.65` (`leading-[1.7]` esplicito). `[low]`

**List items:**

- Icona `CheckCircle2` scendere a 16px su mobile, gap-2.5 su mobile. `[low]`
- Per liste >5 item (Consigli pratici, Cose da sapere) sostituire CheckCircle2 con `—` o `•`. Lascia CheckCircle solo dove la lista e' semantica "vantaggi/checklist" (highlights, packing). `[mid]`

**"In breve" — sostituzione completa:**

- Eyebrow `In breve` 11px tracking 0.18em uppercase color `accent-text`.
- Un paragrafo serif italic `text-xl md:text-2xl` (non 2xl→3xl), leading `1.5`, color `var(--color-ink)`.
- Sfondo: **niente card colorata**. Sta direttamente sul sand della pagina con un filo `border-l-2` accent a sinistra (oppure niente bordo, solo whitespace).
- Padding ridotto: `py-4` (non `p-10`).

Pattern dei "deck" del NYT/The Atlantic: introduce, non urla. `[mid]`

### A.4 Sidebar TOC

- **Soglia di apparizione**: `xl` (1280px), non `lg`. `[low]`
- **Larghezza**: `320px` standard, `360px` opzionale da `2xl`. `[low]`
- **Indicatore sezione attiva**: oggi NON esiste. Aggiungere `IntersectionObserver` (o usare `useScroll` motion gia' presente) che aggiunge `data-active` alla voce TOC della sezione visibile. Stile attivo: `text-[var(--color-ink)] font-semibold` + `bg-accent w-8` sul tratto orizzontale. `[mid]`
- **Bottoni "Modalita lettura" / "Condividi"** — soluzione del bug:
  - "Modalita lettura": **un solo bottone full-width** dentro la card sidebar, icona `BookOpen` 14px + label `Modalita lettura` in uppercase tracking-[0.16em] font 11px. `[low]`
  - "Condividi l'ispirazione" → **`Condividi`** (4 caratteri). Icone share 36px (oggi 48px) `flex flex-wrap gap-2`. `[low]`
- **Sticky offset**: `top-32` corretto. `[no-op]`

### A.5 Sezione "Pratico" (Dove/Quando/Budget/Durata)

**Bug brand-fit:** 4 colonne grid full-width con icone in cima ed eyebrow uppercase. Legge come "feature grid" SaaS.

- Mantieni grid 4-col MA cambia trattamento:
  - Niente piu' `bg-black/5` come gap-px (effetto "tile separator" SaaS).
  - Ogni cella ha `border-r border-border` (ultimo `border-r-0`) sul desktop. Su mobile lista verticale con `border-b` tra le righe. `[mid]`
  - Icona inline accanto al label (non sopra): `[icona 14px] LABEL` uppercase, valore serif sotto.
- Eyebrow `text-black/38` → `text-[var(--color-muted-fg)]`.

### A.6 Itinerario / Mappa / Consigli / Risorse

- Itinerario cerchio numero 64px serif bianco su nero — **MANTIENI**, e' brand-defining.
- Su mobile, cerchio allineato a sinistra (non centrato). `[low]`
- Mappa `h-[420px]` desktop → `h-[320px]` mobile. `[low]`
- Risorse: 2 CTA `flex-col` su mobile per non leggere "form". `[low]`

### A.7 AuthorBio + RelatedArticles + chiusura

**Ordine attuale:** Newsletter → AuthorBio → FinalCtaSection → RelatedArticles. **DUPLICAZIONE CTA.**

**Nuovo ordine:**

1. AuthorBio
2. RelatedArticles
3. Newsletter `variant="article"` (UNA sola)
4. **Rimuovere FinalCtaSection dal template articolo** `[low]`

**AuthorBio polish:**

- Avatar mobile: `w-16 h-16` (oggi `w-20 h-20`). `[low]`
- 3 CTA in row su mobile → `flex-col gap-2`. `[low]`

**RelatedArticles polish:**

- h3 → `text-3xl md:text-4xl font-serif`. `[low]`
- Rimuovi readTime hardcoded "5 min", usa quello reale o ometti. `[low]`

### A.8 Reading Mode + MobileBottomBar

**MobileBottomBar:**

- Pill scura backdrop-blur — MANTIENI.
- **Safe area iOS**: `bottom-[max(1.5rem,env(safe-area-inset-bottom))]`. `[low] [BLOCKER]`
- **3 azioni invece di 4**: Salva, Indice, Condividi. Pinterest dentro share sheet. `[mid]`
- Icona indice da `Menu` → `List`. `[low]`
- Label "Salva" fisso anche quando salvato (cambia solo colore icona, non testo). `[low]`

**ReadingMode:**

- `kbd ESC` hint → `hidden md:inline-flex`. Su mobile solo "Tap X". `[low]`
- Modal va bene. Background bianco MANTIENI (white-paper feel premium per long-form).

### A.9 Bug specifici screenshot — risoluzione

| Bug                                                        | Fix                                                                                                   |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Sidebar destra collassata carattere-per-carattere          | A.2: sidebar appare solo da `xl` (1280px)                                                             |
| "MODALITA LETTURA" / "CONDIVIDI L'ISPIRAZIONE" si spezzano | A.4: label corte, font ridotto, full-width                                                            |
| Voci TOC vanno a capo parola-per-parola                    | A.2 + larghezza min 280px                                                                             |
| Box "In breve" satura primo screen                         | A.3: lead serif italic, no card colorata                                                              |
| DemoContentNotice compete col navbar                       | A.1: dopo il lead, weight ridotto                                                                     |
| "Torna alla sezione" contrasto basso sull'hero             | A.1: text-white + drop-shadow o backdrop-pill `bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full` |

---

## B. ArchiveCard (`/esplora` + correlati)

### B.1 Variant `editorial`

- **Aspect ratio**: `16:10` → **`4:5`** per /esplora; **`16:10` MANTIENI** per RelatedArticles a fine articolo (sono in 2-col strette). `[low]`
- Eyebrow category pill: backdrop-blur 88% (oggi 92%). `[low]`
- Hover lift `-translate-y-0.5` invece di `-1` (4→2px). `[low]`
- **Label footer "Scopri" → "Leggi"** (vietato da DESIGN.md "Reject buzzwords: scopri, esplora"). `[low]`

### B.2 Mobile

- /esplora: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (oggi probabilmente 2-col da mobile). `[low]`

---

## C. 5 principi premium editorial

1. Max 3 weight tipografici per screen.
2. L'immagine fa da sezione, non da decorazione (no bordi accent/gradient esterni).
3. Una sola "carta" per blocco — niente card-in-card.
4. Eyebrow uppercase 11px tracking 0.18em e' il marker brand — stesso treatment ovunque.
5. Whitespace > divisori.

---

## D. Lista NON-DO

- NON rifare Newsletter o varianti.
- NON cambiare schema markdown / ReactMarkdown / remark plugin.
- NON introdurre nuovi componenti grossi (`<ArticleLead>`, `<PracticalGrid>`, etc.).
- NON toccare `InteractiveMap`, `Breadcrumbs`, `SEO`, `DemoContentNotice`, `FinalCtaSection` (a parte rimuoverlo dal template articolo).
- NON cambiare l'ordine children dentro `ArticleHero` ne' parallax `yHero`.
- NON cambiare palette CSS vars. Nessun nuovo token.
- NON introdurre librerie nuove. IntersectionObserver nativo.
- NON cambiare `getCategoryPath` (server-dependent).

---

## E. Stima impatto

- `[low]` × 22 (cambi di classi, breakpoint, label)
- `[mid]` × 6 (refactor JSX lead, IntersectionObserver TOC, sezione Pratico, share sheet Pinterest, list items lunghi, sidebar breakpoint)
- `[high]` × 0

E' polish chirurgico vero. Nessun componente nuovo, nessuna route, nessuna dipendenza, nessun cambio palette/font.

---

## Verdict

`Ship with minor fixes` dopo questo polish. Bug `[blocker]`: sidebar collassata + bottoni spezzati + safe-area mobile bar. I `[serious]` portano da "competente" a "premium editorial credibile".

## Out of scope

- Redesign home / navbar.
- Article body content (editorial-writer).
- Photo selection per nuovi articoli (asset-curator).
- SEO meta / structured data (seo-strategist).
- Server / Firebase / Stripe.

## Open questions per owner

1. Conferma rimozione `FinalCtaSection` dal template articolo.
2. Conferma "Scopri" → "Leggi" come microcopy ArchiveCard.
3. Conferma aspect ratio `4:5` per /esplora (vs 16:10 attuale).
4. ReadingMode mobile: ESC hint o "Tap X"?

## Next hand-off

- Next: `travellini-frontend-builder`
- Ordine esecuzione: `[blocker]` (A.2, A.4, A.8 safe-area) → `[serious]` → `[minor]/[nit]`.
