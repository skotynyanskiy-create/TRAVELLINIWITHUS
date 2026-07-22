# Promessa = sostanza — design spec

Status: in attesa di revisione owner (2026-07-22). Non ancora approvata per il piano di implementazione.

## Contesto e obiettivo

L'audit del 2026-07-22 ha percorso 20 pagine pubbliche nel browser e risolto 561 link
interni: **zero link rotti, zero rotte irraggiungibili, canonical e description ovunque**.
L'impianto regge. Quello che non torna è che **la navigazione promette più di quanto il
contenuto mantenga**:

- `/shop` è voce primaria di navbar ma è una pagina `noindex` che dice «stanno prendendo forma»
- `/itinerari` è linkata da navbar e footer ma è `noindex` secca, con due itinerari demo
- `/guide/:slug` e `/itinerari/:slug` sono `noindex` perché `isDemo`
- tutti i 40 contenuti del seed sono `isPlaceholder: true` → tutte le pagine `/posto/:slug`
  sono `noindex`, e 39 su 40 non hanno copertina
- `/esplora` è `index, follow` e mostra 40 schede placeholder **senza dichiararlo**
- `/mappa` non ha nessun `h1` — unica pagina su 20
- `/destinazione`, prima voce di navbar e indicizzabile, **manca dalla sitemap**
- `/shop` si chiama in quattro modi diversi; `/disclaimer` ha due link con due nomi
  nello stesso footer; l'`h1` di `/risorse` dice «Strumenti», rubando il nome a `/strumenti`

L'obiettivo scelto dall'owner: **la promessa deve valere quanto la sostanza**. Meno
superficie annunciata, tutta vera. Nessuna pagina viene rimossa: cambia come il sito
le annuncia.

## Decisioni prese dall'owner (2026-07-22)

1. Direzione: **onestà**, non nuova grafica e non riempimento contenuti.
2. Shop e Itinerari **restano in navigazione con etichetta onesta** e una pagina
   d'attesa curata con cattura email — non vengono parcheggiati.
3. `/mappa`: **full-screen + testata editoriale sopra** (H1, deck, conteggio).
   Non si torna alla mappa editoriale committata, non ci si limita a un H1 `sr-only`.
4. `/risorse` si chiama **«Cosa usiamo»** ovunque; la parola «Strumenti» resta a `/strumenti`.
5. Approccio architetturale: **registro di stato delle superfici**, non correzioni puntuali.
6. `liteMode.ts` va **in pensione**, non esteso.

## Cosa NON cambia

- Nessuna rotta viene rimossa o smontata. Tutte restano raggiungibili via URL diretto.
- I redirect legacy (`/v2`, `/sentiero`, `/atlante-lab`, `/atlante`, `/destinazioni`,
  `/esperienze`, `/blog`, `/guide`, `/quiz`, `/iscrivi`) restano: servono ai vecchi URL.
- Il linguaggio visivo: Fraunces + sand + terracotta + foto reali. Nessun redesign.
- I file ad alto rischio (`server.ts`, `firestore.rules`, `src/config/admin.ts`) —
  nessuna modifica di questa spec li tocca.
- `MapboxWorldMap.tsx` resta: è ancora usata da `InteractiveMapSection` in home
  (verificato, sembra morta ma non lo è).
- L'esperienza full-screen della mappa e i fix di layout del 2026-07-22.

## Architettura: il registro delle superfici

Nuovo file `src/config/surfaces.ts`.

```ts
export type SurfaceState = 'live' | 'preview' | 'soon';

export interface Surface {
  path: string; // il pattern di rotta come dichiarato in App.tsx
  state: SurfaceState;
  private?: boolean; // reale per l'utente, invisibile ai crawler
  missing?: string; // cosa manca perché diventi 'live'
}
```

Tre stati, perché la realtà del sito ne ha tre:

| Stato     | Significato                      | Effetti                                                           |
| --------- | -------------------------------- | ----------------------------------------------------------------- |
| `live`    | contenuto vero                   | indicizzabile, in sitemap, etichetta secca                        |
| `preview` | navigabile ma con contenuti demo | `noindex`, fuori sitemap, banner dichiarato, suffisso «anteprima» |
| `soon`    | non c'è ancora niente            | `noindex`, fuori sitemap, pagina d'attesa, suffisso «presto»      |

