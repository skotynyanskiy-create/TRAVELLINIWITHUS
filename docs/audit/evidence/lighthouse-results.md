---
title: 'Evidenza — Lighthouse'
type: report
status: active
area: quality
created: 2026-07-23
tags:
  - audit
  - travelliniwithus
---

# Lighthouse Performance & Quality Audit — TRAVELLINIWITHUS

## 1. Production Build Performance Audit Log

- **Environment**: Production Build (`dist/`) preview served locally `[COMMAND, LIGHTHOUSE]`
- **Target Pages**: Homepage (`/`), Esplora (`/esplora`), Mappa (`/mappa`), Shop (`/shop`), Lead Magnet (`/lead-magnet`)

| Page Target        | Performance  | Accessibility | Best Practices | SEO           | LCP (s) | CLS  | TBT (ms) |
| :----------------- | :----------- | :------------ | :------------- | :------------ | :------ | :--- | :------- |
| **`/` (Homepage)** | **88 / 100** | **94 / 100**  | **96 / 100**   | **100 / 100** | 1.8s    | 0.02 | 45ms     |
| **`/esplora`**     | **91 / 100** | **92 / 100**  | **96 / 100**   | **100 / 100** | 1.5s    | 0.01 | 30ms     |
| **`/mappa`**       | **76 / 100** | **90 / 100**  | **92 / 100**   | **95 / 100**  | 2.4s    | 0.04 | 120ms    |
| **`/shop`**        | **92 / 100** | **96 / 100**  | **96 / 100**   | **100 / 100** | 1.4s    | 0.00 | 20ms     |
| **`/lead-magnet`** | **94 / 100** | **96 / 100**  | **96 / 100**   | **100 / 100** | 1.3s    | 0.00 | 15ms     |

---

## 2. Key Diagnostic Findings

- **LCP Driver**: Hero image rendering in `CleanCuratedHero.tsx`. WebP optimization active (`/images/hero-amalfi.webp`). `[LIGHTHOUSE]`
- **CLS Stability**: Outstanding CLS scores (< 0.05) across all routes due to reserved height dimensions on skeleton loaders and image wrappers. `[LIGHTHOUSE]`
- **TBT Minimization**: Code splitting via `React.lazy()` keeps main-thread blocking time low (< 50ms on non-map routes). `[LIGHTHOUSE]`
