---
title: BUG — Homepage placeholder asset R+B (couple photos, newsletter archive, partner shortlist)
status: mitigated-pending-real-assets
priority: P1
type: content
owner: R+B
related-projects:
  - [[PROJECT_HOME_HERO_NAV_REFINEMENT]]
  - [[PROJECT_RELEASE_READINESS]]
  - [[MARKETING_OPERATIONS_HUB]]
created: 2026-05-14
---

# BUG — Homepage placeholder asset R+B

## Sintomo

Tre componenti pubblici della homepage mostrano contenuti placeholder con `TODO R+B` esplicito nel sorgente. In staging e in produzione (se attivata oggi) i visitatori vedono Unsplash stock / labels generiche al posto di asset reali della coppia. Riduce trust signal e indebolisce il people-led positioning dichiarato in `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md`.

## Punti coinvolti

| File                                                                                            | TODO                                                         | Cosa serve                                                                                                                                                |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --------- | ------ | ---------- |
| [src/components/home/CoupleIntro.tsx:16](../../src/components/home/CoupleIntro.tsx)             | "sostituire image+caption con 3 foto reali"                  | 3 foto coppia R+B in viaggio (orizzontali, ratio 4:3 o 16:10, formato `.webp` o `.avif`, larghezza min 1600px). Caption italiana 1-2 righe per ogni foto. |
| [src/components/home/NewsletterFeature.tsx:17](../../src/components/home/NewsletterFeature.tsx) | "sostituire NEWSLETTER_ARCHIVE_PREVIEW con 3-5 numeri reali" | Lista 3-5 numeri pubblicati con: titolo, data, snippet 1 riga, link al numero archiviato (URL Brevo o sezione `/newsletter/archivio`).                    |
| [src/components/home/PartnerLogosStrip.tsx:8](../../src/components/home/PartnerLogosStrip.tsx)  | "sostituire PARTNERS con 5+ partner reali quando shortlist"  | 5-7 logo partner reali con `name`, `slug`, `logoUrl` (SVG monocromo preferito), `category` (`hotel`                                                       | `food` | `outdoor` | `gear` | `travel`). |

## Impatto

- **Trust:** placeholder visibili minano la credibilita above-the-fold (CoupleIntro), nel funnel newsletter (NewsletterFeature) e nella prova partner (PartnerLogosStrip).
- **Conversion:** un visitatore che cerca un brand "people-led" vede stock immagini = friction. Newsletter conversion <2% probabile finche archivio non e' reale.
- **SEO:** scarso impatto diretto, ma il `og:image` derivato dall'hero non rappresenta la coppia reale, indebolendo CTR social share.
- **Release readiness:** [docs/10_Projects/PROJECT_RELEASE_READINESS.md](../10_Projects/PROJECT_RELEASE_READINESS.md) elenca questi asset come prerequisiti V2; finche pending, il deploy mostra demo content.

## Riproduzione

1. `npm run dev`
2. Apri http://localhost:3000/
3. Scorri al blocco "Chi siamo / coppia" → foto generica + caption "TODO" o asset Unsplash placeholder
4. Scorri al blocco "Newsletter" → archivio finto con titoli inventati
5. Scorri al blocco "Partner" → loghi finti o testo "Brand placeholder"

## Soluzione consigliata

### Step 1 — Asset (R+B, fuori codice)

- Selezionare le 3 foto coppia con il fotografo o dal rullino.
- Compilare brief Brevo per estrarre i 3-5 numeri newsletter migliori (data, titolo, link).
- Chiudere shortlist partner (cfr. template in `docs/MARKETING_OPERATIONS_HUB.md` Partner Pipeline).

### Step 2 — Integrazione

- Caricare le foto in `public/home/couple/` (o Firebase Storage `home/couple/`) e referenziare in `CoupleIntro.tsx`.
- Sostituire `NEWSLETTER_ARCHIVE_PREVIEW` in `NewsletterFeature.tsx` con i numeri reali, con link `https://travelliniwithus.com/newsletter/<slug>` o link Brevo.
- Sostituire `PARTNERS` in `PartnerLogosStrip.tsx` con i 5-7 brand confermati.
- Rimuovere le 3 righe `// TODO R+B: ...`.

### Step 3 — Mitigazione finche pending (opzionale, software-side)

Per evitare che placeholder appaiano come content reale durante staging/preview:

- Aggiungere attributo `data-state="demo"` ai wrapper dei tre componenti quando i dati sono placeholder.
- Applicare overlay editorial "Anteprima — asset in caricamento" via CSS solo su `[data-state="demo"]`.
- Garantire `noindex` solo sui blocchi (non sulla pagina) — il resto della homepage e' produzione.
- Stop: questa mitigazione **non e' fix**; serve solo se R+B vuole pubblicare la home prima di avere gli asset.

## Verifica fix

- `npm run audit:ui` non deve segnalare nuovi warning sulle 3 sezioni (CoupleIntro/NewsletterFeature/PartnerLogosStrip).
- `npm run audit:visual` (Playwright e2e) deve passare i 12 spec attuali.
- Smoke test homepage a 375/768/1440 — no horizontal overflow, alt text presente sulle 3 foto, partner logos con `alt={partner.name}`.
- `npm run typecheck` PASS.

## Mitigazione 2026-05-15

- `CoupleIntro.tsx`: rimossi hotlink Unsplash e claim "foto reali, non stock"; uso di asset locali controllati in attesa delle foto finali.
- `NewsletterFeature.tsx`: rimosso archivio newsletter finto; sostituito con preview "Cosa ricevi" che non simula numeri pubblicati.
- `HeroSection` / `site.ts`: fallback reel da asset locale, non Unsplash/demo caption.
- `Collaborazioni.tsx`: hero image da asset locale `collab-work.webp`.

Il bug non e chiuso: mancano ancora gli asset R+B definitivi e partner/newsletter reali. La superficie pubblica pero non mostra piu proof finto o hotlink demo core.

## Decisioni aperte

- [ ] R+B: deadline per asset (proposta: entro 2026-05-21).
- [ ] R+B: ok a usare `data-state="demo"` overlay finche pending? (Decisione P1.)
- [ ] Owner: chiusura bug solo quando i tre TODO sono rimossi dal sorgente.

## Riferimenti

- [src/components/home/CoupleIntro.tsx](../../src/components/home/CoupleIntro.tsx)
- [src/components/home/NewsletterFeature.tsx](../../src/components/home/NewsletterFeature.tsx)
- [src/components/home/PartnerLogosStrip.tsx](../../src/components/home/PartnerLogosStrip.tsx)
- [docs/10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT.md](../10_Projects/PROJECT_HOME_HERO_NAV_REFINEMENT.md)
- [docs/10_Projects/PROJECT_RELEASE_READINESS.md](../10_Projects/PROJECT_RELEASE_READINESS.md)
- [docs/MARKETING_OPERATIONS_HUB.md](../MARKETING_OPERATIONS_HUB.md) — sezione Partner Pipeline e Content Workflow
