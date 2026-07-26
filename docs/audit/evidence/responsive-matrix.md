---
title: 'Evidenza — matrice responsive'
type: report
status: active
area: quality
created: 2026-07-23
tags:
  - audit
  - travelliniwithus
---

# Responsive & Viewport Matrix Audit — TRAVELLINIWITHUS

## 1. Viewports & Devices Inspection (13 Breakpoints)

| Viewport (W × H) | Emulated Profile     | Layout Behavior Observed                  | Sticky / Fixed Components                  | Overflow Check                     | Touch Target (>48px)            |
| :--------------- | :------------------- | :---------------------------------------- | :----------------------------------------- | :--------------------------------- | :------------------------------ |
| **320 × 568**    | iPhone SE (1st Gen)  | Single column layout, text wraps cleanly. | Header sticky, MobileBottomBar fixed.      | `scrollWidth === clientWidth` PASS | Minimum target pass `[BROWSER]` |
| **360 × 800**    | Galaxy S20 / Android | Cards stack vertically, padding 1rem.     | MobileBottomBar active.                    | PASS `[BROWSER]`                   | PASS `[BROWSER]`                |
| **375 × 812**    | iPhone 13 Mini / X   | Drawer menu occupies 100% width.          | Header sticky.                             | PASS `[BROWSER]`                   | PASS `[BROWSER]`                |
| **390 × 844**    | iPhone 13 Pro / 14   | Hero title scales nicely (`text-3xl`).    | Bottom bar active.                         | PASS `[BROWSER]`                   | PASS `[BROWSER]`                |
| **412 × 915**    | Pixel 6 / Android    | Clean grid layout.                        | Bottom bar active.                         | PASS `[BROWSER]`                   | PASS `[BROWSER]`                |
| **768 × 1024**   | iPad Portrait        | 2-column card grid in `/esplora`.         | MobileBottomBar hidden, Header nav active. | PASS `[BROWSER]`                   | PASS `[BROWSER]`                |
| **820 × 1180**   | iPad Air             | Clean 2-column grid.                      | Header nav active.                         | PASS `[BROWSER]`                   | PASS `[BROWSER]`                |
| **1024 × 768**   | iPad Landscape       | 3-column card grid in `/shop`.            | Desktop Header active.                     | PASS `[BROWSER]`                   | PASS `[BROWSER]`                |
| **1280 × 720**   | HD Laptop            | Sidebar visible on `/articolo/:slug`.     | Header desktop sticky.                     | PASS `[BROWSER]`                   | PASS `[BROWSER]`                |
| **1366 × 768**   | Standard Laptop      | Grid centered inside `max-w-7xl`.         | Desktop navigation.                        | PASS `[BROWSER]`                   | PASS `[BROWSER]`                |
| **1440 × 900**   | MacBook Pro 15       | Hero container centered, full contrast.   | Desktop navigation.                        | PASS `[BROWSER]`                   | PASS `[BROWSER]`                |
| **1920 × 1080**  | Full HD Desktop      | Max container width constraint active.    | Desktop navigation.                        | PASS `[BROWSER]`                   | PASS `[BROWSER]`                |
| **2560 × 1440**  | QHD Monitor          | Sand background fills margins gracefully. | Desktop navigation.                        | PASS `[BROWSER]`                   | PASS `[BROWSER]`                |
