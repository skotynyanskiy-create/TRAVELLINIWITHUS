---
type: plan
area: website
status: active
priority: p0
owner: Rodrigo & Betta
created: 2026-07-13
tags:
  - website
  - implementation
  - content-system
  - conversion
---

# Ecosistema Travelliniwithus Connesso — Master Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trasformare il sito locale esistente in un ecosistema proprietario coerente tra social, scoperta, pianificazione, newsletter, partnership e monetizzazione, senza pubblicare dati o contenuti non approvati.

**Architecture:** Il programma conserva `Atlante Vivo` e procede per quattro rilasci indipendenti. Un livello condiviso di disponibilità pubblica e validazione editoriale governa navigazione, sitemap, contenuti, lead magnet, metriche e affiliate; ogni superficie consuma solo record esplicitamente pubblicabili.

**Tech Stack:** React 19, TypeScript, Vite 6, React Router, Tailwind CSS 4, Vitest, Testing Library, Playwright, Firebase/Firestore esistente, Node.js ESM per gli script.

## Global Constraints

- La homepage `Atlante Vivo` e il design system in `DESIGN.md` restano la base.
- La lingua pubblica resta l'italiano.
- Nessun dato, numero, partner, fotografia, offerta o case study non approvato può apparire come reale.
- Shop e Club restano fuori dalla navigazione finché non sono consegnabili.
- `/vieni-con-noi` resta una landing social e non una voce del menu interno.
- `Organizza` è un gruppo di navigazione verso `/itinerari`, `/strumenti` e `/risorse`, non una nuova rotta.
- Le immagini pubbliche devono essere fotografie reali autorizzate.
- Le affiliate sono contestuali, dichiarate e tracciate attraverso un modulo condiviso.
- Nessuna modifica a `server.ts`, `firestore.rules` o `src/config/admin.ts` senza un'approvazione owner separata.
- Nessun deploy, aggiornamento DNS o modifica della bio social durante l'esecuzione tecnica.
- Il worktree corrente è sporco: prima di implementare, inventariare le modifiche esistenti e non usare stash, reset o staging globale.
- Ogni task segue red-green-refactor, verifica mirata e commit selettivo.

---

## Decomposizione del programma

| Ordine | Piano                                                                                    | Risultato indipendente                                                         | Gate                                                     |
| ------ | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------- |
| 1      | [Fondazioni UX, navigazione e homepage](2026-07-13-ecosistema-fase-1-fondazioni-home.md) | IA coerente, CTA corrette, superfici premature nascoste, Atlante Vivo rifinito | Eseguibile senza dati privati                            |
| 2      | [Rete editoriale proprietaria](2026-07-13-ecosistema-fase-2-rete-contenuti.md)           | `ContentItem` validati alimentano posto, Esplora, Mappa, destinazioni e Reel   | Pubblicazione record solo dopo approvazione R&B          |
| 3      | [Acquisizione social ed email](2026-07-13-ecosistema-fase-3-acquisizione.md)             | Bio hub, newsletter e lead magnet coerenti e misurabili                        | PDF, dieci luoghi, immagini e consegna approvati         |
| 4      | [B2B, monetizzazione e release](2026-07-13-ecosistema-fase-4-business-release.md)        | Metriche verificabili, proof, affiliate governate e predeploy completo         | Dati Insights, partner, offerte e azioni owner approvati |

I piani sono sequenziali per le interfacce condivise, ma ogni fase produce un sito funzionante e può essere rilasciata indipendentemente dopo il proprio gate.

## Contratti condivisi

### Stato delle superfici pubbliche

Il file `src/config/public-surfaces.json` è la sorgente unica leggibile sia dal client sia dagli script Node:

```json
{
  "shop": "hidden",
  "club": "hidden",
  "leadMagnet": "hidden",
  "favorites": "live",
  "account": "hidden"
}
```

Valori ammessi: `live`, `waitlist`, `hidden`. Il valore predefinito per superfici non approvate è `hidden`.

### Pubblicabilità editoriale

Un `ContentItem` è pubblico solo quando `getContentReadinessIssues(item)` restituisce un array vuoto. La validazione richiede:

```ts
type ContentReadinessIssue =
  | 'placeholder'
  | 'invalid-permalink'
  | 'missing-cover'
  | 'missing-hook'
  | 'missing-title'
  | 'missing-description'
  | 'missing-place'
  | 'missing-type'
  | 'missing-partnership';
```

