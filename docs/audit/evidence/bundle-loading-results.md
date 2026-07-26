---
title: 'Evidenza — caricamento bundle'
type: report
status: active
area: quality
created: 2026-07-23
tags:
  - audit
  - travelliniwithus
---

# Bundle Composition & Lazy Loading Evidence — TRAVELLINIWITHUS

## 1. Verified Asset Chunk Distribution

- **Three.js Chunk (`three-DXTjPyq9.js`)**: **960.53 kB** (gzip: 257.01 kB) `[COMMAND]`
  - _Evidence_: Imported strictly inside `src/experience/controluce/ControluceCanvas.tsx` for `/manifesto`. **NOT requested on `/` (Homepage)**. Verified via Playwright network traces. `[PLAYWRIGHT, NETWORK]`
- **MapLibre GL Chunk (`maplibre-gl-DTuk6AhN.js`)**: **1,055.60 kB** (gzip: 285.30 kB) `[COMMAND]`
  - _Evidence_: Loaded lazily via `React.lazy()` when `/mappa` or the map section enters viewport. `[PLAYWRIGHT, NETWORK]`
- **Firebase Core (`firebase-core-2khhyNbx.js`)**: **99.36 kB** (gzip: 30.58 kB) `[COMMAND]`
  - _Evidence_: Initialized dynamically when accessing authenticated routes (`/admin`) or Firestore services. `[PLAYWRIGHT, NETWORK]`
- **Admin Module Chunks (`AdminDashboard-IVwf0jQI.js`, `ArticleEditor-ubmqBcwU.js`)**: **44.29 kB** & **14.65 kB** `[COMMAND]`
  - _Evidence_: Isolated inside `/admin` sub-router; public visitors never download admin editor bundles. `[PLAYWRIGHT, NETWORK]`
