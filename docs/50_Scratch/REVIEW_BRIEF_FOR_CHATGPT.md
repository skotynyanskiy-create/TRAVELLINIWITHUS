---
type: scratch
area: workspace
status: active
---

# Travelliniwithus — brief per review esterna

Sito editoriale travel premium di Rodrigo & Betta (creator IT su Instagram/TikTok). UI in italiano.
Stack: React 19 + TypeScript + Vite 6 + Tailwind 4 (CSS variables) + Express (SSR meta) + Firebase/Firestore + Stripe. Esperienza 3D con Three.js + React Three Fiber + drei + postprocessing; motion (Framer), GSAP, Lenis.

Obiettivo della review: valutare struttura, architettura informativa, la home WebGL "Il Sentiero", la meccanica di scroll e il contenuto delle tappe. Dimmi cosa funziona, cosa confonde, dove si perde l'utente, e dove SEO/UX/conversione possono migliorare.

---

## 1. Concept della home — "Il Sentiero" / "Le Tracce"

La homepage (`/`) NON è una pagina a sezioni: è un'esperienza cinematografica interattiva. La telecamera percorre un sentiero 3D che serpeggia nel buio caldo; lungo il cammino incontra 6 "fotogrammi" (cornici 9:16 in stile Polaroid), uno per ogni capitolo del brand. Idea: trasformare il racconto social (reel) in utilità reale (mappe, note, guide).

Tagline d'ingresso: "Un reel fa venire voglia. Una traccia ti aiuta a partire."

Due fedeltà, stessa storia e stesso contenuto:

- Desktop (≥1024px, no reduced-motion): scena WebGL full-screen, scroll-driven.
- Mobile / reduced-motion: story verticale a schermo intero con snap, niente canvas 3D (i reel sono HTML5 video lazy). Decisione owner: "una storia, due fedeltà" — il WebGL è enhancement, la story editoriale è la base.

---

## 2. Le 6 tappe (contenuto reale, in ordine di scroll)

Ogni tappa = kicker + titolo + descrizione + "nota di campo" (taccuino) + 1 CTA verso una pagina reale + media (cover reel o foto).

1. **01 / La Scintilla — "Ci torneremmo davvero?"**
   Un reel fa nascere una voglia in 15 secondi, ma per viaggiare serve capire se un posto merita il tuo tempo.
   Nota: "Se non ci torneremmo noi stessi, non entra nella mappa." → CTA: _Scopri chi siamo_ → `/chi-siamo`

2. **02 / La Prova — "Vissuto sul campo"**
   Nessuna foto stock, nessun itinerario copiato. Testiamo letti, piatti, dettagli.
   Nota: "La presenza reale è la nostra unica garanzia." → CTA: _Guarda il nostro metodo_ → `/mappa`

3. **03 / La Nota Vera — "Il dettaglio utile"**
   Quanto costa davvero? Orario migliore? Errore da evitare? Note oneste per chi viaggia.
   Nota: "Il valore di un posto si misura nei dettagli pratici." → CTA: _Esplora i nostri criteri_ → `/esplora`

4. **04 / Mappa Attiva — "Dal social alla strada"**
   Le tessere del diario diventano pin salvabili su una mappa interattiva.
   Nota: "Dal reel alla scelta pratica: un click e la traccia è sul tuo telefono." → CTA: _Apri la Mappa_ → `/club`

5. **05 / Le Deviazioni — "Fuori dai sentieri battuti"**
   Boutique hotel insoliti, glamping, ristoranti a tema, borghi nascosti: il DNA Travellini.
   Nota: "I viaggi più belli iniziano con le deviazioni improvvise." → CTA: _Esplora i posti particolari_ → `/collaborazioni`

6. **06 / Il Cammino — "Le tracce continuano con te"** (finale)
   Il nostro sentiero finisce qui, il tuo inizia. 3 CTA: Mappa / Newsletter (form vero) / Collaborazioni.
   Nota: "Lascia la tua email e ricevi la lettera delle tracce." → CTA: _Inizia ora_ → `/vieni-con-noi`

I media sono i 5 reel reali del brand (Egitto/Mar Rosso, sushi, draghi, Malesia/Batu Caves, Volterra) + foto di coppia.

**Punto da valutare:** alcune CTA puntano a pagine "in standby" o ambigue (es. tappa 2 "metodo" → /mappa; tappa 4 "Apri la Mappa" → /club invece di /mappa). C'è un fallback `/vieni-con-noi` quando una route è disabilitata (LITE_MODE).

---

## 3. Meccanica di scroll (desktop WebGL)

