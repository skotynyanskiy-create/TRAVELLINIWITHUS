---
project: Travelliniwithus
type: reference
status: active
owner: Rodrigo & Betta
created: 2026-05-14
area: operations
---

# Mappa: stile custom Mapbox Studio per Travelliniwithus

## Perché farlo

La mappa `/mappa` usa oggi lo style standard `mapbox://styles/mapbox/dark-v11`.
Funziona ma sembra "una qualunque". Mapbox Studio permette di costruire
uno style brandizzato in cui oceani, terra, strade, labels usano la
palette Travelliniwithus (sand/ink/accent) — diventando immediatamente
riconoscibile come "quella mappa di R+B".

Pattern di riferimento (siti che usano custom Mapbox styles):

- [The Outdoor Voices Trail Map](https://www.outdoorvoices.com/) — palette earthy
- [Notion Internal Maps](https://www.notion.so/) — palette grigi caldi
- [Le Sirenuse Positano](https://www.sirenuse.it/) — palette beige-oro

## Setup (~30-45 minuti R+B)

### 1. Crea lo style (5 min)

1. Vai a [studio.mapbox.com](https://studio.mapbox.com/) — login con lo stesso account che ha generato il token `pk.eyJ1Ijoic2tvdHgi...`
2. Click "New Style" → scegli **"Dark"** come base (è il più vicino al nostro look attuale)
3. Click "Customize Dark" → si apre l'editor

### 2. Cambia palette (20 min)

Usa la palette Travelliniwithus. Apri l'editor di destra "Components":

**Land (Earth/background)**:

- Colore base: `#0a0a0a` (var `--color-ink`)
- Hillshade highlight: `#1a1715` (warm dark)
- Hillshade shadow: `#050505`

**Water (oceani, mari, fiumi)**:

- Colore: `#1c1a17` (ink-warm, 1 step più chiaro del land)
- Niente texture, solo fill flat

**Buildings (edifici)**:

- Fill: `#26221d`
- Outline: rimuovere (troppo dettaglio per scala worldwide)

**Roads (strade)**:

- Strade principali: `#3a342c` (sand-dark)
- Strade locali: `#2a2520` (più sottili)
- **DISATTIVARE highway labels** (rumore visivo, non serve a R+B)

**Labels (testi paesi/città)**:

- Country labels: `#fafafa` (sand chiaro), font `Helvetica Neue` o `Roboto Condensed`
- City labels: `#a8a39c` (muted-fg)
- Region labels: `#787570`
- **HALO color**: `#0a0a0a` (per leggibilità su land scuro)
- **FONT SIZE**: ridurre 1 step (default è troppo invadente)

**Accent reserved for our markers**:

- NON usare `#ea580c` (terracotta accent) nello style — riservato ai marker custom Travelliniwithus.

### 3. Disattiva layer non necessari (5 min)

Click su "Layers" panel a sinistra. **Toggle off** i layer:

- ❌ `poi-label` (POI generici Mapbox — noise visivo per noi)
- ❌ `transit-label` (metropolitane, fermate bus)
- ❌ `airport-label` (label aeroporti — superflui a scala mondo)
- ❌ `road-shield` (numeri autostrade)
- ❌ `road-label-small` (vie locali)

Tieni solo:

- ✅ `country-label`
- ✅ `state-label` (regioni, importante per Italia)
- ✅ `settlement-label` (città principali — minore size)
- ✅ `water-label` (oceani, mari grandi)

### 4. Pubblica + copia URL (5 min)

1. Click "Publish" in alto a destra → conferma
2. Click "Share & develop" → tab "Develop with this style"
3. Copia lo **Style URL** (formato `mapbox://styles/skotx/clxxxxxxxxxxxxxxxxxx`)

### 5. Sostituisci in codice (1 min, lo faccio io quando me lo mandi)

In [src/components/map/MapboxWorldMap.tsx](../../src/components/map/MapboxWorldMap.tsx):

```tsx
// Cambia da:
mapStyle = 'mapbox://styles/mapbox/dark-v11';

// A:
mapStyle = 'mapbox://styles/skotx/<TUO_STYLE_ID>';
```

### 6. Test (5 min)

`npm run dev` → vai a `/mappa` → verifica:

- Oceani non più blu Mapbox default, ma `#1c1a17` (ink-warm)
- Strade visibili ma non invasive
- Country labels italiane leggibili, no POI noise
- I marker arancioni (accent) restano i SOLI punti caldi visibili → guida l'occhio sui posti

Se qualcosa non torna, torna in Mapbox Studio e ritocca → click "Publish" di nuovo → il nuovo style arriva automaticamente live (stesso URL).

## Versioning

Mapbox Studio mantiene versioni. Quando pubblichi, hai 2 opzioni nel
codice:

- **`mapbox://styles/skotx/<ID>`** — sempre l'ultima versione pubblicata
- **`mapbox://styles/skotx/<ID>/draft`** — versione draft (utile per A/B test)

Consiglio: prima versione = `<ID>` puro (publish-as-you-go). Quando il
look è stabile, fai uno snapshot → "Make this version production" e
usa quell'URL hardcoded per evitare regression accidentali.

## Mockup colori (preview palette)

```
Background land:      ████████ #0a0a0a (ink)
Water:                ████████ #1c1a17 (ink-warm)
Buildings:            ████████ #26221d (sand-dark)
Roads major:          ████████ #3a342c
Roads minor:          ████████ #2a2520
Country labels:       ████████ #fafafa (sand)
Region labels:        ████████ #a8a39c (muted-fg)
City labels:          ████████ #787570 (muted)
HALO labels (stroke): ████████ #0a0a0a
RESERVED for markers: ████████ #ea580c (accent terracotta)
                      ████████ #16a34a (success — partner badge)
```

## Quando hai finito

Mandami lo Style URL (formato `mapbox://styles/skotx/...`) e io faccio
il replace in `MapboxWorldMap.tsx`. Il commit successivo sostituisce
`dark-v11` con quello custom in 5 secondi. Niente refactor.

## Effetto atteso

Prima:

- Mappa "generica dark", indistinguibile da qualunque altro sito Mapbox.

Dopo:

- Mappa che, screenshot-ata in un OG card o messa accanto al logo
  Travelliniwithus, e' immediatamente riconoscibile come "loro".
- Mood editoriale-warm invece di "dark techy".
- I marker accent terracotta acquistano peso (sono gli unici punti
  arancioni in un mare di neutri ink/sand).

ICE 45 (alto impatto brand). Effort 30-45 min R+B (zero codice).