`private` è un asse **ortogonale** allo stato, non un quarto stato: una pagina può essere
pienamente `live` per l'utente e comunque non avere senso per un motore di ricerca.
`private: true` implica `noindex` e assenza dalla sitemap, senza toccare l'etichetta.
Serve a `/preferiti`, `/account/acquisti`, `/lead-magnet`, `/vieni-con-noi` e `/manifesto`.

Nota: `path` è il **pattern di rotta**, non un URL concreto. La superficie delle guide è
`/guide/:slug` (la rotta `/guide` è un redirect verso `/esplora?format=guida` e non è
una superficie).

Stato iniziale:

| Superficie                                                                                                                                                                                                        | Stato              | Note                               |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ---------------------------------- |
| `/`, `/esplora`, `/destinazione`, `/destinazione/:zoneSlug`, `/mappa`, `/chi-siamo`, `/collaborazioni`, `/media-kit`, `/press`, `/contatti`, `/strumenti`, `/risorse`, `/club`, `/posto/:slug`, `/articolo/:slug` | `live`             |                                    |
| `/itinerari`, `/itinerari/:slug`, `/itinerari/compare`, `/guide/:slug`                                                                                                                                            | `preview`          | contenuti demo                     |
| `/shop`, `/shop/:slug`                                                                                                                                                                                            | `soon`             | `missing: 'prodotti acquistabili'` |
| `/preferiti`, `/account/acquisti`, `/lead-magnet`, `/vieni-con-noi`, `/manifesto`                                                                                                                                 | `live` + `private` |                                    |

`/preferiti` oggi è `index, follow`: con `private` diventa `noindex`. È un cambiamento
voluto — una pagina di preferiti personali è vuota per un crawler.

`/posto/:slug` e `/articolo/:slug` sono `live` come superfici: il fatto che oggi tutti i
40 posti siano `isPlaceholder` (e quindi `noindex` per item) resta responsabilità del
flag per-contenuto. La superficie è pronta, i contenuti no — ed è proprio la distinzione
che i due livelli servono a esprimere.

### Separazione delle responsabilità

Il registro **non contiene etichette**. Esiste già un registro di nomi editabile
dall'admin — `siteContentDefaults.navigation`, consumato via `useSiteContent('navigation')`
— ma è costruito a metà: 7 etichette passano da lì, tutte le altre sono stringhe
hardcoded in `Navbar.tsx` e `Footer.tsx`, e `shopLabel: 'Shop'` esiste nei default
senza che nessuno lo usi. È da lì che nascono i quattro nomi dello Shop.

Quindi: **una preoccupazione, una casa.**

| File                                             | Possiede                                  | Non possiede |
| ------------------------------------------------ | ----------------------------------------- | ------------ |
| `siteContent.navigation` (esiste, va completato) | come si chiama — resta editabile da admin | lo stato     |
| `surfaces.ts` (nuovo)                            | quanto è vera                             | il nome      |

Il registro **non sostituisce** i flag per-contenuto. `isPlaceholder` sui 40 posti e
`isDemo` su guide e itinerari restano dove sono: sono proprietà del singolo item, non
della superficie. Una superficie `live` può contenere item demo; i due livelli si sommano.

Il registro **non è un feature flag di build**: non nasconde rotte e non spegne codice.

## Consumatori del registro

1. **`noindex`** — le pagine smettono di dichiararlo a mano (`noindex={true}` in
   `Shop.tsx:129`, `noindex` secco in `Itinerari.tsx:43` e `ItinerariCompare.tsx:38`)
   e lo derivano da `state !== 'live'`. I `noindex` per-item (`isDemo`, `isPlaceholder`,
   `isPreviewArticle`) restano e si sommano in OR.
2. **Sitemap** — `scripts/predeploy.mjs` la genera dalle superfici `live` più le rotte
   dinamiche con contenuto reale. Oggi è un file mantenuto a mano che ha già perso
   `/destinazione`, `/destinazione/italia` e `/destinazione/europa`.
