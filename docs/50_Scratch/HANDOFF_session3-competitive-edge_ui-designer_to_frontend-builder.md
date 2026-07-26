---
title: HANDOFF_session3-competitive-edge_ui-designer_to_frontend-builder
status: consumed
created: 2026-05-18
consumed: 2026-05-18 (3c shipped + 3a shipped + 3b shipped — landing /destinazione/[regione])
from: main-thread-synthesis
to: travellini-frontend-builder
slug: session3-competitive-edge
expires: 2026-06-01
sources:
  - docs/10_Projects/PROJECT_COMPETITIVE_DESTINATIONS_ANALYSIS.md
  - docs/10_Projects/PROJECT_ARTICLE_EDITORIAL_PRIMITIVES_V1.md
  - docs/10_Projects/PROJECT_ARTICLE_DESTINATION_POLISH.md
type: handoff
area: workspace
---

# Handoff: Sessione 3 — Competitive edge (VerifiedBox + landing destinazione + H2 domanda)

## Why this work matters

L'analisi competitiva su 9 competitor (PROJECT_COMPETITIVE_DESTINATIONS_ANALYSIS.md) ha individuato che Travelliniwithus puo' occupare un **quadrante vuoto in italiano**: "editorial premium + specifico operativo". Tre mosse strutturali compongono il vantaggio competitivo:

