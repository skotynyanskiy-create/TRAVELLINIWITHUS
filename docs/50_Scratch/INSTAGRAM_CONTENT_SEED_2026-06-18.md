---
title: Instagram Content Seed — Travelliniwithus
date: 2026-06-18
type: scratch
source: instagram.com/travelliniwithus (raccolta via Claude-in-Chrome, sessione loggata)
status: active
area: workspace
---

# Instagram Content Seed (campione 2026-06-18)

Raccolta dal profilo reale `@travelliniwithus` (170K follower · 1.251 post · in
elenco AGCOM · bio: "POSTI PARTICOLARI IN TUTTO IL MONDO · ADV DM o email").
Highlight organizzati **per regione** (Toscana, Lombardia, Veneto, Calabria,
Lazio, Emilia). Questo è un campione dei 12 reel più recenti — per la libreria
completa serve l'API ufficiale Instagram (vedi nota in fondo).

## Pillar di contenuto reali (confermati dal campione)

1. **Alloggi particolari / insoliti** — glamping/treehouse, suite romantiche, infinity pool low-cost.
2. **Ristoranti & locali a tema** — Tim Burton, Disney, locanda medievale con falconeria, vampiri Volturi, taverna draghi.
3. **Esperienze & luoghi insoliti** — parchi a tema, agriturismi con animali, aperitivi in vigna.
4. **Relax / resort / mare** — Costa degli Dei, Mar Rosso, lidi.
5. **Taglio valore/prezzo** — prezzo sempre esplicito ("25€/notte", "190€", "low cost", "città economica").
6. **Monetizzazione attiva** — molti post ADV/invited/collaborazione/affiliazione + Linktree (sconti, assicurazioni, escursioni) + community "travellini".

Geografia: forte **Italia regionale** (Veneto, Lombardia, Toscana, Calabria) + Europa (Slovenia, Spagna) + Asia (Malesia).

## Campione (12 reel recenti)

| #   | Permalink        | Luogo                                                         | Regione/Zona                     | Pillar/Tipo                             | ADV       |
| --- | ---------------- | ------------------------------------------------------------- | -------------------------------- | --------------------------------------- | --------- |
| 1   | reel/DJoQoqUIRh3 | Garden Village Bled (glamping)                                | Slovenia · Lago di Bled / Europa | Alloggio insolito                       | invited   |
| 2   | reel/DNdews7ooto | Kuala Lumpur (città low-cost, Batu Caves)                     | Malesia / Asia                   | Posti particolari                       | collab    |
| 3   | reel/C6gJr_noB_i | The Burton Juice (ristorante tema Tim Burton)                 | Italia                           | Insolito / Food                         | —         |
| 4   | reel/DZscTqAshTD | Contea del Vignolo Fiorito, Graffignana (agriturismo animali) | Lombardia / Italia               | Posti particolari / Food                | ADV       |
| 5   | reel/DZmlYZSs6l7 | Suite spa civico 4, Follonica (suite romantica + cinema)      | Toscana / Italia                 | Weekend romantici / Hotel con carattere | invited   |
| 6   | reel/DZjvWDoslzS | Alessandro Benini Wines, Lavagno VR (aperitivo in vigna)      | Veneto / Italia                  | Food & Ristoranti                       | invited   |
| 7   | reel/DZhFdM_sQY9 | Chioggia (mare, ostriche, Sand Beach Club)                    | Veneto / Italia                  | Posti particolari / Relax               | ADV       |
| 8   | reel/DZcxolzsGPr | Insta360 Snap (gear)                                          | —                                | Affiliazione prodotto                   | affiliate |
| 9   | reel/DZaO32kMg8R | Caribe Bay, Jesolo (parco acquatico caraibico)                | Veneto / Italia                  | Insolito                                | —         |
| 10  | reel/DZWo5OTM_Cw | Storyland, Madrid (ristorante tema Disney)                    | Spagna / Europa                  | Insolito / Food                         | —         |
| 11  | reel/DZRwpH6MDM- | Costa degli Dei, Capo Vaticano (Tonicello Resort & Spa)       | Calabria / Italia                | Relax, terme e spa                      | invited   |
| 12  | reel/DZPFeJBMF9v | Ristorante Al Mago, Albairate (locanda medievale falconeria)  | Lombardia / Italia               | Insolito / Food                         | ADV       |

(Permalink completi: prefisso `https://www.instagram.com/travelliniwithus/`.)

## Nota tecnica

- Le thumbnail CDN sono state oscurate dall'estensione (`[BLOCKED]`) — per le cover servono frame/screenshot o l'API.
- **Per i 1.251 post**: l'Instagram Graph API (account proprio) restituisce media + permalink + caption + thumbnail in automatico. È la via per popolare `/esplora` (tassonomia zona/tipo già pronta) e la griglia social senza scraping manuale.

