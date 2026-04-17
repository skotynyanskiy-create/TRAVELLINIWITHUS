---
name: smoke-test
description: Quick browser smoke test after code changes. Checks homepage loads, nav works, main CTA visible, no console errors.
agent: browser-auditor
---

# /smoke-test

Verifica rapida nel browser dopo modifiche: $ARGUMENTS

## Checklist

1. Homepage carica senza errori
2. Navbar visibile e funzionante
3. Hero / above-the-fold integro
4. CTA principale visibile
5. Footer presente
6. Nessun errore console critico
7. Mobile: nessun overflow orizzontale

## Output

Pass / Fail per ogni check. Se fail: route, problema, fix consigliato.
Tieni il report breve — è una smoke, non un audit completo.
