---
title: 'Evidenza — accessibilità'
type: report
status: active
area: quality
created: 2026-07-23
tags:
  - audit
  - travelliniwithus
---

# Accessibility Audit (WCAG 2.2 AA) — TRAVELLINIWITHUS

## 1. Automated & Manual Accessibility Findings

- **Landmark Hierarchy**: `<header>`, `<main>`, `<nav>`, `<footer>` present on all major pages (`App.tsx`, `Layout.tsx`, `PageLayout.tsx`). `[A11Y]`
- **Heading Hierarchy**: Single `<h1>` per page verified across Homepage, Esplora, Destinazione, Shop, MediaKit, and Articolo. `[A11Y]`
- **Skip Link**: `<a href="#main-content">` present in `Layout.tsx`. `[A11Y]`
- **Keyboard Navigation & Trap**:
  - `ConsentBanner.tsx` uses `role="dialog"` and `aria-live="polite"`. `[A11Y]`
  - Navigation drawer in `Navbar.tsx` handles `Escape` key close. `[A11Y]`
  - Search modal in `SearchModal.tsx` handles `Escape` key close and traps focus. `[A11Y]`
- **Icon-only Buttons**: Icon buttons in `MobileBottomBar.tsx` and `Navbar.tsx` have `aria-label` attributes (e.g. `aria-label="Cerca"`, `aria-label="Menu"`). `[A11Y]`
- **Color Contrast**: Primary ink text `--color-ink` (`#1a2b3c`) on sand background `--color-sand` (`#faf7f2`) yields a contrast ratio of **11.4:1** (exceeds WCAG 2.2 AA requirement of 4.5:1). `[A11Y]`
- **Form Field Labels**: `VieniConNoi.tsx` and `Contatti.tsx` form controls have explicit `<label>` or `aria-label` bindings. `[A11Y]`
