---
title: Audit Senior — Profilo Instagram @travelliniwithus + ecosistema collegato
date: 2026-05-29
type: audit
status: draft
owner: web/marketing lead (per conto di Rodrigo & Betta)
method: 9 lenti senior + sintesi + stress-test avversariale · analisi reel reali frame-by-frame · typecheck/audit:ui · sweep integrità (asset/rotte/pagine/SEO) · audit live browser
scope: profilo IG osservabile + intero repo travelliniwithus.it
area: operations
---

# Audit Senior — @travelliniwithus + ecosistema

> **Nota di metodo.** Le metriche IG private (reach, engagement, retention, share-rate) NON erano accessibili: vanno richieste al cliente (Insights / Meta Business Suite partner read-only / export archivio). Tutto ciò che è owner-declared o non verificabile è marcato `[DA VERIFICARE]`. I dati di codice/asset sono verificati sul repo (`file:line`). I 5 reel sono stati ispezionati **frame-by-frame** estraendo i fotogrammi reali.

---

## 1. Verdetto in 30 secondi

Una coppia con un **asset di audience genuino** (~170K IG verificato Meta + iscrizione AGCOM — trust raro nella nicchia) e un sito **tecnicamente sopra la media** (schema.org maturo, ~90 eventi tracciati, consent banner, funnel ben disegnato, typecheck pulito) **che però non è pubblicabile così com'è**.

Il filo rosso che lega quasi tutte le criticità è uno solo: **"falso spacciato per vero"** su un brand il cui unico capitale è l'autenticità. Non è un'opinione di stile — è verificato nel codice e nei file:

- L'**intera libreria immagini è AI-generated** (coppia + luoghi), presentata come fotografia reale.
- I **5 video reel** sono ricondivisioni con **watermark TikTok impresso**, e i loro metadati nel sito (`reels.ts`) descrivono **luoghi e temi completamente sbagliati** (un resort a Sharm el-Sheikh etichettato "Puglia, trulli").
- Le pagine **`/destinazione/*` indicizzabili** raccontano esperienze e date vissute **inventate**, firmate "Rodrigo & Betta".

In più, un **blocco tecnico di produzione**: il sito gira in hosting statico, quindi tutta la SEO server-side è inerte e i crawler vedono pagine vuote.

**Tradotto:** il sito è pronto al ~90% come impalcatura, ma oggi pubblicarlo danneggerebbe il brand invece di aiutarlo. Le priorità non sono "nuove feature": sono **bonifica dell'integrità** + **attivazione di ciò che è già costruito** + **sblocco SEO di produzione**.

---

## 2. Il verdetto centrale: coerenza IG ↔ sito

**Non è una frattura di brand. È una scala di valore coerente, gestita male.**

- Motore IG = **wow / globale / aspirazionale** (resort Sharm, taverna fantasy, bar Twilight, Batu Caves) → è il **top-funnel** legittimo, l'amo che ferma lo scroll.
- Sito = **slow / editoriale / italo-centrico premium** ("il sud che non si racconta", "niente fila") → è il **mid/bottom**, la sostanza che trattiene e monetizza.

Il problema è che **i due mondi non si parlano**. Manca il ponte. E — insight della lente brand — **il ponte esiste già** ed è l'hero del sito: _"Posti particolari che valgono davvero"_. "Posti particolari" = lessico IG-wow; "che valgono davvero" = filtro editoriale-slow. È la stessa promessa nei due registri. Va **eletta a piattaforma di brand** e ripetuta identica ovunque.

Frase-madre che assegna i ruoli:

> **Travelliniwithus trasforma il "wow, dove si trova?" in "ecco se ti merita davvero".**
> La meraviglia è l'amo, il criterio è la parola data.

---

## 3. Scorecard di maturità per settore