3. **Suffissi in navigazione** — «presto» e «anteprima» li aggiunge il componente
   leggendo `state`. Non sono testo salvato, quindi non possono divergere dall'etichetta.
4. **Pagina d'attesa** — la rende chi è `soon`.

### Pensione di `liteMode.ts`

`LITE_MODE` e `isDisabled()` spariscono da: `App.tsx`, `Navbar.tsx`, `Footer.tsx`,
`NotFound.tsx`, `LeadMagnet.tsx`, `VieniConNoi.tsx`. Il file `src/config/liteMode.ts`
viene cancellato.

Motivo: dichiara `/strumenti`, `/press`, `/risorse` e `/lead-magnet` disabilitati mentre
`App.tsx` li monta senza gate e il footer li linka senza gate. È già andato in deriva.
Affiancarlo significherebbe avere tre meccanismi; estenderlo significherebbe ereditare
la deriva.

Le rotte oggi condizionate da `!LITE_MODE` in `App.tsx` diventano incondizionate.
Nessuna pagina sparisce: erano già tutte online, perché il flag è `false`.

Rischio accettato dall'owner: non è reversibile con una riga. Se in futuro servirà uno
staging ridotto, si aggiunge uno stato `hidden` al registro — un concetto, non due.

## Le superfici in attesa

### Shop (`soon`)

La pagina esiste e ha un `h1` valido: «Gli strumenti di viaggio / stanno prendendo forma».
**Non viene riscritta.** Le manca di chiudere il giro: oggi annuncia e poi lascia il
lettore senza azione. Interventi:

- agganciare `Newsletter.tsx` (componente esistente) come lista d'attesa
- `noindex` ed etichetta derivati dal registro invece che hardcoded
- `missing: 'prodotti acquistabili'` nel registro

### Itinerari e Guide (`preview`)

Riuso del pattern già presente in `Esplora.tsx`: banner «anteprima editoriale» che
dichiara al lettore che sta guardando esempi.

**Bug da chiudere contestualmente.** La condizione di Esplora è:

```ts
const usingPreview = CONTENT_ITEMS.length === 0 && ...
```

Controlla se i contenuti esistono, non se sono veri. I 40 posti esistono, quindi
`usingPreview` è `false`: `/esplora` è `index, follow` e mostra 40 schede placeholder
senza dichiararlo. La condizione va agganciata a `isPlaceholder`.

## I nomi

