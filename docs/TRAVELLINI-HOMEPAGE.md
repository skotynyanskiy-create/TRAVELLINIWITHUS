---
title: TRAVELLINIWITHUS Homepage — Diario delle meraviglie vere
type: reference
status: active
updated: 2026-07-21
area: product
---

# Homepage — Diario delle meraviglie vere

La home pubblica `/` è un taccuino editoriale digitale per Rodrigo e Betta. La direzione nasce
dal campione Instagram documentato in [[13_Content/INSTAGRAM_CONTENT_AUDIT_2026-07-21]]: il
magnete del brand è la **meraviglia concreta**, cioè posti che sembrano inventati ma vengono
raccontati con prova, prezzo, periodo e un giudizio personale.

## Promessa

> Posti che sembrano inventati. Ma esistono davvero.

Il sito completa ciò che un Reel non contiene: contesto, limiti, periodo giusto e una strada
chiara verso mappa, diario e collaborazione.

## Sequenza narrativa

1. **Sembra impossibile** — promessa di brand e ingresso nel diario.
2. **Altrove, vicino** — luoghi italiani che sembrano appartenere a un altro mondo.
3. **Dentro una storia** — soggiorni, tavole ed esperienze che diventano ricordi.
4. **Vale davvero?** — metodo: prova, dati pratici e verdetto sincero.
5. **Prossima traccia** — mappa, storia di Rodrigo e Betta, collaborazioni.

## Interazione

- scroll browser-native, senza hijacking;
- pagine sticky con una lieve prospettiva Motion su desktop;
- indicatore `Pagina NN / 05` sincronizzato via Intersection Observer;
- testata, rilegatura e indice laterale persistenti;
- mobile verticale intenzionale, senza 3D né pieghe fragili;
- `prefers-reduced-motion` disattiva trasformazioni e transizioni non essenziali.

## Implementazione

- entry page: `src/pages/AtlanteHome.tsx`;
- esperienza: `src/components/home/cinematic/CinematicHomepage.tsx`;
- stili: blocco `.journal-*` in `src/index.css`;
- asset: `public/images/home-journal/` in AVIF, WebP e sorgente PNG;
- reference approvata: `docs/30_Design/references/home-journal-target-2026-07-21.png`;
- verifica visuale: `design-qa.md`.

## Asset e trasparenza

I tre ambienti editoriali sono stati generati con ImageGen per questa composizione. Sono marcati
nel DOM come visuali editoriali e non vengono presentati come prove fotografiche di un luogo
specifico o di una collaborazione. La promessa `Esperienze reali` riguarda il metodo editoriale
di Rodrigo e Betta, non la provenienza delle immagini di art direction.

Quando saranno disponibili fotografie proprietarie approvate, potranno sostituire gli asset
senza modificare layout o motion.

## Vincoli rispettati

- un solo H1 e contenuto HTML indicizzabile;
- nessuna nuova dipendenza;
- immagini AVIF/WebP e lazy loading fuori dall'hero;
- CTA su route pubbliche esistenti;
- nessuna modifica a backend, Firebase, Stripe o file ad alto rischio;
- nessun dato social inventato in pagina.

## Verifica 2026-07-21

- typecheck e build produzione: pass;
- audit UI: zero errori;
- visual smoke: 14/14 pass;
- matrice responsive: 320/375/768/1024/1536 senza overflow;
- axe WCAG 2A/AA/2.1AA: zero violazioni homepage;
- console browser: zero errori.

## Prossimo incremento

Sostituire una visuale AI con una prima storia proprietaria completa — foto reale, prezzo,
periodo e limite — mantenendo identica la regia del taccuino.
