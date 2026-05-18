---
title: HANDOFF_puglia-photo-plan-v1_asset-curator_to_editorial-writer
status: body-written
created: 2026-05-18
updated: 2026-05-18
from: travellini-asset-curator
to: travellini-editorial-writer
slug: puglia-trulli-masserie
expires: 2026-06-01
---

> **Editorial-writer update (2026-05-18)** — Body custom Puglia scritto in [`src/config/previewContent.ts`](../../src/config/previewContent.ts) via dict `CUSTOM_BODIES['puglia-trulli-masserie']`. Lunghezza ~1850 parole. Primitives integrate: DropCap auto-attivato sul primo paragrafo (380+ char), 5 marker `IMG_SLOT_2`...`IMG_SLOT_6` ai punti narrativi del photo plan, 1 PullQuote dopo sezione "Come muoversi", 1 SourceBlock Istat dopo "Errori da non fare" (cifre marcate `[VERIFY: ...]`). Prossimo step: frontend-builder sostituisce `IMG_SLOT_N` con path AVIF/WebP reali; in parallelo `/verify-facts` valida il dato Istat sul movimento turistico 2024.

# Handoff: Photo direction pillar Puglia — 6 immagini + OG card

## Why this work matters

Sessione 2 della roadmap "fai di meglio sul formato articolo". Le primitive `InlineFigure` e `FullBleedFigure` sono shipped (v1, 2026-05-18) ma nessun pillar le sfrutta ancora — gli articoli demo restano single-cover. Il pillar Puglia (`/articolo/puglia-trulli-masserie`) deve diventare il **primo articolo che mostra l'aspetto rivista premium** e fissare il pattern visivo (densita', registro, caption) per i prossimi pillar (Salento, Dolomiti, Toscana). L'obiettivo non e' decorare: e' costruire trust visivo a un livello che il template Medium-tier non puo' raggiungere con una sola cover.

## Decisions already made (LOCKED — non rilitigare)

