---
title: 'Evidenza — consenso e rete'
type: report
status: active
area: quality
created: 2026-07-23
tags:
  - audit
  - travelliniwithus
---

# Technical Consent & Network Audit — TRAVELLINIWITHUS

## 1. Cookie & Analytics Consent Verification

- **Pre-Consent Network State**: Zero third-party tracking scripts or marketing cookies are dispatched before explicit user interaction. `[HAR, NETWORK]`
- **Consent Storage Key**: `tw:consent` in `localStorage`. `[FILE: src/lib/consent.ts]`
- **Default Preference State**: `{ necessary: true, analytics: false, marketing: false, timestamp: 0 }`. `[FILE, BROWSER]`
- **Acceptance Action (`acceptAll`)**: Sets `analytics: true`, `marketing: true` and dispatches `tw:consent-changed` custom event. `[BROWSER]`
- **Rejection Action (`rejectAll`)**: Maintains `analytics: false`, `marketing: false` and closes the banner gracefully without network leaks. `[BROWSER]`
- **Accessibility**: Banner rendered with `role="dialog"`, `aria-live="polite"`, and `aria-label="Informativa cookie"`. `[A11Y]`
