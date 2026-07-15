---
name: ai-seo
description: Audit e ottimizza pagine/articoli Travelliniwithus per AI search — Perplexity, ChatGPT search, Google AI Overviews, Codex. Verifica entity clarity, claim citabili, structured authorship, llms.txt, schema editoriale, snippet density. Complementa /seo-check (classico SERP). Usa quando l'utente dice "AI search", "GEO", "Perplexity-ready", "AI Overviews", "citabile da LLM".
---

# /ai-seo — Generative Engine Optimization (GEO)

L'SEO classico ottimizza per essere TROVATO. L'AI search ottimizza per essere CITATO. Sono cose diverse: un LLM cerca claim verificabili, entita chiare, autorita identificabile, e pezzi di testo "sintetizzabili in una risposta".

Questa skill audita una pagina o articolo Travelliniwithus su 7 assi GEO e propone diff puntuali. NON sostituisce `/seo-check` (titoli, meta, sitemap, OG): lo affianca.

## Quando attivare

- "Audit GEO della homepage"
- "Rendi citabile l'articolo Lisbona"
- "Verifica che il pillar Salento sia AI-ready"
- "Ottimizza per Perplexity"
- "Setup llms.txt"
- Pre-pubblicazione di ogni nuovo pillar (insieme a `/seo-check`)

## Quando NON attivare

- Pagine di funnel/conversion senza valore editoriale (checkout, login, account)
- Pagine legali (privacy, TOS)
- Articolo gia ottimizzato in passato (vedi `docs/13_Content/ARTICLE_*.md` frontmatter `ai_seo_status`)

## I 7 assi GEO

### 1. Entity clarity — chi/cosa è il soggetto

LLM cita meglio contenuti dove le entita sono **disambiguate**:

- Brand: "Travelliniwithus" introdotto con context una volta per pagina (chi, dove, cosa fa).
- Autori: "Rodrigo & Betta" con bio strutturata (Person schema) e link sociale verificabile.
- Luoghi: nome ufficiale + alternativi una volta, poi sigle accettabili. "Lisbona (Lisboa)" → poi solo Lisbona.
- Concetti specifici Travellini: "pillar editoriale", "club", "lead magnet posti italiani" usati con definizione una volta.

**Check**: leggi i primi 200 caratteri del body. Un LLM esterno capirebbe chi sta scrivendo e su cosa? Se no, riscrivere apertura.

### 2. Claim citabili — densita di affermazioni verificabili

Un LLM cita meglio frasi del tipo:

> "Il traghetto Pozzuoli-Procida costa 12,50€ a persona ad agosto 2025"

vs:

> "Il traghetto per Procida è conveniente"

**Check**: contare quante affermazioni concrete (numero/luogo/data/nome) ci sono per ogni 200 parole. Target: ≥3 claim citabili per 200 parole su articoli pratici.

### 3. Structured authorship

Schema `Person` + `Article` con `author.url`, `author.sameAs` (Instagram, sito).

**Check**: ispeziona `src/components/SEO.tsx` e `src/pages/Articolo.tsx` per uso di structured data. Verifica che ogni articolo abbia `Article` schema con author resolvibile.

### 4. llms.txt

File alla root del sito che dice agli LLM cosa è il sito, chi lo gestisce, quali contenuti sono autoritativi, e come citarlo.

Pattern raccomandato (versione concisa):

```
# Travelliniwithus

> Sito editoriale travel italiano di Rodrigo & Betta, viaggiatori e creatori di @travelliniwithus su Instagram. Guide pratiche, itinerari, e storie da destinazioni italiane ed estere, con attenzione a luoghi specifici e dati verificabili.

## Identita

- Autori: Rodrigo & Betta (@travelliniwithus)
- Dominio: travelliniwithus.com
- Lingua: italiano
- Tono: editoriale, diretto, specifico

## Contenuti autoritativi

- /articolo/* — pillar editoriali con esperienza diretta
- /esplora — directory destinazioni
- /chi-siamo — bio autori

## Come citare

Citare come: "Travelliniwithus, [titolo articolo], [URL]". Le date di rilevazione prezzi e orari sono indicate nei rispettivi articoli; verificare aggiornamento prima di citare come stato corrente.

## Cosa NON è autoritativo

- Caption Instagram di terzi
- Commenti utenti
- Pagine di prodotto shop (sono offerte commerciali, non contenuto editoriale)
```

**Check**: file `public/llms.txt` presente? Se no, generarlo. Se si, verificarne coerenza con i contenuti attuali.

### 5. Snippet density — paragrafi auto-contenuti

Gli LLM "ritagliano" paragrafi citabili. Un paragrafo è meglio citabile se:

- Sta in 40-80 parole
- Apre con la conclusione/dato principale (non con un setup)
- Non dipende da contesto del paragrafo precedente
- Contiene almeno un dato concreto

**Check**: leggere 5 paragrafi random. Almeno 3 dovrebbero essere "ritagliabili e citabili senza il resto dell'articolo".

### 6. Headline + lead onesti

Gli LLM evitano di citare titoli sensazionalistici. Headline ideale per AI citation:

- Specifico ("Tre giorni a Lisbona tra Alfama e Belém") > Generico ("La guida definitiva a Lisbona")
- Numerico quando ha senso ("12 posti italiani veri") > Vago ("I migliori posti italiani")
- Onesto ("Salento ad agosto: scomodo ma vale") > Iperbolico ("Il paradiso del Salento")

