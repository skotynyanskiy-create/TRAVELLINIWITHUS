---
title: HANDOFF_webapp-travelliniwithus_orchestrator_to_social
status: open
created: 2026-09-29
from: travellini-orchestrator
to: travellini-social-content-operator
slug: webapp-travelliniwithus
expires: 2026-10-13
type: handoff
area: delivery
round: R1 (divergenza, in parallelo con ui-designer x2, growth, seo, asset-curator)
---

# Handoff: il reel come unità di contenuto e i loop reel → app → salva → condividi

## Why this work matters

Travelliniwithus diventa una **webapp** (decisione owner, 2026-09-29). Il pubblico vive su
Instagram: 1.192 reel in 5 anni. L'app vale solo se vince il momento dopo il reel, e se
restituisce a Instagram formati che senza l'app non esisterebbero. Tu progetti i loop e
i formati, e trovi dove si rompono.

## Le domande che devi risolvere (angolo divergente)

> **1. Cosa fa una persona nei 10 secondi dopo che un reel finisce? E come l'app vince
> quei 10 secondi contro il tasto Salva di Instagram?**
>
> **2. Quale formato Instagram può esistere SOLO perché esiste l'app?**

## Decisions already made

- **Travelliniwithus diventa una webapp**, con lo schermo unico al centro. Articoli,
  guide e schede posto restano livelli di contenuto con URL indicizzabili.
- **Modello media deciso dall'owner** (spec corpus §2): il reel è una copertina 9:16
  poster-first con badge play e handle, e il tap apre il reel su Instagram
  (`/reel/<code>`). Con una spunta per posto, `<video>` in pagina con `preload="none"`,
  mai autoplay. **L'embed ufficiale di Instagram è escluso.** Un carosello non è un reel
  (è quadrato 1440×1440, permalink `/p/`).
- **Imagery truth (non negoziabile)** — `docs/20_Decisions/DECISION_IMAGERY_TRUTH_RULE_2026-07-22.md`:
  i formati di ritorno verso Instagram usano solo fotogrammi e riprese reali, con
  provenienza. Niente scene, persone o luoghi generati. AI solo per asset `craft` (carta,
  timbri, map wash). Mai far dire a Rodrigo e Betta cose che non hanno detto (ASSET_STRATEGY §6).
- **Regole di canale in vigore** (da `docs/MARKETING_OPERATIONS_HUB.md`):
  - Telegram disabilitato, nessuna CTA;
  - `/guida-in-regalo` è l'unica landing della bio;
  - 1 contenuto partner ogni 4 editoriali;
  - nessun numero social scritto nel codice.
- **Invariati**: brand, consenso, budget del bundle, file ad alto rischio fuori scope,
  nessun segreto, nessun numero inventato, testo pubblico in italiano.

## Ipotesi di lavoro (raccomandazioni dell'orchestratore, da confermare dall'owner prima della sintesi R2)

- "Webapp" significa: un guscio persistente con schede, una home a schermo unico e «I
  miei posti» salvati **senza account** e leggibili offline; l'installabilità è una
  conseguenza.
- Si lancia con i 79 posti visibili. Il corpus può comparire come **tracce** (reel
  geolocalizzati senza pagina propria) distinte dai **posti** (scheda e URL).
- Privacy: deny-list della spec; il post della nascita non compare mai; i contenuti
  Family seguono `BEST/docs/20_Decisions/DECISION_TRAVELLINI_FAMILY_PUBLIC_2026-07-24.md`.
- Metrica primaria: iscrizioni email nate nell'app.

## Context the receiver needs

**Fatti verificati** (usa solo questi; tutto il resto va marcato `[VERIFY: ...]`):

- Base = ramo del PR #27, commit 4fe1794, checkout in sola lettura:
  `BEST = /tmp/claude-0/-home-user-TRAVELLINIWITHUS/8c6b9c85-6fd1-5455-93cb-7a8ffe3e982f/scratchpad/best`.
  `/home/user/TRAVELLINIWITHUS` è `main`, fermo all'11 agosto: non è la base.
- Corpus: 1.283 post dal 25 lug 2021 al 13 ago 2026 (1.192 reel, 84 caroselli, 6 foto),
  in `BEST/src/data/instagram-corpus.json`. Per post: `code` (shortcode), `takenAt`,
  `location`, `plays`, `likes`, `comments` (solo conteggio), caption integrale.
  **1.017 reel citano un luogo; circa 186 milioni di visualizzazioni sommate.**
- 624 luoghi geocodificati (463 Italia, 31 Spagna, 17 UK, 15 Emirati, 11 Francia, 10
  Egitto; 120 solo città o regione).
- Squilibrio: Lombardia 147; Puglia 1, Sicilia 2; Sardegna, Marche, FVG, Molise e
  Basilicata a zero.
- La formula in chiusura di caption è «L1nk in bi@ per super sc@nti di ogni
  genere/assicurazione viaggio/escursioni»: la bio oggi spinge sconti e assicurazione.
- Sul sito: 79 schede posto visibili su 110; la scheda del PR #27 ne regge 533; l'import
  del corpus non è fatto.
