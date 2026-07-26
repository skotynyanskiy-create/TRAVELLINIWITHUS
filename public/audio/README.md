# Audio Guides — asset folder

Cartella per le audio guide narrate da Rodrigo & Betta (Marathon FASE 2.B).
Ogni audio e' una clip da 60-120 secondi registrata in loco, con voce
diretta e nessuna musica.

## Struttura

```
public/audio/
├── README.md                     ← questo file
└── {guide-slug}/                 ← una cartella per ogni guida (es. "salento")
    ├── 01-marina-serra.mp3       ← numerato per ordine + slug breve
    ├── 02-tricase-porto.mp3
    └── ...
```

## Naming convention

Pattern obbligatorio: `{indice-zero-padded}-{slug-breve}.mp3`

- **indice**: 01, 02, 03... (zero-padded a 2 cifre per ordine alfabetico
  coerente con UI dispatch-index-number)
- **slug-breve**: kebab-case del nome luogo/punto, max 3 parole (es.
  "marina-serra", "otranto-mattina", "tricase-porto")
- **estensione**: `.mp3` (compatibile con HTML5 audio su tutti i browser
  moderni + Apple Podcasts)

## Specifiche audio raccomandate

- **Formato**: MP3, 128 kbps mono (voce sola, no musica)
- **Sample rate**: 44.1 kHz
- **Loudness**: -16 LUFS (broadcast podcast standard)
- **Durata**: 60-120 secondi per punto (10-15 minuti totali per guida)
- **Microfono**: Rode VideoMic / Rode NT-USB / equivalente — no audio
  smartphone diretto per qualita
- **Editing**: Audacity / Hindenburg / Reaper. Rimuovere "ehm", "uhm",
  pause >2 sec. Normalizzare a -16 LUFS. Fade-in/out 200ms.

## Workflow di pubblicazione

1. **Registrazione (R+B in loco)**: usare nota vocale o microfono. Una
   take pulita per ogni punto, riascoltare prima di chiudere la sessione.
2. **Editing in-house**: importare WAV/M4A in editor, normalizzare,
   esportare in MP3 con le specifiche sopra.
3. **Naming**: rinominare i file secondo la convention.
4. **Upload**: `git add public/audio/{guide-slug}/` + commit.
5. **Aggiornare config**: in `src/config/audioGuides.ts`:
   - Sostituire la `transcript` placeholder con la trascrizione reale
     (importante per a11y + AI search citation — usare Whisper o
     trascrivere a mano da nota di registrazione)
   - Aggiornare `durationSec` con la durata reale
   - Aggiornare `recordedAt` con mese + anno (es. "luglio 2025")
   - Cambiare `status: 'planning'` → `'published'`
6. **Verifica**: l'`AudioGuideSection` legge automaticamente i nuovi dati.
   Pagina articolo collegata mostrera' la sezione "Audio guida".

## Apple Podcast RSS feed (opzionale, post-pilot)

Quando una guida completa ha tutti i punti registrati, generare un feed
RSS Apple Podcasts per discovery cross-platform. Pattern:

```
https://travelliniwithus.it/audio/{guide-slug}/feed.xml
```

Implementare endpoint `GET /audio/:slug/feed.xml` in `server.ts` che
genera RSS 2.0 + iTunes namespace dai dati `audioGuides.ts`.

Owner: `travellini-backend-engineer` quando il pilot Salento e' completo.

## Stato attuale

- **Pilot Salento**: status `planning`. 4 punti placeholder strutturali in
  `audioGuides.ts`. Nessun file audio reale ancora caricato.
- Quando R+B registrano i primi punti, sostituire qui i `.mp3` e
  aggiornare il config. UI gestisce automaticamente lo stato pubblicato.