| Settore                   | /10 | Sintesi                                                                                           |
| ------------------------- | --- | ------------------------------------------------------------------------------------------------- |
| Compliance & Trust        | 6   | Buona forma (consent opt-in), fragile sulla sostanza (pixel pre-consenso latente, claim assoluti) |
| Brand & Positioning       | 5.5 | Ingredienti forti, identità non ancora decisa; nome incoerente cross-canale                       |
| Motore IG / short-form    | 5   | Formula valida e ripetibile, ma plateau strutturale; leva save→share da attivare                  |
| SEO & Conversione         | 5   | Impianto schema maturo, ma zero contenuto indicizzabile reale + SSR inerte in prod                |
| Visual & Art direction    | 5   | Sistema premium su fondamenta AI/stock                                                            |
| Dati & Misurazione        | 5   | Ottima strumentazione, attribuzione IG→sito rotta                                                 |
| Community & Audience      | 4   | Buona impalcatura owned, motore spento (newsletter non invia)                                     |
| Business & Monetizzazione | 4   | Mono-leva (brand deal IG) mascherata da multi-leva                                                |
| Diversificazione canali   | 4   | Strutturalmente mono-piattaforma                                                                  |

---

## 4. Analisi reel reali (verificata frame-by-frame)

I 5 reel in `public/video/reel-1..5.mp4` (480×864 / 576×1024, 9:16, 30–38s, 30fps) sono stati ispezionati estraendo i fotogrammi reali.

| #   | Cosa è DAVVERO (dai frame)                                                                  | Hook reale                               | Durata | `reels.ts` dichiara                  |
| --- | ------------------------------------------------------------------------------------------- | ---------------------------------------- | ------ | ------------------------------------ |
| 1   | Recensione **resort 5★ a Sharm el-Sheikh (Egitto)** — piscina, parasailing, spa, animazione | "RESORT 5⭐ ECONOMICO A SHARM EL SHEIK?" | 37,6s  | ❌ "Puglia · Valle d'Itria · trulli" |
| 2   | **Sushi all-you-can-eat in Toscana** — interni dark, food, coppia che mangia                | "UNO DEI SUSHI PIÙ BELLI DELLA TOSCANA"  | 30,8s  | ⚠️ "Toscana · borghi" (tema errato)  |
| 3   | **Taverna fantasy** (draghi, trono GoT, medievale)                                          | "TAVERNA FANTASY DA PERDERE LA TESTA"    | 34,6s  | ❌ "Dolomiti · Alta Badia · rifugi"  |
| 4   | **Batu Caves, Kuala Lumpur (Malesia)** — scalinata colorata, Petronas                       | "VALE LA PENA VISITARE LE BATU CAVES?"   | 36,8s  | ❌ "Sardegna · Cala Goloritzé"       |
| 5   | **Cocktail bar a tema Twilight a Volterra** — rosso/fumo, drink "sacche di sangue"          | "COCKTAIL A TEMA TWILIGHT?"              | 32,7s  | ❌ "Islanda · Ring Road"             |

**Osservazioni reali:**

- **Watermark "TikTok @travellini.withus" impresso su tutti e 5.** Sono export TikTok ricondivisi → Instagram penalizza i contenuti con watermark di altre piattaforme; su un sito "premium" è un downgrade visivo evidente. Non usabili in produzione né per provenienza né per coerenza.
- **4 etichette su 5 sono sbagliate per luogo E tema.** `reels.ts` (`isPlaceholder:false`, righe 77/91/105/119/133) li promuove a "reali": il sito mostrerebbe un resort egiziano didascalizzato "Puglia, trulli e masserie" — disinformazione, non placeholder.
- **Craft short-form solido**: hook frame-1 a curiosità/valore, testo on-screen che costruisce una frase per spingere il completamento (retention), lower-third coerente, durata ideale (30–38s), 9:16 nativo, volti presenti.
- **Motore "posti particolari" verificato**: venue a tema + resort-review + destinazioni globali + food. Wow/aspirazionale/globale, l'opposto dello slow-Italian del sito → la tensione IG↔sito ha ora prova visiva.
- **Estetica satura/alto-contrasto/TikTok-native**: mondo visivo diverso dal sand/ink del sito → il "ponte visivo" mancante è reale.

---

## 5. Dossier "Falso spacciato per vero" (la criticità #1, trasversale)

Su un brand che vende autenticità, ogni elemento fabbricato è **debito reputazionale**, non placeholder neutro. Consolidato da 7 lenti:

