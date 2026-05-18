---
name: repurpose
description: Trasforma un pillar article Travelliniwithus pubblicato in un pacchetto multi-canale — carosello IG 8 slide, script Reel 30s, quiz lead-magnet 5 domande, bullet newsletter, oggetto newsletter, 3 hook social, OG card brief. Massimizza la resa di ogni articolo lungo. Usa quando l'utente dice "repurpose", "trasforma articolo X in social", "fai contenuti dall'articolo", "estrai da pillar".
---

# /repurpose — Da pillar article a pacchetto multi-canale

Skill di leva: un articolo da 2000+ parole vale come 4-6 contenuti satellite se ben distillato. Questo skill produce il pacchetto.

NON sostituisce gli agent: orchestra `travellini-social-content-operator` + `travellini-seo-conversion-strategist` + `travellini-asset-curator` su un input gia esistente e gia editorialmente validato.

## Quando attivare

- Articolo appena pubblicato sul sito (status `published: true` nel seed)
- "Fai contenuti dall'articolo Lisbona"
- "Trasforma il pillar Salento in pacchetto social"
- "Estrai newsletter dall'articolo X"
- Cadenza settimanale: ogni pillar pubblicato → repurpose entro 7 giorni

## Quando NON attivare

- Articolo ancora draft → fallo finire prima
- Articolo <800 parole → non c'è abbastanza materiale per 4 canali, usa social-operator direttamente
- Articolo gia repurposato (controlla `docs/13_Content/ARTICLE_*.md` frontmatter `repurpose_status`)

## Argomenti

- **slug** (obbligatorio): es. `lisbona-tre-giorni-quartieri`
- **canali** (default: tutti): `ig-carousel` | `reel` | `quiz` | `newsletter` | `og` (subset comma-separated)
- **tone** (default: `editorial`): `editorial` (default) | `direct-response` (per lead magnet conversion)

## Protocollo

### Fase 1 — Lettura sorgente (no agent, lookup veloce)

1. Leggi `src/data/articles/[slug].seed.ts` per metadata (title, excerpt, category, destination, tags, coverImage).
2. Leggi corpo articolo da `docs/13_Content/ARTICLE_[SLUG].md` (vault Obsidian, source of truth) o dal seed se vault assente.
3. Estrai:
   - **Tesi principale** (1 frase) — cosa dice l'articolo che altri non dicono
   - **3-5 dati concreti** — prezzi, distanze, nomi luoghi specifici
   - **1-2 scene** — momenti narrativi con dettaglio sensoriale
   - **CTA implicita** — cosa il lettore dovrebbe fare dopo (visitare? prenotare? salvare? scriverci?)

Se manca uno di questi, **stop**: l'articolo non ha abbastanza specificita per essere riproposto bene. Suggerire `/anti-ai-slop` o rewrite.

### Fase 2 — Distillazione per canale

#### A. Carosello IG (8 slide, 1080x1350)

| Slide | Funzione                  | Contenuto                                |
| ----- | ------------------------- | ---------------------------------------- |
| 1     | Hook + promessa           | Tesi principale, dato d'aggancio         |
| 2     | Setup contesto            | Dove siamo, perche ci interessa          |
| 3     | Dato 1                    | Prima specificita concreta               |
| 4     | Dato 2                    | Seconda specificita concreta             |
| 5     | Scena                     | Momento sensoriale (cibo, luce, persona) |
| 6     | Errore / contro-narrativa | Cosa avresti sbagliato senza sapere      |
| 7     | Sintesi azionabile        | 3 cose da fare/sapere prima di andare    |
| 8     | CTA + link bio            | "Articolo completo in bio" + handle      |

Output: testo per slide + indicazione foto per ciascuna (`asset-curator` brief).

#### B. Script Reel 30s

Struttura: 0-3s hook scroll-stopper / 3-15s contesto + dato / 15-25s payoff narrativo / 25-30s CTA.

Output: script con timing + indicazione shot (cosa filmare) + audio suggestion (parlato R&B vs trending audio).

Invoca `/hook` se serve aiuto sull'opener.

#### C. Quiz lead-magnet (5 domande)

Quiz a tema destinazione, per lead generation. Ogni domanda:

1. **D**: domanda specifica con 3 opzioni (A/B/C)
2. **Risposta corretta** + 1 riga di approfondimento (mini-payoff)
3. **Tie-in articolo**: rimanda al pillar per il dettaglio

