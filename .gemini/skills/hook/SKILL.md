---
name: hook
description: Genera 5 hook italiani scroll-stopper per Travelliniwithus — apertura pillar article, opener Reels/TikTok 0-3s, hero subtitle CTA-pesante, oggetto newsletter, headline lead magnet. Mai clickbait, mai esagerato — specificita Rodrigo & Betta. Usa quando l'utente dice "hook", "apertura", "scroll-stopper", "primi 3 secondi", "soggetto newsletter".
---

# /hook — Generatore di apertura specifiche

Skill compatto per la fase di apertura: i primi 3 secondi (video) o le prime 2 righe (testo). Genera 5 varianti per ogni richiesta, su frameworks testati.

NON è clickbait. NON è "non crederai mai a cosa...". L'apertura Travellini è specifica, onesta, ti fa fermare perche dice una cosa precisa che altri non dicono.

## Quando attivare

- "Dammi 5 hook per il Reel sul Salento"
- "Apertura pillar Lisbona"
- "Soggetto newsletter di settembre"
- "Hero subtitle per pagina media kit"
- "Headline lead magnet posti italiani"
- "Primi 3 secondi del prossimo TikTok"

## Quando NON attivare

- Body articolo lungo → `travellini-editorial-writer`
- Meta description SEO → `/copywriting-italian` (ha sezione meta)
- Caption Instagram completa → `travellini-social-content-operator`

## Frameworks (italianizzati, sani)

### F1 — Curiosity gap onesto

Pattern: anticipazione di un dato concreto + delay del payoff.

> A Procida ad agosto il prezzo del traghetto cambia 4 volte in tre ore. Vi raccontiamo perche, e quando conviene.

✓ Specifico
✓ Onesto (non dice "non crederai")
✓ Promette payoff verificabile nel corpo

### F2 — Specificita numerica

Pattern: cifra concreta + contesto + insight.

> 23 km a piedi in due giorni nel Cilento. Cinque cose che faremmo diverse, due che rifaremmo identiche.

### F3 — Contrarian autentico

Pattern: contro-narrativa che il pubblico riconosce vera.

> Tutti dicono "evita Roma in agosto". Noi siamo andati apposta. Funziona, ma con tre regole.

### F4 — Scena (in medias res)

Pattern: entrata su dettaglio sensoriale concreto.

> Sei e venti del mattino, il pescatore di Marzamemi ti chiede dieci euro per due ricci. Te li apre li. Comincia da qui.

### F5 — Stake personale

Pattern: cosa è in gioco per chi legge/guarda.

> Se a settembre stai pianificando una settimana in Puglia con due bambini, queste tre cose abbiamo sbagliato noi e tu eviti.

### F6 — Contraddizione apparente

Pattern: due fatti veri che sembrano in conflitto.

> A Matera dormire in grotta costa meno che in centro a Bologna. Ma c'e un perche.

### F7 — Domanda specifica (non retorica)

Pattern: domanda che il pubblico target si è realmente fatto.

> Si puo vedere bene Firenze in 36 ore senza salire alla cupola di Brunelleschi? Si. Ecco come.

## Anti-pattern (mai)

- "Non crederai mai..." / "Ti lascera a bocca aperta"
- "5 cose che NON sapevi su X"
- "Il segreto per Y che nessuno ti dice"
- Promesse impossibili: "il viaggio perfetto", "la guida definitiva"
- Cliffhanger vuoti: "...continua leggendo per scoprirlo"
- Domande retoriche senza target: "Vi siete mai chiesti come sarebbe...?"
- Emoji nell'apertura (OK più avanti su social, non in apertura)
- Maiuscole urlate: "DEVI SAPERE QUESTO"

## Pipeline

1. **Brief in 1 riga**: cosa è la cosa (Reel/articolo/newsletter/lead magnet) e qual è il TEMA.
2. **Target**: chi guarda/legge (italiani 25-45 / coppia / famiglia / solo traveler / creator) e cosa cerca davvero.
3. **Promise verificabile**: cosa il contenuto consegnera dopo l'hook. Senza questo l'hook diventa clickbait.
4. **Genera 5 varianti** usando 5 frameworks diversi della lista sopra.
5. **Verifica**: ogni variante ha (a) almeno un dato/luogo/cifra concreta, (b) una promessa che il contenuto puo onorare, (c) zero parole della anti-pattern list.
6. **Consigliato**: indica la variante migliore per il canale specifico + perche.

## Vincoli per canale

| Canale               | Lunghezza               | Vincoli aggiuntivi                                     |
| -------------------- | ----------------------- | ------------------------------------------------------ |
| Reel/TikTok opener   | 6-14 parole, 0-3 sec    | Niente musica nel testo; dire la cosa subito           |
| Pillar article lead  | 30-60 parole, 2 frasi   | Prima frase pesante, seconda che apre il filo          |
| Hero subtitle (sito) | 12-20 parole            | No emoji; deve reggere senza l'h1                      |
| Newsletter subject   | 35-50 caratteri         | Niente "🔥", niente "[Travellini]" prefix              |
| Lead magnet headline | 6-12 parole             | Promessa + verifica (es. "Posti italiani veri, 12 +1") |
| Caption IG opener    | 1 riga prima del taglio | La frase prima di "...altro" deve reggere da sola      |

## Output template

```markdown
## Brief

[1 riga del task]

## Target

[chi guarda/legge — età, profilo, contesto]

## Promise verificabile

[cosa il contenuto consegnera]

## Canale

[Reel / pillar / hero / newsletter / lead magnet / caption]

## 5 hook (frameworks diversi)

### H1 — F[N] [framework name]

[hook]

### H2 — F[N] [framework name]

[hook]

### H3 — F[N] [framework name]

[hook]

### H4 — F[N] [framework name]

[hook]

### H5 — F[N] [framework name]

[hook]

## Consigliato: H[N]

Motivo: [perche per QUESTO canale e QUESTO target]

## Check

- Dato concreto in ogni hook: si / [quali mancano]
- Anti-pattern presenti: 0
- Promessa onorabile: si
```

## Skill correlate

- `/copywriting-italian` — per body di hero, CTA, meta (dopo l'hook)
- `travellini-social-content-operator` — caption + script Reel completo
- `travellini-editorial-writer` — pillar article (consumera l'hook scelto come lead)
- `travellini-seo-conversion-strategist` — meta + h1 SEO-aware

## Project context

- `AGENTS.md` — root operating guide and skill routing.
- `CLAUDE.md` — Claude-specific rules, quality bar, and model routing.
- `brand_voice.md` (memory) — tono Rodrigo & Betta
- `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md` — audience + pillar editoriali
- `docs/MARKETING_OPERATIONS_HUB.md` — funnel state, canali attivi
