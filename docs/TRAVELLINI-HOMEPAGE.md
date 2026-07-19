---
title: TRAVELLINIWITHUS Homepage — Il montaggio delle tracce
status: implemented
updated: 2026-07-18
area: product
---

# Homepage cinematografica

La homepage trasforma l'apertura del sito in un racconto a scroll nativo. La direzione scelta è **Il montaggio delle tracce**: alternanza fra immagini reali a pieno campo, superfici scure e carta editoriale calda.

## Struttura narrativa

1. **Apertura:** Batu Caves e promessa “Non collezioniamo luoghi. Seguiamo le tracce.”
2. **Partire:** manifesto breve sul metodo di Rodrigo e Betta.
3. **Attraversare:** Batu Caves come prima prova reale, con reel e scheda luogo.
4. **Ricordare:** Tavernal come esperienza che supera la sola scenografia.
5. **Prossima traccia:** conversione verso destinazioni e community.

## Implementazione

- Entry page: `src/pages/AtlanteHome.tsx`.
- Esperienza: `src/components/home/cinematic/CinematicHomepage.tsx`.
- Stili: blocco `.cinematic-*` in `src/index.css`.
- Asset: cover reali dei reel 3 e 4 già presenti nel repository.
- Motion: solo parallasse leggera nell'hero via Motion; nessun blocco dello scroll.
- Reduced motion: parallasse e trasformazioni non essenziali vengono rimosse.
- Responsive: sotto 768 px le scene diventano composizioni verticali, con CTA e capitoli sempre raggiungibili.

## Vincoli e budget

- Un solo H1 e testo HTML indicizzabile.
- Nessun WebGL o nuova dipendenza.
- Poster locale come LCP; immagini successive in lazy loading.
- Nessun cambiamento a navbar, footer, backend, Firebase o Stripe.
- Lo scroll resta browser-native per mouse, touch e tastiera.

## Analytics e conversione

Le destinazioni e le CTA usano route pubbliche esistenti. Il prossimo incremento consigliato è aggiungere eventi dedicati `home_destination_click`, `home_reel_open` e `home_chapter_depth` nel contratto analytics condiviso.

## Rollback

Il redesign è isolato nel componente `CinematicHomepage`. Per tornare alla home Atlante precedente è sufficiente ripristinare la composizione precedente di `AtlanteHome.tsx`; i vecchi componenti non sono stati rimossi.
