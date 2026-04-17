---
name: new-article
description: Scaffold a Travelliniwithus editorial article seed and matching Obsidian content note with Italian metadata, slug, category, and draft publication state.
---

# /new-article

Scaffold a new article for the Travelliniwithus editorial archive.

## Arguments

The user must provide:

- **title**: article title in Italian (e.g. "Le migliori spiagge della Sardegna")
- **slug**: URL slug (e.g. `spiagge-sardegna`) — auto-generate from title if not provided
- **category**: one of `destinazioni`, `esperienze`, `guide`, `risorse`
- **destination** (optional): place name (e.g. "Sardegna")

## Steps

### 1. Generate slug

If not provided, generate from title:

- lowercase
- replace spaces with `-`
- remove accents and special characters
- strip non-alphanumeric except `-`

### 2. Create Firestore seed document

Create or update `src/data/articles/[slug].seed.ts` with this structure:

```typescript
import { Timestamp } from 'firebase/firestore';

export const articleSeed = {
  title: 'TITLE',
  slug: 'SLUG',
  excerpt: 'Breve descrizione — max 160 caratteri per SEO.',
  content: `# TITLE\n\nContenuto dell'articolo in Markdown.\n`,
  category: 'CATEGORY',
  destination: 'DESTINATION',
  tags: [],
  author: {
    name: 'Rodrigo & Betta',
    bio: 'Viaggiatori e creatori di @travelliniwithus',
  },
  coverImage: '/hero-adventure.jpg',
  published: false,
  featured: false,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
};
```

### 3. Create Obsidian content note

Create `docs/13_Content/ARTICLE_[SLUG].md` using this frontmatter:

```markdown
---
type: content
area: editorial
status: draft
category: CATEGORY
slug: SLUG
route: /articolo/SLUG
repo_path: src/data/articles/SLUG.seed.ts
tags:
  - article
  - CATEGORY
---

# TITLE

## Brief

- Angolo:
- Target reader: viaggiatori curiosi che cercano posti reali
- Tone: autentico, diretto, niente fuffa
- CTA primaria:

## Outline

1.
2.
3.

## Note operative

- [ ] Testo scritto
- [ ] Immagine cover selezionata
- [ ] SEO excerpt ottimizzato (max 160 char)
- [ ] Pubblicato su Firebase
```

### 4. Report

Tell the user:

- Seed file created at `src/data/articles/[slug].seed.ts`
- Content note created at `docs/13_Content/ARTICLE_[slug].md`
- Next steps: write the content, set `published: true` when ready, seed to Firestore via AdminDashboard

## Conventions

- All content in Italian
- `published: false` always on creation — never auto-publish
- Cover image: use `/hero-adventure.jpg` as placeholder until final asset is ready
- Slug must be unique — check `src/data/` for conflicts before creating
