---
title: HANDOFF_repurpose-puglia_main_to_social-operator
status: obsolete
created: 2026-05-19
from: main-thread (via /repurpose skill)
to: travellini-social-content-operator
slug: repurpose-puglia
expires: 2026-06-15
type: handoff
area: workspace
---

# Handoff: Repurpose pillar Puglia → pacchetto multi-canale

## Stato

Pacchetto **drafted** in [docs/13_Content/REPURPOSE_puglia-trulli-masserie.md](../13_Content/REPURPOSE_puglia-trulli-masserie.md). 5 canali coperti: carosello IG 8 slide, Reel 30s, quiz 5 domande, newsletter, OG card brief.

## Cosa è pronto

- **Testi slide carosello** completi e in italiano, voce R+B verificata
- **Script Reel** con timing + voiceover + shot brief + cover frame
- **5 domande quiz** con risposte + tie-in pillar
- **Newsletter** completa (oggetto + pre-header + body + PS) — pronta da incollare in Mailchimp/Substack
- **OG card brief** con titolo, sub, palette, layout, pattern riusabile per prossimi pillar

## Cosa serve scegliere

1. **Data + ora pubblicazione** caroselli IG — raccomandato martedì 11:00 + giovedì 19:00 (finestra audience IT). Da confermare in `docs/13_Content/CONTENT_CALENDAR_H2_2026.md`.
2. **Caption complete** caroselli IG (oggi solo testo slide, manca caption-corpo sotto). Suggerimento: caption-corpo da 80-120 parole basata su slide 5 (Ostuni alle 7) o slide 6 (errore Alberobello). Hashtag già forniti nel doc repurpose.
3. **A/B test Reel hook**: "Ti mentono" vs "Aspettavi un'altra cosa" — decidere quale lanciare prima.
4. **Handle masserie** da taggare: verificare profili IG reali di Il Frantoio, Cervarolo, Torre Coccaro prima di taggarli. Se profilo non esiste o struttura non è partner, niente tag (no pubblicità non concordata).
5. **PS newsletter** "piano B agosto" — confermare se è scrivibile davvero in caso qualcuno risponda. Se no, eliminare il PS.

## Cosa va in coda calendario social

- **Carosello IG #1** (Puglia pillar): slot martedì o giovedì prossimi
- **Reel 30s**: 1-2 settimane dopo il carosello (dare respiro)
- **Newsletter**: prossima edizione, headline su Puglia
- **Quiz**: una volta wired su `/quiz` route, link dalla bio IG + footer newsletter
- **OG card**: shippare prima delle pubblicazioni social per migliorare share preview

## Risk / note

- **Foto pillar oggi sono placeholder SVG.** I caroselli e Reel hanno shot brief che assumono foto reali R+B. Se entro 2 settimane non arrivano, valutare fallback Unsplash con curatela editoriale (no cliche).
- **Stagione**: il pillar dice "settembre seconda metà". Se il calendario sociale spinge oltre il 15 luglio, considerare di lanciare in autunno per non andare contro la propria tesi (sarebbe sabotaggio editoriale).
- **PS newsletter**: se viene attivato, prepararsi a rispondere manualmente a 10-30 mail in 7 giorni.

## Next hand-off

- `travellini-asset-curator` per scelta foto carosello + Reel
- `/social-card` skill per generare OG card
- `travellini-seo-conversion-strategist` per wiring quiz su `/quiz` + schema markup
- `travellini-data-analyst` (post-pubblicazione 30 giorni) per misurare:
  - IG bio link click → /articolo/puglia-trulli-masserie
  - Newsletter CTR sulla CTA principale
  - Quiz completion rate + email captured
  - Scroll depth pillar Puglia pre/post repurpose (baseline GA4)
