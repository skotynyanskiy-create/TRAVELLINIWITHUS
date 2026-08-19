---
title: 'DECISION — Imagery truth rule (provenienza delle immagini del sito)'
type: decision
status: active
decided: 2026-07-22
decided_by: owner (approvazione piano redesign "L'Atlante delle Meraviglie Vere")
area: brand
tags:
  - assets
  - images
  - higgsfield
  - brand
---

# DECISION — Imagery truth rule

Risolve la **OPEN OWNER DECISION** di `docs/ASSET_STRATEGY.md` §2 (contraddizione tra
`CLAUDE.md:302` "real photography only" e l'imagery generata già in produzione).

## Contesto

- La value proposition del brand è "ci siamo stati davvero": immagini generate di
  persone e luoghi la contraddicono alla radice.
- In produzione esistevano: una coppia AI generica presentata come Rodrigo & Betta
  (`public/images/brand/couple-travel.*`, `about-editorial.*`) e tre ambienti della
  home dichiarati generati con ImageGen (`docs/TRAVELLINI-HOMEPAGE.md`), pur
  raffigurando luoghi realmente visitati dal brand.
- Il piano di redesign approvato dall'owner il 2026-07-22 (sessione "Atlante delle
  Meraviglie Vere") contiene questa risoluzione come §3 "Truth rule".

## Decisione (variante (b) di ASSET_STRATEGY §2, delimitata)

1. **Ruoli referenziali → solo materiale reale.** Ogni immagine che afferma un fatto
   (un luogo visitato, una persona, un'esperienza) deve essere fotografia o frame
   reale del brand. Etichetta di provenienza obbligatoria per asset:
   `real-photo` / `real-frame` / `craft`.
2. **Craft non-referenziale → generazione ammessa.** Texture di carta, inchiostro,
   timbri, map wash, matte di transizione: asset di mestiere che non affermano
   fatti. Etichetta `craft`, scheda metadata obbligatoria (ASSET_STRATEGY §5),
   staging `generated/` (§4).
3. **La coppia AI viene rimossa da tutte le superfici live** — **fatto il
   2026-07-22** (fase 3 del piano). Stato per superficie:

| Superficie                                    | Prima                                                                  | Ora                                              |
| --------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------ |
| `ChiSiamo.tsx`                                | ritratto AI della coppia                                               | pagina di taccuino tipografica (`atlante-paper`) |
| `ArticleHero.tsx`                             | avatar autore AI                                                       | monogramma «R&B» su carta                        |
| `Collaborazioni.tsx`                          | foto AI "coppia al lavoro" (+ preload)                                 | collage di 4 frame **reali** dai reel            |
| `site.ts` (FEATURED_REEL thumbnail)           | `couple-travel`                                                        | `reels/reel-1-cover`                             |
| `demoArchive`, `demoGuides`, `previewContent` | asset brand AI                                                         | cover reali dei reel                             |
| `dev/DiarioPreview.tsx` (fixture)             | asset brand AI, un alt dichiarava falsamente «foto reale della coppia» | frame reali dei reel, alt corretti               |

I riferimenti residui (`CoupleIntro`, `HeroSection`, `Diary3DScroll`,
`HomeCollaborationCta`, `InstagramGrid`, `experience/atlante`,
`experience/sentiero`) vivono **solo in componenti non raggiungibili da
alcuna rotta**: si estinguono con la Fase 5 (cancellazione, gated).
Sostituzione definitiva prevista: foto reali fornite dall'owner.

I **divieti assoluti** di ASSET_STRATEGY §6 restano invariati e prevalgono.

## Certificazione pendente (owner)

I quattro asset della home journal restano in pagina ma con provenienza da
certificare — la documentazione interna è contraddittoria (dichiarati ImageGen in
`TRAVELLINI-HOMEPAGE.md`, ma `hero-impossible` corrisponde alla cover del reel
reale The Burton Juice, testo title-card incluso):

| Asset                               | Raffigura                         | Da certificare                                |
| ----------------------------------- | --------------------------------- | --------------------------------------------- |
| `home-journal/hero-impossible.*`    | Burton Juice (reel reale, pinned) | cover reale del reel o ricreazione ImageGen?  |
| `home-journal/altrove-vicino.*`     | Caribe Bay, Jesolo (reel reale)   | idem                                          |
| `home-journal/dentro-storia.*`      | Garden Village, Bled (reel reale) | idem                                          |
| `home-journal/notebook-reference.*` | taccuino (decorativo)             | se resta in pagina è `craft` e va etichettato |

Finché la certificazione non arriva: gli asset restano dove sono già (nessuna
nuova superficie referenziale li adotta come "prova"), e il posto
`campania-burton-juice` resta `isPlaceholder: true` (→ noindex). Se certificati
ImageGen, vanno sostituiti con le cover reali dei reel (percorso di acquisizione
già documentato) prima di dichiarare il posto "verificato".

## Applicazione — l'etichetta esiste nel codice (2026-08-11)

Per quindici giorni questa regola è stata solo prosa. L'etichetta obbligatoria
del punto 1 non esisteva da nessuna parte: né come campo del modello, né come
registro, né come controllo. Il risultato prevedibile: l'hero della home aveva
adottato `home-journal/hero-impossible` come prova — la superficie referenziale
più visibile del sito, sopra uno dei quattro asset che questa stessa nota
dichiara non certificati — e nessuno se n'era accorto, perché non c'era niente
che potesse accorgersene.

Da oggi la provenienza è un dato:

| Cosa                                  | Dove                                            |
| ------------------------------------- | ----------------------------------------------- |
| Registro prefisso → provenienza       | `src/data/asset-provenance.json`                |
| API runtime (`isCertifiedReal`, ecc.) | `src/config/assetProvenance.ts`                 |
| Audit statico                         | `scripts/check-image-provenance.mjs`            |
| Comando                               | `npm run audit:provenance` (in `audit:quality`) |
| Debito congelato                      | `src/data/asset-provenance-baseline.json`       |

Ogni riga del registro **cita la fonte** che autorizza l'etichetta: nessuna
provenienza si dichiara a memoria. Un asset usato dal codice e assente dal
registro è un errore di audit, non un'omissione tollerata.

Cosa ha trovato al primo giro: **54 usi di immagini generate su superfici che
affermano un fatto** — `destinations/*`, `experiences/*`, `hero-amalfi`,
`brand/collab-work` come cover di destinazione, archivio demo e itinerari demo
(fonte dell'etichetta: `AUDIT_SENIOR_IG_ECOSYSTEM_2026-05-29` §1). Sono il
debito che la fase 5 di questa decisione prevede di estinguere con le foto reali
dell'owner: la baseline li congela così che l'audit possa entrare subito in CI e
bloccare le violazioni **nuove**. La lista può solo accorciarsi —
`--update-baseline` si esegue dopo una bonifica, mai per far passare una
regressione.

Superfici sanate nella stessa sessione:

- **Hero della home**: il posto in copertina è passato da `campania-burton-juice`
  (placeholder, ADV, senza cover né prezzo) a `jesolo-caribe-bay` — reale,
  organico, con prezzo pubblico — e la fotografia è il frame certificato del suo
  reel. `BrandCoherentHero.prova.test.tsx` blocca la regressione, preload LCP di
  `index.html` incluso.
- **Pagina posto**: sotto la copertina compare la riga di provenienza, ma solo
  quando è certificata. Un asset `da-certificare` o generato non si etichetta
  come prova: resta senza riga.

Restano in attesa dell'owner i 6 usi `da-certificare` che l'audit elenca a ogni
esecuzione (i quattro asset journal e `atlante/posto-volterra`).

## Conseguenze operative

- `CLAUDE.md` riga 302 emendata per codificare la regola (stessa sessione).
- `ASSET_STRATEGY.md` §2 aggiornato: contraddizione risolta, rimando qui.
- Higgsfield: restano ammesse le trasformazioni di materiale reale (§7); si sbloccano
  SOLO le generazioni craft non-referenziali (regola 2); ogni generazione resta
  soggetta ad approvazione owner per-asset e a verifica crediti preventiva.
- Ogni de-placeholdering di un posto richiede: cover `real-frame`/`real-photo`
  certificata + fatti passati da `/verify-facts`.