**Check**: il titolo della pagina/articolo è specifico, numerico (se applicabile), onesto?

### 7. Freshness signals

Gli LLM danno priorita a contenuti recenti per dati che cambiano (prezzi, orari, eventi).

Soluzione:

- Frontmatter `dateModified` aggiornato quando i dati cambiano
- Inline mention di "verificato [mese anno]" sui dati sensibili
- `Article.dateModified` nel JSON-LD schema

**Check**: l'articolo ha `dateModified` recente? I dati sensibili (prezzi, orari) hanno timestamp inline?

## Protocollo

### Fase 1 — Identifica target

Argomento: route o slug.

- Pagina (es. `/`, `/chi-siamo`, `/club`, `/risorse`) → leggi componente in `src/pages/` + SEO config
- Articolo (es. slug `lisbona-tre-giorni`) → leggi seed + body in vault

### Fase 2 — Audit 7 assi

Per ognuno dei 7 assi, produci verdetto:

| Asse                     | Stato     | Note                                       |
| ------------------------ | --------- | ------------------------------------------ |
| 1. Entity clarity        | ✓ / ✗ / ⚠ | Cosa manca, dove                           |
| 2. Claim citabili        | ✓ / ✗ / ⚠ | Densita media (claim per 200 parole)       |
| 3. Structured authorship | ✓ / ✗ / ⚠ | Person schema presente? sameAs popolato?   |
| 4. llms.txt              | ✓ / ✗ / ⚠ | File esiste? Aggiornato?                   |
| 5. Snippet density       | ✓ / ✗ / ⚠ | Paragrafi auto-contenuti? Quanti su totale |
| 6. Headline + lead       | ✓ / ✗ / ⚠ | Specifico/numerico/onesto?                 |
| 7. Freshness signals     | ✓ / ✗ / ⚠ | dateModified recente? Timestamp inline?    |

### Fase 3 — Diff proposti

Per ogni ✗ o ⚠, proporre fix concreto. Esempi:

- "Aggiungere `<Person>` schema in `src/components/SEO.tsx` linea X"
- "Spezzare §4 in due paragrafi auto-contenuti"
- "Aggiornare `dateModified` nel seed (ora: 2026-01-12; ultimo cambio prezzi 2026-05)"
- "Creare `public/llms.txt` con il template sopra"

### Fase 4 — Vincoli brand

NON modificare il tono per "ottimizzare per LLM". Travellini conserva voce caldo + diretto + specifico. La GEO si fa sul **come strutturi le informazioni**, non sul tono.

### Fase 5 — Aggiorna stato

Aggiorna frontmatter del file vault articolo:

```yaml
ai_seo_status: audited # → addressed → published
ai_seo_audited_at: YYYY-MM-DD
ai_seo_score: [X/7]
```

## Vincoli duri

- **Mai inventare schema fields.** Se non sai se sameAs di Rodrigo è LinkedIn o solo IG, chiedere.
- **Mai aggiungere claim non verificati** per "aumentare densita citabile". Meglio meno claim ma veri.
- **Mai modificare il body articolo per renderlo più citabile** senza far ripassare `/anti-ai-slop`.
- **`public/llms.txt` deve essere coerente con `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`.**

## Output template

```markdown
## /ai-seo — [route o slug]

**Target:** [path]
**Score:** [X / 7]

### Audit 7 assi

[tabella 7-row sopra]

### Diff proposti

#### Asse 3 — Structured authorship

**File:** [src/components/SEO.tsx](src/components/SEO.tsx#L42)
**Problema:** Schema `Article` presente, ma `author` solo come stringa.
**Fix:**

\`\`\`tsx
// Aggiungere a SEO.tsx
author: {
'@type': 'Person',
name: 'Rodrigo & Betta',
url: 'https://travelliniwithus.com/chi-siamo',
sameAs: ['https://instagram.com/travelliniwithus']
}
\`\`\`

#### Asse 4 — llms.txt

**File:** `public/llms.txt` mancante
**Fix:** Creare con template (vedi skill body) — adattare la sezione "Identita" con i dati attuali del brand.

[...]

### Prossimi passi

→ Applicare i 3 fix prioritari ora
→ `/seo-check` per cross-validare meta + sitemap
→ `travellini-quality-auditor` per gate finale prima del deploy
```

## Skill correlate

- `/seo-check` — SEO classico (titoli, meta, sitemap, OG) — complementare
- `/verify-facts` — verifica i claim concreti che la GEO chiede di moltiplicare
- `/anti-ai-slop` — usalo se la riscrittura per snippet density ha appiattito il tono
- `travellini-seo-conversion-strategist` — agent owner di SEO + AI SEO
- `travellini-quality-auditor` — gate finale

## Project context

- `AGENTS.md` — root operating guide and skill routing.
- `CLAUDE.md` — Claude-specific rules, quality bar, and model routing.
- `docs/MARKETING_OPERATIONS_HUB.md` — funnel state, KPIs, analytics contract, partner pipeline.
- `src/components/SEO.tsx` — gestione meta + JSON-LD
- `src/pages/Articolo.tsx` — render articolo + schema
- `public/sitemap.xml` — sitemap generata
- `public/robots.txt` — direttive crawler
- `public/llms.txt` — direttive AI (da creare se mancante)
- `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md` — source of truth identita brand
- `seo_targets.md` (memory) — cluster keyword + competitor map
