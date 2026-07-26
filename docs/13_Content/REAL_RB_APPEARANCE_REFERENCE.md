---
type: reference
area: content
status: active
owner: team
tags:
  - reference
---

# Rodrigo & Betta — riferimento aspetto reale (per imagery-truth)

Scopo: avere una fonte VERA dell'aspetto di Rodrigo (Gaetano) e Betta, così il
sito usa loro foto reali e sostituisce le immagini AI finte della coppia
(`public/images/brand/couple-travel.*`, `about-editorial.*`). Non è un dossier:
serve solo a scegliere lo scatto reale giusto per lo slot giusto.

Regola: solo foto/frame reali dei loro contenuti pubblici (imagery-truth rule
2026-07-22). Nessuna generazione AI dei loro volti presentata come reale.

## Chi è chi

- **Rodrigo (Gaetano)** — uomo, capelli scuri rasati ai lati/corti, barba curata,
  braccia molto tatuate. (rif: cover Cancún di spalle con cappello; coppia Warner Bros a destra)
- **Betta** — donna, capelli castani (spesso a treccine/braids), abbronzata,
  vari tattoo su braccia e spalle, sorriso aperto. (rif: cover "gravidanza";
  coppia Warner Bros a sinistra)

Nota stato: nei contenuti recenti Betta è in gravidanza / hanno un bimbo piccolo
("fagiolino", "primo volo") — utile saperlo per non scegliere scatti fuori periodo
se serve coerenza temporale.

## Fonti reali disponibili (già scaricate, in scratch)

Il profilo pubblica quasi solo reel (pochi post-foto), quindi i volti reali stanno
nei frame/cover dei reel. Cover con volti chiari:

- `DaYSq2sMK6p` (Warner Bros, Londra) — **scatto di coppia**, entrambi, mantelli HP. Ottimo per "chi siamo".
- `DZCgKqqAFnc` / `DY61NnyMi8e` (gravidanza / primo volo) — Betta, volto chiaro.
- `DZy-HunM8Rt` (Cancún) — Rodrigo di spalle (no volto).
- Molte altre cover reel mostrano l'uno o l'altra in scena reale.
  Candidati già ritagliati (title-card rimossa) in scratch: `rb-candidate-warner-couple.jpg`, `rb-candidate-betta.jpg`.

## Immagini AI FINTE da sostituire (16 usi)

`couple-travel.*` e `about-editorial.*`:

- `src/components/InstagramGrid.tsx` (×4)
- `src/config/destinations.ts` (×8)
- `src/experience/atlante/atlanteData.ts` (×3)
- `src/experience/sentiero/sentieroData.ts` (×1)
  Anche `collab-work.*` è brand stock (verificare se AI). La memoria cita inoltre
  ChiSiamo/CoupleIntro/HeroSection/ArticleHero (verificare i riferimenti attuali).

## Post-foto: realtà e metodo (2026-07-24)

Il profilo è ~99% reel; i post-foto sono rarissimi. Trovato 1 vero photo-dump:
`/travelliniwithus/p/DWGIK86jOBZ/` (~10 foto personali della coppia).

- yt-dlp NON scarica le immagini dei post IG ("No video formats found").
- Metodo che FUNZIONA: browser loggato → aprire il post → leggere gli `<img>` con
  `efg` che decodifica a `CAROUSEL_ITEM/regular_photo` → `curl` dell'URL firmato.
  Rese 2 foto 1080x1350 pulite (`couple_a` volti+gravidanza, `couple_b` Betta neve).
- Limite: IG carica le slide del carosello 1-2 per volta e la freccia "avanti"
  resiste al click programmatico → estrarre tutte e 10 in automatico è costoso/fragile.
  Per i photo-dump conviene: l'owner le salva dal browser loggato e le droppa in una
  cartella, poi si processano. Alternativa affidabile e abbondante: estrarre frame
  reali dai 39 reel già scaricati (ffmpeg), dove R&B sono continuamente in scena.

## Da fare (fase B)

1. Raccolta ritratti reali: da photo-dump (owner li droppa) e/o frame puliti dai reel.
2. Ottimizzare in `public/images/brand/` e sostituire i 16 usi delle finte AI.
3. Verificare nel browser + coerenza brand.
