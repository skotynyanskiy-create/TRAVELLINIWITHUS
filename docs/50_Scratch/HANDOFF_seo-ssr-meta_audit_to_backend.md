---
type: handoff
from: ultracode-audit
to: travellini-backend-engineer
feature: seo-ssr-meta
status: consumed
created: 2026-06-18
expires: 2026-07-02
requires: owner-confirmation (server.ts è high-risk)
related: '[[10_Projects/PROJECT_ULTRACODE_FULL_SITE_AUDIT_2026-06-18]]'
---

# HANDOFF — SSR meta universale + coerenza schema (server.ts)

Origine: audit ultracode 2026-06-18, angolo SEO. Tutti i finding sotto vivono in
`server.ts` (high-risk). **Nessun edit applicato.** Richiede conferma owner prima
che backend-engineer tocchi il file.

## Problema (perché conta)

Oggi l'SSR inietta meta/schema SOLO per `/articolo/*` (`injectMetaTags`, server.ts:896)
e `/shop/*` (`injectProductMetaTags`, server.ts:982). Tutte le altre ~14 rotte statiche

- le dinamiche `/itinerari/:slug`, `/destinazione/:slug` ricevono l'`index.html` grezzo:
  `<title>Travelliniwithus</title>` e description generica, **identici per tutte**.
  React-helmet corregge solo dopo l'hydration JS → Bing/DuckDuckGo, unfurl social
  (WhatsApp/LinkedIn/Slack) e crawler AI (PerplexityBot, OAI-SearchBot, ClaudeBot in
  fetch leggero) vedono title/description duplicati su ~25 URL. È il singolo fattore che
  impedisce di dominare la SERP non-Google e di essere citati in modo affidabile dagli LLM.

## Lavoro richiesto

### 1. SSR meta universale — `injectStaticMeta(html, pathname)` (P0, F1)

Le stringhe **esistono già**: ogni pagina imposta `<SEO title="..." description="..." />`.
Il dizionario server-side deve **rispecchiare quelle stringhe** (non inventarne di nuove).

Route → file sorgente da cui estrarre title + description esatti:

| pathname          | file sorgente                    | nota                                      |
| ----------------- | -------------------------------- | ----------------------------------------- |
| `/`               | src/pages/Home.tsx:87            | "Viaggi reali e posti particolari"        |
| `/chi-siamo`      | src/pages/ChiSiamo.tsx:121       | "Rodrigo e Betta: chi siamo"              |
| `/esplora`        | src/pages/Esplora.tsx:369        | "Esplora viaggi scelti a mano"            |
| `/itinerari`      | src/pages/Itinerari.tsx          | title couple/Sud-Italia                   |
| `/mappa`          | src/pages/Mappa.tsx              | "Mappa dei posti che abbiamo visitato"    |
| `/collaborazioni` | src/pages/Collaborazioni.tsx:343 | "Collaborazioni travel con hotel e brand" |
| `/media-kit`      | src/pages/MediaKit.tsx           |                                           |
| `/contatti`       | src/pages/Contatti.tsx:182       |                                           |
| `/risorse`        | src/pages/Risorse.tsx            |                                           |
| `/club`           | src/pages/Club.tsx:55            |                                           |
| `/shop`           | src/pages/Shop.tsx               | hub (non il dettaglio prodotto)           |
| `/press`          | src/pages/Press.tsx              |                                           |
| `/strumenti`      | src/pages/Strumenti.tsx          |                                           |
| `/vieni-con-noi`  | src/pages/VieniConNoi.tsx        | noindex — vedi sotto                      |

Implementazione:

- `const STATIC_ROUTE_META: Record<string, { title: string; description: string; ogImage?: string }>`
  con le coppie estratte sopra (title finale = `${title} | Travelliniwithus`, coerente con `injectMetaTags`).
- `function injectStaticMeta(html, pathname)` che, se `pathname` è nel dizionario, sostituisce
  `<title>` e inietta `<meta name=description>` + OG/Twitter (stesso shape di `injectMetaTags`,
  `og:type=website`, `og:image` fallback `/og/default.jpg` — vedi punto 5).
- Chiamarla nel catch-all SSR (sia dev `server.ts:1928` sia prod `server.ts:1968`) DOPO i blocchi
  `/articolo/` e `/shop/`, con un `else if` sul `pathname` normalizzato (niente trailing slash).
