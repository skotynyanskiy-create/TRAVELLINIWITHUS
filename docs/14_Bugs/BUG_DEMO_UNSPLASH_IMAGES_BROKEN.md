---
type: bug
area: frontend
status: fixed
priority: p1
owner: team
severity: high
repo: TRAVELLINIWITHUS
route:
  - /shop
  - /destinazioni
  - /mappa
related:
  - [[10_Projects/PROJECT_ADVANCED_FULL_SITE_AUDIT_2026_05_15]]
  - [[10_Projects/PROJECT_RELEASE_READINESS]]
source: advanced full site audit 2026-05-15
tags:
  - bug
  - assets
  - trust
  - visual
---

# BUG - Demo Unsplash images broken

## Sintomo

Browser audit rileva immagini rotte su pagine pubbliche basate su contenuto demo.

## Impatto

- Trust immediato basso su pagine editoriali e shop.
- Percezione non premium.
- Potenziale CLS/layout fallback se il browser non mantiene dimensioni corrette.

## Repo context

- route: `/shop`, `/destinazioni`, `/mappa`
- repo_path: contenuti demo / preview content / product demo data

## URL rotti rilevati

Shop:

- `photo-1499695867787-12ace027e651` - Roadtrip in Puglia
- `photo-1547471080-7fc2caa6f7ea` - Safari in Sudafrica
- `photo-1551882547-ff40c0d129df` - Fuga in Trentino

Destinazioni / Mappa:

- Puglia
- Toscana
- Costiera Amalfitana

## Riproduzione

1. Avviare `npm run dev`.
2. Aprire `/shop`, `/destinazioni`, `/mappa`.
3. Controllare network panel o script browser image naturalWidth.
4. Verificare immagini con `naturalWidth === 0`.

## Fix

- Sostituire URL Unsplash demo con asset locali approvati in `public/images/`.
- Preferire `.webp` / `.avif` ottimizzati e versionati nel repo.
- Evitare hotlink instabili per superfici pubbliche core.
- Se il contenuto e' demo, aggiungere fallback visuale coerente e noindex dove opportuno.

## Test

- Browser sweep su route coinvolte.
- Nessuna immagine con `naturalWidth === 0`.
- `npm run build`.
- `npm run audit:visual` dopo stabilizzazione test.

## Root cause

Dipendenza da URL remoti demo non controllati dal progetto.

## Fix 2026-05-15

- Sostituiti gli URL demo rotti in `src/config/demoContent.ts` con asset locali controllati in `public/images/`.
- Verifica browser mobile su `/shop`, `/destinazioni`, `/mappa`, `/vieni-con-noi`, `/lead-magnet`: 0 immagini rotte.
