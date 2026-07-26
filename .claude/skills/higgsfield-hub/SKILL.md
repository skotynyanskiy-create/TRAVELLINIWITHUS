---
name: higgsfield-hub
description: Punto d'ingresso unico a tutte le capacita Higgsfield per Travelliniwithus — instrada l'intento sul canale giusto tra CLI locale, connettore MCP remoto e le 7 skill del fornitore, senza doverli cercare ogni volta. Copre video verticali e reframe, clipper da video lunghi, upscale foto e video, doppiaggio e voci, analisi performance e viralita, rimozione sfondo e outpaint, motion control, 3D, generazione immagini e video, marketing studio, siti e giochi. Usa quando l'utente dice "higgsfield", "genera video", "fai un reel verticale", "taglia questo video", "migliora questa foto", "doppia questo video", "quanto costa generare", o quando serve una capacita media che il repo non ha nativamente.
---

# Higgsfield Hub — router unico delle capacita media

Higgsfield espone le stesse capacita su **tre canali diversi**. Questo file dice
quale usare, cosi non si perde tempo a cercarlo e non si sceglie il canale
sbagliato.

Prerequisito gia soddisfatto: CLI installata e autenticata (`higgsfield account
status` risponde con piano e crediti), connettore MCP collegato, 7 skill del
fornitore collegate in `.claude/skills/`.

## I tre canali

| Canale                  | Quando usarlo                                                                                                                     | Come si chiama                                                                                                                                                                                  |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Skill del fornitore** | L'intento coincide con una skill dedicata. Conoscono modelli, preset e parametri meglio di qualsiasi riepilogo. **Prima scelta.** | `higgsfield-generate`, `higgsfield-soul-id`, `higgsfield-product-photoshoot`, `higgsfield-marketplace-cards`, `higgsfield-video-explainer`, `higgsfield-websites`, `higgsfield-game-generation` |
| **Connettore MCP**      | Capacita che **non** hanno una skill locale. E il canale piu ampio.                                                               | tool del server Higgsfield, per nome (`reframe`, `dubbing`, ...)                                                                                                                                |
| **CLI locale**          | Job scriptabili, stime di costo, liste modelli/preset/voci, upload, polling. Utile dentro comandi e verifiche.                    | `higgsfield <comando>`                                                                                                                                                                          |

Se due canali coprono lo stesso intento, vince la skill del fornitore.

## Routing per intento

### Video — montaggio e riuso di girato reale

Queste sono le piu rilevanti per Travelliniwithus, perche lavorano su **materiale
gia vostro** e non inventano immagini.

| Intento                                           | Canale | Chiamata                                                                                                    |
| ------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------- |
| Girato 16:9 → verticale 9:16 per Reels            | MCP    | `reframe`                                                                                                   |
| Estrarre clip corte da un video lungo             | MCP    | `personal_clipper_create`, poi `personal_clipper_status`                                                    |
| Produrre short in serie con preset ricorrente     | MCP    | `shorts_studio_create`, preset via `shorts_studio_list_presets` / `shorts_studio_create_preset`             |
| Unire clip, musica, sottotitoli                   | MCP    | `generate_video` con workflow di montaggio, oppure app marketplace _Match Cut + Tracelab_ via `apps_invoke` |
| Cambiare rapporto d'aspetto di un video esistente | CLI    | `higgsfield generate workflow reframe ...`                                                                  |
| Migliorare qualita di un video                    | MCP    | `upscale_video`                                                                                             |

### Foto — solo su scatti reali

| Intento                                | Canale | Chiamata            |
| -------------------------------------- | ------ | ------------------- |
| Alzare risoluzione di uno scatto reale | MCP    | `upscale_image`     |
| Estendere l'inquadratura oltre i bordi | MCP    | `outpaint_image`    |
| Scontornare un soggetto                | MCP    | `remove_background` |

### Audio e lingue