---

# Analisi su 46 post (batch 2026-06-18) → architettura contenuti

## Pillar reali e VOLUME (il food domina)

| Pillar                             | Peso                  | Esempi reali                                                                                                                                                                                                  |
| ---------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Food & Ristoranti**              | 🔥 dominante (~18/46) | sushi AYCE Roma, omakase Azabu Milano, pizza Sleppa/TheFork Milano, churros Madrid, BBQ coreano Parma, smashburger Bologna, pasta fresca Roma, ristorante sottomarino Madrid, Dari Verona, La Forchetta Parma |
| **Ristoranti/locali a TEMA**       | forte                 | Tim Burton (Campania), Disney Storyland (Madrid), jazz/burlesque (Bologna/Milano), locanda medievale, Volturi, draghi                                                                                         |
| **Esperienze & attività insolite** | forte (~10)           | looping bici Plose, cinema a letto Padova, esperienza fluo Roma, profumo con IA Madrid, Bridgerton Bergamo, Phantasialand, mostra Armani                                                                      |
| **Alloggi particolari**            | medio                 | glamping Bled, suite spa Follonica, "dormire in una fiaba" Lombardia, hotel Madrid                                                                                                                            |
| **Luoghi/destinazioni**            | medio                 | Alsazia (Riquewihr), Christiania Copenhagen, Disneyland Shanghai, giardino segreto Valpolicella                                                                                                               |
| **Relax/Spa**                      | medio                 | Lugano spa, parchi acquatici, terme                                                                                                                                                                           |
| **Personale/Famiglia**             | thread umano          | reveal gravidanza, "principessa per una sera", baby, anniversario 2016, @travellinifamily                                                                                                                     |
| **Affiliate/Gear**                 | ricorrente            | Insta360 (x3-4)                                                                                                                                                                                               |

Geografia: **Italia capillare** (Roma, Milano, Parma, Bologna, Verona, Padova, Bergamo + regioni) **+ Europa** (Madrid molto presente, Slovenia, Svizzera, Danimarca, Francia) **+ extra-UE** (Malesia, Cina/Shanghai).

## Pattern di voce/formato (come descrivere i contenuti)

- **Hook a domanda**: `👇🏻[DOMANDA MAIUSCOLA]👇🏻` (es. "MIGLIOR SUSHI AYCE ROMA?", "DORMIRE IN UNA FIABA?"). Quasi universale.
- **Disclosure ADV scrupolosa** (sono in elenco AGCOM): prefissi `ADV / Invito / Invited / gifted / Pubblicità / In collaborazione con / Affiliazione`. → il sito DEVE gestire la trasparenza partnership.
- **Angolo valore**: prezzo spesso esplicito ("8€", "25€/notte", "economico", "low cost").
- **Tag del locale**: `@venue` — partnership con strutture specifiche.
- **Tag finali MAIUSCOLI** = ottimi per tassonomia (es. "ROMA CIBO SUSHI ALL YOU CAN EAT").
- **CTA**: "link in bio per sconti/assicurazione/escursioni" (affiliate/Linktree).

## Schema dati proposto — `ContentItem` (predisposizione API IG)

```ts
interface ContentItem {
  id: string;
  source: 'instagram' | 'tiktok';
  permalink: string; // ← IG API: media.permalink
  mediaType: 'reel' | 'post' | 'carousel'; // ← media.media_type
  cover: string; // ← media.thumbnail_url / media_url (o frame ffmpeg)
  videoSrc?: string; // mp4 locale se ospitato
  caption?: string; // ← media.caption (raw)
  publishedAt: string; // ← media.timestamp
  // — campi curati (enrichment manuale o da parsing caption) —
  hook: string; // "Miglior sushi AYCE di Roma?"
  title: string; // titolo editoriale
  description: string; // blurb voce R+B (vale la pena? + criterio)
  place: {
    name: string;
    city?: string;
    region?: string;
    country: string;
    lat?: number;
    lng?: number;
  };
  zone: Zone; // tassonomia esistente
  types: ContentType[]; // 1-3 tipi (tassonomia esistente)
  partnership?: { kind: 'adv' | 'invited' | 'gifted' | 'affiliate' | 'organic'; partner?: string };
  value?: { price?: string; budget?: Budget };
  featured?: boolean;
  isPlaceholder: boolean;
}
```

L'**adapter IG API** riempie i campi raw (permalink/cover/caption/publishedAt/mediaType); un passo di **enrichment** (admin o parser caption) riempie i campi curati. `reels.ts` diventa un caso particolare di `ContentItem` (source instagram, mediaType reel).