| Pagina        | Oggi                                                                              | Dopo                                                                                                                                                 |
| ------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/shop`       | Shop · Shop Premium · Boutique di Viaggio · «strumenti di viaggio»                | **Shop** in navbar, footer, title e label                                                                                                            |
| `/risorse`    | Cosa usiamo · Risorse di viaggio selezionate · h1 «Strumenti scelti con criterio» | **Cosa usiamo** ovunque; title e `h1` riscritti senza la parola «Strumenti»                                                                          |
| `/disclaimer` | «Affiliazioni» e «Disclaimer»: due link allo stesso URL nello stesso footer       | resta **Disclaimer** nella riga legale; il doppione «Affiliazioni» viene rimosso — la pagina «Cosa usiamo» già linka il disclaimer nel proprio corpo |
| `/strumenti`  | già coerente                                                                      | invariato                                                                                                                                            |

La copy pubblica nuova (title e `h1` di «Cosa usiamo», microcopy dell'attesa Shop,
testo dei banner anteprima) **non viene improvvisata**: passa da
`travellini-seo-conversion-strategist` con handoff dedicato, come da regole di progetto.

## Testata editoriale su `/mappa`

Struttura in flusso, non in overlay: la testata è contenuto, non un quarto pannello
flottante su una pagina che ne ha già tre.

```
[navbar fixed 80px]
[testata: occhiello · h1 · deck · «40 posti provati»]   shrink-0
[mappa full-screen con i suoi controlli]                flex-1 min-h-0
```

Il contenitore diventa `h-[calc(100dvh-80px)] flex flex-col`; la testata `shrink-0`,
la mappa `flex-1 min-h-0`. Nessun numero magico nuovo: la mappa prende lo spazio che
avanza, con lo stesso meccanismo già applicato alla colonna dei controlli.

Su mobile la testata si comprime: `h1` ridotto, deck nascosto — a 375px la colonna dei
controlli occupa già molto spazio verticale.

Recupera l'**impianto** della mappa editoriale che aveva superato il gate del 2026-07-21
(occhiello, titolo, deck, conteggio) senza recuperarne il layout. Il full-screen resta.

## Debito da chiudere

| Cosa                                                                                 | Perché                                                               |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Committare `FullScreenMapExperience.tsx`                                             | è untracked; con l'`h1` rimesso non regredisce più il gate           |
| Riallineare `PROJECT_RELEASE_READINESS.md`                                           | certifica «un H1, zero overflow» per una `/mappa` che non esiste più |
| Cancellare `src/pages/Home.tsx`, `HomeLegacy.tsx`, `AtlanteLab.tsx`, `V2/HomeV2.tsx` | importate da zero file; i redirect verso `/` restano                 |
| Cancellare `src/pages/Mappa.css`                                                     | 914 righe importate da nessuno, nessuna classe usata in TSX          |
| Cancellare `src/config/liteMode.ts`                                                  | sostituito dal registro                                              |

## Fuori perimetro

- **Esplora vs Racconti**: la navbar ha due voci primarie sulla stessa pagina
  (`/esplora` e `/esplora?format=storia`). È una decisione di architettura
  dell'informazione, non di onestà. Da affrontare separatamente.
- **Rendere reali i 40 posti**: copertine, verdetti, rimozione di `isPlaceholder`.
  È la leva più grande sul traffico ma il collo di bottiglia è il materiale dell'owner,
  non il codice.
- **Qualità della copy pagina per pagina**: tono, ripetizioni, CTA. Passaggio separato
  con `travellini-seo-conversion-strategist`.

## Criteri di accettazione

Verificabili, nell'ordine in cui li verificherò:

1. `npm run typecheck`, `npm run lint`, `npm run test` verdi.
2. Ricerca di `LITE_MODE` e `liteMode` in `src/`: zero occorrenze.
3. Ogni pagina pubblica ha esattamente un `h1` — `/mappa` inclusa. Verifica nel browser
   sulle 20 rotte già coperte dall'audit.
4. La sitemap generata contiene tutte e sole le superfici `live` **non** `private`, più
   le rotte dinamiche con contenuto reale; `/destinazione`, `/destinazione/italia` e
   `/destinazione/europa` sono presenti; `/shop`, `/itinerari` e `/preferiti` no.
   Confronto esplicito con i 15 URL attuali: nessuno sparisce se non intenzionalmente.
5. Nel browser: `/shop` risponde `noindex`, mostra la lista d'attesa, e in navbar e
   footer appare con un nome solo — la stringa «Shop Premium» non esiste più in `src/`.
6. `/esplora` dichiara l'anteprima finché i contenuti sono `isPlaceholder`.
7. Nessun link interno rotto: ripetere il crawl delle 20 rotte, atteso 0 su ~561.
8. Nessun overflow orizzontale a 375, 768, 1280.
9. `/mappa`: testata visibile, nessuna collisione fra testata, barra controlli, pannello
   filtri, elenco e scheda, alle 7 combinazioni di viewport già usate nell'audit.

## Rischi

| Rischio                                                                | Mitigazione                                                                                                                          |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| La pensione di `liteMode` tocca 6 file e non è reversibile in una riga | branch dedicato, criterio 2 verificato prima del merge; stato `hidden` disponibile se servirà uno staging ridotto                    |
| La sitemap generata potrebbe perdere URL che oggi indicizzano          | confronto esplicito prima/dopo sui 15 URL attuali, documentato nel piano                                                             |
| Cancellare 5 file può rompere import non individuati                   | `typecheck` + `build` sono il gate; ogni cancellazione è un commit separato e revertibile                                            |
| La copy nuova rallenta il lavoro                                       | i cambi strutturali non dipendono dalla copy: si implementano con i testi attuali e la copy definitiva arriva in uno step successivo |
