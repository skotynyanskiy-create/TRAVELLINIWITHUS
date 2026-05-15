---
name: new-page
description: Scaffold a new TRAVELLINIWITHUS page with SEO, PageLayout, Section, route wiring, optional navigation, sitemap considerations, and project conventions.
---

# /new-page

Scaffold a new page for the TRAVELLINIWITHUS project.

## Arguments

The user should provide: page name (e.g., "Podcast", "Blog", "Partners")

## Steps

1. **Create page file** at `src/pages/{PageName}.tsx` with this structure:

   ```tsx
   import { Helmet } from 'react-helmet-async';
   import SEO from '../components/SEO';
   import PageLayout from '../components/PageLayout';
   import Section from '../components/Section';

   export default function PageName() {
     return (
       <>
         <Helmet>
           <title>Page Title | Travelliniwithus</title>
         </Helmet>
         <SEO
           title="Page Title"
           description="Description here"
           canonical={`${import.meta.env.VITE_APP_URL}/route-name`}
         />
         <PageLayout>
           <Section>{/* Content */}</Section>
         </PageLayout>
       </>
     );
   }
   ```

2. **Add route** in `src/App.tsx`:
   - Add lazy import: `const PageName = lazy(() => import('./pages/PageName'));`
   - Add route inside `<Routes>`: `<Route path="route-name" element={<PageName />} />`
   - Place before the catch-all `*` route

3. **Add to navigation** if needed — update `src/components/Navbar.tsx`:
   - Add a new entry to the `navItems` array inside the `useMemo` block
   - If the page has subpages, add a `subLinks` array

4. **Add to sitemap** — if it's a static public page, add the URL to the sitemap generation logic

5. **Verify** — confirm the page renders at the correct route

## Conventions to follow

- Use CSS variables for colors (never hardcoded)
- Use Tailwind classes only
- Use `lucide-react` for icons
- Type all props with interfaces
- If fetching data, use React Query pattern

## Project context

Before applying this skill, anchor in the local operating system:

- `AGENTS.md` — root operating guide and skill routing.
- `CLAUDE.md` — Claude-specific rules, quality bar, and model routing.
- `DESIGN.md` — design tokens, palette, typography and component conventions.
- `docs/` — the Obsidian-style operational vault; treat it as source of truth.
- `docs/BRAND_PUBLIC_SNAPSHOT_TRAVELLINIWITHUS.md` — brand positioning, audience, tone.
- `docs/MARKETING_OPERATIONS_HUB.md` — funnel state, KPIs, analytics contract, partner pipeline.
- `docs/AI_AGENT_STACK.md` — current skills, agents, MCP policy.

Every finding must respect Italian public copy, premium editorial tone, and the release readiness gate documented in `docs/10_Projects/PROJECT_RELEASE_READINESS.md`.