- Già costruito nel PR #27:
  - scheda posto con «Il Timbro», «Cosa sapere prima», bollo «Esiste davvero?»;
  - la didascalia «Frame dal reel che abbiamo girato lì» sotto la cover (screenshot 06);
  - il componente reel poster-first con ripiego sul permalink Instagram
    (`BEST/src/components/article/directives/reel.tsx`);
  - `BEST/src/config/reels.ts` con 67 voci;
  - 84 cover reali in `public/images/reels/`;
  - mappa con tessere solo dietro consenso marketing.
- «I miei posti» = `/preferiti`: posti e articoli nello stesso array. La PWA attuale è una
  base "da blog", senza momento d'installazione.
- Rotte: una rotta top-level nuova (per esempio `/r/<codice>`) richiede una modifica a
  `server.ts` (alto rischio, solo travellini-backend-engineer con conferma owner).
  Varianti su rotte esistenti (`/esplora`, `/mappa`, `/posto/<slug>` con parametri) non
  la richiedono.
- **Da verificare**: come si comporta il browser integrato di Instagram (iOS e Android)
  con localStorage, installazione PWA e apertura nel browser di sistema. Non darlo per
  noto: marca `[VERIFY]` e progetta loop che reggano anche nel caso peggiore (salvataggi
  persi all'uscita dal webview).

**Da leggere (solo questo):** `docs/MARKETING_OPERATIONS_HUB.md`,
`BEST/docs/superpowers/specs/2026-08-14-corpus-e-modello-media-design.md` (§2 modello
media), `BEST/src/config/reels.ts`, gli screenshot 01, 05, 06 e 07 in
`/tmp/claude-0/-home-user-TRAVELLINIWITHUS/8c6b9c85-6fd1-5455-93cb-7a8ffe3e982f/scratchpad/shots/`,
il fact pack se è pronto
(`docs/50_Scratch/HANDOFF_webapp-travelliniwithus_data-analyst_to_divergenza.md`).

## What the receiver should produce

1. **Tre loop** reel → app → salva → condividi → nuovo follower o iscritto. Per ognuno:
   - il punto d'ingresso (bio, sticker link nelle storie, risposta a un commento,
     caption, QR);
   - i passi;
   - l'uscita;
   - cosa si misura a ogni passo e con quale consenso;
   - **dove si rompe**, in particolare nel browser integrato di Instagram.
2. **Tre formati nuovi** che esistono solo perché esiste l'app (reel, storia o
   carosello), ognuno con un hook d'esempio in italiano e i materiali reali che usa.
3. **Il ponte dal reel all'app**: valuta il deep link per codice reel. Opzioni: parametro
   su una rotta esistente (per esempio `/esplora?reel=<code>`) oppure `/r/<code>`, che
   richiede `server.ts`. Per ciascuna: pro, contro, attribuzione per singolo reel.
4. **Il loop inverso**: cosa l'app restituisce a Instagram, cioè contenuti nati dai dati
   dell'app (le zone bianche come sondaggio, la stagionalità reale, i ritorni negli
   stessi posti), sempre con materiale reale.
5. **Rischi di canale**: concorrenza per l'unico link in bio, coerenza con la regola 1
   contenuto partner ogni 4, contenuti Family.
6. Le tue idee nel **formato scheda idea** (qui sotto).

Formato scheda idea (obbligatorio, una scheda per idea):

```
### Idea N — <nome italiano, max 5 parole>
- In una frase:
- Perché stupisce (la schermata che l'owner manderebbe a Betta):
- Dato reale su cui poggia: <fatto citato; se ignoto [VERIFY: ...]>
- Cosa richiede: dati / asset / codice / ore owner
- Rischio principale:
- Regole toccate: imagery-truth | anti-SaaS | brand-DNA | SEO-URL | file-alto-rischio | privacy | metriche-pubbliche | bundle | nessuna
- Variante: prudente | firma | audace
- Autovalutazione 1-5: Stupore / Verità / Business / Costo (5 = economico) / Carico owner (5 = leggero)
```

- Where it lands: `docs/50_Scratch/HANDOFF_webapp-travelliniwithus_social_to_orchestrator.md`
  nel repo `/home/user/TRAVELLINIWITHUS`, con il frontmatter del template handoff.

## Out of scope (do NOT touch)

- Codice e `src/`. `BEST/` è in sola lettura. Nessun file ad alto rischio.
- Calendario editoriale, caption complete, script di reel oltre a un hook d'esempio per
  formato.
- Modificare la bio o proporre di sostituire `/guida-in-regalo` come unico link: puoi
  proporre come usarlo meglio, non come cambiarlo.
- **Vietato proporre**:
  - l'embed ufficiale di Instagram;
  - l'autoplay;
  - feed infinito "per te";
  - gamification;
  - challenge con premi non documentati;
  - UGC con volti di follower;
  - CTA Telegram;
  - numeri di views scritti nel codice.

## Open questions / decisions for the user

- Nessuna nuova. Se un loop richiede di cambiare il link in bio, segnalalo come
  decisione owner.

## Next hand-off

- Next agent: travellini-orchestrator (sintesi R2).
- Trigger: il tuo file di uscita esiste con i punti 1-6.

## Notes

- Il valore del corpus è la **coerenza nel tempo**: 5 anni di posti veri, con date e
  coordinate. I formati migliori probabilmente sfruttano questo, non il singolo posto.
