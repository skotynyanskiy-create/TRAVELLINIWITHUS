# TravelliniWithUs — Design System

> **Version**: 1.0  
> **Last Updated**: June 2026  
> **Brand**: TravelliniWithUs — Rodrigo & Betta  
> **Framework**: Next.js 15 · Tailwind CSS v4 · Framer Motion

---

## Table of Contents

1. [Design Principles](#-design-principles)
2. [Color Palette](#-color-palette)
3. [Typography](#-typography)
4. [Spacing Scale](#-spacing-scale)
5. [Border Radius](#-border-radius)
6. [Shadow System](#-shadow-system)
7. [Components](#-components)
8. [Section Patterns](#-section-patterns)
9. [Animation Reference](#-animation-reference)
10. [Implementation Examples](#-implementation-examples)

---

## 🧭 Design Principles

Every design decision in TravelliniWithUs flows from these five guiding principles:

### 1. Warmth Over Coldness — _Calore_

Always prefer warm tones, soft shadows, and organic shapes. The digital experience should feel like Mediterranean sunlight — inviting and alive. Avoid clinical whites, harsh blues, and cold grays. Even our neutral palette carries warmth.

### 2. Breathe — _Respiro_

Generous whitespace is not wasted space — it's _respiro_ (breathing room). Layouts should feel open and unhurried, like a slow afternoon in an Italian piazza. Never cram content. Let each element have room to exist beautifully.

### 3. Cinematic — _Cinematografico_

Think of every page as a frame in a film. Full-bleed hero images, dramatic gradient overlays, editorial typography, and intentional composition. We don't display photos — we create visual stories.

### 4. Authentic — _Autentico_

Real textures, genuine photography, and imperfect beauty. We celebrate the cracked wall of an ancient _borgo_, the asymmetry of a hand-thrown ceramic plate, the unposed laughter at a dinner table. Perfection is not the goal — truth is.

### 5. Progressive Disclosure — _Scoperta Graduale_

Reveal content as the user scrolls, creating a sense of discovery. Never overwhelm with everything at once. Each scroll should unveil something new, like turning a corner in a narrow Italian street and finding an unexpected piazza.

---

## 🎨 Color Palette

### Primary Colors

| Name                  | Swatch | HEX       | HSL            | Usage                                 |
| --------------------- | ------ | --------- | -------------- | ------------------------------------- |
| **Terracotta**        | 🟫     | `#C2714F` | `15° 47% 54%`  | CTAs, accents, warmth, brand identity |
| **Terracotta Light**  | 🟫     | `#D4917A` | `15° 47% 65%`  | Hover states, soft accents            |
| **Terracotta Dark**   | 🟫     | `#A85D3F` | `15° 47% 45%`  | Active/pressed states, emphasis       |
| **Beige Crema**       | 🟨     | `#F5F0E8` | `36° 38% 93%`  | Page backgrounds, canvas, sections    |
| **Verde Oliva**       | 🟩     | `#6B7C5E` | `100° 14% 42%` | Nature accents, badges, tags          |
| **Verde Oliva Light** | 🟩     | `#8A9B7D` | `100° 14% 55%` | Hover state for oliva elements        |

### Neutral Colors

| Name              | Swatch | HEX       | Usage                               |
| ----------------- | ------ | --------- | ----------------------------------- |
| **Nero Morbido**  | ⬛     | `#1A1A1A` | Headings, strong contrast, overlays |
| **Grigio Caldo**  | ◼️     | `#2D2A26` | Body text (primary text color)      |
| **Grigio Medio**  | ◾     | `#6B6560` | Secondary text, captions, metadata  |
| **Grigio Chiaro** | ◻️     | `#B8B2AC` | Borders, dividers, disabled states  |
| **Bianco Caldo**  | ⬜     | `#FEFCF9` | Primary background, page canvas     |
| **Bianco Puro**   | ⬜     | `#FFFFFF` | Cards, overlays, elevated surfaces  |

### Semantic Colors

| State       | HEX       | Usage                                                    |
| ----------- | --------- | -------------------------------------------------------- |
| **Success** | `#5E8B5A` | Confirmations, completed states, positive feedback       |
| **Warning** | `#D4A843` | Alerts, caution notices, pending states                  |
| **Error**   | `#C25454` | Error messages, destructive actions, validation failures |
| **Info**    | `#5A7E8B` | Informational notices, tips, neutral alerts              |

### Color Accessibility — Contrast Ratios

| Combination                                      | Ratio  | WCAG AA       |
| ------------------------------------------------ | ------ | ------------- |
| Grigio Caldo `#2D2A26` on Bianco Caldo `#FEFCF9` | 14.2:1 | ✅ Pass       |
| Grigio Medio `#6B6560` on Bianco Caldo `#FEFCF9` | 5.3:1  | ✅ Pass       |
| Terracotta `#C2714F` on Bianco Caldo `#FEFCF9`   | 3.8:1  | ✅ Large text |
| White `#FFFFFF` on Terracotta `#C2714F`          | 3.4:1  | ✅ Large text |
| White `#FFFFFF` on Nero Morbido `#1A1A1A`        | 17.4:1 | ✅ Pass       |

> **Note**: Terracotta on white backgrounds passes for large text (18px+ bold or 24px+ regular) but not for small body text. Use Grigio Caldo for small body text.

### Tailwind CSS v4 — Theme Configuration

```css
/* app/globals.css */
@import 'tailwindcss';

@theme {
  /* Primary */
  --color-terracotta: #c2714f;
  --color-terracotta-light: #d4917a;
  --color-terracotta-dark: #a85d3f;
  --color-crema: #f5f0e8;
  --color-oliva: #6b7c5e;
  --color-oliva-light: #8a9b7d;

  /* Neutrals */
  --color-nero: #1a1a1a;
  --color-grigio-caldo: #2d2a26;
  --color-grigio-medio: #6b6560;
  --color-grigio-chiaro: #b8b2ac;
  --color-bianco: #fefcf9;

  /* Semantic */
  --color-success: #5e8b5a;
  --color-warning: #d4a843;
  --color-error: #c25454;
  --color-info: #5a7e8b;
}
```

---

## ✒️ Typography

### Font Stack

| Role         | Font Family      | Type       | Source                       |
| ------------ | ---------------- | ---------- | ---------------------------- |
| **Headings** | Playfair Display | Serif      | Google Fonts via `next/font` |
| **Body**     | DM Sans          | Sans-serif | Google Fonts via `next/font` |

### Font Loading (Next.js)

```tsx
// app/layout.tsx
import { Playfair_Display, DM_Sans } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export default function RootLayout({ children }) {
  return (
    <html lang="it" className={`${playfair.variable} ${dmSans.variable} font-sans`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

### Heading Scale — Playfair Display

| Level  | Size           | Line Height    | Weight | Letter Spacing | Tailwind Classes                                                              |
| ------ | -------------- | -------------- | ------ | -------------- | ----------------------------------------------------------------------------- |
| **H1** | 56px (3.5rem)  | 64px (4rem)    | 700    | -0.02em        | `font-playfair text-[3.5rem] leading-[4rem] font-bold tracking-[-0.02em]`     |
| **H2** | 40px (2.5rem)  | 48px (3rem)    | 700    | -0.015em       | `font-playfair text-[2.5rem] leading-[3rem] font-bold tracking-[-0.015em]`    |
| **H3** | 32px (2rem)    | 40px (2.5rem)  | 600    | -0.01em        | `font-playfair text-[2rem] leading-[2.5rem] font-semibold tracking-[-0.01em]` |
| **H4** | 24px (1.5rem)  | 32px (2rem)    | 600    | normal         | `font-playfair text-2xl leading-8 font-semibold`                              |
| **H5** | 20px (1.25rem) | 28px (1.75rem) | 600    | normal         | `font-playfair text-xl leading-7 font-semibold`                               |
| **H6** | 16px (1rem)    | 24px (1.5rem)  | 600    | normal         | `font-playfair text-base leading-6 font-semibold`                             |

#### Responsive Heading Scale

Headings scale down on mobile. Apply responsive classes:

```tsx
// H1 responsive
<h1 className="font-playfair text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-[3.5rem] lg:leading-[4rem]">
  Viaggiare è vivere due volte
</h1>

// H2 responsive
<h2 className="font-playfair text-2xl font-bold tracking-tight sm:text-3xl md:text-[2.5rem] md:leading-[3rem]">
  Le nostre destinazioni
</h2>
```

### Body Text Scale — DM Sans

| Style          | Size            | Line Height    | Weight | Usage                                       |
| -------------- | --------------- | -------------- | ------ | ------------------------------------------- |
| **Body Large** | 18px (1.125rem) | 28px (1.75rem) | 400    | Hero subtitles, intro paragraphs, lead text |
| **Body**       | 16px (1rem)     | 24px (1.5rem)  | 400    | Default body text, descriptions             |
| **Body Small** | 14px (0.875rem) | 20px (1.25rem) | 400    | Card descriptions, metadata, secondary info |
| **Caption**    | 12px (0.75rem)  | 16px (1rem)    | 400    | Timestamps, labels, fine print              |
| **Overline**   | 12px (0.75rem)  | 16px (1rem)    | 600    | Section labels, category tags, pre-headings |

### Overline Style

The overline is a signature typographic element used above section headings:

```tsx
<span className="text-xs font-semibold uppercase tracking-[0.1em] text-terracotta">
  Esplora il Mondo con Noi
</span>
```

Properties:

- Font: DM Sans
- Size: 12px
- Weight: 600 (semibold)
- Letter Spacing: 0.1em
- Transform: uppercase
- Color: Terracotta `#C2714F`

---

## 📏 Spacing Scale

Based on a **4px base unit** for consistent rhythm:

| Token      | Value | Tailwind        | Usage                                |
| ---------- | ----- | --------------- | ------------------------------------ |
| `space-1`  | 4px   | `p-1` / `m-1`   | Tight inner spacing, icon gaps       |
| `space-2`  | 8px   | `p-2` / `m-2`   | Inner component padding              |
| `space-3`  | 12px  | `p-3` / `m-3`   | Badge padding, small gaps            |
| `space-4`  | 16px  | `p-4` / `m-4`   | Default component padding            |
| `space-5`  | 20px  | `p-5` / `m-5`   | Card inner padding (mobile)          |
| `space-6`  | 24px  | `p-6` / `m-6`   | Card inner padding (desktop)         |
| `space-8`  | 32px  | `p-8` / `m-8`   | Section horizontal padding (desktop) |
| `space-10` | 40px  | `p-10` / `m-10` | Medium section gap                   |
| `space-12` | 48px  | `p-12` / `m-12` | Large section gap                    |
| `space-16` | 64px  | `p-16` / `m-16` | Section vertical spacing             |
| `space-20` | 80px  | `p-20` / `m-20` | Major section vertical spacing       |
| `space-24` | 96px  | `p-24` / `m-24` | Hero section padding                 |
| `space-32` | 128px | `p-32` / `m-32` | Extra-large vertical spacing         |

### Layout Spacing Patterns

```
Section vertical padding:    py-16 md:py-20 lg:py-24
Section horizontal padding:  px-4 md:px-8
Content max-width:           max-w-7xl mx-auto
Card gap in grids:           gap-6 md:gap-8
Stack gap (vertical):        space-y-4 md:space-y-6
Inline gap (horizontal):     gap-3 md:gap-4
```

---

## 🔲 Border Radius

| Token    | Value  | Tailwind       | Usage                                  |
| -------- | ------ | -------------- | -------------------------------------- |
| **sm**   | 4px    | `rounded-sm`   | Small elements, tags, inline badges    |
| **md**   | 8px    | `rounded-md`   | Buttons, input fields, small cards     |
| **lg**   | 16px   | `rounded-lg`   | Cards, modals, image containers        |
| **xl**   | 24px   | `rounded-xl`   | Large cards, feature sections          |
| **2xl**  | 32px   | `rounded-2xl`  | Hero overlays, prominent containers    |
| **full** | 9999px | `rounded-full` | Avatars, pill badges, circular buttons |

### Radius Guidelines

- **Cards**: Always use `rounded-lg` (16px) for consistency.
- **Buttons**: Use `rounded-lg` for primary/secondary, `rounded-full` for icon buttons.
- **Images within cards**: Match the card's border radius or use `rounded-lg`.
- **Badges**: Use `rounded-full` for pill shapes.
- **Input fields**: Use `rounded-md` (8px).

---

## 🌗 Shadow System

### Elevation Scale

| Token           | Value                                | Usage                                       |
| --------------- | ------------------------------------ | ------------------------------------------- |
| **shadow-sm**   | `0 1px 2px rgba(26, 26, 26, 0.05)`   | Subtle lift — buttons, tags, small elements |
| **shadow-md**   | `0 4px 12px rgba(26, 26, 26, 0.08)`  | Default card elevation, dropdowns           |
| **shadow-lg**   | `0 8px 24px rgba(26, 26, 26, 0.12)`  | Elevated cards, modals, popovers            |
| **shadow-xl**   | `0 16px 48px rgba(26, 26, 26, 0.16)` | Hover states, floating elements, hero cards |
| **shadow-glow** | `0 0 24px rgba(194, 113, 79, 0.2)`   | Terracotta glow — featured elements, CTAs   |

### Shadow in Tailwind CSS v4

```css
@theme {
  --shadow-sm: 0 1px 2px rgba(26, 26, 26, 0.05);
  --shadow-md: 0 4px 12px rgba(26, 26, 26, 0.08);
  --shadow-lg: 0 8px 24px rgba(26, 26, 26, 0.12);
  --shadow-xl: 0 16px 48px rgba(26, 26, 26, 0.16);
  --shadow-glow: 0 0 24px rgba(194, 113, 79, 0.2);
}
```

### Shadow Usage Pattern

Cards should elevate on hover for a tactile, responsive feel:

```tsx
<div className="rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl">
  {/* Card content */}
</div>
```

---

## 🧩 Components

### Button

Four variants, all sharing common base styles.

#### Base Styles (shared)

```
font-sans font-medium text-base leading-6
rounded-lg
transition-all duration-200
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2
disabled:pointer-events-none disabled:opacity-50
```

#### Variants

| Variant       | Styles                                                                                                             | Usage                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| **Primary**   | `bg-terracotta text-white py-3 px-6 hover:bg-terracotta-light active:bg-terracotta-dark shadow-sm hover:shadow-md` | Main CTAs, form submissions, key actions          |
| **Secondary** | `bg-transparent border-2 border-terracotta text-terracotta py-3 px-6 hover:bg-terracotta hover:text-white`         | Alternative actions, secondary CTAs               |
| **Ghost**     | `bg-transparent text-grigio-caldo py-2 px-4 hover:bg-crema`                                                        | Navigation items, subtle actions, toolbar buttons |
| **Link**      | `bg-transparent text-terracotta p-0 hover:underline underline-offset-4`                                            | Inline text links, "Read more" links, breadcrumbs |

#### Button Sizes

| Size             | Padding     | Font Size          |
| ---------------- | ----------- | ------------------ |
| **sm**           | `py-2 px-4` | `text-sm` (14px)   |
| **md** (default) | `py-3 px-6` | `text-base` (16px) |
| **lg**           | `py-4 px-8` | `text-lg` (18px)   |

#### Implementation

```tsx
// components/ui/button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

// Usage
<Button variant="primary" size="lg">Scopri di più</Button>
<Button variant="secondary">Guarda il video</Button>
<Button variant="ghost">Menu</Button>
<Button variant="link">Leggi tutto →</Button>
```

---

### Card — Destination Card

A visually immersive card for showcasing travel destinations. Image-dominant with gradient text overlay.

#### Specifications

| Property          | Mobile                          | Desktop                            |
| ----------------- | ------------------------------- | ---------------------------------- |
| **Aspect Ratio**  | 3:4 (portrait)                  | 4:5 (portrait)                     |
| **Border Radius** | 16px (`rounded-lg`)             | 16px (`rounded-lg`)                |
| **Shadow**        | `shadow-md`                     | `shadow-md` → `shadow-xl` on hover |
| **Image**         | `object-cover`, fills container | Same + zoom on hover               |
| **Hover Scale**   | None (touch devices)            | `scale(1.05)`, 0.6s ease           |
| **Overflow**      | `hidden`                        | `hidden`                           |

#### Structure

```
┌─────────────────────────────┐
│                             │
│     [Background Image]      │
│     cover, subtle zoom      │
│     on hover (1.05)         │
│                             │
│                             │
│  ┌─────────────────────┐    │
│  │ 🟢 Location Badge   │    │  ← Verde Oliva bg, white text, pill
│  │                     │    │
│  │ Destination Title   │    │  ← H4, white, Playfair Display
│  │ Brief description   │    │  ← Body Small, white/80 opacity
│  └─────────────────────┘    │
│  ▓▓▓▓ Gradient Overlay ▓▓▓▓ │  ← Bottom 60%, transparent → rgba(26,26,26,0.7)
└─────────────────────────────┘
```

#### Implementation

```tsx
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface DestinationCardProps {
  title: string;
  location: string;
  description: string;
  image: string;
  href: string;
}

export function DestinationCard({
  title,
  location,
  description,
  image,
  href,
}: DestinationCardProps) {
  return (
    <motion.a
      href={href}
      className="group relative block aspect-[3/4] overflow-hidden rounded-lg shadow-md transition-shadow duration-400 hover:shadow-xl md:aspect-[4/5]"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Background Image */}
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-600 ease-out group-hover:scale-105"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-nero/70 via-nero/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        {/* Location Badge */}
        <span className="mb-3 inline-block rounded-full bg-oliva px-3 py-1 text-xs font-semibold text-white">
          {location}
        </span>

        {/* Title */}
        <h3 className="font-playfair text-2xl font-semibold leading-8 text-white">{title}</h3>

        {/* Description */}
        <p className="mt-2 text-sm leading-5 text-white/80">{description}</p>
      </div>
    </motion.a>
  );
}
```

---

### Card — Blog Card

An editorial card for blog articles with image header and text content.

#### Structure

```
┌─────────────────────────────┐
│                             │
│     [Featured Image]        │  ← Top half, object-cover, rounded-t-lg
│     aspect-video (16:9)     │
│                             │
├─────────────────────────────┤
│                             │
│  📅 Date    🏷️ Category     │  ← Caption style, Grigio Medio
│                             │
│  Article Title              │  ← H5, Grigio Caldo, Playfair
│                             │
│  Brief excerpt text that    │  ← Body Small, Grigio Medio, 2-line clamp
│  previews the content...    │
│                             │
│  Leggi tutto →              │  ← Link button, Terracotta
│                             │
└─────────────────────────────┘
```

#### Specifications

| Property          | Value                              |
| ----------------- | ---------------------------------- |
| Background        | Bianco Puro `#FFFFFF`              |
| Border Radius     | 16px (`rounded-lg`)                |
| Shadow            | `shadow-md` → `shadow-lg` on hover |
| Image Aspect      | 16:9 (`aspect-video`)              |
| Padding (content) | 20px mobile, 24px desktop          |
| Date format       | "15 Giugno 2026" (Italian locale)  |
| Excerpt           | Max 2 lines, `line-clamp-2`        |

#### Implementation

```tsx
interface BlogCardProps {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  href: string;
}

export function BlogCard({ title, excerpt, image, date, category, href }: BlogCardProps) {
  return (
    <article className="group overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg">
      {/* Image */}
      <div className="aspect-video overflow-hidden">
        <Image
          src={image}
          alt={title}
          width={640}
          height={360}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-5 md:p-6">
        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-grigio-medio">
          <time>{date}</time>
          <span className="rounded-full bg-crema px-2 py-0.5 font-medium text-terracotta">
            {category}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-3 font-playfair text-xl font-semibold leading-7 text-grigio-caldo">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="mt-2 line-clamp-2 text-sm leading-5 text-grigio-medio">{excerpt}</p>

        {/* CTA */}
        <a
          href={href}
          className="mt-4 inline-block text-sm font-medium text-terracotta hover:underline underline-offset-4"
        >
          Leggi tutto →
        </a>
      </div>
    </article>
  );
}
```

---

### Card — Offer Card

A horizontal card for travel offers and packages, featuring price and booking CTA.

#### Structure (Desktop)

```
┌─────────────────┬──────────────────────────────┐
│                 │                              │
│   [Image]       │  🏷️ Category Badge           │
│   aspect-square │                              │
│   or 4:3        │  Offer Title                 │
│                 │  Description text...         │
│   object-cover  │                              │
│                 │  💰 da €599      [Prenota →]  │
│                 │     per persona               │
│                 │                              │
└─────────────────┴──────────────────────────────┘
```

#### Specifications

| Property      | Value                                               |
| ------------- | --------------------------------------------------- |
| Layout        | Horizontal (flex-row) on desktop, stacked on mobile |
| Image width   | 40% desktop, full width mobile                      |
| Background    | Bianco Puro `#FFFFFF`                               |
| Border Radius | 16px (`rounded-lg`)                                 |
| Shadow        | `shadow-md` → `shadow-lg` on hover                  |
| Price         | H4 size, Terracotta color, Playfair Display         |
| CTA           | Primary button                                      |

---

### Badge

Small pill-shaped labels for categorization.

| Variant        | Background                                   | Text Color          | Usage                 |
| -------------- | -------------------------------------------- | ------------------- | --------------------- |
| **Terracotta** | `bg-terracotta/10`                           | `text-terracotta`   | Featured, highlighted |
| **Oliva**      | `bg-oliva`                                   | `text-white`        | Location, nature      |
| **Neutral**    | `bg-crema`                                   | `text-grigio-caldo` | Default, category     |
| **Outline**    | `bg-transparent border border-grigio-chiaro` | `text-grigio-medio` | Subtle, secondary     |

```tsx
// Base badge styles
<span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold">
  Badge Text
</span>
```

---

### Section Wrapper

Every major page section uses a consistent wrapper pattern:

```tsx
interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionWrapper({ children, className = '', id }: SectionWrapperProps) {
  return (
    <section id={id} className={`py-16 px-4 md:py-20 md:px-8 lg:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}
```

| Property           | Mobile         | Desktop                          |
| ------------------ | -------------- | -------------------------------- |
| Max Width          | —              | 1280px (`max-w-7xl`)             |
| Horizontal Padding | 16px (`px-4`)  | 32px (`px-8`)                    |
| Vertical Padding   | 64px (`py-16`) | 80px (`py-20`) to 96px (`py-24`) |
| Centering          | `mx-auto`      | `mx-auto`                        |

---

## 📐 Section Patterns

### Section Header

A consistent pattern for introducing sections:

```tsx
// Centered section header
<div className="mx-auto max-w-2xl text-center">
  <span className="text-xs font-semibold uppercase tracking-[0.1em] text-terracotta">
    Le Nostre Destinazioni
  </span>
  <h2 className="mt-3 font-playfair text-3xl font-bold tracking-tight text-nero sm:text-4xl md:text-[2.5rem]">
    Luoghi che toccano l'anima
  </h2>
  <p className="mt-4 text-lg leading-7 text-grigio-medio">
    Ogni destinazione è scelta con il cuore. Scopri i luoghi che hanno trasformato il nostro modo di
    vedere il mondo.
  </p>
</div>
```

### Grid Layouts

```
// 3-column destination grid
<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
  {destinations.map(dest => <DestinationCard key={dest.id} {...dest} />)}
</div>

// 2-column feature layout
<div className="mt-12 grid gap-12 md:grid-cols-2 md:items-center">
  <div>{/* Text content */}</div>
  <div>{/* Image */}</div>
</div>

// 4-column stats/features
<div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
  {features.map(feat => <FeatureCard key={feat.id} {...feat} />)}
</div>
```

---

## 🎬 Animation Reference

### Reveal Animation (Default)

```tsx
const revealVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};
```

### Stagger Container

```tsx
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};
```

### Hover Scale

```tsx
// For cards and interactive elements
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
>
```

### Reduced Motion Support

```tsx
// Always wrap animations with reduced motion check
const prefersReducedMotion = useReducedMotion();

const variants = {
  hidden: {
    opacity: 0,
    y: prefersReducedMotion ? 0 : 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: prefersReducedMotion ? 0 : 0.6,
    },
  },
};
```

---

## 📸 Implementation Examples

### Hero Section — Full Implementation

```tsx
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  const variants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : staggerContainer;

  const childVariants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0 } } }
    : fadeUp;

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <Image
        src="/images/hero/main-hero.jpg"
        alt="Vista panoramica di un villaggio costiero italiano al tramonto"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-nero/60 via-nero/20 to-transparent" />

      {/* Content */}
      <motion.div
        className="relative z-10 mx-auto max-w-3xl px-4 text-center"
        variants={variants}
        initial="hidden"
        animate="visible"
      >
        {/* Overline */}
        <motion.span
          variants={childVariants}
          className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.1em] text-white/90"
        >
          Esplora il Mondo con Noi
        </motion.span>

        {/* Heading */}
        <motion.h1
          variants={childVariants}
          className="font-playfair text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Viaggiare è vivere due volte
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={childVariants}
          className="mt-6 text-lg leading-relaxed text-white/85 md:text-xl"
        >
          Insieme scopriamo angoli nascosti, sapori autentici e tramonti che restano nel cuore. Ogni
          viaggio è una storia da raccontare.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={childVariants}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <a
            href="#destinations"
            className="rounded-lg bg-terracotta px-8 py-4 text-base font-medium text-white shadow-md transition-all duration-200 hover:bg-terracotta-light hover:shadow-lg"
          >
            Scopri le Destinazioni
          </a>
          <a
            href="#about"
            className="rounded-lg border-2 border-white/30 px-8 py-4 text-base font-medium text-white backdrop-blur-sm transition-all duration-200 hover:border-white/60 hover:bg-white/10"
          >
            Chi Siamo
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="h-10 w-6 rounded-full border-2 border-white/40 p-1">
          <div className="h-2 w-1.5 rounded-full bg-white/60 mx-auto" />
        </div>
      </motion.div>
    </section>
  );
}
```

### Destination Grid — Full Implementation

```tsx
'use client';