- **6 immagini totali** per il pillar (cover + 5 nel body): la densita' minima per giustificare il salto editoriale senza sforare i 600-800KB.
- **Distribuzione**: 1 hero (cover esistente, da rivedere) + 3 `InlineFigure` dentro il body + 2 `FullBleedFigure` tra sezioni H2 (massimo consentito dalle primitive v1).
- **Mix aspect ratio**: 16/9 cinematografico per hero e fullbleed; 4/5 verticale per inline (rapporto piu' leggibile in colonna body 700-800px e mobile-first).
- **Lingua caption + alt**: italiano, sempre. Caption editoriale stile R+B (specifica, calda, mai buzzword). Alt accessibile descrittivo e non ridondante con caption.
- **Tre foto su sei DEVONO contenere una figura umana piccola** (silhouette in lontananza, mai posa frontale). Pattern Conde Nast Traveler / National Geographic Traveler.
- **Zero foto generate AI.** Zero Adobe/Getty stock generico. Unsplash ammesso solo con credit identificabile e con uno scatto che potrebbe esistere nell'archivio R+B.
- **Stagione visiva**: settembre-giugno. Niente foto da agosto pieno (folla, saturazione gialla cliche). Niente Natale.
- **Image weight budget totale articolo: 720KB** (margine sul soft cap 800KB). LCP target < 2.5s su 3G simulato.
- **Loading priority**: hero `fetchpriority="high"` + preload hint in `<head>`. Tutte le altre `loading="lazy"` con `decoding="async"`.

## Context the receiver needs

- Slot narrativi del pillar (sezioni canoniche, locked dal template):
  Hero -> Lead "In breve" -> Pratico -> Body (H2 ordinati: Perche' vale / Quando andare / Dove dormire / Come muoversi / Errori / Quando NON andarci) -> Itinerario -> Mappa -> Consigli -> Risorse.
- Le `InlineFigure` vanno **dentro** il body markdown (in mezzo alle H2 o subito dopo l'apertura H2). Le `FullBleedFigure` vanno **tra** una sezione H2 e l'altra, come stacco visivo.
- File sorgente articolo demo: [src/config/previewContent.ts](../../src/config/previewContent.ts) (`generateBody` procedurale). Seed: [src/config/demoArchive.ts](../../src/config/demoArchive.ts) riga 134.
- Primitive disponibili + cheat sheet markdown: [docs/10_Projects/PROJECT_ARTICLE_EDITORIAL_PRIMITIVES_V1.md](../10_Projects/PROJECT_ARTICLE_EDITORIAL_PRIMITIVES_V1.md) sez. "Sintassi markdown".
- Brand voice: [docs/EDITORIAL_GUIDE.md](../EDITORIAL_GUIDE.md), [docs/TRAVELLINIWITHUS_BRAND_MEMORY.md](../TRAVELLINIWITHUS_BRAND_MEMORY.md).
- Asset Puglia esistenti in repo:
  - `public/images/destinations/puglia.png` (originale)
  - `public/images/destinations/puglia.avif`
  - `public/images/destinations/puglia.webp`
  - Nessun altro asset Puglia in repo: tutte le altre 5 foto vanno reperite (Unsplash) o richieste a R+B.

## What the receiver should produce

L'editorial-writer riceve questo piano e:

1. Riscrive `generateBody` (o il body Puglia specifico) inserendo i 5 placeholder immagine inline/fullbleed nei punti narrativi indicati di seguito, con la sintassi markdown delle primitive.
2. Scrive il primo paragrafo del Lead **>= 280 caratteri** per attivare DropCap automatico (Sessione 1 limitation gia' documentata).
3. Passa poi al frontend-builder (handoff successivo) che concretizza i path immagine e il wire del component `<Image>` con triplet AVIF/WebP/PNG e srcset.

Output editorial-writer: nuovo body Puglia in [src/config/previewContent.ts](../../src/config/previewContent.ts) o file dedicato (a sua scelta), che usi i marker `IMG_SLOT_1` ... `IMG_SLOT_6` documentati qui sotto.

### Photo plan operativo

| #   | Slot narrativo                                                              | Trattamento       | Aspect               | Soggetto + crop direction                                                                                                                                                                                                                                                                                                                                                                                                            | Caption (IT)                                                                                                           | Credit                                                                       | Alt (IT, =< 120 char)                                                                  | Peso target   | Reperimento                                                                                                                                                                                                                                                                                                                         |
| --- | --------------------------------------------------------------------------- | ----------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Hero** (cover articolo, sopra H1)                                         | `<Image>` hero    | 16/9                 | Muretto a secco con due trulli sullo sfondo, luce di prima mattina (8-9), figura umana piccola sulla strada bianca a 1/3 da destra. Punto focale: trullo principale al centro-sinistra. NIENTE drone aerial puro. Inquadratura a altezza occhio o leggermente sotto, per dare scala.                                                                                                                                                 | "Strada bianca tra Locorotondo e Cisternino, prima mattina di settembre."                                              | Foto: Rodrigo Trav. (se archivio R+B) — altrimenti Foto: Unsplash / [autore] | "Strada di campagna tra muretti a secco con due trulli sullo sfondo, luce mattutina."  | =< 120KB AVIF | **Asset esistente da rivedere**: `public/images/destinations/puglia.avif` va valutato — se mostra Polignano o Alberobello in cliche, sostituire con shooting R+B o Unsplash query: `puglia countryside trulli dry stone wall morning`. **Verifica con Rodrigo: avete uno scatto archivio della valle d'Itria con muretti a secco?** |
| 2   | **Inline #1 — dentro H2 "Perche' vale"** (dopo 300-400 parole di body)      | `InlineFigure`    | 4/5 verticale        | Interno di masseria: cortile in pietra bianca con archi, tavolo apparecchiato a colazione vista uliveto. Niente persone in primo piano, **una sedia spostata** o un cappello di paglia su una sedia per dare presenza umana. Luce naturale laterale, ore 9-10.                                                                                                                                                                       | "La masseria Il Frantoio a Ostuni — ulivi millenari e ospitalita' che non recita."                                     | Foto: archivio Travellini                                                    | "Cortile interno di masseria pugliese con tavolo apparecchiato vista uliveto."         | =< 70KB WebP  | **Shooting buco**: R+B hanno gia' visitato masserie pugliesi? Se si', archivio. Altrimenti Unsplash query: `masseria puglia courtyard breakfast olive trees`. Verificare licenza autore.                                                                                                                                            |
| 3   | **FullBleed #1 — stacco visivo tra H2 "Quando andare" e H2 "Dove dormire"** | `FullBleedFigure` | 16/9 cinematografico | Polignano a Mare visto dal lato nord del porto vecchio, NON dalla terrazza-cliche di Lama Monachile. Casa bianca a strapiombo, mare blu intenso non saturato, due barche da pesca attraccate in basso. Figura umana piccola (pescatore o silhouette) sulla scogliera. Luce tardo pomeriggio (16-17, NON tramonto saturato).                                                                                                          | "Polignano a Mare al tramonto, dal lato nord del porto vecchio. La folla e' due strade piu' in la."                    | Foto: Rodrigo Trav.                                                          | "Polignano a Mare vista dal porto vecchio con barche da pesca, luce tardo pomeriggio." | =< 150KB AVIF | **Probabile shooting buco**: R+B raramente fotografano dal porto vecchio (la maggior parte sceglie Lama Monachile). Se non in archivio: Unsplash query `polignano a mare old port north fishing boats`. **Domanda a R+B: ne avete uno fuori dalla terrazza cliche?**                                                                |
| 4   | **Inline #2 — dentro H2 "Dove dormire"** (subito dopo apertura H2)          | `InlineFigure`    | 4/5 verticale        | Letto matrimoniale in camera di masseria, lenzuola bianche stropicciate (non rifatte da hotel), finestra aperta vista uliveto fuori fuoco, una camicia di lino sulla sedia. NIENTE vista totale stanza tipo brochure. Dettaglio narrativo, non catalogo. Luce calda mattutina che entra da sinistra.                                                                                                                                 | "Camera della masseria Cervarolo, alle 8 del mattino — il letto come lo lasci tu, la vista come la prepara la Puglia." | Foto: archivio Travellini                                                    | "Letto sfatto in camera di masseria con finestra aperta su uliveti pugliesi."          | =< 70KB WebP  | **Buco molto probabile**: foto in stanza richiede permesso struttura. R+B hanno scatti di camera in masseria gia' fotografati? Se no, Unsplash query: `masseria bedroom morning light olive view`.                                                                                                                                  |
| 5   | **Inline #3 — dentro H2 "Come muoversi"**                                   | `InlineFigure`    | 4/5 verticale        | Vespa o Fiat 500 d'epoca parcheggiata su strada bianca con muretto a secco, **vista dal lato** (NON dall'alto, NON di tre quarti turistico). In lontananza, sfocata, la cupola bianca di un trullo. Niente targa visibile, niente persone. Luce media giornata. **Alternativa**: cartello stradale arrugginito "Cisternino X km" con mano fuori finestrino auto che indica.                                                          | "Sulla provinciale tra Cisternino e Locorotondo — qui le distanze sulla mappa mentono, sempre per difetto."            | Foto: Rodrigo Trav.                                                          | "Vespa parcheggiata su strada bianca pugliese con trullo sullo sfondo sfocato."        | =< 70KB WebP  | **Possibile archivio**: R+B avranno scatti di trasferimenti. Se no, Unsplash query `puglia country road vespa fiat trulli` — selezionare scatto laterale, NON aerial.                                                                                                                                                               |
| 6   | **FullBleed #2 — stacco visivo tra H2 "Errori" e H2 "Quando NON andarci"**  | `FullBleedFigure` | 16/9 cinematografico | Costa adriatica salentina: scogliera bassa con pini marittimi, mare turchese, una persona piccola a piedi nudi sulle rocce in lontananza. NIENTE Maldive del Salento dall'alto, NIENTE Pescoluse pieno di ombrelloni. Costa **vera**, frequentata da locali, ore 10-11 mattino. **Alternativa**: tavolata di trattoria sul mare al tramonto vista di lato (tre tre quarti), con mani che servono orecchiette in primo piano sfocato. | "Costa di Otranto, fine settembre, ore 10 — il mare e' ancora caldo ma le sdraio non ci sono piu'."                    | Foto: Rodrigo Trav.                                                          | "Costa rocciosa salentina con pini marittimi e figura in lontananza sulle rocce."      | =< 150KB AVIF | **Possibile archivio**: R+B Otranto hanno scatti reali. Se non si trova fuori-cliche, Unsplash query `otranto coast rocks pine trees september` con selezione attenta.                                                                                                                                                              |

**Totale weight**: 120 + 70 + 150 + 70 + 70 + 150 = **630KB** (entro budget 800KB).

### Editorial markers per editorial-writer

Nel body Puglia, inserisci i blocchi alle posizioni indicate. Esempio markdown completo:

```markdown
## Perche' vale

(...300-400 parole di body...)

![Cortile interno di masseria pugliese con tavolo apparecchiato vista uliveto.](IMG_SLOT_2 "La masseria Il Frantoio a Ostuni — ulivi millenari e ospitalita' che non recita. | Foto: archivio Travellini")

(...continuo body...)

## Quando andare

(...body...)

:::fullbleed
![Polignano a Mare vista dal porto vecchio con barche da pesca, luce tardo pomeriggio.](IMG_SLOT_3 "Polignano a Mare al tramonto, dal lato nord del porto vecchio. La folla e' due strade piu' in la. | Foto: Rodrigo Trav.")
:::

## Dove dormire

![Letto sfatto in camera di masseria con finestra aperta su uliveti pugliesi.](IMG_SLOT_4 'Camera della masseria Cervarolo, alle 8 del mattino — il letto come lo lasci tu, la vista come la prepara la Puglia. | Foto: archivio Travellini')

(...body...)
```

I marker `IMG_SLOT_N` saranno sostituiti dal frontend-builder con path reali quando le foto saranno raccolte.

## OG card per /articolo/puglia-trulli-masserie

Brief grafico (non mockup pixel-perfect):

- **Dimensione**: 1200x630 esatti, JPG, =< 280KB.
- **Soggetto principale**: stesso hero (slot #1) ma ricomposto — strada bianca + due trulli + figura piccola. Crop diverso da hero articolo: piu' stretto, soggetto piu' a sinistra per lasciare respiro al testo a destra.
- **Overlay testo (IT)**: "Puglia, lentamente." (max 3 parole, peso visivo principale a destra) — Playfair Display o equivalente serif del design system, peso 500, colore `--color-ink` su fondo crema semitrasparente (overlay 40% sand) per leggibilita'.
- **Sottotesto opzionale (IT)**: "Trulli, masserie, costa adriatica." — sans-serif, peso 400, sotto al titolo, 60% opacita'.
- **Brand mark**: logo Travelliniwithus mini in basso a destra, monocromatico ink, max 80px larghezza. Non dominante.
- **Palette derivata**: sand (#F2EDE6 o equivalente), ink (#1B1B1B), accent muto (zero saturazione gialla forte).
- **Focal preservation**: assicurarsi che il volto/silhouette della figura umana NON sia coperta dal box testo. Box testo nella meta' destra, soggetto sulla meta' sinistra.
- **Test obbligatorio**: anteprima Twitter/X, LinkedIn, WhatsApp prima del deploy (handoff a `browser-auditor` post-deploy).

## Coerenza brand — palette dominante

Le 6 foto insieme devono raccontare **una sola Puglia**: pietra bianca, terra rossa, ulivi argento, mare blu non saturato. Evita:

- Saturazione gialla forte (filtro Instagram piatto da 2018).
- HDR aggressivo (cieli troppo blu, ombre troppo aperte).
- Drone aerial-only senza contesto umano (cliche del sud Italia 2020-2024).
- Bianco-azzurro Mykonos-style (la Puglia ha la sua luce, non Santorini).
- Saturazione boost del verde uliveto (l'argento dell'olivo e' parte del registro).

## Lista NON-DO (cosa NON includere)

- Foto di Trulli di Alberobello dalla strada principale Rione Monti (cliche, pieno di turisti, gia' fatto da tutti).
- Tramonti viola/arancio saturati su Polignano da Lama Monachile.
- Piatti di orecchiette dall'alto centrato su tovaglia bianca (fanno blog 2014). Se cibo serve: tavolo di trattoria visto di lato + mani che servono + bicchiere primitivo, MAI flatlay.
- Foto stock Adobe Stock / Getty senza nome fotografo identificabile.
- Coppia di turisti che si tiene per mano davanti al tramonto (anti-pattern editoriale assoluto).
- Cartello "I love Puglia" o simili gimmick turistici.
- Foto AI-generated (anche se realistica).
- Drone-only senza scala umana visibile.

## Workflow di reperimento — per ogni foto

| Slot                                | Fonte primaria                             | Fonte fallback                                                            | Domanda aperta per Rodrigo                                                        |
| ----------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| #1 Hero                             | Verifica archivio R+B Valle d'Itria        | Unsplash query: `puglia countryside trulli dry stone wall morning`        | "Avete uno scatto archivio della valle d'Itria con muretti a secco mattutini?"    |
| #2 Inline masseria cortile          | Archivio R+B masserie                      | Unsplash query: `masseria puglia courtyard breakfast olive trees`         | "Quali masserie avete fotografato? Il Frantoio? Cervarolo? Torre Coccaro?"        |
| #3 FullBleed Polignano fuori-cliche | Archivio R+B porto vecchio                 | Unsplash query: `polignano a mare old port north fishing boats`           | "Avete uno scatto di Polignano NON da Lama Monachile?"                            |
| #4 Inline camera masseria           | Archivio R+B (richiede permesso struttura) | Unsplash query: `masseria bedroom morning light olive view`               | "Avete dormito in masseria con foto camera? Permesso pubblicazione?"              |
| #5 Inline strada-mezzo              | Archivio R+B trasferimenti                 | Unsplash query: `puglia country road vespa fiat trulli` (scatto laterale) | "Avete scatti di trasferimenti su strada bianca? Vespa, auto, scooter?"           |
| #6 FullBleed costa salentina        | Archivio R+B Otranto/Salento               | Unsplash query: `otranto coast rocks pine trees september`                | "Quale tratto di costa salentina avete coperto? Otranto-Castro? Porto Selvaggio?" |

## Out of scope (do NOT touch)

- Layout, spacing, hierarchy del template articolo (Sessione 1 lockata).
- Implementazione `<Image>` component, srcset, AVIF/WebP triplet → spetta a `travellini-frontend-builder` nell'handoff successivo.
- Scrittura del body completo del pillar Puglia in tono editoriale → spetta a `travellini-editorial-writer` che riceve questo handoff.
- OG card pixel-perfect mockup → spetta a chi la genera in produzione (Figma + export).
- Photo shooting fisico → task umano (Rodrigo & Betta).
- Editing/grading delle foto raccolte → task umano.

## Open questions / decisions for the user

1. **Archivio R+B disponibile?** Per ognuna delle 6 foto, Rodrigo deve confermare cosa c'e' gia' in archivio. Senza questa info, 4 su 6 foto vanno reperite su Unsplash come fallback.
2. **Stagione foto richiesta**: settembre-giugno e' raccomandazione asset-curator. Se R+B hanno solo scatti agosto, e' accettabile **solo se** il giallo non e' saturato (post-processing soft).
3. **Permesso pubblicazione masserie**: foto #2 e #4 richiedono permesso struttura se vengono da archivio R+B. Verificare prima del go-live.
4. **OG card produzione**: chi la genera? Figma manuale o `@vercel/og` runtime? Decisione a frontend-builder + ui-designer.

## Next hand-off

- **Next agent**: `travellini-editorial-writer`
- **Trigger**: Rodrigo conferma archivio disponibile + risponde alle 6 domande aperte. Editorial-writer riceve i marker `IMG_SLOT_1` ... `IMG_SLOT_6` e li integra nel body Puglia con sintassi primitive v1.
- **Post-editorial**: handoff successivo a `travellini-frontend-builder` per concretizzare path immagine + `<Image>` wire + srcset + preload hero.
- **Gate finale**: `browser-auditor` smoke su `/articolo/puglia-trulli-masserie` desktop 1280 + mobile 375, LCP < 2.5s, zero console error, OG preview validata su Twitter/X + WhatsApp + LinkedIn.

## Notes

- Questo piano fissa il **pattern visivo** per i prossimi pillar (Salento, Dolomiti, Toscana). Una volta validato su Puglia + misurato (scroll depth, time on page pre/post in GA4), si replica il template a 5-6 foto per ogni pillar canonico.
- Quality bar editoriale Conde Nast Traveler / Suitcase Magazine: foto **rare**, **specifiche**, **con scala umana**. Mai foto-cartolina, mai foto-checklist.
- Se dopo go-live la metrica LCP supera 2.5s, primo intervento: dropare aspect ratio inline da 4/5 a 3/4 (riduce ~15% peso) prima di toccare hero. Secondo intervento: switchare fullbleed #2 a inline.
- Il pattern "una figura umana piccola in lontananza" e' deliberato — riprende il visual language di Conde Nast Traveler 2019-2024 e funziona meglio della popolazione vuota o della popolazione affollata. NON e' un caso applicato 3 volte.

---

## Photo selections (Unsplash, 2026-05-18)

### Disclaimer operativo (LEGGERE PRIMA)

Questa sessione asset-curator opera **senza accesso WebSearch / WebFetch attivo** (toolset corrente: Read, Write, Edit, Bash, Glob, Grep). Non posso quindi:

- Aprire `unsplash.com/s/photos/<query>` e leggere i risultati.
- Estrarre l'URL canonico `https://images.unsplash.com/photo-<id>` di una foto specifica.
- Verificare in tempo reale autore + handle + license (Unsplash standard vs Unsplash+).

Inventare 5 URL `photo-XXXXXXX` sarebbe una violazione diretta delle hard rules dell'agent ("Never invent files. Never claim a license you can't verify"). Una foto Unsplash inventata equivale a un broken asset al go-live.

**Cosa faccio invece**: per ogni slot fornisco

1. Query Unsplash **precisa** (testata mentalmente contro pattern di risultato noti).
2. **Criteri di scelta puntuali** sulla prima pagina dei risultati (cosa accettare, cosa scartare).
3. Shortlist di **autori Unsplash Puglia-specialisti** noti per registro editoriale compatibile con R+B — da preferire se compaiono nei primi 15 risultati.
4. Marcatura `[NEEDS_OWNER_PICK]` su tutti gli slot: Rodrigo apre la query in browser, applica i criteri, incolla URL + autore + handle nel piano (5 minuti totali, 1 per slot).
5. Caption + alt + credit **gia' rifiniti** lato editoriale — pronti a essere paste-ati una volta selezionato l'URL.

Questo e' l'output massimo verificabile a contesto attuale. Se preferisci che invochi una sessione separata con WebSearch attivo per pre-popolare gli URL, lo dichiari e ripianifichiamo (5-10 minuti aggiuntivi). Altrimenti il flusso `[NEEDS_OWNER_PICK]` qui sotto e' progettato per essere risolto da Rodrigo in 5 minuti senza re-prompt.

### Autori Unsplash Puglia-rilevanti (preferire se compaiono)

Profili noti per scatti Puglia/Sud Italia con registro editoriale (luce naturale, scala umana, composizione fuori-cliche). Se uno di questi compare nei primi 15 risultati di una query, **preferiscilo** ad autore generico — il credit conta come dichiarato nel brief.

| Handle                 | Profile URL                           | Note registro                                                           |
| ---------------------- | ------------------------------------- | ----------------------------------------------------------------------- |
| Gabriella Clare Marino | `https://unsplash.com/@gabiontheroad` | Italiana, scatti diffusi su Sud Italia, registro caldo non saturato     |
| Tommaso Pecchioli      | `https://unsplash.com/@tommao`        | Italiano, fotografo viaggio, composizione editoriale                    |
| Davide Cantelli        | `https://unsplash.com/@cant89`        | Italiano, light naturale, paesaggio non drone-only                      |
| Henrique Ferreira      | `https://unsplash.com/@rickpsd`       | Sud Europa, registro Conde-Nast-like                                    |
| Luca Bravo             | `https://unsplash.com/@lucabravo`     | Italiano top-10, italy travel editoriale (verifica se ha scatti Puglia) |

Se nessuno di questi compare, accettabile qualunque autore con almeno **20 foto pubblicate** e profilo italiano/europeo (filtro qualita' debole ma utile).

### License default (applicabile a tutti gli slot)

- **Unsplash License** standard: uso commerciale OK, modifica OK, attribuzione NON obbligatoria ma noi diamo credit sempre per allineamento brand editoriale.
- **Escludere tassativamente** foto marcate "Unsplash+" (badge nero, richiede subscription a pagamento).
- Verificare al click: l'URL del download deve essere `unsplash.com/photos/<slug>/download` senza paywall.

### Slot #2 — Inline #1 dentro H2 "Perche' vale" — masseria cortile (4/5 verticale)

- **URL**: `[NEEDS_OWNER_PICK]` — incollare qui dopo selezione.
- **Query Unsplash da aprire**: `https://unsplash.com/s/photos/masseria-puglia` — fallback secondario: `https://unsplash.com/s/photos/puglia-courtyard-olive-trees`.
- **Criteri di scelta sui primi 15 risultati**:
  - SI': cortile in pietra bianca, archi visibili, tavolo apparecchiato O sedia con cappello/asciugamano (presenza umana implicita).
  - SI': luce laterale naturale (ore 9-10 mattutine, ombra netta ma non dura).
  - SI': orientation portrait (verticale) o square croppabile a 4/5.
  - NO: persone in primo piano frontali (model release).
  - NO: piscina infinity stile resort (registro sbagliato, non e' una masseria-resort review).
  - NO: drone aerial della masseria (no scala umana).
  - NO: foto con marchio masseria leggibile sullo sfondo (problema legale).
- **Autore preferito se presente**: Gabriella Clare Marino, Tommaso Pecchioli (vedi tabella sopra).
- **Profile URL autore**: `[NEEDS_OWNER_PICK]` — incollare dopo selezione.
- **License**: Unsplash License (verificare assenza badge "Unsplash+").
- **Srcset consigliato**: 800w, 1200w, 1600w — formato WebP con AVIF opzionale se peso permette.
- **Aspect target**: 4/5 verticale. Se la foto e' 3/4 o 2/3, croppare in alto/basso (preservare archi e tavolo).
- **Caption final (IT)**: "Una masseria della Valle d'Itria al mattino — gli ulivi fanno meta' del lavoro, il resto e' silenzio."
- **Alt final (IT)**: "Cortile interno di masseria pugliese in pietra bianca con tavolo apparecchiato vista uliveto."
- **Credit final (IT)**: "Foto: [NOME AUTORE] / Unsplash"

### Slot #3 — FullBleed #1 stacco tra "Quando andare" e "Dove dormire" — Polignano fuori-cliche (16/9)

- **URL**: `[NEEDS_OWNER_PICK]` — incollare qui dopo selezione.
- **Query Unsplash da aprire**: `https://unsplash.com/s/photos/polignano-a-mare-port` — fallback: `https://unsplash.com/s/photos/polignano-fishing-boats`.
- **Criteri di scelta sui primi 15 risultati**:
  - SI': inquadratura del porto vecchio (lato nord) o vista laterale delle case bianche a strapiombo.
  - SI': barche da pesca attraccate in primo piano O scogliera bassa con figura umana piccola.
  - SI': luce tardo pomeriggio (ombre lunghe, non saturazione tramonto rosa).
  - SI': orientation landscape, croppabile 16/9.
  - NO: la terrazza di Lama Monachile dall'alto (il cliche assoluto — scartare istantaneamente).
  - NO: tramonto viola/arancio over-saturato.
  - NO: drone diretto a piombo.
  - NO: turisti in primo piano riconoscibili.
- **Autore preferito se presente**: Gabriella Clare Marino, Davide Cantelli.
- **Profile URL autore**: `[NEEDS_OWNER_PICK]`.
- **License**: Unsplash License.
- **Srcset consigliato**: 800w, 1200w, 1600w — formato AVIF prioritario (full-bleed = visibilita' alta, qualita' percepita conta).
- **Aspect target**: 16/9 cinematografico. Se la foto e' 3/2, croppare in alto (cielo) per stringere a 16/9.
- **Caption final (IT)**: "Polignano a Mare dal lato nord del porto vecchio. La folla di Lama Monachile e' due strade piu' in la."
- **Alt final (IT)**: "Case bianche di Polignano a Mare a strapiombo sul mare con barche da pesca attraccate nel porto vecchio."
- **Credit final (IT)**: "Foto: [NOME AUTORE] / Unsplash"

### Slot #4 — Inline #2 dentro H2 "Dove dormire" — camera masseria (4/5 verticale)

- **URL**: `[NEEDS_OWNER_PICK]` — incollare qui dopo selezione.
- **Query Unsplash da aprire**: `https://unsplash.com/s/photos/masseria-bedroom` — fallback: `https://unsplash.com/s/photos/italian-countryside-bedroom-window`.
- **Criteri di scelta sui primi 15 risultati**:
  - SI': letto matrimoniale con lenzuola bianche, finestra aperta visibile, luce naturale calda.
  - SI': dettaglio narrativo (camicia su sedia, libro sul comodino, vista uliveto fuori fuoco).
  - SI': orientation portrait o 4/5.
  - NO: foto totale stanza tipo brochure hotel.
  - NO: letto rifatto perfetto stile catalogo (manca registro editoriale).
  - NO: arredamento Mykonos/Santorini (azzurro saturo).
  - NO: brand hotel visibile (sciugamani con logo, etc.).
- **Nota probabilita' fit**: questo e' lo slot piu' difficile su Unsplash. Le "masseria bedroom" generiche su Unsplash spesso sono **hotel pugliesi rebrand** che si autodefiniscono masseria — accettabile **solo se** registro fotografico e' editoriale (luce naturale, no flash, no wide-angle distorto).
- **Autore preferito se presente**: Gabriella Clare Marino, Tommaso Pecchioli.
- **Profile URL autore**: `[NEEDS_OWNER_PICK]`.
- **License**: Unsplash License (Unsplash+ frequente in questa categoria interior — verificare con attenzione).
- **Srcset consigliato**: 800w, 1200w, 1600w — WebP.
- **Aspect target**: 4/5 verticale.
- **Caption final (IT)**: "Camera di masseria alle otto del mattino — il letto come lo lasci tu, la vista come la prepara la Puglia."
- **Alt final (IT)**: "Letto matrimoniale in camera di masseria con lenzuola bianche e finestra aperta su uliveti."
- **Credit final (IT)**: "Foto: [NOME AUTORE] / Unsplash"
- **Flag**: se dopo 15 risultati nessuna foto rispetta i criteri (probabilita' ~40%), proponi alternativa: **scattare al primo viaggio in masseria** (R+B) e usare placeholder skeleton per il go-live. Oppure spostare la foto al H2 "Errori" cambiando contenuto.

### Slot #5 — Inline #3 dentro H2 "Come muoversi" — strada/Vespa (4/5 verticale)

- **URL**: `[NEEDS_OWNER_PICK]` — incollare qui dopo selezione.
- **Query Unsplash da aprire**: `https://unsplash.com/s/photos/puglia-country-road` — fallback: `https://unsplash.com/s/photos/vespa-italy-countryside`.
- **Criteri di scelta sui primi 15 risultati**:
  - SI': strada bianca con muretti a secco, croppabile verticale.
  - SI': Vespa O Fiat 500 vintage vista di lato (NON di tre quarti turistico, NON dall'alto).
  - SI': cupola di trullo o oliveto sullo sfondo fuori fuoco.
  - SI': nessuna targa leggibile (anonimato veicolo).
  - SI': luce diurna naturale, no golden hour saturato.
  - NO: aerial drone della strada (cliche).
  - NO: Vespa con coppia di turisti felici a bordo (anti-pattern).
  - NO: cartello "Welcome to Puglia" o gimmick.
  - NO: filtro vintage estremo (sbiadito anni '70).
- **Nota**: alternativa equivalente accettabile: scatto laterale di **muretto a secco** che curva con uliveto sullo sfondo, **senza veicolo** — comunica "muoversi lentamente" senza dipendere dalla Vespa.
- **Autore preferito se presente**: Davide Cantelli, Tommaso Pecchioli.
- **Profile URL autore**: `[NEEDS_OWNER_PICK]`.
- **License**: Unsplash License.
- **Srcset consigliato**: 800w, 1200w, 1600w — WebP.
- **Aspect target**: 4/5 verticale.
- **Caption final (IT)**: "Tra Cisternino e Locorotondo le distanze sulla mappa mentono — sempre per difetto."
- **Alt final (IT)**: "Strada bianca tra muretti a secco nella Valle d'Itria con uliveti sullo sfondo."
- **Credit final (IT)**: "Foto: [NOME AUTORE] / Unsplash"

### Slot #6 — FullBleed #2 stacco tra "Errori" e "Quando NON andarci" — costa salentina (16/9)

- **URL**: `[NEEDS_OWNER_PICK]` — incollare qui dopo selezione.
- **Query Unsplash da aprire**: `https://unsplash.com/s/photos/otranto-coast` — fallback: `https://unsplash.com/s/photos/salento-rocks-pine-trees`.
- **Criteri di scelta sui primi 15 risultati**:
  - SI': scogliera bassa con pini marittimi, mare turchese non saturato.
  - SI': una figura umana piccola in lontananza (silhouette su rocce o sentiero).
  - SI': ore mattutine o tardo pomeriggio, luce non zenitale.
  - SI': orientation landscape, croppabile 16/9.
  - NO: "Maldive del Salento" Pescoluse vista dall'alto (cliche assoluto).
  - NO: spiaggia piena di ombrelloni colorati.
  - NO: tramonto saturo over-edited.
  - NO: stabilimento balneare con marchio visibile.
- **Autore preferito se presente**: Gabriella Clare Marino, Henrique Ferreira.
- **Profile URL autore**: `[NEEDS_OWNER_PICK]`.
- **License**: Unsplash License.
- **Srcset consigliato**: 800w, 1200w, 1600w — formato AVIF prioritario (full-bleed = visibilita' alta).
- **Aspect target**: 16/9 cinematografico.
- **Caption final (IT)**: "Costa di Otranto, fine settembre, ore dieci — il mare e' ancora caldo ma le sdraio non ci sono piu'."
- **Alt final (IT)**: "Scogliera salentina con pini marittimi e figura umana in lontananza sulle rocce con mare turchese."
- **Credit final (IT)**: "Foto: [NOME AUTORE] / Unsplash"

### Procedura operativa per Rodrigo (5 minuti totali)

1. Apri le 5 URL query sopra in 5 tab del browser.
2. Per ogni tab, applica i criteri SI'/NO sui primi 15 risultati. Tempo target: 1 minuto per slot.
3. Click sulla foto scelta → copia URL canonico (formato `https://images.unsplash.com/photo-XXXXXXX?ixlib=...` — basta troncare a `?w=1200&auto=format&fit=crop&q=80`).
4. Click sul nome autore → copia URL profilo (`https://unsplash.com/@handle`).
5. Incolla URL + autore + handle nei placeholder `[NEEDS_OWNER_PICK]` di ogni slot.
6. Aggiorna manualmente `Credit final` sostituendo `[NOME AUTORE]` con il nome reale.
7. Cambia frontmatter `status: photos-selected` → `status: photos-confirmed`.
8. Procedi all'handoff successivo verso `travellini-editorial-writer`.

### Vincoli ricordati al click

- Massimo 1 foto per autore (varieta' visiva): se Gabriella Clare Marino e' perfetta per slot #2, non riusarla su slot #3.
- Niente foto con persone riconoscibili in primo piano (no model release).
- Niente foto con brand/logo identificabile sullo sfondo.
- Niente Unsplash+ (badge nero).
- Stagione: scartare foto palesemente da agosto pieno (folla, luce zenitale gialla).

### Note finali asset-curator

- I 5 caption final e i 5 alt final sopra sono **gia' rifiniti** in stile editoriale R+B (specifici, non decorativi, no buzzword). Non vanno riscritti dall'editorial-writer — vanno solo accoppiati all'URL finale.
- Una volta che Rodrigo incolla i 5 URL, il piano e' completo e si puo' triggerare l'handoff a `travellini-editorial-writer` per integrare i marker `IMG_SLOT_2`...`IMG_SLOT_6` nel body Puglia.
- Se uno slot risulta impossibile da risolvere su Unsplash (probabilita' alta per #4 camera masseria), il fallback raccomandato e': **placeholder skeleton al go-live + shooting R+B nel primo viaggio Puglia post-launch**. Non degradare la qualita' editoriale prendendo una foto-cartolina solo per riempire lo slot.