Esempio: "Quanto costa il traghetto per Procida in agosto al pomeriggio?" → A 8€ / B 12€ / C 16€ — Corretta: B (con nota: dipende dall'orario, leggi articolo).

Output finale: 5 Q+A pronte per integrazione in `/quiz` (route esistente).

#### D. Bullet newsletter (Mailchimp / Substack)

Struttura:

- **Oggetto** (35-50 char) — usa `/hook` framework F1 o F2
- **Apertura** (40-60 parole) — entra in scena, no "Ciao a tutti"
- **3 bullet** dal pillar (max 25 parole ciascuno)
- **Link articolo** con anchor specifico (es. "tutta la mappa dei quartieri")
- **PS** (opzionale, 1 riga) — un dettaglio bonus che non è nell'articolo

Output: testo completo italiano pronto da incollare.

#### E. OG card brief (1200x630)

Brief per `/social-card` o `travellini-asset-curator`:

- Titolo (max 8 parole)
- Sub (max 12 parole)
- Foto suggerita dal coverImage
- Palette: `var(--ink)` su `var(--sand)` o variante
- CTA visiva: dominio `travelliniwithus.com` in basso

### Fase 3 — Output strutturato

Tutto in un singolo file:

```
docs/13_Content/REPURPOSE_[SLUG].md
```

Con frontmatter:

```yaml
---
type: repurpose
source_article: [SLUG]
source_path: docs/13_Content/ARTICLE_[SLUG].md
generated: YYYY-MM-DD
channels: [ig-carousel, reel, quiz, newsletter, og]
status: draft # → review → published
tags: [repurpose, social, newsletter]
---
```

E aggiorna il frontmatter dell'articolo sorgente: `repurpose_status: drafted`.

### Fase 4 — Handoff

Scrivi handoff brief per la pubblicazione effettiva:

```
docs/50_Scratch/HANDOFF_repurpose-[slug]_main_to_social-operator.md
```

Contiene: cosa è pronto, cosa serve scegliere (foto, orari pubblicazione), cosa va in coda calendario social.

## Vincoli duri

- **Mai inventare fatti.** Se l'articolo non lo dice, il satellite non lo dice.
- **Italiano sempre** per output pubblico.
- **No emoji** nel sito (caroselli IG → emoji OK ma parsimoniose).
- **Tesi coerente con l'articolo.** Se il pillar dice "Salento ad agosto è scomodo ma vale", il Reel non dice "Salento ad agosto è perfetto".
- **CTA realistico.** Mai promesse impossibili. Mai "link in bio" se l'articolo non è ancora pubblicato.

## Vincolo brand cruciale

Travellini campa di autenticita: i contenuti satellite devono **sembrare scritti da Rodrigo & Betta**, non "ottimizzati per engagement". Se un bullet della newsletter suona da growth-hacker, riscrivilo. Se il Reel hook è clickbait, riscrivilo.

Test: leggi il pacchetto e chiediti "se Betta vedesse questo, lo pubblicherebbe?". Se no, taglia.

## Output template (sintesi)

```markdown
## Repurpose — [TITOLO ARTICOLO]

**Source:** [path articolo]
**Tesi:** [1 frase]
**CTA implicita:** [cosa deve fare il lettore]

---

## 1. Carosello IG (8 slide)

[slide-by-slide table]

## 2. Reel 30s

[script con timing]

## 3. Quiz (5 domande)

[Q+A]

## 4. Newsletter

**Oggetto:** [...]
**Body:**
[...]

## 5. OG card brief

[brief]

---

## Note brand

- [eventuali avvertenze sulla tesi]
- [foto suggerite]
- [partner da taggare se rilevante]

## Prossimi passi

→ `travellini-social-content-operator` per finalizzare caption complete + scheduling
→ `travellini-asset-curator` per scelta foto per carosello e Reel
→ `/social-card` per generare l'OG card
→ Aggiornare frontmatter articolo sorgente: `repurpose_status: published`
```

## Skill correlate

- `/new-article` — crea l'articolo che POI sara repurposato
- `/hook` — per opener Reel e oggetto newsletter
- `/social-card` — per OG card finale
- `travellini-social-content-operator` — finalizza caption + calendar
- `travellini-asset-curator` — sceglie foto per slide e Reel

## Project context

- `docs/13_Content/` — vault articoli (source of truth)
- `docs/MARKETING_OPERATIONS_HUB.md` — funnel + canali attivi
- `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md` — audience + tono
- `src/data/articles/` — seed ts files
- `src/pages/Quiz.tsx` — quiz route esistente
