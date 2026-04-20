---
title: Editorial Publish Checklist
type: checklist
status: active
owner: Rodrigo & Betta
tags: [editorial, seo, quality-gate]
---

# Editorial Publish Checklist

Ogni articolo pubblicato su travelliniwithus.it passa per questa checklist. Il validator `src/utils/articleValidator.ts` copre i check meccanici (lunghezze, struttura, media). Questa checklist copre quello che una macchina non può verificare: onestà, taglio editoriale, allineamento di brand.

## Prima di scrivere

- [ ] C'è un'esperienza reale, vissuta o osservata da noi? Se no, riformulalo come "ricerca" e non come racconto.
- [ ] L'articolo risponde a una domanda specifica, non a "cosa c'è di bello a X" generico.
- [ ] Ho scelto un angolo editoriale (coppia, slow, design, food, logistica)? In un articolo uno prevale sugli altri.
- [ ] Ho 8-15 foto reali utilizzabili o alternative accettabili già stock-licensed?

## Struttura

- [ ] Titolo: 20-75 caratteri, beneficio o specificità, no clickbait.
- [ ] Slug: kebab-case, minuscolo, niente accenti, niente stop-word superflue.
- [ ] Excerpt / meta description: 80-170 caratteri, promessa editoriale non keyword stuffing.
- [ ] Primi 2 paragrafi: stabiliscono contesto + il punto di vista da cui scriviamo.
- [ ] Almeno 3 H2 che scandiscono un percorso logico (preparazione → esperienza → consigli).
- [ ] Minimo 600 parole di valore reale (non riempimento).
- [ ] Una sola H1 (il titolo): nel body usa solo H2/H3.

## Taglio editoriale Travellini

- [ ] Tono sobrio: zero "imperdibile", "magico", "top 10", "devi assolutamente".
- [ ] Onestà dichiarata: se un posto è troppo pieno, se un consiglio ha un limite, lo scriviamo.
- [ ] Non consigliamo cose che non useremmo. Se è affiliato, lo diciamo inline.
- [ ] Niente placeholder in inglese nei copy pubblici ("Lorem ipsum", "Click here", "Read more").

## SEO on-page

- [ ] Title tag + meta description passano il validator.
- [ ] Canonical corretto (deve puntare a `travelliniwithus.it/...` finale).
- [ ] `article.articleSection` impostato (es. "Guida destinazione", "Itinerario", "Esperienza").
- [ ] `article.keywords` con 5-10 termini pertinenti (no keyword stuffing).
- [ ] `article.wordCount` valorizzato (ci pensa la UI, ma verifica dopo la pubblicazione).
- [ ] Se parla di un luogo geografico: usa prop `destination` nel componente SEO.
- [ ] Se è un itinerario multi-tappa: usa prop `itinerary` con `duration` ISO 8601 (es. `P4D`).
- [ ] Internal linking: almeno 2 link interni pertinenti (altra guida, risorsa, pagina chi-siamo).
- [ ] Anchor text semantico: evita "leggi di più", preferisci frasi descrittive.

## Media

- [ ] Cover image reale, min 1600x900, ottimizzata.
- [ ] Tutte le foto inline hanno `alt` descrittivo (se ricaricate via editor).
- [ ] Crediti foto dichiarati se non nostre.
- [ ] Nessun drone/riprese in zone dove la normativa locale lo vieta.

## Compliance

- [ ] Link affiliate: usano `prepareAffiliateLink` via componenti condivisi (AffiliateBox/AffiliateWidget/Risorse).
- [ ] Disclosure affiliate presente se l'articolo cita partner commerciali.
- [ ] Nessuna sponsorship non dichiarata.
- [ ] Rispetto privacy persone: niente volti identificabili senza consenso.

## Ultimo check pre-pubblicazione

- [ ] Lettura integrale ad alta voce: se un paragrafo non regge a voce, riscrivilo.
- [ ] Anteprima `SEOPreview` OK.
- [ ] `articleValidator` non blocca (0 errori, warning accettabili con motivo).
- [ ] Link interni ed esterni testati (nessun 404).
- [ ] Se articolo inizia con immagine reale diversa da cover, verifica coerenza visiva.

## Dopo la pubblicazione

- [ ] Condividi su Instagram con formato dedicato (stories + feed se giustifica).
- [ ] Aggiungi riga in `docs/13_Content/CONTENT_CALENDAR.md` se tracciato li'.
- [ ] Entro 48h: verifica Google Search Console indicizzazione.
- [ ] Entro 7 giorni: guarda engagement + commenti, nota cosa ha funzionato per il prossimo articolo.

---

## Riferimenti tecnici

- Validator: [src/utils/articleValidator.ts](../../src/utils/articleValidator.ts)
- Editor admin: [src/pages/admin/ArticleEditor.tsx](../../src/pages/admin/ArticleEditor.tsx)
- Schema SEO: [src/components/SEO.tsx](../../src/components/SEO.tsx)
- Template Obsidian: [TPL_Article.md](../90_Templates/TPL_Article.md) · [TPL_Destination_Guide.md](../90_Templates/TPL_Destination_Guide.md) · [TPL_Itinerary.md](../90_Templates/TPL_Itinerary.md)