import { motion } from 'framer-motion';
import { DestinationCard } from '@/components/destination-card';

const destinations = [
  {
    id: 1,
    title: 'Costiera Amalfitana',
    location: 'Campania, Italia',
    description: 'Scogliere a picco sul mare, limoni profumati e borghi color pastello.',
    image: '/images/destinations/amalfi.jpg',
    href: '/destinations/amalfi-coast',
  },
  // ... more destinations
];

export function DestinationsSection() {
  return (
    <section id="destinations" className="bg-crema py-16 px-4 md:py-20 md:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-terracotta">
            Le Nostre Destinazioni
          </span>
          <h2 className="mt-3 font-playfair text-3xl font-bold tracking-tight text-nero sm:text-4xl md:text-[2.5rem]">
            Luoghi che toccano l'anima
          </h2>
          <p className="mt-4 text-lg leading-7 text-grigio-medio">
            Ogni destinazione è scelta con il cuore. Scopri i luoghi che hanno trasformato il nostro
            modo di vedere il mondo.
          </p>
        </div>

        {/* Destination Grid */}
        <motion.div
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.12 },
            },
          }}
        >
          {destinations.map((dest) => (
            <motion.div
              key={dest.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
                },
              }}
            >
              <DestinationCard {...dest} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
```

---

## 📋 Design Checklist

Use this checklist when building or reviewing any page or component:

### Visual Quality

- [ ] Colors match the defined palette — no hardcoded values
- [ ] Typography uses Playfair Display for headings, DM Sans for body
- [ ] Spacing follows the 4px grid
- [ ] Border radius is consistent (`rounded-lg` for cards, `rounded-md` for buttons)
- [ ] Shadows use the defined elevation scale

### Layout

- [ ] Mobile-first implementation
- [ ] Responsive across all breakpoints (sm, md, lg, xl)
- [ ] Content max-width is `max-w-7xl`
- [ ] Generous whitespace between sections (`py-20`)
- [ ] Grids use appropriate column counts per breakpoint

### Interaction

- [ ] Hover states on all interactive elements
- [ ] Focus states visible and styled (ring-2 ring-terracotta)
- [ ] Transitions are smooth (0.2s–0.4s duration)
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Touch targets are at least 44x44px

### Content

- [ ] Images use `next/image` with proper `sizes` and `alt`
- [ ] Text contrast meets WCAG AA standards
- [ ] Overline text is uppercase with 0.1em tracking
- [ ] Italian terminology used naturally, not forced

---

> _"Il design non è solo come appare, ma come funziona — e come ti fa sentire."_  
> _(Design is not just how it looks, but how it works — and how it makes you feel.)_
>
> — TravelliniWithUs Design Philosophy

---

_Fine del documento · Design System v1.0 · Giugno 2026_
