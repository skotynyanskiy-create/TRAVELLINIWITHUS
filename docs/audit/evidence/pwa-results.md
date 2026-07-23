---
title: 'Evidenza — PWA'
type: report
status: active
area: quality
created: 2026-07-23
tags:
  - audit
  - travelliniwithus
---

# Progressive Web App (PWA) & Offline Audit — TRAVELLINIWITHUS

## 1. Service Worker & Precache Verification

- **Service Worker File**: `dist/sw.js` generated via `vite-plugin-pwa` (Workbox v7.4.0). `[COMMAND, FILE]`
- **Precached Entries**: **97 static assets precached** (total ~2.95 MB precache bundle). `[COMMAND]`
- **Offline Navigation**: Static Shell, icons, and CSS variables remain cached and renderable when offline. `[BROWSER]`
- **Cache Busting Strategy**: Content hash appended to compiled bundle filenames (e.g. `index-CFAqE7Qg.js`). `[COMMAND]`
