---
type: bug
area: privacy-ux
status: resolved-local
priority: p1
owner: team
severity: high
repo: TRAVELLINIWITHUS
route: globale
repo_path: src/lib/consent.ts, src/context/AudienceContext.tsx, src/components/InterestPicker.tsx
related: '[[10_Projects/PROJECT_HOME_RICOMPOSIZIONE_2026-07-26]]'
source: audit implementazione personalizzazione 2026-08-02
tags:
  - bug
  - privacy
  - consent
  - personalization
---

# BUG_2026-08-02_personalization_consent_storage

## Sintomo

L'interesse scelto nel pannello **Cosa cerchi oggi?** poteva essere scritto in
`localStorage` anche senza il consenso alla personalizzazione. La UI suggeriva
inoltre che la scelta fosse sempre ricordata.

## Impatto

Una preferenza usata per ordinare contenuti poteva sopravvivere alla sessione
senza opt-in esplicito. I dati locali precedenti non avevano una rimozione
centralizzata al cambio di consenso.

## Fix

- Il profilo interessi e leggibile e scrivibile solo con consenso
  **Personalizzazione**; senza consenso resta nello stato di sessione.
- L'etichetta del selettore chiarisce se la scelta e ricordata o valida solo
  per la sessione.
- Il cambio di consenso svuota interesse, segnali di comportamento e
  cronologia di lettura; cosi dati legacy o revocati non vengono riutilizzati.

## Test

- Test unitario: pulizia dello storage senza consenso, all'opt-in e alla
  revoca: PASS.
- Test `AudienceProvider`: scelta temporanea, persistenza dopo opt-in e
  azzeramento alla revoca: PASS.
- Browser `/collaborazioni`: etichetta sessione senza consenso; dopo opt-in,
  etichetta ricordata e profilo locale creato: PASS.

## Root cause

Il gate del consenso era gia applicato a segnali e cronologia, ma non al
profilo di interessi esplicito nell'`AudienceContext`. La politica di rimozione
era quindi incompleta e distribuita.
