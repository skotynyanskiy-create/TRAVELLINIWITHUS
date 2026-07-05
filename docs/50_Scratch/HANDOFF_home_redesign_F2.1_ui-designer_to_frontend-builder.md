---
title: HANDOFF_home_redesign_F2.1_ui-designer_to_frontend-builder
status: obsolete
created: 2026-05-15
from: travellini-ui-designer
to: travellini-frontend-builder
slug: home-redesign-11-to-7
expires: 2026-05-29
type: handoff
area: workspace
---

# Handoff: Home redesign 11 → 7 sezioni — direction LOCKED

## Why this work matters

La Home attuale ([src/pages/Home.tsx](../../src/pages/Home.tsx)) ha **11 sezioni** con:

- 3 superfici social proof ridondanti (`HomeTrustStrip` + `HomePartnerSignal` + `PartnerLogosStrip`),
- 2 push commerciali sovrapposti (`MonetizationTeaser` + `HomeCollaborationCta`),
- 1 quiz/budget calc che spezza il tono editoriale e introduce un secondo lead-capture in competizione con la Newsletter,
- gerarchia narrativa non lineare (CoupleIntro arriva DOPO due strisce di proof anonime).

Obiettivo: 7 sezioni con narrativa editoriale (copertina → autori → indice → feature → contemporary → subscribe → back-cover commerciale). Riduzione cognitive load mobile, raddoppio attivo del peso narrativo per sezione, signature interaction unica e utile.

## Decisions already made (LOCKED — non rilitigare)

### Architettura finale: 7 sezioni

1. **HeroSection**
2. **CoupleIntro**
3. **MapStrip + DiscoveryFinder** (signature interaction)
4. **LatestArticles**
5. **InstagramGrid** (Reels feed reale)
6. **NewsletterFeature**
7. **CommercialBlock** (NUOVO — sostituisce MonetizationTeaser + HomeCollaborationCta)

### Sezioni eliminate dalla home

- `HomeTrustStrip` → rimossa.
- `HomePartnerSignal` + `PartnerLogosStrip` → migrate dentro `CommercialBlock` (logo strip lato B2B, max 5-8 partner).
- `HomeQuizBudgetTeaser` → rimossa dalla home, riallocazione futura in `/esplora` (modulo dedicato) o `/strumenti`.

### 12 decisioni LOCKED implementative

1. **Sezioni totali = 7.** Non riaggiungere componenti rimossi.
2. **Hero H1**: `var(--text-display-1)`, Fraunces 500, allineato sx, max-width 18ch. **NO overlay scuro full**. Solo gradiente angolare bottom-left max 30% opacity per leggibilità testo.
3. **Hero CTA**: 2 CTA orizzontali (primaria terracotta `--color-accent`, secondaria ghost ink). Mobile stack verticale full-width.
4. **CoupleIntro desktop**: foto col 1-5 (5/12), testo col 7-12 (6/12). Foto 4:5 ritratto editoriale, NO sorrisi forzati, NO foto da matrimonio. Mobile: stack foto first.
5. **MapStrip = full-bleed dark** `var(--color-ink-deep)`. Mappa Mapbox dark-v11 con pin animati via `IntersectionObserver` (stagger 60ms, fade+scale). **Mobile = immagine statica fallback** + 4 card scroll-snap orizzontali. NO Mapbox runtime mobile per LCP.
6. **LatestArticles layout = asimmetrico 5/3/3 col desktop** (NON griglia simmetrica). Card 1 dominante (foto 3:2), card 2-3 compatte (foto 4:5). Mobile = stack simmetrico.
7. **InstagramGrid = 6 reel desktop 1 riga, 2-col mobile (3 righe)**. **NO autoplay**. Hover-play desktop, tap → instagram.com mobile.
8. **NewsletterFeature = full-bleed band** `var(--color-accent-soft)`. Split 7/5 desktop, stack mobile. Input pill custom esistente.
9. **CommercialBlock = full-bleed dark** `var(--color-ink-deep)`. **Asimmetria 60/40** (NON 50/50). B2C sx 60%, B2B dx 40%. Separatore 1px `rgba(255,255,255,0.08)`. Mobile = stack, B2C first.
10. **Lazy boundary**: solo MapStrip, LatestArticles, InstagramGrid, NewsletterFeature, CommercialBlock in `Suspense`. Hero + CoupleIntro **static import** (above the fold). Hero preload AVIF resta.
11. **Motion globale**: ogni reveal rispetta `prefers-reduced-motion: reduce` → fallback `opacity: 1; transform: none`. Nessun parallax, WebGL, shader.
12. **Typography scale**: Hero `--text-display-1`, sezione H2 `--text-h2`, article card title `--text-h3` (dominante) / `--text-h4` (compatte). Tutto Fraunces. Body Inter.

