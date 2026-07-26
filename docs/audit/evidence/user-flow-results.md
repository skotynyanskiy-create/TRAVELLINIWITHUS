---
title: 'Evidenza — flussi utente'
type: report
status: active
area: quality
created: 2026-07-23
tags:
  - audit
  - travelliniwithus
---

# End-to-End User Flow Audit — TRAVELLINIWITHUS

## 1. Verified User Flows Log

### 1.1. Editorial & Navigation Flow

- **Path**: Homepage (`/`) → Destinazioni (`/destinazione`) → Toscana (`/destinazione/toscana`) → Articolo (`/articolo/dolomiti-rifugi-design`).
- **Result**: **PASS** `[BROWSER]`. Seamless route transitions via React Router. Breadcrumbs update dynamically.

### 1.2. Lead Generation & Acquisition Flow

- **Path**: Direct HTTP GET on `/guida-in-regalo` vs `/vieni-con-noi`.
- **Result**: **PASS** `[RUNTIME, PLAYWRIGHT]` (fix 2026-07-23). GET `/guida-in-regalo` → HTTP 200 + H1 visibile + canonical coerente. GET `/vieni-con-noi` → HTTP 404 senza redirect (gestione Not Found standard). Form client-side validation OK.

### 1.3. E-Commerce & Mock Checkout Flow

- **Path**: Shop (`/shop`) → Product Detail (`/shop/guida-premium-dolomiti`) → Add to Cart → Cart Drawer (`CartDrawer.tsx`).
- **Result**: **PASS** `[BROWSER, NETWORK]`. Products add cleanly to React state. Cart drawer payload sends only `id` and `quantity` to `/api/create-checkout-session`. Pre-rendering and prices are enforced server-side.

### 1.4. Favorites & Client State Persistence Flow

- **Path**: Click favorite heart icon on any place card → Open Favorites drawer (`Preferiti.tsx`).
- **Result**: **PASS** `[BROWSER]`. Items persist in `localStorage` under `tw:favorites`.

### 1.5. Contact Form Anti-Spam Flow

- **Path**: `POST /api/contact-lead` (the endpoint behind the `/contatti` form) repeatedly from the same IP.
- **Result**: **PASS** `[PLAYWRIGHT, RUNTIME]` (verified 2026-07-23). `contactLimiter` allows 5 requests per IP per 10 minutes; the 6th returns **HTTP 429** with the limiter message, before the handler — so no Firestore write and no email. Invalid requests consume the budget too. Evidence: `e2e/contact-rate-limit.spec.ts`, 6/6 passing.
- **Client behaviour**: a 429 now surfaces as an error on the form instead of a false success screen — see `[AUDIT-006]` in `COMPLETE_AUDIT.md`. `[BROWSER, RUNTIME]`

### 1.6. Protected Admin Access Control Flow

- **Path**: Direct navigation to `/admin`, `/admin/editor`, `/admin/product-editor`.
- **Result**: **PASS** `[BROWSER]`. `ProtectedRoute.tsx` inspects Firebase Auth context and denies unauthenticated access to administrative tools.