- Curva CatmullRom a 7 punti di controllo che va in profondità (-Z) con zig-zag laterale e dislivelli: il viaggio non è mai una linea retta.
- `ScrollControls` di drei: lo scroll mappa `offset` 0→1 sulla curva. Pagine di scroll = numero tappe + 2.
- **Camera rig**: damping frame-indipendente, look-ahead dinamico (guarda un po' avanti, di più mentre scorri veloce), "posa" lo sguardo al 25% verso la card attiva invece di puntarcela addosso. Parallax leggero col puntatore + micro-sway organico. Tutto si spegne sotto `prefers-reduced-motion`.
- **Snap fluido senza librerie**: quando lo scroll si ferma, interpola dolcemente verso il punto-tappa più vicino.
- **Atmosfera che cambia**: sfondo + nebbia + luce ambientale sfumano tra i temi colore delle tappe lungo lo scroll (ogni tappa ha la sua palette).
- **Le card**: cornice unica 9:16 (passe-partout ink + hairline terracotta) uguale per tutte le 6 tappe; Billboard (sempre rivolte alla camera) con Float leggero; anti-clipping (le card non attive sfumano quando la camera le supera).
- **Reel live nel fotogramma 3D (v2)**: solo la tappa attiva monta un `<video>` (un decoder alla volta); la cover statica resta dietro come poster finché il frame non è pronto (niente fotogrammi neri). Cover-fit 9:16 ritaglia il watermark TikTok in fondo.
- **Elementi guida**: un "filo" tubolare terracotta a bassa emissione lungo la curva + 6 pin/waypoint che pulsano sulla tappa attiva (logica mappa). Post-processing: Bloom contenuto, Vignette, Noise (grana filmica).
- **HUD fuori dal canvas**: testo della tappa attiva su scrim (h2 serif + nota di campo + 1 CTA pill), barra di progresso verticale, pannello finale a 3 CTA che appare oltre il 92% di scroll.
- **Ingresso**: un "portal" iniziale a tutto schermo (wordmark + tagline + bottone "Segui le tracce", chime audio) che svanisce all'entrata. Il wordmark è l'`<h1>` visibile della pagina.

## 3b. Scroll mobile (fallback)

- `<main>` a scroll verticale con `snap-y snap-mandatory`, ogni slide = 100vh.
- Slide 0 splash (wordmark + h1 + "Inizia il cammino"), poi 6 capitoli con media full-bleed (reel HTML5 lazy via IntersectionObserver, audio muto default + toggle), card sabbia con titolo/descrizione/nota/CTA, freccia "prossima tappa". Slide finale = 3 CTA stacked + form newsletter. Footer "Torna su".

---

## 4. Mappa pagine (React Router)

Home & ingresso:

- `/` — home cinematografica "Il Sentiero" (fuori dalla navbar standard: nav/footer nascosti)
- `/sentiero` → redirect 301-like a `/` (dedup SEO)
- `/futuro` — pagina sperimentale ("Atlante", AskBar)
- `/vieni-con-noi` — bio hub (link da IG/TikTok); `/iscrivi` redirige qui

Discovery / contenuto:

- `/esplora` — hub discovery (disattivabile in LITE_MODE)
- `/destinazione/:regionSlug` — landing per regione/cluster
- `/mappa` — mappa interattiva dei posti (Mapbox)
- `/posto/:slug` — scheda singolo posto
- `/articolo/:slug` — articolo editoriale
- `/guide/:slug`, `/itinerari`, `/itinerari/:slug`, `/itinerari/compare` (LITE_MODE off)
- Redirect storici: `/destinazioni`,`/esperienze` → `/esplora`; `/guide` → `/esplora?format=guida`; `/quiz` → `/esplora`

Brand / business:

- `/chi-siamo`, `/collaborazioni`, `/media-kit`, `/press`, `/contatti`
- `/risorse` (risorse/affiliate), `/lead-magnet`, `/strumenti`, `/preferiti` (LITE off)
- `/shop`, `/shop/:slug`, `/club` (LITE off)

Account / admin / legal:

- `/account/acquisti`, `/admin/*` (protetto)
- `/privacy`, `/cookie`, `/termini`, `/disclaimer`
- `*` → 404

Nota: esiste un `LITE_MODE`/`rebuildMode` per spegnere le route non ancora pronte; in tale modalità alcune CTA cadono sui fallback.

---

## 5. Stato e contesto (per inquadrare la review)

- La home Sentiero è stata appena rifinita (conversione reale del form, art direction, perf, reel live, e dedup SEO/h1/title). Verificata in browser desktop+mobile.
- Molte pagine "interne" (Esplora, Shop, Club, Itinerari, alcuni articoli) sono ancora su contenuto demo/preview e vanno riattivate una alla volta dopo redesign + contenuto reale + SEO.
- I 5 reel sono reali; alcune cover hanno ancora watermark/testo baked-in da ripulire.

---

## 6. Cosa vorrei dalla review

1. **Narrazione**: le 6 tappe raccontano il brand in modo chiaro e in crescendo? La promessa "da reel a utilità" arriva?
2. **Scroll/UX**: un'esperienza scroll-driven a schermo bloccato come unica home è una scelta forte — rischi (utenti che non capiscono come procedere, accessibilità, SEO, tempo al contenuto)? Mitigazioni?
3. **CTA & funnel**: le destinazioni delle CTA sono coerenti col testo della tappa? Dove rischiano di confondere (es. /club vs /mappa)?
4. **Coerenza pagine**: la struttura rotte ha senso per un brand creator-led? Cosa accorperesti/elimineresti?
5. **Conversione**: il finale a 3 CTA (mappa/newsletter/collab) è la chiusura giusta, o disperde? Cosa renderesti prioritario?
6. **SEO/contenuto**: una home quasi tutta WebGL con testo reale solo in `sr-only`/HUD — come la renderesti più indicizzabile senza rompere l'esperienza?