## Context the receiver needs

### File da modificare

- [src/pages/Home.tsx](../../src/pages/Home.tsx) (127 righe → riscrivere imports + Suspense + ordine sezioni)

### File da CREARE

- `src/components/home/MapStrip.tsx` (signature interaction)
- `src/components/home/CommercialBlock.tsx` (B2C 60% / B2B 40%)

### File da MODIFICARE

- `src/components/home/HeroSection.tsx` (rimuovere overlay full, ridefinire CTA primaria/secondaria, copy dopo F1.5 owner pick)
- `src/components/home/CoupleIntro.tsx` (rivedere layout 5/7 col, foto 4:5)

### File da ELIMINARE / DEPRECARE

- `src/components/home/HomeTrustStrip.tsx`
- `src/components/home/HomePartnerSignal.tsx`
- `src/components/home/PartnerLogosStrip.tsx` (se ancora esiste)
- `src/components/home/MonetizationTeaser.tsx`
- `src/components/home/HomeCollaborationCta.tsx`
- `src/components/home/HomeQuizBudgetTeaser.tsx` (spostato in `/esplora` o `/strumenti` da issue separata)

### Riferimenti visivi (vedi screenshot/inspector)

- Cereal Magazine — Hero people-led, testo sx, foto pulita.
- Kinfolk "About" — CoupleIntro foto + manifesto.
- The Pudding "Where is it most expensive..." — MapStrip dark + pin animati.
- Monocle.com Shop/Subscribe footer band — CommercialBlock dark asimmetrico.
- Aesop.com journal grid — InstagramGrid reels editoriali, no badge.

### Anti-pattern (NON fare)

1. NO carousel automatico (Instagram, articles, hero).
2. NO carillon logo partner sulla home (resta solo dentro CommercialBlock lato B2B come logo strip 5-8 fissi).
3. NO trust strip con numeri inventati.
4. NO gradient overlay scuro full sul hero.
5. NO doppia lead capture (solo Newsletter).
6. NO icone emoji-style (🌍 ✈️) in CommercialBlock.
7. NO card-in-card.

## What the receiver should produce

1. **PR** che applica tutte 12 decisioni LOCKED.
2. **`Home.tsx` finale** con 7 imports + Suspense corretto + ordine sezioni come da architettura sopra.
3. **2 nuovi componenti** (`MapStrip`, `CommercialBlock`) con:
   - Props minime + types,
   - Responsive completo (375/768/1024/1440/1920),
   - `prefers-reduced-motion` rispettato,
   - Lazy/Suspense compatibile.
4. **Smoke test**: `npm run typecheck`, `npm run audit:ui`, `npm run audit:visual`, `npm run e2e`.
5. **Hand-off browser-auditor** dopo PR open: real-browser audit su `/` a 375/768/1280/1920.

## Out of scope (do NOT touch)

- `server.ts`, `firestore.rules`, `admin.ts` — nessuna modifica.
- Copy hero — verrà fornito dalla scelta owner su F1.5 (placeholder OK fino ad allora).
- Quiz/BudgetCalc reimplementation — issue separata.
- Foto reali R+B — F1.6 separato (con asset-curator).

## Open questions / decisions for the user

- **CommercialBlock B2C bullets**: Shop / Club / Risorse — confermi questi 3? Sì/no.
- **CommercialBlock B2B**: solo "Media kit" + mailto? Oppure 2 voci (Media kit + Lavora con noi)?
- **MapStrip pin count desktop**: 8-12 pin animati. Confermi 10 come compromesso?

## Next hand-off

- **Next agent dopo PR**: `browser-auditor` (real-browser audit) → `travellini-quality-auditor` (regression).
- **Trigger**: PR open su feature branch `feature/home-redesign-7-sezioni`.

## Notes

- L'architettura proposta inizialmente era 8 sezioni; ridotta a 7 dall'ui-designer per rimuovere Quiz/BudgetCalc dalla home (off-tono e doppio lead-capture).
- Sequenza narrativa giustificata: copertina → autori → indice geografico → feature → contemporary → subscribe → commerciale. Newsletter precede CommercialBlock perché offer gratuito (low friction) intercetta chi non comprerà subito.
- Tutti i componenti vivono ancora in `src/components/home/` per coerenza con la struttura esistente.