1. **Intera libreria immagini AI-generated** — `public/images/brand/{couple-travel,about-editorial,collab-work}.png`, `hero-amalfi.png`, tutte `destinations/*` ed `experiences/*` sono JPEG-in-PNG 1024×1024 / 1024×1536 a 300 DPI (firma generatori AI). Usate come **foto di Rodrigo & Betta** (HeroSection, CoupleIntro, ChiSiamo, Collaborazioni, InstagramGrid) e come **foto dei luoghi**. Nessuna è reale. _Gravità: critica._
2. **Reel mislabeled + watermark** (vedi §4). _Critica._
3. **`/destinazione/*` indicizzabili con esperienze inventate** — date e vissuti specifici ("settembre 2025, tre giorni nella Valle d'Itria", "cosa abbiamo sbagliato salendo sull'Etna") presentati come fatti, byline "Rodrigo & Betta", su archivio 100% demo, **senza noindex** e **nel sitemap** (`regions.ts:40-105`, `Destinazione.tsx`). _Critica._
4. **Cover lead-magnet AI** con suffisso `-demo` nel filename, su una pagina di conversione (`posti-italiani-cover-demo.webp`, `VieniConNoi.tsx:23`). _Alta._
5. **Contatore newsletter hard-coded** `NEWSLETTER_RECENT_SIGNUPS = 184` (commentato "demo: aggiornare manualmente"), mostrato come social-proof. _Alta._
6. **Numeri incoerenti** in pubblico: follower 170K (`site.ts`) vs 167K (`SocialFollowCTA`) vs ~250K+ (`llms-full.txt`) vs 260K+ cross-platform; ER 6.5% (sito) vs 8.5% (AdminDashboard); fondazione 2016/2017/2018/2024. _Media-alta._

---

## 6. Blocco tecnico di produzione (SEO) — sistemico

La prod è **Firebase Hosting statico** (`firebase.json`: public=dist, rewrite SPA `** → /index.html`). Conseguenza: **tutta la logica SSR di `server.ts` è inerte in produzione**.

- **Pagine thin per i crawler non-JS**: ogni URL serve `dist/index.html` con `<title>Travelliniwithus</title>` e meta default. Title/description/canonical/OG/JSON-LD per-pagina sono iniettati da react-helmet **solo dopo l'idratazione JS**. (Confermato via `curl localhost:3000` → 200, title generico.) _Alta._
- **Sitemap senza articoli**: `public/sitemap.xml` ha 21 URL, **0 `/articolo/*`** (generato senza credenziali Firestore). L'unico contenuto editoriale è invisibile ai crawler. _Alta._
- **Artefatti incoerenti col LITE_MODE**: il sito gira `VITE_LITE_MODE=true` (disabilita /esplora,/itinerari,/shop,/club,/preferiti) ma sitemap+robots committati includono /esplora e /club come indicizzabili → soft-404 + segnale contraddittorio (Google vs llms.txt che dice "non indicizzare"). _Alta._
- **`/rss.xml` rotto in prod** (restituisce index.html), redirect 301 `/articoli→/guide` inerte (soft-404), `robots.txt` dichiara in `llms-full.txt` un'allowlist bot che **non esiste** nel file reale. _Media._

---

## 7. Bug-list concreta (con `file:line`)

