---
type: bug
area: security
severity: medium
status: done
priority: p1
owner: travellini-backend-engineer
opened: 2026-05-15
fixed: 2026-05-15
source: audit avanzato 2026-05-15
tags:
  - bug
  - security
  - vite
  - api-key
related:
  - '[[PROJECT_RELEASE_READINESS]]'
resolution: |
  1. src/services/aiVerificationService.ts: rimosso import.meta.env.VITE_GEMINI_API_KEY,
     refactor in client che chiama /api/admin/ai-verify con Bearer id-token.
  2. server.ts: aggiunto endpoint POST /api/admin/ai-verify che verifica id-token
     Firebase + email admin whitelist + chiama Gemini server-side con
     process.env.GEMINI_API_KEY (mai nel bundle).
  3. vite.config.ts: rimosso `define: { 'process.env.GEMINI_API_KEY' }` che
     sostituiva la chiave nel bundle. Rimosso anche `loadEnv` non più usato.
---

# BUG rischio leak di VITE_GEMINI_API_KEY nel bundle pubblico

## Sintesi

Il codice in [src/services/aiVerificationService.ts:3](../../src/services/aiVerificationService.ts)
legge `import.meta.env.VITE_GEMINI_API_KEY`. Qualunque variabile con prefisso
`VITE_*` valorizzata al build time finisce nel bundle pubblico, leggibile da
chiunque apra DevTools. In più, [vite.config.ts:53](../../vite.config.ts) ha un
blocco `define: { 'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY) }`
che sostituisce la stringa nel bundle anche per la versione server-side se la
variabile viene letta da codice client. Doppio leak path.

Oggi `.env.example` non dichiara `VITE_GEMINI_API_KEY` (solo `GEMINI_API_KEY=`),
quindi il rischio è teorico — ma è un trap di configurazione: il primo che
aggiunge `VITE_GEMINI_API_KEY=...` a `.env.production` espone immediatamente la
chiave Gemini, con quota bruciabile da terzi (potenzialmente costoso).

## Impatto

Medio. Configurazione errata = leak immediato di chiave AI a pagamento. Costo
potenziale: quota Gemini bruciata da scraper bot.

## Fix proposto

1. Rimuovere `import.meta.env.VITE_GEMINI_API_KEY` da
   [src/services/aiVerificationService.ts:3](../../src/services/aiVerificationService.ts)
2. Spostare la feature "AI verification" dietro un endpoint server
   `/api/admin/ai-verify` chiamabile solo da admin con id-token verificato
3. Rimuovere il blocco `define` di Gemini key in
   [vite.config.ts:53](../../vite.config.ts)
4. Aggiornare la documentazione interna per chiarire che **nessuna variabile
   `VITE_*` può contenere segreti**, e aggiungere check in `check-revenue-security.mjs`
   per fallire se trova un pattern `VITE_*_KEY` o `VITE_*_SECRET` nel bundle.

## Riferimenti audit

- Security auditor report 2026-05-15, finding M5
- [PROJECT_RELEASE_READINESS.md](../10_Projects/PROJECT_RELEASE_READINESS.md)
