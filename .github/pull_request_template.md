<!--
Grazie per il contributo a Travelliniwithus.
Compila tutte le sezioni. Mantieni il PR focalizzato: un tema per PR.
Riferimenti: CLAUDE.md · AGENTS.md · DESIGN.md
-->

## Sommario

<!-- 1-3 bullet su cosa cambia e perché. Niente "what" generico, serve il "why". -->

-
-

## Tipo di cambiamento

- [ ] `feat` nuova funzionalità
- [ ] `fix` bug
- [ ] `chore` manutenzione / config / infra
- [ ] `docs` documentazione
- [ ] `refactor` nessun cambio di comportamento
- [ ] `perf` performance
- [ ] `test` test
- [ ] `style` formattazione / lint

## Area impattata

- [ ] Homepage / hero / navbar
- [ ] Destinazioni / articoli / guide
- [ ] Shop / Stripe / checkout
- [ ] Admin / Firestore rules
- [ ] SEO / sitemap / structured data
- [ ] UI system / CSS vars / componenti
- [ ] Infrastruttura / CI / tooling

## Test plan

<!-- Checklist con come verificare la PR. -->

- [ ] `npm run typecheck` passa
- [ ] `npm run lint` senza warning
- [ ] `npm run test` verde
- [ ] `npm run build` ok
- [ ] `npm run audit:ui` passa
- [ ] Testato manualmente in browser (indicare route + device)
- [ ] Se UI: screenshot o nota su `audit:visual`
- [ ] Se Firestore: `npm run audit:firebase` passa
- [ ] Se Stripe: `npm run audit:stripe` passa

## Docs e knowledge base

- [ ] Nota `docs/` aggiornata (quale?)
- [ ] `CHANGELOG.md` aggiornato (se user-visible)
- [ ] Nessun aggiornamento docs richiesto

## File high-risk toccati?

<!-- server.ts · firestore.rules · src/config/admin.ts · .github/workflows/*
Se sì, motiva qui e richiedi review dedicata. -->

- [ ] Nessun file high-risk toccato
- [ ] Sì: _______ (motivazione: _______)

## Screenshot / evidenza (se UI)

<!-- Prima / Dopo, desktop + mobile. Drag & drop. -->

## Note per il reviewer

<!-- Trade-off, alternative considerate, follow-up previsti. -->
