---
title: HANDOFF_dormire-posti-sembrano-inventati_growth_to_seo
status: consumed
created: 2026-08-18
consumed: 2026-08-18
from: travellini-growth-revenue-operator
to: travellini-seo-conversion-strategist
slug: dormire-posti-sembrano-inventati
expires: 2026-09-15
type: handoff
area: delivery
---

# Handoff: SEO del pillar «Posti che sembrano inventati» — H1, meta, excerpt, cluster, schema, outline

## Why this work matters

La SERP di riferimento è occupata da listicle scritti alla scrivania: SiViaggia,
The Wom, Turisti per Caso. Nessuno c'è stato, nessuno dichiara una relazione
commerciale, nessuno mostra una prova. Il nostro vantaggio non è scrivere
meglio: è **essere gli unici che possono dimostrare di esserci stati**. Tu
costruisci l'ossatura di ranking prima che l'editorial scriva, così il corpo
nasce già sulle query vere invece di essere riadattato dopo.

## Decisions already made (locked — non rilitigare)

- **Slug FISSO**: `dormire-posti-sembrano-inventati`. Non riscriverlo, non
  proporre alternative: è già nel seed e nella content note.
- Categoria `esperienze`, destinazione `Italia`, tipo pillar.
- **Apertura con Emotional Grand Motel** (`novara-emotional-grand-motel`,
  disclosure `collaboration`).
- **Audience, metrica primaria e lista delle voci**: leggile dalla sezione
  `## Brief` della content note, già compilata dal growth-operator. **Non
  ridefinirle.**
- **Nessun numero inventato.** E, per vincolo tecnico, **nessun `[VERIFY]` nel
  testo destinato al seed**: `scripts/publish-article-seed.mjs:22-28,97-100`
  rifiuta la pubblicazione se `title`, `excerpt` o `content` contengono la
  stringa `[VERIFY`. Se un dato manca, la meta non lo cita.
- **Excerpt ≤ 160 caratteri** — è un limite del codice, non uno stile
  [MISURATO: `publish-article-seed.mjs:32,89-91`].
- L'articolo cita solo strutture presenti in `src/data/content-seed.json`, con
  link interni a `/posto/:id`.

## Context the receiver needs

- Content note (compila la sezione `## SEO`):
  `docs/13_Content/ARTICLE_dormire-posti-sembrano-inventati.md`
- Brief growth già compilato nella stessa nota (audience + metrica + voci).
- Registro: `src/data/content-seed.json` — nomi, città, regioni e tipi reali.
  I tipi che contano per il cluster: `Insolito`, `Hotel con carattere`,
  `Posti particolari`.
- Seed da aggiornare a valle (campo `excerpt`, oggi placeholder):
  `src/data/articles/dormire-posti-sembrano-inventati.seed.ts:15`
- Blocchi editoriali disponibili nel corpo (servono a te per l'outline, non li
  scrivi tu): `docs/50_Scratch/HANDOFF_editorial-blocks-v2_ui-designer_to_frontend-builder.md`
  — `:::posto`, `:::verdetto`, `:::reel`, `:::dati`, `:::mappa`, `:::domande`,
  più l'inline `:affiliato`.

## What the receiver should produce

Compila la sezione `## SEO` della content note:

- **H1** — una sola, italiana, specifica. Deve contenere la promessa
  verificabile («dormirci davvero»), non l'aggettivo («magico», «incredibile»).
- **Meta title** ≤ 60 caratteri, **meta description** ≤ 160: nomina Italia +
  tipo di alloggio + la prova (ci siamo stati / disclosure dichiarata).
- **Excerpt per il seed** ≤ 160 caratteri — è la stringa che sostituisce il
  placeholder alla riga 15 del seed. Scrivila come stringa finita, pronta da
  incollare.
- **Keyword cluster**: primaria + secondarie + long-tail. Le long-tail vere di
  questa nicchia sono di forma «dormire in una mirror house», «case sugli
  alberi Italia», «alloggi insoliti <regione>», «hotel a tema Italia»: verifica
  e correggi, non fidarti di questo elenco. Segna **quali diventano H2**.
- **Schema.org**: proposta attesa = `Article`/`BlogPosting` + `ItemList` delle
  strutture citate (ogni voce con `name`, `url` interno `/posto/:id`,
  `address.addressLocality`/`addressRegion` dalla scheda). Se l'editorial usa
  `:::domande`, il `FAQPage` è **già emesso dal blocco**: non duplicarlo
  [MISURATO: spec `:::domande`, «emesso una sola volta per pagina»].
  Nomina i campi che vanno popolati e da quale campo del seed vengono.
- **Struttura H2/H3** per l'editorial: una sezione per voce non funziona se le
  voci sono 8-10 (diventa un listicle come gli altri). Proponi un
  **raggruppamento** — per tipo di stranezza, per occasione, per regione — e
  di' perché quello e non gli altri due.
- **La riga sulla disclosure**: come si scrive una dicitura di trasparenza che
  è leggibile da un umano e non danneggia lo snippet.

## Out of scope (do NOT touch)

- Non scrivere il corpo, gli attacchi di sezione, i verdetti (editorial-writer).
- Non scegliere né ordinare le strutture: la lista è lockata nel Brief.
- Non toccare codice: indichi l'`excerpt`, lo applica il frontend-builder.
- Nessun `[VERIFY]` in H1/meta/excerpt (blocca la pubblicazione).
- Non proporre un secondo articolo, un cluster di supporto o una strategia di
  pillar/cluster: **questo è l'unico articolo in produzione**, per decisione
  dell'owner.

## Open questions / decisions for the user

- Se il Brief ha lasciato aperta la domanda sul costo per voce (vedi
  `HANDOFF_..._orchestrator_to_growth.md`), **non aspettare**: scrivi meta e H1
  sulla prova che abbiamo comunque (ci siamo stati, disclosure dichiarata, reel
  a supporto). Il costo è un rinforzo, non la promessa portante.
- Produci **una** sola variante di H1/meta. Se ne proponi due, la decisione
  torna all'owner e il pezzo si ferma.

## Next hand-off

- Next agent: `travellini-editorial-writer`
- Trigger: sezione `## SEO` compilata (H1 + meta + excerpt + cluster + schema +
  outline H2 con raggruppamento motivato). Brief pronto in
  `HANDOFF_dormire-posti-sembrano-inventati_seo_to_editorial.md`.

## Notes

Il vero differenziatore GEO/AI-search qui è l'`ItemList` con link interni alle
schede: è l'unica lista in SERP dove ogni voce ha una pagina propria con
coordinate, disclosure e un video. Dillo esplicitamente nella tua sezione, così
il frontend sa che quello schema non è decorativo.
