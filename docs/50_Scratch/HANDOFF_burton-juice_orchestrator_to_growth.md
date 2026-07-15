---
title: HANDOFF_burton-juice_orchestrator_to_growth
status: consumed
created: 2026-07-15
from: travellini-orchestrator
to: travellini-growth-revenue-operator
slug: burton-juice-ristorante-tim-burton
expires: 2026-07-29
type: handoff
area: delivery
---

# Handoff: kickoff pillar "The Burton Juice" — definisci why-now, audience, business goal, metrica

## Why this work matters

Uno dei 3 cavalli editoriali pinned di @travelliniwithus (reel 63K like / 918
commenti, mag 2024) va trasformato in pillar del sito. Il contenuto e' gia'
validato dall'audience: manca solo la struttura editoriale/SEO per catturare
la domanda long-tail che oggi si perde su Instagram. Sei il primo step della
sequenza canonica S1 (nuovo articolo pillar).

## Decisions already made (locked — non rilitigare)

- **Slug**: `burton-juice-ristorante-tim-burton` (gia' fissato, non cambiarlo).
- **Tipo**: pillar. **Categoria**: esperienze. **Destinazione**: Somma
  Vesuviana (Napoli), Campania.
- **Route**: `/articolo/burton-juice-ristorante-tim-burton`.
- **Il pillar DEVE usare la scheda recensione** (`ReviewBlock` / `RatingPill`,
  campo `review` su `ArticleData`). Registro: recensione vissuta di Rodrigo &
  Betta, che erano davvero al locale. Non brochure.
- **Constraint asset**: SOLO fotografia reale (frame del reel o foto owner).
  MAI immagini AI. Deciso a livello di brand DNA.
- **Contenuto organico**, non #ADV: il reel non ha disclosure. Assunzione di
  default = nessuna relazione commerciale col locale (da confermare, vedi
  open questions).

## Context the receiver needs

- Content note (tua sezione "Brief" da compilare):
  [ARTICLE_burton-juice-ristorante-tim-burton.md](../13_Content/ARTICLE_burton-juice-ristorante-tim-burton.md)
- Analisi contenuto IG (perche' questo pillar, quale audience, quale registro):
  [IG_CONTENT_ANALYSIS_2026-07-15.md](../13_Content/IG_CONTENT_ANALYSIS_2026-07-15.md)
- Seed repo (placeholder da riempire a valle):
  `src/data/articles/burton-juice-ristorante-tim-burton.seed.ts`
- Fatti verificati (2026-07-15): The Burton Juice, Via Marigliano 168, Somma
  Vesuviana (NA). Primo ristorante d'Europa dedicato a Tim Burton: cocktail bar
  - ristorante + teatro + bakery; aree a tema Alice / Beetlejuice / Jack
    Skeleton / Edward mani di forbice; attori in sala; prenotazione WhatsApp
    obbligatoria; sito theburtonjuice.com. `[VERIFY: prezzi e orari correnti]`
- Segnale strategico dall'analisi IG: gli evergreen organici "posti
  particolari" fanno 5K-63K like e catturano intent di ricerca che gli ADV
  locali non hanno. Questo e' l'esemplare massimo (63K).

## What the receiver should produce

Compila la sezione **## Brief** della content note con:

- **Why now**: perche' questo pillar adesso (validazione 63K, domanda organica,
  posizionamento "esperienze particolari in Italia").
- **Audience**: UNA persona specifica (proposta: appassionato di esperienze
  immersive a tema cinema/pop-culture, 25-40, coppia o gruppo di amici,
  disposto a spostarsi in Campania per una serata unica; fandom Tim Burton /
  Beetlejuice / Nightmare). Conferma o correggi.
- **Business goal**: cattura organica long-tail + crescita autorevolezza
  editoriale del verticale "esperienze". Nessuna monetizzazione diretta se
  confermato organico.
- **Primary metric**: proposta = sessioni organiche alla pagina + engagement
  sulla scheda recensione (scroll-depth / tempo). Se emerge un CTA (segui su
  IG, iscrizione newsletter, prenota), definisci il click primario.

## Out of scope (do NOT touch)

- Non scrivere H1/meta/slug (e' della seo-strategist, step 2).
- Non scrivere il body ne' i voti della recensione (editorial + owner).
- Non toccare codice o seed.
- Non inventare numeri di audience, prezzi, o relazioni con partner.

## Open questions / decisions for the user (escala PRIMA di chiudere)

1. **Relazione col locale**: e' puramente organico (nessun #ADV / invito) o
   c'e' interesse a proporre una collaborazione futura con The Burton Juice?
   La risposta decide se in pagina serve qualsiasi disclosure.
2. **Angolo famiglia**: l'analisi IG segnala il verticale @travellinifamily
   ("ci ritorneremo col piccolo"). Burton Juice va inquadrato come serata
   adulti/coppie (cocktail bar + teatro + temi horror) o come esperienza
   family-friendly (bakery + area Alice)? Serve UNA scelta di registro.
3. **Metrica primaria confermata**: SEO organico puro, o c'e' un obiettivo di
   conversione (newsletter / segui IG) che deve guidare la CTA in pagina?

## Next hand-off

- Next agent: `travellini-seo-conversion-strategist`
- Trigger: sezione "## Brief" della content note compilata + audience e
  metrica lockate. Brief gia' pronto in
  `HANDOFF_burton-juice_growth_to_seo.md`.

## Notes

Non ri-verificare i fatti gia' elencati (indirizzo, format del locale): sono
verificati 2026-07-15. Prezzi/orari restano `[VERIFY]` fino allo step
`/verify-facts` pre-publish.