Le coordinate restano opzionali e controllano soltanto la presenza in mappa.

### Dati approvati

Metriche, proof, risorse e lead magnet usano record con questo contratto:

```ts
interface ApprovalMetadata {
  status: 'draft' | 'approved' | 'rejected';
  approvedBy?: 'Rodrigo' | 'Betta' | 'Rodrigo & Betta';
  approvedAt?: string;
  sourceUrl?: string;
  observedAt?: string;
}
```

Il codice pubblico accetta solo `status === 'approved'`. Gli script di audit falliscono se un record approvato non contiene `approvedBy` e `approvedAt` ISO.

### Eventi analytics

I quattro piani convergono su questi nomi:

```ts
type EcosystemEventName =
  | 'bio_hub_view'
  | 'bio_hub_path_click'
  | 'content_item_view'
  | 'content_item_to_map'
  | 'content_item_to_related'
  | 'reel_play'
  | 'reel_to_owned_content'
  | 'newsletter_signup'
  | 'lead_magnet_download'
  | 'affiliate_outbound_click'
  | 'media_kit_view'
  | 'media_kit_submit'
  | 'partner_lead_submit';
```

Parametri condivisi: `source`, `content_id`, `cta_id`, `partner_kind`, `route`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`.

## Gate di ingresso

- [ ] **Step 1: Fotografare lo stato Git senza modificarlo**

Run:

```powershell
git status --short
git diff --name-only
git diff --cached --name-only
```

Expected: inventario completo delle modifiche preesistenti; nessun comando mutante.

- [ ] **Step 2: Verificare la baseline tecnica**

Run:

```powershell
npm run typecheck
npm run lint
npm run test:unit
npm run build
```

Expected: ogni comando termina con exit code `0`. Se un comando fallisce, registrare il difetto come baseline e non attribuirlo al piano.

- [ ] **Step 3: Stabilire l'ambiente di esecuzione**

Se le modifiche preesistenti sono state salvate in commit dall'owner, usare `superpowers:using-git-worktrees` e creare un worktree dedicato. Se restano non committate e sono necessarie al sito corrente, lavorare nel workspace attuale con staging per percorso esatto. Non eseguire `git add -A`, `git stash`, `git reset` o checkout distruttivi.

## Gate tra le fasi

### Dopo la fase 1

```powershell
npm run test:unit -- src/config/publicSurfaces.test.ts src/components/Navbar.test.tsx src/components/home/atlante/AtlanteHome.test.tsx
npm run typecheck
npm run lint
npm run build
npx playwright test e2e/home.spec.ts
```

### Prima della fase 2 pubblica

```powershell
npm run content:approval
npm run content:audit
```

Expected: almeno dieci record approvati e zero errori di pubblicabilità per i record approvati.

### Prima della fase 3 live

```powershell
npm run lead-magnet:audit
npm run generate:lead-magnet
npm run test:unit -- src/components/Newsletter.test.tsx src/pages/VieniConNoi.test.tsx
```

Expected: dieci luoghi approvati, PDF generato, nessuna promessa di consegna simulata.

### Prima della fase 4 live

```powershell
npm run business-data:audit
npm run audit:stripe
npm run audit:firebase
npm run audit:env
```

Expected: solo metriche, proof e offerte approvate; nessun segreto letto o stampato.

## Gate finale

```powershell
npm run typecheck
npm run lint
npm run test
npm run build
npm run audit:ui
npm run audit:firebase
npm run audit:stripe
npm run audit:revenue
npm run audit:agents
npm run audit:obsidian
npm run audit:visual
npm run audit:size
npx playwright test
```

In aggiunta:

- matrice responsive 320/375/768/1024/1440;
- navigazione completa da tastiera;
- console browser senza errori applicativi;
- nessun contenuto demo indicizzabile;
- sitemap composta solo da superfici e contenuti pubblicabili;
- nessun numero non approvato nel sito, nelle email o nel media kit;
- nessun link affiliate scaduto o non dichiarato;
- dominio, deploy e bio restano esclusi finché l'owner non li autorizza esplicitamente.

## Criterio di completamento del programma

Il programma è completo quando le quattro fasi sono verdi, i gate dati sono firmati, il predeploy non presenta errori e Rodrigo approva separatamente il rilascio. Fino a quel momento il risultato è un candidato locale verificato, non una release pubblica.