- Le rotte `noindex` (`/vieni-con-noi`, `/lead-magnet`, preview) NON vanno nel dizionario indicizzabile,
  oppure vanno con `<meta name=robots content=noindex>` esplicito.

### 2. Coerenza schema Article SSR vs client (P0, F2)

`injectMetaTags` (server.ts:899-915) emette `BlogPosting` scarno (solo headline/image/date/author),
mentre il client `buildArticleJsonLd` (src/lib/seo.ts:141) emette `Article` ricco (publisher@id,
inLanguage, mainEntityOfPage, about/mentions, speakable). Per lo stesso URL il crawler vede DUE schema
con `@type` diverso.

- Allineare il blocco SSR allo shape `Article` di `buildArticleJsonLd` (riusare/condividere la logica se
  possibile, o replicarne i campi: publisher con `@id` → `#organization`, `inLanguage: it-IT`,
  `mainEntityOfPage`).
- Evitare il doppio: l'SSR scrive un marker (es. `data-ssr-jsonld="article"`) e il client `SEO.tsx`
  salta l'iniezione dell'Article jsonLd se il marker è presente.

### 3. FAQ SSR — `name` ripetuto identico (P1, F3)

server.ts:937 — ogni `Question` ha `name: "Consiglio utile per ${location}"` identico → pattern spam,
Google lo scarta. Usare la **prima frase del tip** come `name` della Question (o ristrutturare i tip
come Q/A reali nel modello articolo).

### 4. 301 server-side per redirect legacy (P1, F7)

`/destinazioni`, `/esperienze`, `/guide` oggi fanno redirect **client-side** (`<Navigate replace>` in
src/App.tsx) → i bot vedono 200+JS, il link-equity non si trasferisce. Aggiungere 301 server-side
copiando il pattern già presente per `/articoli`→`/guide` (server.ts:1915):

```
app.get(/^\/destinazioni(\/.*)?$/, (req,res)=>res.redirect(301, '/esplora'));
app.get(/^\/esperienze(\/.*)?$/, (req,res)=>res.redirect(301, '/esplora'));
```

NOTA: `/guide` è una rotta LIVE (non un alias): verificare la decisione di consolidamento prima di
301-arla. Da confermare con owner — l'audit segnala l'incoerenza, non forza il target.

### 5. Sitemap + OG fallback (P1/P2, F8/F9/F10)

- Sitemap dinamica (server.ts:1853 `staticRoutes`): aggiungere `/press`, `/strumenti` e le 6 region
  landing `/destinazione/{puglia,sicilia,sardegna,toscana,campania,trentino-alto-adige}`.
- `injectProductMetaTags` (server.ts:987): fallback OG è `og-default.svg` → **SVG non valido come OG image**.
  Sostituire con `/og/default.jpg` (1200×630). Uniformare lo stesso fallback in `injectStaticMeta`.
- (Il file morto `public/sitemap.xml` viene rimosso lato frontend — non è in server.ts.)

### 6. ItineraryGuide SSR (P1, F5) — opzionale in questo giro

`/itinerari/:slug` non ha jsonLd né SSR meta. Candidato a `ItineraryGuide`/`HowTo` step-by-step
(alimenta AI Overview "itinerario X giorni"). Richiede sia SSR (qui) sia client (src/pages/Itinerario.tsx,
→ frontend-builder con nuovo builder `buildItineraryGuideJsonLd` in src/lib/seo.ts). Può essere una
seconda iterazione dopo F1/F2.

## Verifica attesa post-fix

- `curl` su `/`, `/chi-siamo`, `/esplora`, `/collaborazioni` (SSR grezzo, no JS) → `<title>` e
  description UNICI per rotta, non più il default.
- Google Rich Results Test su un `/articolo/:slug` reale → un solo Article (no doppio BlogPosting+Article).
- `/destinazioni` → 301 a `/esplora` (verificare con `curl -I`).
- Nessun SVG come og:image.

## Scope / guardrail

- File: **solo `server.ts`** (+ eventuale marker letto da src/lib/seo.ts / src/components/SEO.tsx lato client).
- High-risk → richiede conferma owner prima dell'edit.
- Non toccare la logica `resolveAppStatus` / lite-mode / Stripe / CSP in questo handoff.
- Le stringhe meta = quelle già nei `<SEO>` delle pagine: NON riscriverle qui senza coordinamento con
  `travellini-seo-conversion-strategist` (sono copy SEO italiano).
