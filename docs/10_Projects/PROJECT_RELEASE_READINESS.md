---
type: project
area: delivery
status: open
priority: p1
owner: team
repo: TRAVELLINIWITHUS
related: '[[10_Projects/PROJECT_TRAVELLINIWITHUS_SITE]]'
source: release preparation
tags:
  - project
  - delivery
  - release
---

# PROJECT_RELEASE_READINESS

## Obiettivo

Tenere sotto controllo cio che manca per una release pulita e verificabile della V1.

## Checklist

- [ ] verificare home e hero
- [ ] verificare destinazioni
- [ ] verificare navbar e navigazione
- [ ] verificare contenuti, funnel e shop
- [ ] verificare build e smoke test

## Snapshot fase A

- [x] consent banner predisposto con categorie necessarie, analytics e marketing
- [x] loader analytics e pixel gated da consenso + env
- [x] preview admin limitata a build dev locale
- [x] wrapper email con no-op sicuro se `RESEND_API_KEY` manca
- [x] media kit PDF generato nel build e verificato in predeploy
- [x] newsletter Brevo allineata a `BREVO_LIST_ID` con fallback save-lead-only
- [ ] verificare roundtrip reale lead -> Firestore in ambiente locale
- [ ] eseguire release QA completa dopo il prossimo blocco di UI/editorial rebuild

## Snapshot fase B parziale

- [x] `Collaborazioni` riposizionata come pagina business-ready e piu selettiva
- [x] `Media Kit` riposizionato come accesso qualificato al funnel B2B
- [x] `Home` resa piu leggibile nei tre percorsi principali: scoperta, strumenti, collaborazioni
- [x] `Chi Siamo` spostata verso metodo, fiducia e criteri editoriali
- [x] `siteContent` normalizzato con default CMS coerenti e senza copy legacy/encoding rotto nelle sezioni gestite
- [x] tassonomia esperienze normalizzata in ASCII coerente tra config e pagine pubbliche
- [x] `Destinazioni` rifinita come archivio discovery/SEO con filtri piu utili e JSON-LD `CollectionPage`
- [x] `Esperienze` rifinita come tassonomia editoriale per intenzione di viaggio con JSON-LD `CollectionPage`
- [x] sistema sezioni condivise V1.1: newsletter unica con varianti, CTA finale condivisa, notice per preview controllate
- [x] `Guide` rifinita come biblioteca pratica con preview controllate e collegamenti discovery coerenti
- [x] `Articolo` rifinito come template editoriale piu pulito: hero, in breve, info pratiche, itinerario, mappa, consigli, risorse e noindex sulle preview
- [x] `Risorse` riposizionata come toolkit editoriale con affiliazioni dichiarate e logica "quando usarlo / quando evitarlo"
- [x] `Shop` riposizionato come boutique editoriale; demo non acquistabile e noindex finche catalogo reale non e pronto
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `npm run audit:ui`
- [x] `npm run predeploy`
- [x] smoke test browser delle CTA principali su `/`, `/collaborazioni`, `/media-kit`, `/chi-siamo`
- [x] verifica desktop/mobile delle quattro superfici aggiornate con Playwright
- [x] fix mobile `Chi Siamo`: testo e H1 riportati sopra l'immagine nella prima schermata
- [x] rimosso preload globale di `hero-adventure.jpg` per evitare warning su pagine interne
- [ ] revisione umana finale degli screenshot prima del deploy pubblico

## Snapshot V1.1 editoriale/commerciale

- Componenti condivisi introdotti per evitare formati diversi sulle stesse sezioni: `Newsletter`, `FinalCtaSection`, `DemoContentNotice`.
- I contenuti mancanti vengono trattati come preview controllate, non come prova reale o case study pubblicabile.
- `Guide` ora mostra una struttura da biblioteca pratica, con filtri sobri, cards editoriali e newsletter condivisa.
- `Articolo` non usa piu un lungo fallback hardcoded con placeholder evidenti; il contenuto demo e centralizzato e marcato come noindex.
- `Risorse` e `Shop` sono piu coerenti con fiducia e monetizzazione sobria: meno sconto, piu contesto e utilita.
- Restano da fare prima del deploy: contenuti reali, foto reali, verifica roundtrip Firestore lead, controllo screenshot umano e sostituzione/approvazione delle preview.

## Link

- [[DEPLOYMENT_RUNBOOK]]
- [[LAUNCH_CHECKLIST]]
- [[OPERATIONAL_VERIFICATION_REPORT]]
- [[90_Templates/TPL_Release_Note]]
