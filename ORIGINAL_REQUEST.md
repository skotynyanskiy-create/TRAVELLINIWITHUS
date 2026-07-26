# Original User Request

## Initial Request — 2026-07-24T14:24:34Z

Ristrutturazione e perfezionamento chirurgico di livello Enterprise dell'intero sito web TRAVELLINIWITHUS per Gaetano Rodrigo & Betta (UI/UX, tipografia, micro-animazioni, utilità viaggiatore e revisione di tutte le pagine).

Working directory: c:\Users\carme\Desktop\TRAVELLINIWITHUS\TRAVELLINIWITHUS

## Requirements

### R1. Complete UI/UX & Editorial Refinement

Revisione e perfezionamento grafico e di contenuto di tutte le pagine (Homepage, Posto, Destinazione, Esplora, Mappa, Chi Siamo, Collaborazioni, Media Kit, Risorse) mantenendo la voce autentica di Rodrigo & Betta e l'elevazione visuale Enterprise.

### R2. Interactive Traveler Tools & Integrations

Implementazione degli strumenti pratici per i visitatori: geolocalizzazione "Vicino a me" con distanza Haversine in km, indicazioni dirette su Google Maps, contatti/prenotazioni Google Business Profile, condivisione nativa Web Share API e tracciamento affiliati centralizzato.

### R3. Quality, Performance & Security Compliance

Garanzia di 0 errori in `npm run typecheck` e `npm run audit:ui`, conformità WCAG AA e conservazione intatta dei file ad alto rischio (`server.ts`, `firestore.rules`, `src/config/admin.ts`).

## Acceptance Criteria

### Verification & Quality Gates

- [ ] `npm run typecheck` senza errori.
- [ ] `npm run audit:ui` senza errori sui token di brand.
- [ ] Nessuna regressione sui Core Web Vitals e nessun overflow orizzontale su schermi mobile (375px).
- [ ] Conservazione intatta della sicurezza e dei file ad alto rischio.