## Struttura pagina destinazione (`/destinazione/:regione`)

Hub regionale di "posti particolari" curati, raggruppati per intenzione:

1. **Hero regione** (foto + claim "i posti particolari di [Regione] che valgono").
2. **Mangiare** (Food & Ristoranti, incl. a tema).
3. **Dormire** (Alloggi/Hotel particolari).
4. **Esperienze** (attività insolite, parchi, eventi).
5. **Vedere/Relax** (luoghi, spa, terme).
6. **Mappa** della regione con i pin dei content item.
   Ogni card: cover + hook-domanda + 1 riga valore/prezzo + badge tipo + (se ADV) badge partnership trasparente.

## Pattern di descrizione contenuto (voce R+B)

`[Hook a domanda] → cos'è in 1 frase → il dato di valore (prezzo/gratis/economico) → il "criterio" (vale la pena? per chi?) → disclosure ADV se presente.`

---

# Dataset esteso — 70 caption INTEGRALI lette (2026-06-18)

Lette le caption complete via `alt` non troncato (non aperti i singoli post). Estratti: hook, luogo, **prezzo**, **partner taggato**, **disclosure ADV**. Nota: alcuni partner mancano perché loro scrivono "sc@nti"/"bi@" per aggirare IG (artefatto risolto nel parser); permalink di alcuni oscurato dall'estensione.

