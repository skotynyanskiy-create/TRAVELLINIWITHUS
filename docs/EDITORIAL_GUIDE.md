---
type: guide
area: brand
status: active
tags:
  - brand
  - content
  - editorial
---

# Editorial Guide — Travellini

Regole operative per produrre contenuti coerenti con il brand.
Questo documento è la fonte di verità editoriale: leggerlo prima di scrivere qualsiasi contenuto pubblico.

---

## Brand in una frase

Rodrigo e Betta — una coppia che viaggia con occhio editoriale, gusto estetico e cura per i dettagli.
Il sito è un luogo premium, non un aggregatore. Ogni contenuto è curato, personale, utile.

---

## Tono di voce

**È**: caldo, diretto, competente, personale, specifico.
**Non è**: formale, distaccato, generico, pubblicitario, entusiasta per principio.

### Regole pratiche di voce

- Parla in prima persona plurale (noi, abbiamo, ci è piaciuto) quando è esperienza diretta
- Parla in seconda persona (tu, puoi, trovi) quando è consiglio pratico
- Evita i superlativi senza motivazione ("il migliore", "incredibile", "fantastico")
- Sii specifico: non "bella spiaggia" ma "spiaggia di sabbia fine con acque turchesi e ombra naturale di eucalipti"
- Il dubbio o l'ammissione di limite rafforzano la credibilità: "non è per tutti" è più onesto di "consigliato a tutti"

---

## Pillar editoriali

| Pillar | Descrizione | Tono |
|--------|-------------|------|
| **Destinazione** | Guide città, regioni, paesi. La nostra prospettiva su dove andare e perché | Esperienziale, curato |
| **Stile di viaggio** | Come viaggiamo: coppia, lento, estetico, sostenibile | Personale, ispirazionale |
| **Pratico** | Consigli reali: booking, budget, trasporti, packing | Diretto, utile, specifico |
| **Ispirazione** | Idee viaggio, trend, luoghi insoliti | Visivo, evocativo |
| **Shop** | Prodotti, guide digitali, risorse per viaggiatori | Funzionale, credibile |

---

## Struttura articolo

### Lunghezze consigliate

| Tipo | Parole | Note |
|------|--------|------|
| Articolo pillar (guida destinazione) | 1800–3000 | SEO-friendly, completo |
| Articolo medio (consigli pratici) | 900–1500 | Specifico, scannable |
| Articolo breve (notizia, spunto) | 400–700 | Solo se c'è valore reale |
| Guida destinazione completa | 2500–4000 | Struttura a sezioni |

### Struttura base

1. **Apertura** — 1-2 paragrafi. Perché questo luogo/argomento conta per noi. No introduzioni generiche.
2. **Corpo** — sezioni con H2/H3 chiari e scannabili. Una idea per sezione.
3. **Consigli pratici** — tabella o lista. Specifici e verificati.
4. **CTA finale** — una sola azione. Newsletter, guida correlata, prodotto, destinazione.

### Cosa non fare

- Non copiare l'approccio da Lonely Planet (enciclopedico, freddo)
- Non iniziare con "Se stai leggendo questo articolo..."
- Non usare H2 come "Introduzione" o "Conclusione"
- Non mettere link affiliate senza contesto editoriale

---

## SEO — Regole minime

- Ogni articolo ha una keyword primaria identificata prima di scrivere
- La keyword primaria è nel title, nell'H1, nel primo paragrafo, in almeno un H2
- La meta description è tra 140-160 caratteri e contiene la keyword
- Minimo 3 link interni a contenuti correlati
- Alt text su ogni immagine: descrittivo, non decorativo
- URL: `/blog/<slug-in-italiano>` — corto, parole chiave, no stop words

---

## Fotografia e immagini

- Priorità alle foto di Rodrigo/Betta: autentiche, non stock
- Se si usano stock: Unsplash, qualità alta, mood coerente con brand
- Formato: webp, max 1200px wide, < 200kb
- Ogni immagine ha alt text descrittivo in italiano
- Niente collage, niente testi sovrapposti pesanti, niente filtri saturi
- Hero image: sempre orizzontale, soggetto principale a sinistra o centro

---

## Link interni — Strategia

- Ogni guida destinazione punta agli articoli correlati e ai luoghi specifici
- Ogni articolo pratico punta alla guida destinazione madre
- Ogni luogo/hotel punta all'articolo o guida che lo menciona
- La homepage collega alle destinazioni principali e ai contenuti pillar
- Non creare link interni "per fare SEO": solo se il link aggiunge valore al lettore

---

## Naming contenuti nel vault

| Tipo | Pattern | Esempio |
|------|---------|---------|
| Articolo | `ART_<slug>` | `ART_weekend-barcellona` |
| Guida destinazione | `DEST_<Nome>` | `DEST_Lisbona` |
| Itinerario | `ITIN_<dest>_<durata>` | `ITIN_Lisbona_3gg` |
| Luogo/hotel | `PLACE_<Nome>` | `PLACE_Hotel_Neri_Barcelona` |
| SEO page | `SEO_<route-slug>` | `SEO_guida-lisbona` |

---

## Checklist prima di pubblicare

- [ ] Keyword primaria identificata e usata correttamente
- [ ] Title e meta description scritti e ottimizzati
- [ ] H1 unico e coerente con keyword
- [ ] Minimo 3 link interni
- [ ] CTA finale presente e specifico
- [ ] Immagini con alt text
- [ ] Nota SEO creata in `80_SEO/Pagine/`
- [ ] `route` nella nota Obsidian aggiornata
- [ ] `status: published` e `published_at` compilata
- [ ] Link bidirezionali aggiunti (da altri articoli verso questo)

---

## Destinazioni prioritarie

Quelle dove abbiamo più esperienza diretta e dove il sito vuole posizionarsi:
→ vedi [[13_Content/CONTENT_PILLARS_TRAVELLINIWITHUS]]

---

## Aggiornamento contenuti

- Articoli pillar: review ogni 12 mesi
- Guide destinazioni: review ogni 6-12 mesi (prezzi, disponibilità, link)
- Check SEO performance: ogni 3 mesi per pagine `priority: p1`
- Quando si aggiorna un articolo: aggiorna `last_audit` nella SEO page corrispondente