- **VerifiedBox** = distinguishing point #1 (affidabilita' + freshness)
- **Tassonomia /destinazione/[regione]/** = cluster SEO+UX che fa scala (pattern Suitcase/Afar)
- **H2 in forma domanda** = AI search ranking moltiplicato

Insieme superano Miprendoemiportovia (competitor diretto IT) e occupano la posizione "Conde Nast Traveler reader normalizzato per l'Italia".

## Decisions already locked

- Mantieni palette/font/CSS vars esistenti.
- Tutte le primitive sono **opt-in** (eccetto eventuale auto-apply su pillar regionali — vedi A.1).
- Mobile e desktop pari priorita'.
- Italiano per ogni micro-copy.
- Non toccare `server.ts`, `firestore.rules`, `admin.ts`.
- Riusa `PageLayout`, `Section`, `Breadcrumbs`, `SEO`, `ArchiveCard` esistenti.

---

## A. VerifiedBox (nuova primitive editoriale)

### A.1 Trigger e regola d'uso

**Opt-in via directive markdown.** L'editorial-writer la usa quando l'articolo e' un pillar con esperienza diretta verificabile. **Non auto-applicata.**

Posizione canonica: **subito sotto il lead "In breve"** (sopra alla griglia "Pratico"). Diventa il secondo elemento del pillar dopo il lead. Distingue subito un articolo "ci siamo stati davvero" da uno "raccontato da fuori".

### A.2 Sintassi markdown

```markdown
:::verified{visited="2025-09" pricesChecked="2026-04" contacts="true"}
Costa adriatica visitata dal 12 al 19 settembre 2025 — 3 cene, 4 strutture testate, noleggio auto verificato.
:::
```

Attributi tutti opzionali:

- `visited` — `"YYYY-MM"` o `"YYYY-MM-DD"` (data o mese ultima visita)
- `pricesChecked` — `"YYYY-MM"` (data ultima verifica prezzi)
- `contacts` — `"true"` se contatti strutture sono stati ri-verificati
- Body opzionale — dettaglio narrativo della verifica

### A.3 Visuale

- Card sand chiaro (`bg-[var(--color-sand)]`) con bordo-l accent (`border-l-2 border-[var(--color-accent)]`), `rounded-r-[var(--radius-md)]`, `p-4 md:p-5`, `my-8`.
- **Distinguibile da SourceBlock**: VerifiedBox e' piu' compatto, ha icone `CalendarCheck` + `BadgeCheck` di lucide, color accent. SourceBlock ha `Quote`/`CheckCircle2` e body sans-serif. PullQuote e' tutt'altra grammatica.
- Top row: badge `VERIFICATO` (`text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-accent-text)]`).
- Datapoint row (grid 2-col desktop, stack mobile):
  - `CalendarCheck` 14px + `text-xs text-[var(--color-muted-fg)]` "Visitato: " + `text-sm font-medium text-[var(--color-ink)]` "settembre 2025"
  - `BadgeCheck` 14px + "Prezzi verificati: " + "aprile 2026"
  - Se `contacts="true"`: terzo datapoint icona `Phone` 14px "Contatti aggiornati ad aprile 2026".
- Body opzionale: `text-sm leading-relaxed text-[var(--color-ink-2)]` sotto i datapoint.
- Date format italiano: "settembre 2025", "aprile 2026" (months map gia' esiste in [src/pages/Articolo.tsx](../../src/pages/Articolo.tsx) funzione `toIsoDateString`).

### A.4 Componente React

`<VerifiedBox visited? pricesChecked? contacts? children />` in `src/components/article/editorial/VerifiedBox.tsx`.

Props parsate da `containerDirective[name='verified']` con `node.attributes`.

### A.5 Stato "vintage"

Se la data `visited` e' piu' vecchia di 24 mesi rispetto a oggi: il badge "VERIFICATO" diventa giallo (`text-yellow-700` o `var(--color-warning-text)` se esiste, altrimenti color amber custom) + label diventa `VERIFICATO · DA AGGIORNARE`. Onesta' editoriale.

Calcolo: `(today - visitedDate) > 730 giorni`. Lato client OK.

### A.6 Edge case

- Tutti i 3 attributi mancanti + body vuoto → componente non renderizzato (silenzio).
- Solo `visited` presente → mostra 1 datapoint singolo, niente grid.
- `visited` con formato malformato → fallback: mostra la stringa raw, console.warn in dev.

---

## B. Tassonomia `/destinazione/[regione]/` parent

### B.1 Struttura URL

- **Parent landing**: `/destinazione/[regione-slug]` (es. `/destinazione/puglia`, `/destinazione/salento`, `/destinazione/marche-entroterra`).
- **Children pillar (esistenti)**: `/articolo/[slug]` resta. Nessun breaking change.
- **Cluster**: ogni articolo demo/preview che ha campo `region: 'Puglia'` (o `regionSlug: 'puglia'`) diventa figlio della landing `/destinazione/puglia`.

### B.2 Routing

Aggiungi rotta in [src/App.tsx](../../src/App.tsx): `<Route path="/destinazione/:regionSlug" element={<Destinazione />} />`.

Nuova pagina: `src/pages/Destinazione.tsx`.

### B.3 Struttura della landing

Ordine sezioni:

1. **Hero** (medium height, ~60-70vh — piu' breve dell'hero pillar 85vh, per dire "questa e' un indice, non long-read"):
   - Foto cover regionale (campo `region.heroImage` o fallback alla cover del pillar piu' forte della regione)
   - Eyebrow "DESTINAZIONE" + nome regione H1 serif `text-6xl md:text-7xl`
   - Chapeau italiano 1 frase R+B (es. "La Puglia che ci e' rimasta addosso — settembre 2025 e tre giorni dentro la luce della Valle d'Itria.")
   - Meta: numero articoli + autore coppia + last update
2. **Intro autoriale** 100-150 parole (paragraph singolo, no drop cap qui — lo lasciamo ai pillar): perche' Travelliniwithus copre questa regione, taglio editoriale specifico.
3. **Mini-grid "Quando andarci"** — 12 mesi compatti come pillole color-coded (giallo "alta stagione cara", verde "sweet spot", grigio "off-season"). Riusa pattern di `WhenToGoCalendar.tsx` se esiste.
4. **Cluster articoli figli** raggruppati per **format** (Pillar / Itinerari / Storie):
   - "Le nostre guide pillar" → grid ArchiveCard 4/5 (variant `editorial`), max 6 visibili + "vedi tutti" se piu'.
   - "Itinerari pronti" → grid 2-col compact.
   - "Storie e reportage" → lista tipografica densa (titolo + data + 2 righe excerpt + link).
5. **Mappa interattiva** (riusa `InteractiveMap` esistente) con i marker degli articoli della regione.
6. **CTA principale** — Lead magnet PDF specifico della regione (es. "Scarica il PDF: 3 giorni reali in Puglia") oppure pillar piu' forte se il PDF non esiste ancora. NO "scopri di piu'".
7. **Disclosure affiliati** + Newsletter compact.

### B.4 Differenza visiva chiave vs pillar

- Hero piu' corto (60-70vh vs 85vh)
- Mancanza del Lead "In breve" + box VerifiedBox + sezioni operative (Dove dormire/mangiare)
- Presenza del cluster articoli (la landing **e'** un cluster)
- TOC sidebar assente (la landing non e' lunga abbastanza)
- Badge "DESTINAZIONE" eyebrow nell'hero (vs "GUIDA" / "ITINERARIO" / "STORIA" nel pillar)

Il visitatore deve capire in 1 secondo: "sono in un indice di regione, non in un singolo articolo".

### B.5 Card lista articoli figli

Riusa `ArchiveCard` esistente con variant `editorial` (4/5 verticale). Layout grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`. Stesso pattern di /esplora.

### B.6 Stato "1 articolo solo"

Se la regione ha solo 1 pillar: la landing mostra hero + intro + UN solo CTA "leggi la guida completa" che linka al pillar. No cluster, no mappa. Diventa una specie di "preview esteso" del pillar. **Decisione**: lo facciamo lo stesso (anche con 1 articolo) per coerenza SEO/URL.

### B.7 Stato "10+ articoli"

Mostra solo i primi 6 in grid + "Vedi tutti gli articoli sulla Puglia →" che linka a `/esplora?region=puglia`. Niente paginazione propria — riusa /esplora come archivio filtrato.

### B.8 SEO

- Title: `[Regione] — Le nostre guide e itinerari · Travelliniwithus`
- Meta description: chapeau della landing (140 char).
- Schema: `CollectionPage` + `ItemList` per gli articoli figli + `Place` con coordinate regione.
- BreadcrumbList: Home → Esplora → Destinazione [Regione].

### B.9 Cosa serve nei dati

Verifica in [src/config/demoArchive.ts](../../src/config/demoArchive.ts) e [src/config/previewContent.ts](../../src/config/previewContent.ts) che gli articoli abbiano almeno un campo `region` o `country` o `regionSlug`. Se manca, aggiungi (chirurgico, no schema migration).

Crea un helper `src/lib/regions.ts` con:

- `getArticlesByRegion(regionSlug: string): ArticleSummary[]`
- `getAllRegions(): RegionMeta[]` (slug, nome IT, foto hero, count articoli)
- `getRegionMeta(regionSlug: string): RegionMeta | null`

Le regioni iniziali: Puglia, Salento, Costiera Amalfitana, Cilento, Sardegna, Sicilia, Marche, Toscana — derivate dai demo esistenti.

---

## C. H2 in forma domanda

### C.1 Le 6 nuove H2 per pillar regionali

Da: A:

- "Perche' vale il viaggio" → "Vale davvero il viaggio?"
- "Quando andare" → "Quando andarci?"
- "Dove dormire" → "Dove dormiamo?"
- "Come muoversi" → "Come ci si muove?"
- "Errori da non fare" → "Cosa NON fare?"
- "Quando NON andarci" → "Quando NON andarci?"

Voce: prima persona plurale R+B inclusiva ("dormiamo", "ci si muove"). Non SEO-clinical ("Quanto costa visitare X").

### C.2 Treatment visivo H2

Nessun cambio di stile. Stessa classe `mt-10 md:mt-14 ... text-3xl md:text-4xl font-serif` gia' shipped. La forma domanda fa il lavoro semantico, no ornamento.

### C.3 TOC

Voci sidebar TOC: usa forma corta (4-12 caratteri) per leggibilita' a 320px:

- "Vale davvero?" / "Vale?" → scegli "Vale davvero?"
- "Quando andarci?" → "Quando?"
- "Dove dormiamo?" → "Dove dormire"
- "Come ci si muove?" → "Come muoversi"
- "Cosa NON fare?" → "Errori"
- "Quando NON andarci?" → "Quando NO"

Forma corta nel TOC ≠ forma lunga in H2. Pattern UX corretto.

### C.4 Retro-compatibilita'

Articoli demo procedurali (29) usano `generateBody()` con H2 vecchie. Aggiorna `generateBody` per emettere le nuove H2-domanda. Articoli custom (`CUSTOM_BODIES['puglia-trulli-masserie']`) gia' devono essere aggiornati a mano.

File: [src/config/previewContent.ts](../../src/config/previewContent.ts).

Anche il TOC dinamico (`buildTocItems` in [src/pages/Articolo.tsx](../../src/pages/Articolo.tsx) riga 137) usa label fissi. Aggiorna i label corti per le voci TOC.

---

## D. Priorita' di implementazione

**Ordine consigliato: 3c → 3a → 3b**

1. **3c (H2 domanda)** prima — `[low]`, retro-compatibile, beneficia tutti gli articoli demo + Puglia immediatamente. Test SEO/AI search rapido.
2. **3a (VerifiedBox)** secondo — `[mid]`, nuova primitive isolata, opt-in, zero rischio retro. Pillar Puglia sara' primo a usarla nel body (sostituire SourceBlock in cima oppure aggiungere VerifiedBox sotto lead).
3. **3b (landing /destinazione/)** ultimo — `[high]`, nuova rotta + nuovo template + nuovo helper regioni. Rischio piu' alto perche' tocca dati + routing.

---

## E. Open questions per owner (5)

1. **Box VerifiedBox vintage threshold**: 24 mesi e' troppo strict (regioni come Roma cambiano poco) o troppo lasco? Alternativa: 18 mesi default, override per articolo.
2. **`/destinazione/[regione]/` quando un articolo ha 1 sola regione vs 1+ sotto-regioni** (es. Salento appartiene a Puglia ma ha la sua identita'): creiamo entrambe le landing (`/destinazione/puglia` + `/destinazione/salento`) o solo la macro?
3. **Lead magnet per landing regione**: c'e' gia' un PDF "lead magnet" generico? Se no, lo scriveremo dopo o per ora linkiamo al pillar piu' forte come CTA?
4. **H2 retro-compat su demo articoli**: aggiorno tutte le H2 di `generateBody` oppure ne tengo alcune (es. "Quando NON andarci" funziona gia' come anti-pattern senza diventare domanda)?
5. **Auto-apply VerifiedBox**: in futuro, quando un editorial-writer salva un pillar custom, vogliamo che VerifiedBox sia OBBLIGATORIO (quality gate)? Per ora opt-in, decisione futura.

---

## F. Stima impatto

| Mossa                     | Effort   | File toccati                                      | Componenti nuovi                |
| ------------------------- | -------- | ------------------------------------------------- | ------------------------------- |
| 3a VerifiedBox            | `[mid]`  | 2 (componente + Articolo.tsx)                     | 1                               |
| 3b Landing /destinazione/ | `[high]` | 6+ (pagina + routing + lib + SEO + dati + helper) | 1 (Destinazione.tsx) + 1 helper |
| 3c H2 domanda             | `[low]`  | 2 (previewContent + Articolo TOC label)           | 0                               |

Stima totale: **3-5 ore** di lavoro frontend-builder + audit.

---

## Vincoli

- Non aggiungere nuove librerie.
- Non toccare server.ts/firestore.rules/admin.ts.
- Non rompere articoli esistenti.
- Italiano per ogni micro-copy.
- Riusa CSS vars esistenti.

## Next hand-off

- Next: `travellini-frontend-builder` per 3c → 3a → 3b.
- Owner risposte alle 5 open questions PRIMA di iniziare 3b (3a e 3c possono partire subito).
- Dopo: `browser-auditor` su `/articolo/puglia-trulli-masserie` (verifica H2+VerifiedBox) + `/destinazione/puglia` (nuova landing).
- Docs update: `PROJECT_SESSION3_COMPETITIVE_EDGE.md` o estendere `PROJECT_ARTICLE_EDITORIAL_PRIMITIVES_V1.md`.