| Hook                               | Luogo                             | Prezzo | Partner                      | ADV            |
| ---------------------------------- | --------------------------------- | ------ | ---------------------------- | -------------- |
| Paese della Bella e la Bestia      | Riquewihr · Alsazia (FR)          | —      | —                            | organic        |
| Miglior sushi AYCE Roma            | Roma                              | 20,90€ | —                            | invito         |
| Parata di Mulan                    | Disneyland Shanghai (CN)          | —      | —                            | organic        |
| Dormire a Madrid                   | Madrid (ES)                       | —      | —                            | invitedby      |
| Plose Looping (bici sospesa)       | Bressanone · Alto Adige           | 8€     | —                            | organic        |
| Hotel per la colazione             | (IT)                              | —      | @hihotels.it                 | organic        |
| Cinema sotto le stelle             | Il Cascinetto (IT)                | —      | —                            | organic        |
| 3 esperienze primaverili           | Cervia                            | —      | Insta360                     | gifted         |
| Miglior churros                    | Madrid (ES)                       | 8€     | Chocolateria 1902            | organic        |
| Miglior ristorante a Parma         | Parma                             | —      | La Forchetta                 | adv            |
| Mangiare nel mondo sottomarino     | Madrid (ES)                       | —      | —                            | invited        |
| Serata burlesque                   | King Cole Club · Bologna          | —      | @lea.libeluna                | adv            |
| Pomeriggio stile Bridgerton        | Bergamo                           | —      | —                            | invited        |
| Locale esoterico                   | Madrid (ES)                       | —      | —                            | invited        |
| Glamping immerso nella natura      | Lago di Bled (SI)                 | —      | @gardenvillagebledresort     | organic        |
| Smashburger di cavallo             | Bologna                           | —      | —                            | adv            |
| Cena nel mondo Disney (Storyland)  | Madrid (ES)                       | —      | @storylandmadrid             | invited        |
| Creare un profumo con l'IA         | Madrid (ES)                       | 60€    | —                            | invited        |
| Esperienza omakase                 | Milano                            | —      | @azabu10\_                   | invito         |
| Principessa per una sera (incinta) | Madrid (ES)                       | —      | @storylandmadrid             | organic        |
| Il topolino dei denti              | Madrid (ES)                       | —      | —                            | organic        |
| Pizza migliore di Milano (Lievità) | Milano                            | —      | @thefork_it                  | adv            |
| Giardino segreto Pojega            | Valpolicella · Veneto             | —      | —                            | organic        |
| Attrazione adrenalinica            | Phantasialand (DE)                | —      | @phantasialand               | organic        |
| 5 idee weekend (cinema a letto)    | Padova                            | —      | @cineplexmoderno_duecarrare  | organic        |
| Pizza gigante (Sleppa)             | Milano                            | —      | @sleppa                      | adv            |
| Poke di pasta fresca               | Roma · Piazza di Spagna           | 8€     | @pastaeat                    | collaborazione |
| Parco acquatico + spa              | Lugano (CH)                       | —      | @lugano.region               | collaborazione |
| Letti al cinema                    | Padova                            | —      | @cineplexmoderno_duecarrare  | invito         |
| Esperienza Fluo                    | Roma                              | —      | @splashandpaint_roma         | collaborazione |
| Cena San Valentino                 | Lazio                             | —      | @oraristorante               | collaborazione |
| Cena spettacolo                    | Jazz Cafè · Milano                | —      | @jazzcafemilano              | organic        |
| Mostra Armani Privé                | Milano                            | €12    | —                            | organic        |
| Reaction "sono incinta"            | —                                 | —      | Insta360                     | collaborazione |
| Olimpiadi in tavola                | Dari · Verona                     | 75€    | @ristorantedari              | collaborazione |
| Fuga invernale                     | Lugano (CH)                       | —      | @lugano.region               | collaborazione |
| Ristorante tema Tim Burton         | Somma Vesuviana · Campania        | —      | @theburtonjuice              | pubblicità     |
| Dormire in una fiaba               | Lombardia                         | —      | @naturooms                   | pubblicità     |
| Paradiso dei risotti               | Milano                            | —      | @thefork_it                  | adv            |
| Insta360 X5 (gear)                 | —                                 | —      | Insta360                     | affiliazione   |
| BBQ coreano a carbonella           | Parma                             | —      | @coalmatebbq                 | adv            |
| Christiania, città libera          | Copenaghen (DK)                   | —      | —                            | organic        |
| Cascina San Valentino              | Morimondo · Lombardia             | —      | @ilfilodigrano_morimondo     | organic        |
| Mirror House                       | Toscana                           | —      | @spinofiorito_stay           | organic        |
| Ramen e raclette                   | Mantova · Lombardia               | —      | @ramen_ramen_mantova         | organic        |
| Granduca di Campigna (wellness)    | Emilia Romagna                    | 98€    | @granducadicampigna          | organic        |
| 3 locali fantasy                   | Bergamo/Brescia/Piemonte          | —      | @lacavernatreviolo           | organic        |
| Laboratorio ceramica               | Chinatown · Milano                | 39€    | @firstchoice_shouyi          | organic        |
| Cucina giapponese (Sagami)         | Bologna                           | —      | @sagami.bolognaportalame     | organic        |
| Resort 5\* Marsa Alam              | Marsa Alam (EG)                   | —      | @dreamlagoonresort           | organic        |
| Glamping cupole                    | Suvereto · Toscana                | —      | @lestelledielisaglamping     | organic        |
| Aperitivo alchemico                | Volterra · Toscana                | —      | @anticavelathricafe.volterra | organic        |
| Città assurda (capibara, Labubu)   | Shanghai (CN)                     | —      | —                            | organic        |
| Cena nella Terra di Mezzo          | Treviolo · Bergamo                | —      | @lacavernatreviolo           | adv            |
| Cinnamon roll virali               | Praga (CZ)                        | —      | @cinnamood\_                 | organic        |
| Hotel perfetto a Vipiteno          | Vipiteno · Alto Adige             | —      | @post_hotel_lamm             | organic        |
| Beer Spa                           | Praga (CZ)                        | —      | @beerspabernard.prague       | organic        |
| Zipline più lunga d'Europa         | San Vigilio di Marebbe · Dolomiti | —      | @adrenaline_dolomites        | adv            |
| Città natalizia                    | Praga (CZ)                        | 52€    | @revelton_official           | organic        |
| Vacanza invernale                  | Vipiteno · Alto Adige             | —      | @post_hotel_lamm             | adv            |
| Bar a tema Avatar/Pandora          | Londra (UK)                       | —      | @avora_experience            | organic        |
| Mercatini di Natale                | Praga (CZ)                        | —      | —                            | organic        |
| Dog café                           | Praga (CZ)                        | —      | @yorkmutcafe                 | organic        |
| BBQ coreano illimitato (Magi)      | Verona                            | 19,90€ | @bbqmagi                     | organic        |

## Cosa conferma questo dataset più ampio

- **Praga è un cluster fortissimo** (~6 post: cinnamon, beer spa, dog café, natalizia, mercatini, ponte Carlo) → contenuto a "città" approfondito.
- **Alloggi insoliti** è un pillar pieno (mirror house, glamping cupole, fiaba/Naturooms, hotel Alto Adige).
- **Food capillare** + **ristoranti a tema** (Tim Burton, Terra di Mezzo/LOTR, Disney) + **AYCE/economico** (sushi 20,90€, BBQ 19,90€, pizza, churros 8€).
- **Internazionale ricco**: Madrid, Praga, Egitto, Shanghai, Londra, Copenaghen, Germania, Svizzera, Slovenia, Francia + Italia capillare.
- **Partnership reali identificate** (~40 venue taggati) → il sito può linkare/accreditare i partner e gestire la disclosure ADV per tipo (adv/invito/gifted/collaborazione/pubblicità/affiliazione/organic).
