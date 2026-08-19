---
type: bug
area: ux-accessibility
status: resolved-local
priority: p1
owner: team
severity: high
repo: TRAVELLINIWITHUS
route: globale, /esplora
repo_path: src/hooks/useFocusTrap.ts, src/hooks/useOverlayLayer.ts, src/components/SearchModal.tsx, src/components/QuickViewDrawer.tsx, src/components/ExitIntentPopup.tsx, src/components/Navbar.tsx, src/pages/Esplora.tsx
related: '[[10_Projects/PROJECT_HOME_RICOMPOSIZIONE_2026-07-26]], [[30_Design/UI_UX_AUDIT_2026-08-02]]'
source: audit UX 2026-08-02
tags:
  - bug
  - accessibility
  - focus
  - error-state
---

# BUG_2026-08-02_overlay_focus_and_discovery_errors

## Sintomo

Gli overlay non trattenevano il focus da tastiera e non ripristinavano
coerentemente il controllo di origine alla chiusura. In Ricerca e Esplora un
errore di caricamento remoto poteva non dare una spiegazione o una via di
recupero esplicita.

## Impatto

Una persona che usa tastiera o lettore di schermo poteva tabulare dietro un
overlay oppure perdere il punto di ripartenza. Un errore della sorgente dati
poteva sembrare un archivio vuoto o parzialmente aggiornato.

## Riproduzione

1. Aprire Ricerca, l'anteprima rapida, il popup di uscita o il menu mobile.
2. Premere Tab e Maiusc+Tab fino ai limiti del dialogo, quindi chiuderlo con
   Esc.
3. Simulare il fallimento della richiesta dell'archivio in Ricerca o Esplora.

## Fix

- Hook condiviso `useFocusTrap` per intrappolare Tab e ripristinare il focus.
- Stack `useOverlayLayer`: solo il dialogo più in alto riceve la tastiera e lo
  scroll resta bloccato finché non si chiude l'ultimo overlay.
- Semantica `dialog` del menu mobile attiva solo quando il pannello e aperto.
- Fallback di Ricerca per le pagine locali, avviso `role=alert` e azione
  **Riprova** che riavvia la richiesta a ogni riapertura o tentativo.
- Avviso e retry in Esplora, con skeleton annunciati come stato di
  caricamento e stato esplicito durante il nuovo tentativo.
- Il popup di uscita non può aprirsi sopra un dialogo già presente (compreso
  il consenso cookie).

## Test

- Browser: ricerca desktop, Tab/Maiusc+Tab, Esc e ritorno del focus: PASS.
- Browser mobile: menu, ricerca dal menu, Esc e chiusura coerente: PASS.
- Browser: dopo gli 8 secondi di exit intent, un dialogo cookie aperto blocca
  il popup di uscita: PASS.
- Test unitario dello stack overlay (ordine, scroll lock, dialogo già aperto):
  PASS (2 test).
- Test componente Ricerca (fallback locale, chiusura e riapertura, retry):
  PASS (2 test).
- Suite unitaria completa: PASS (32 file, 162 test).
- Typecheck, lint mirato e controllo whitespace Git: PASS.
- La simulazione Firestore offline mantiene il contenuto locale: comportamento
  atteso. Firestore risolve dalla cache e non espone artificialmente lo stato
  di errore dell'app.

## Root cause

Ogni overlay gestiva separatamente una parte dell'interazione (o solo Esc),
senza una politica condivisa per focus e scroll. Le query discovery assumevano
che la risposta remota fosse sempre disponibile.
