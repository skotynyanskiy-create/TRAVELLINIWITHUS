---
name: trend-research
description: Ricerca trend recenti (ultimi ~30 giorni) su un tema travel/creator attraverso le fonti che il progetto ha gia — brave-search, WebSearch, e dove utile Reddit/YouTube/X via web — poi sintetizza un brief grounded con fonti citate per alimentare travellini-social-content-operator e travellini-growth-revenue-operator. Assorbe le idee di last30days-skill e Agent-Reach senza dipendenze esterne. Usa quando l'utente dice "trend", "cosa si dice su X", "ricerca ultimi 30 giorni", "spunti social", "cosa sta funzionando adesso", "di cosa parla il pubblico".
---

# /trend-research — Brief trend grounded per contenuti

Adatta l'idea dei repo last30days-skill e Agent-Reach al setup Travellini: non un nuovo tool, ma uno skill che orchestra i search MCP gia presenti (`brave-search`, `WebSearch`) in un workflow di ricerca recency-focused, e produce un brief citabile — non opinioni inventate.

NON sostituisce gli agent: prepara l'input per `travellini-social-content-operator` (idee contenuto) e `travellini-growth-revenue-operator` (decisione su cosa fare). NON pubblica e NON scrive copy finale.

## Quando attivare

- "Cosa sta funzionando adesso su [destinazione / formato / tema]?"
- Prima di un ciclo di pianificazione editoriale o di un calendario social
- "Trend Reels travel ultimi 30 giorni", "di cosa parla il pubblico su Salento/Sud-est asiatico"
- Validare un'idea articolo/Reel con segnali reali prima di investirci

## Quando NON attivare

- Domande su dati PROPRI (GA4/Stripe/Sentry) → `travellini-data-analyst`
- Fact-check di un draft gia scritto → `/verify-facts`
- Generazione copy/caption → `travellini-social-content-operator`

## Argomenti

- **tema** (obbligatorio): es. `cilento autunno`, `formato reel coppia`, `slow travel italia`
- **finestra** (default: `30d`): `7d` | `30d` | `90d`
- **fonti** (default: `web,brave`): subset di `web,brave,reddit,youtube,x`
- **output** (default: `brief`): `brief` (sintesi) | `raw` (lista fonti grezze)

## Procedura

1. **Espandi il tema** in 3-5 query specifiche (incluse varianti italiane ed
   English) — non una query generica.
2. **Cerca** con `brave-search` e `WebSearch`; per Reddit/YouTube/X usa query
   web mirate (`site:reddit.com`, `site:youtube.com`). Filtra per recency
   secondo la finestra richiesta.
3. **Scarta** fonti vecchie, SEO-spam, contenuti AI-generated a bassa densita.
4. **Sintetizza** un brief: 3-5 segnali con cosa sta emergendo, perche, e da
   quante fonti indipendenti e supportato.
5. **Cita** ogni segnale con URL. Claim non verificabili → marcati
   `[NON VERIFICATO]`, mai presentati come fatto.

## Output contract

```
## Trend brief — <tema> (<finestra>)

### Segnali
1. <segnale> — <perche conta> — fonti: [n] · [url], [url]
2. ...

### Implicazioni per Travellini
- Contenuto: <idea concreta per social-content-operator>
- Business: <eventuale leva per growth-operator>

### Da verificare
- [NON VERIFICATO] <claim che serve confermare>
```

## Guardrail

- Mai inventare numeri, view count, o "sta spopolando" senza fonte.
- Mai presentare un singolo post come "trend": minimo 2 fonti indipendenti.
- Output destinato al pubblico resta italiano; le fonti possono essere in
  qualsiasi lingua.
- Se le fonti sono troppo deboli, dillo: "segnale insufficiente", non riempire.