| Intento                                  | Canale | Chiamata                                   |
| ---------------------------------------- | ------ | ------------------------------------------ |
| Doppiare un video in un'altra lingua     | MCP    | `dubbing`                                  |
| Sostituire la voce mantenendo il parlato | MCP    | `voice_change`                             |
| Voce sintetica nuova                     | MCP    | `create_voice`, catalogo con `list_voices` |
| Musica o effetti sonori                  | Skill  | `higgsfield-generate` (Seed Audio)         |

### Analisi e decisione

| Intento                              | Canale | Chiamata                                                   |
| ------------------------------------ | ------ | ---------------------------------------------------------- |
| Capire perche un video funziona o no | MCP    | `video_analysis_create`, esito con `video_analysis_status` |
| Stimare la resa prima di pubblicare  | MCP    | `virality_predictor`                                       |

Sono supporto alla decisione: l'interpretazione per il business resta a
`travellini-growth-revenue-operator`, i dati reali a `travellini-data-analyst`.

### Generazione (vedi guardrail sotto)

| Intento                              | Canale                                                    |
| ------------------------------------ | --------------------------------------------------------- |
| Immagini, video, 3D, audio da prompt | Skill `higgsfield-generate`                               |
| Foto prodotto / creativita brand     | Skill `higgsfield-product-photoshoot`                     |
| Identita facciale coerente           | Skill `higgsfield-soul-id`                                |
| Video esplicativo narrato            | Skill `higgsfield-video-explainer`                        |
| Card prodotto per marketplace        | Skill `higgsfield-marketplace-cards`                      |
| Siti e giochi                        | Skill `higgsfield-websites`, `higgsfield-game-generation` |

### Utility

| Intento                            | Canale | Chiamata                                    |
| ---------------------------------- | ------ | ------------------------------------------- |
| Caricare un file locale come input | CLI    | `higgsfield upload ...`                     |
| Elencare modelli disponibili       | CLI    | `higgsfield model list --image` / `--video` |
| Elencare workflow                  | CLI    | `higgsfield workflow list`                  |
| Preset di generazione              | CLI    | `higgsfield preset ...`                     |
| Stato di un job                    | CLI    | `higgsfield generate get <id>` / `wait`     |
| Crediti residui                    | CLI    | `higgsfield account status`                 |

## Guardrail

**Stimare il costo prima di generare.** I crediti sono finiti. Per job non
banali: `higgsfield generate cost ...` prima di `create`. Riportare la stima
all'owner quando supera il consumo ordinario.

**Fotografia reale sul sito.** `CLAUDE.md` e `DESIGN.md` prescrivono foto vere
per le pagine pubbliche. Le capacita che lavorano su materiale esistente
(reframe, upscale, clipper, dubbing, outpaint, rimozione sfondo) sono coerenti
con quella regola. Quelle che generano immagini da zero **non** lo sono: usarle
per il sito richiede una decisione esplicita dell'owner, non e un default.

**Niente upload di lavoro interno.** Il tool `sync_agents` del connettore non
importa nulla: carica le skill del progetto e un profilo sintetizzato sui server
del fornitore. Non invocarlo senza richiesta esplicita e informata dell'owner.

**Connettori Supercomputer.** Collegare Gmail, Drive, Notion o GitHub al
Supercomputer fa transitare dati aziendali da terzi e duplica capacita MCP gia
presenti nel repo. Fuori perimetro salvo decisione esplicita.

## Contesto di progetto

Prima di produrre materiale destinato al pubblico, leggere il minimo
indispensabile e non l'intero vault `docs/`:

- `AGENTS.md` — guida operativa radice: chi fa cosa e con quale sequenza.
- `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md` — voce e identita visiva da
  rispettare in qualsiasi asset generato o rilavorato.
- `docs/MARKETING_OPERATIONS_HUB.md` — dove registrare l'asset prodotto quando
  entra in una campagna, cosi la decisione resta tracciata.

## Verifica

Dopo un lavoro che produce un file destinato al sito, valgono le regole di
sempre: peso immagine e alt text con `travellini-asset-curator`, resa reale nel
browser prima di dire che e fatto.