> Verificati personalmente: il bug TikTok (#1) e il mismatch reel (`reels.ts`). Gli altri provengono dall'audit e vanno ricontrollati prima del fix.

| #   | Bug                                                                                                                                                | `file:line`                                                                                         | Gravità                                    |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| 1   | **Link + handle TikTok errato** `@travelliniwithus` invece di `@travellini.withus` → profilo sbagliato/inesistente. In 4+ file ad alta esposizione | `SocialFollowCTA.tsx:29,44`, `AuthorBio.tsx:40,54`, `email.ts:194,213`, `ItineraryDocument.tsx:302` | Alta                                       |
| 2   | **Numero follower hard-coded** "167K+" invece di 170K (BRAND_STATS)                                                                                | `SocialFollowCTA.tsx:17`                                                                            | Media                                      |
| 3   | **Reel `isPlaceholder:false` su metadati falsi** → serviti come reali                                                                              | `reels.ts:64-135`                                                                                   | Critica                                    |
| 4   | **GDPR: AnalyticsScripts inietta GA4/Meta Pixel senza gate di consenso** (inerte solo perché gli ID sono vuoti) — doppio sistema di tracking       | `AnalyticsScripts.tsx`, montato in `Layout.tsx:84`                                                  | Critica (latente)                          |
| 5   | **`/destinazione/*` senza noindex + nel sitemap** con contenuto demo                                                                               | `Destinazione.tsx`, `sitemap.xml:110-145`                                                           | Critica                                    |
| 6   | **OG image 404** per 2 slug preview routable                                                                                                       | `Articolo.tsx:732`, mancano `og/weekend-borgo-lento.webp`, `og/guida-prima-di-prenotare.webp`       | Media                                      |
| 7   | **CTA "Leggi la guida {regione}" → pillar inesistenti**                                                                                            | `Destinazione.tsx:178-184`, `regions.ts:44…105`                                                     | Alta                                       |
| 8   | **Rotta orfana `/account/acquisti`** (nessun link; Stripe success_url → /shop)                                                                     | `App.tsx:140`, `server.ts:1677`                                                                     | Media                                      |
| 9   | **Link hash `/#storie` dell'hero non scrolla** (ScrollToTop ignora hash)                                                                           | `HeroSection.tsx:148,163`, `ScrollToTop.tsx:7-9`                                                    | Media                                      |
| 10  | **PNG ~1MB come fallback `<img>` e come OG image** (no rewriting nei meta)                                                                         | `regions.ts:39…100`, `Destinazione.tsx:111`                                                         | Media                                      |
| 11  | **`ItinerariCompare` senza DemoContentNotice** (chi atterra diretto non vede il disclaimer)                                                        | `ItinerariCompare.tsx`                                                                              | Media                                      |
| 12  | **Nota interna CMS esposta all'utente** nel fallback Risorse                                                                                       | `Risorse.tsx:207`                                                                                   | Bassa                                      |
| 13  | **Refusi** "e"→"è" + apostrofi ASCII                                                                                                               | `Risorse.tsx:59,162,384`, `MieiAcquisti.tsx:188`                                                    | Bassa                                      |
| 14  | **Legal pages incomplete**: manca ragione sociale/P.IVA/indirizzo, data aggiornamento, elenco cookie/provider                                      | `legal/Privacy.tsx`, `Cookie.tsx`, `Termini.tsx`, `Disclaimer.tsx`                                  | Media (rischio compliance con Stripe live) |
| 15  | **`/articolo/*` ritorna HTTP 404 sul documento iniziale** (si idrata client-side ma crawler/anteprima social vedono 404)                           | `server.ts` route `/articolo/*`                                                                     | Alta                                       |
| 16  | **L'unico articolo è un seed placeholder** ("Budget: Da definire", "Tutto l anno"): la "storia in evidenza" in home porta a una bozza              | `/articolo/guida-bali`, `src/data/seedArticle.ts`                                                   | Alta                                       |
| 17  | **`landing_view` sparato 2× su `/vieni-con-noi`** (probabile StrictMode dev — da confermare in prod, sporca le metriche della landing IG)          | `VieniConNoi.tsx`                                                                                   | Bassa                                      |
| 18  | **`/strumenti`: due `h2` ridondanti adiacenti** per la stessa sezione                                                                              | `Strumenti.tsx` (WhenToGoCalendar/ItineraryBuilder)                                                 | Bassa                                      |

**Code health buona**: `typecheck` pulito (0 errori); `audit:ui` solo warning soft (palette non-brand confinata all'admin, inline-style per animazioni, scrim `rgba()` invece di CSS var). **Runtime browser pulito**: zero `TypeError`/eccezioni JS su tutte le rotte; gli unici errori console sono i 404 di rete sotto elencati.

---

## 8. Piano d'azione in DUE CORSIE

Vincolo reale (dichiarato nei docs): la coppia ha ~6h/mese contenuti + ~1h/sett outreach. Quindi: **separare ciò che gli agent/dev possono fare sul codice** (non consuma le ore del cliente) da **ciò che solo Rodrigo & Betta possono fare** (sequenziale, una alla volta).

### 🔧 Corsia CODICE — eseguibile subito (dev/agent), non tocca le ore del cliente

**P0**

- Fix handle/link TikTok → leggere da `CONTACTS` (`SocialFollowCTA`, `AuthorBio`, `email.ts`, `ItineraryDocument`).
- `SocialFollowCTA` legge follower da `BRAND_STATS` (stop al "167K" hardcoded).
- `reels.ts`: `isPlaceholder:true` sulle entry live (degrada a non-reale) **o** rimuoverle da `VISIBLE_REEL_IDS` finché non ci sono dati veri.
- Gate di consenso dentro `AnalyticsScripts` (soluzione minima: condizionare il render al consenso, non frammentare il tracking) — ⚠️ tocca `Layout`, area sensibile.
- `noindex` su `/destinazione/*` + rimuoverle dal sitemap finché demo.
- Rigenerare `sitemap.xml`/`robots.txt` con `LITE_MODE=true` + includere gli articoli; allineare `llms.txt`; riconciliare /club /shop /esplora (oggi 404 da LITE_MODE ma indicizzati in sitemap).
- Fix **`/articolo/*` → 404 documento iniziale** (`server.ts`, ⚠️ file high-risk → `travellini-backend-engineer` + conferma owner).

**P1**

- DemoContentNotice su `ItinerariCompare`; gestione hash in `ScrollToTop`; `regions.ts` heroImage `.webp` (no PNG 1MB in OG); generare/rimuovere i 2 OG mancanti; rinominare cover lead-magnet (no `-demo`).
- Decidere fonte di verità sitemap in prod statica (prerender o Cloud Function per `/sitemap.xml`+`/rss.xml`); valutare prerender per le rotte pubbliche (risolve il thin-rendering).
- FAQPage JSON-LD su `/vieni-con-noi`; unificare i 2 moduli errore (telemetry.ts vince); link "Gestisci cookie" nel footer.

**P2**

- Pulizia dead-code asset (`destinationVisuals.ts`, `EXPERIENCE_HERO_IMAGE`, `hero-adventure.jpg` orfano); unificare le 3 liste rotte (manifest/server/script); refusi; redirect 301 `/articoli→/guide` come Firebase rewrite.

### 👤 Corsia UMANA — solo R&B, una alla volta (non parallelizzare)

1. **[ORA]** 4 registrazioni affiliate (Skyscanner/Booking/Airalo/Revolut, ~90 min) → primo euro passivo, zero dipendenze tecniche.
2. **[ORA]** Fornire **foto reali** di Rodrigo & Betta + dei luoghi (o accettare esplicitamente immagini dichiarate come illustrazioni). È bloccante per qualsiasi claim di autenticità.
3. **[ORA]** Fissare numero follower ufficiale + data di fondazione unica.
4. **[30g]** Accendere newsletter: integrazione Brevo **già scritta in `server.ts`** → servono 3 env var + dominio Resend verificato + i 10 luoghi reali del PDF (sforzo tecnico basso, editoriale medio).
5. **[30g]** Pubblicare **almeno 1 articolo reale finito** (oggi l'unico è il seed "guida-bali" placeholder) — è la "storia in evidenza" della home: traffico freddo da IG non deve atterrare su una bozza.
6. **[30g]** URL + caption reali dei reel virali (**prima chiarire la licenza**: i frame di resort/venue sono di proprietà o di strutture terze?). Fornire export **senza watermark TikTok**.
7. **[30g+]** Loop commento-IG→DM→lead magnet; format-ponte "wow ma vero"; rituale firmato ("Il posto del mese").
8. **[90g]** 3 pillar dai reel virali; media kit attorno ad AGCOM+Meta+format reel; validare Club sulla waitlist prima di Stripe; presidiare Pinterest.

---

## 9. Cosa NON toccare (per evitare over-fixing)

- La **formula hook-first** del motore IG: funziona, è il top-funnel legittimo. Non inseguire "più wow".
- **Impianto SEO/eventi/consent** (schema.org, ~90 trackEvent, banner opt-in, pipeline OptimizedImage avif/webp): sopra la media. Attivare, non riscrivere.
- **Architettura visiva** (sand/ink, griglia 9/16, modal reel, scrim calibrati): premium. Manca la materia prima, non il sistema.
- **Disciplina anti-rischio**: shop preorder-first cart-off, ClubFaq onesta ("quando NON vale"), cancellazione 1-click. La ClubFaq **non** va riscritta in chiave persuasiva (è qualificazione del lead che riduce churn): semmai aggiungere un re-indirizzamento (newsletter/Pinterest), non ammorbidire il filtro.
- **Pricing Club** (5,90/mese): la value-comm è fatta bene. Il blocco è attivazione + ponte traffico, non il prezzo.
- **YouTube / Threads**: deprioritizzare.

---

## 10. Dati da chiedere al cliente (sblocca i coverage gap)

In ordine di leva:

1. **Performance dei reel** (Insights: views, watch-through, retention 3s, save-rate, **share-rate**) → è il single-point-of-dependency dell'intera strategia anti-plateau.
2. **Licenza/proprietà** dei contenuti virali (resort, venue a tema) → decide se il ponte visivo è fattibile e se i video sono ri-pubblicabili.
3. **Asset fotografici reali** di R&B + dei luoghi → sblocca la bonifica immagini (criticità #1).
4. **Numeri ufficiali datati** (follower, ER, reach) → chiude le incoerenze pubbliche.
5. **Economics dei brand deal** (n°/anno, valore medio, % fatturato) → conferma/smentisce la dipendenza mono-leva.
6. **Capacità reale** (ore/settimana) → determina quante leve attivare in parallelo.

Via meno invasiva: accesso **Analista (sola lettura)** su Meta Business Suite, oppure export Insights/archivio. (Il messaggio pronto per il cliente è nel thread di lavoro.)

---

## 11. Audit live browser (completato — 9 rotte × 3 viewport)

Eseguito sul DOM reale a 375/768/1280 con submit reali dei form.

**Funziona davvero (verificato):** home, /chi-siamo, /vieni-con-noi, /media-kit, /strumenti, /collaborazioni caricano pulite, H1 unico, title corretto post-Helmet (es. "Viaggi reali e posti particolari | Travelliniwithus"). **Newsletter** e **lead magnet** convertono (submit reale ok, eventi tracciati, LCP 2456ms good). Navbar mobile ok. **Zero overflow orizzontale** ovunque. **Zero eccezioni JS**.

**Blocker live:**

- **`/club`, `/shop`, `/esplora` → 404.** Sono disabilitati da `VITE_LITE_MODE=true` (intenzionale, Navbar/Footer li nascondono) — **ma** restano nel `sitemap.xml` come indicizzabili: se uno di questi URL è in bio IG / story-sticker, il traffico muore su "Pagina non trovata". → riconciliare LITE_MODE ↔ sitemap ↔ link (vedi §6).
- **`/articolo/*` → 404 sul documento iniziale** (bug #15): si idrata bene nel browser ma crawler/anteprime social vedono 404.
- **L'unico articolo è un seed placeholder** (bug #16): la "storia in evidenza" della home porta a una bozza.

**Sfumature importanti (correggono i §4–§5):**

- **La sezione "InstagramGrid"/Reel NON è renderizzata nella home attuale.** Quindi il mismatch reel↔realtà oggi è **latente** (i dati falsi sono nel codice e alimentano `FEATURED_REEL`/`/esplora`-futuro, ma non sono live in home). Resta da bonificare prima di attivare la sezione.
- **Le immagini brand "non sembrano stock generiche" a occhio** e renderizzano con alt text italiano corretto: la firma AI è rilevabile dai **metadati file** (1024×1024 / 300 DPI), non necessariamente dall'occhio. Per il brand conta comunque (autenticità "ci siamo stati davvero"), ma non è un difetto visivo evidente.

**Limite:** l'exit-intent popup non è triggerabile in modo affidabile via MCP (manca `mouseleave` puro) → verificare con e2e dedicato.

## 11bis. Coverage gaps & note di metodo

- **Profilo IG live** (highlight, foto profilo, griglia feed, prassi #adv storica): non ispezionabile dal repo → richiede screenshot/accesso.
- **Metriche reali** di reach/ER/share: `[DA VERIFICARE]`.
- **Presenza entità esterna** (Wikipedia/Wikidata/testate per i sameAs Person schema): non verificata.
- **Stato canali secondari** (TikTok ~90K, Pinterest, Threads, YouTube): owner-declared.

---

## 12. Riepilogo operativo

**Prima di mandare traffico reale al sito serve:** bonifica immagini AI + reel (criticità #1), `noindex`/sitemap su `/destinazione/*`, fix SSR/sitemap di produzione (altrimenti la SEO è invisibile), fix bug TikTok e numeri. **Poi**: accendere il canale owned (newsletter + loop DM) e costruire il ponte IG→sito tracciato. **Solo dopo**: Pinterest, media kit premium, lancio Club.

Il sito non ha un problema di costruzione. Ha un problema di **verità dei contenuti** e di **attivazione**. Risolti quelli, l'impalcatura premium che c'è già diventa un vantaggio competitivo reale.
