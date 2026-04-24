# TRAVELLINIWITHUS — Quick Start Guide for Developers

**Last Updated**: 2026-04-24
**Status**: 🟢 Ready to Develop
**Scope**: onboarding developer. Per AI-assisted workflow vedi `CLAUDE.md` + `AGENTS.md`. Per security/contributing vedi `SECURITY.md` + `CONTRIBUTING.md`.

---

## Prerequisites

- **Node.js**: >= 22 (LTS). Il progetto usa syntax/feature Node 22; 18/20 non supportati.
- **npm**: >= 10.9 (bundled con Node 22)
- **Git**: any recent version
- **IDE**: VS Code. All'apertura del repo, VS Code proporrà le estensioni raccomandate in `.vscode/extensions.json` (ESLint, Prettier, Tailwind, Playwright, Vitest, GitLens).

---

## 1. Local Setup (5 minutes)

### Clone & Install

```bash
git clone https://github.com/skotynyanskiy-create/TRAVELLINIWITHUS.git
cd TRAVELLINIWITHUS
npm install
```

### Create Environment File

```bash
# Copy template (committed) to local file (gitignored)
cp .env.example .env.local

# Edit .env.local only when needed. The site runs with ZERO keys set —
# every integration is guard-clause gated (see .env.example header).
# For pure frontend dev you don't need to fill anything.
# For checkout testing: set ALLOW_MOCK_CHECKOUT=true.
```

Do not commit `.env.local` — it's in `.gitignore` and the Claude Code
PreToolUse hook blocks reading/writing it.

### Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3000` (the `.vscode/tasks.json` task
overrides PORT to 3001 for VS Code's launch target).

---

## 2. Key Commands

```bash
# Development
npm run dev              # Start dev server + Vite hot reload
npm run start           # Start Node server only (no Vite)

# Building
npm run build           # Production build (generates sitemap)
npm run preview         # Preview production build locally
npm run clean           # Remove dist folder

# Code Quality
npm run lint            # Check code style
npm run lint:fix        # Auto-fix style issues
npm run format          # Format code with Prettier
npm run typecheck       # Run TypeScript check (no emit)

# Testing
npm run test            # Run unit tests (Vitest)
npm run e2e             # Run E2E tests (Playwright)

# Database & Admin
# Use Firebase Console for all CRUD operations
```

---

## 3. Project Structure

```
src/
├── App.tsx                   # Main app router
├── main.tsx                  # Entry point
├── index.css                 # Global styles (Tailwind)
│
├── components/               # Reusable React components
│   ├── Button.tsx
│   ├── Newsletter.tsx
│   ├── ProductCard.tsx
│   ├── ProtectedRoute.tsx    # Admin auth wrapper
│   └── ... (25+ components)
│
├── pages/                    # Route-level pages
│   ├── Home.tsx
│   ├── Shop.tsx
│   ├── ProductPage.tsx       # /shop/:slug
│   ├── Articolo.tsx          # /articolo/:slug
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── ArticleEditor.tsx
│   │   └── ProductEditor.tsx
│   └── ... (15+ pages)
│
├── context/                  # React Context
│   ├── AuthContext.tsx       # User auth state
│   ├── CartContext.tsx       # Shopping cart
│   └── FavoritesContext.tsx
│
├── services/                 # API & business logic
│   ├── firebaseService.ts    # Firestore/Firebase calls
│   ├── analytics.ts          # Event tracking
│   └── aiVerificationService.ts
│
├── lib/                      # Utilities
│   ├── firebaseApp.ts        # Firebase init
│   ├── firebaseAuth.ts       # Auth helpers
│   ├── firebaseDb.ts         # Firestore init
│   ├── errorTracking.ts      # Error logging [NEW - FIX #4]
│   └── ...
│
├── config/                   # Configuration
│   ├── site.ts               # Site meta (title, contact, etc)
│   ├── admin.ts              # Admin email whitelist
│   ├── contentTaxonomy.ts    # Content categories
│   ├── siteContent.ts        # Page content defaults
│   └── demoContent.ts        # Demo data for preview
│
├── hooks/                    # Custom React hooks
│   └── useSiteContent.ts
│
├── types.ts                  # TypeScript types
├── vite-env.d.ts            # Vite types
└── utils/                    # Standalone utilities

docs/
├── TRAVELLINIWITHUS_BRAND_MEMORY.md    # Brand guidelines
├── TRAVELLINIWITHUS_MASTER_PLAN.md     # Strategy
├── TRAVELLINIWITHUS_EXECUTION_PLAN.md  # Roadmap
├── DEPLOYMENT_RUNBOOK.md               # Deploy guide [NEW - FIX #5]
└── QUICK_START.md (this file)

e2e/
├── home.spec.ts
└── shop-and-checkout.spec.ts          # Checkout tests [NEW - FIX #7]

public/
├── robots.txt
└── sitemap.xml

server.ts                    # Express server (SSR + API)
vite.config.ts              # Vite + Tailwind config
tailwind.config.js          # Tailwind theme
tsconfig.json               # TypeScript config
```

---

## 4. Common Development Tasks

### 4.1 Add a New Page

```bash
# 1. Create page component
touch src/pages/MyPage.tsx

# 2. Add to App.tsx routes
// In App.tsx
const MyPage = lazy(() => import('./pages/MyPage'));

// In <Routes>
<Route path="my-route" element={<MyPage />} />

# 3. Add to server.ts sitemap (if needed)
const STATIC_APP_ROUTES = new Set([
  '/',
  '/my-route',  // Add here
  // ...
]);
```

### 4.2 Add a Product

```bash
# Go to Firebase Console → Firestore → products collection
# Create new document with:
{
  "name": "My Product",
  "slug": "my-product",      # Must be unique, URL-friendly
  "price": 29.99,            # In EUR
  "category": "guide",       # One of: preset, guide, planner, digital-planner, bundle, map
  "description": "...",      # Product description
  "imageUrl": "https://...", # Product image (optional)
  "published": true,         # Must be true to show on site
  "createdAt": NOW           # Server timestamp
}

# Product now appears in /shop and at /shop/my-product
```

### 4.3 Publish an Article

```bash
# Go to Firebase Console → Firestore → articles collection
# Create new document with:
{
  "title": "Guide to Rome",
  "slug": "rome-guide",          # Unique, URL-friendly
  "content": "# Rome\n...",      # Markdown content
  "excerpt": "Discover Rome...", # Short description
  "coverImage": "https://...",
  "category": "Guide",
  "country": "Italia",           # For taxonomy
  "continent": "Europa",
  "region": "Lazio",
  "city": "Roma",
  "author": "Betta & Rodrigo",
  "authorId": "uid-of-author",   # Firebase UID
  "published": true,             # Must be true
  "createdAt": NOW
}

# Article now appears in Home, Destinazioni, and at /articolo/rome-guide
```

### 4.4 Edit Site Content

```bash
# Navigate to /admin
# Log in with Google (must be in ADMIN_EMAILS in src/config/admin.ts)
# Go to "Site Content Editor"
# Edit copy for: home, about, contact, etc.

# Changes saved to Firestore → useSiteContent hook fetches on page load
```

### 4.5 Test Newsletter Submission

```bash
# 1. Open http://localhost:3000
# 2. Scroll to newsletter section
# 3. Enter email
# 4. Check Firebase Console → Firestore → leads collection
# 5. Should see new document with type: "newsletter"
```

### 4.6 Test Checkout Flow

```bash
# Make sure ALLOW_MOCK_CHECKOUT=true in .env.local

# 1. Go to /shop
# 2. Click on a product (or use demo)
# 3. Click "Aggiungi al carrello"
# 4. Click "Procedi al pagamento"
# 5. Should see:
#    - Stripe form (if STRIPE_SECRET_KEY set) OR
#    - Redirect to /shop?success=true (if mock mode)

# Check server logs:
# Should see: "POST /api/create-checkout-session"
```

---

## 5. Debugging Tips

### 5.1 Check Server Logs

```bash
# Terminal where `npm run dev` is running
# Shows:
# - [vite] client log messages
# - [server] Express API calls
# - [firebase] Auth/Firestore operations
```

### 5.2 Use Firebase Console

```
Firebase Console → Your Project
├── Authentication   → See logged-in users
├── Firestore       → View/edit all data
├── Storage         → Manage images
└── Hosting         → Deploy static files
```

### 5.3 Browser DevTools

```bash
# Chrome DevTools (F12)
├── Console   → React + JavaScript errors
├── Network   → API calls (/api/create-checkout-session, etc)
├── Storage   → localStorage, sessionStorage, cookies
└── Elements  → DOM inspection (React DevTools extension helps)
```

### 5.4 Common Errors & Fixes

**Error: "Firebase config not found"**

```bash
# Solution: Make sure .env.local has Firebase keys
cp .env.example .env.local
# Fill in your Firebase config (or leave blank — app degrades gracefully)
```

**Error: "Admin access denied"**

```bash
# Solution: Add your email to ADMIN_EMAILS
# Edit: src/config/admin.ts
const ADMIN_EMAILS = ['your-email@example.com', 'other@example.com'];
```

**Error: "Products not showing"**

```bash
# Solution: Verify products are published
# Go to: Firebase Console → Firestore → products
# Check each doc has: published = true
```

**Error: "Newsletter form not submitting"**

```bash
# Solution: Check Firestore leads collection
# Firebase Console → Firestore → leads
# If empty, check browser console for errors
# Check that `leads` collection exists and rules allow public create
```

---

## 6. Testing Locally

Full E2E suite docs live in [`../e2e/README.md`](../e2e/README.md). Short version:

### Run Unit Tests (Vitest)

```bash
npm run test            # 8 test files under src/
```

Scripts `test:watch` and `test:coverage` aren't defined in `package.json` —
use `npx vitest --watch` or `npx vitest run --coverage` directly if needed.

### Run E2E Tests (Playwright)

```bash
# Full suite — Playwright auto-starts the dev server
npm run e2e

# Targeted audits (already in package.json)
npm run audit:visual    # visual regression
npm run audit:a11y      # axe-core smoke
npm run audit:forms     # newsletter / contact / media-kit

# Single spec
npx playwright test e2e/home.spec.ts

# UI mode
npx playwright test --ui
```

### Manual Testing Checklist

```
Home page
☐ Hero loads correctly
☐ Featured destinations render
☐ Featured articles render
☐ Newsletter form works
☐ All links clickable

Shop page
☐ Loads at /shop
☐ Products listed (or demo)
☐ Can click product to /shop/:slug
☐ Add to cart button works
☐ Cart drawer opens

Product page
☐ Loads at /shop/slug
☐ Image displays
☐ Title, price, description visible
☐ Add to cart works
☐ Checkout button works

Contact form
☐ Navigate to /contatti
☐ Fill all fields
☐ Submit works
☐ Success message appears

Admin
☐ Go to /admin?previewAdmin=1 (on localhost)
☐ Dashboard loads
☐ Can edit site content
☐ Can create article
☐ Can create product
```

---

## 7. Git Workflow

See [`../CONTRIBUTING.md`](../CONTRIBUTING.md) for the full branching,
commit, and Definition-of-Done policy. Short version:

```bash
# Branch prefix: codex/ feat/ fix/ chore/ docs/ refactor/
git checkout -b feat/my-feature

# Stage specific files (avoid `git add .`)
git add src/components/MyFeature.tsx

# Conventional commit style
git commit -m "feat(scope): add my feature"

# Push
git push -u origin feat/my-feature

# Open PR via gh
gh pr create --fill
```

Husky pre-commit runs `lint-staged` (ESLint max-warnings=0 + Prettier)
automatically.

---

## 8. Performance Tips

✅ **Do:**

- Lazy load routes (already done in App.tsx)
- Use React Query for API data
- Optimize images (use OptimizedImage component)
- Keep component props minimal

❌ **Don't:**

- Call `useEffect` without dependencies
- Create new objects/functions in render
- Forget to cleanup subscriptions
- Use `any` type (use TypeScript properly)

---

## 9. Next Steps When Ready

1. **Deploy** → Follow [DEPLOYMENT_RUNBOOK.md](./DEPLOYMENT_RUNBOOK.md)
2. **Monitor** → Set up Sentry/LogRocket
3. **Optimize** → Run Lighthouse audits
4. **Scale** → Monitor database usage
5. **Market** → Promote on Instagram & socials

---

## Need Help?

- **Bugs**: Check browser console + server logs
- **Firebase**: See [Firebase Docs](https://firebase.google.com/docs)
- **React**: See [React Docs](https://react.dev)
- **Tailwind**: See [Tailwind Docs](https://tailwindcss.com)
- **Stripe**: See [Stripe Docs](https://stripe.com/docs)

Happy coding! 🚀

---

## Recent changes

Release history is tracked in [`../CHANGELOG.md`](../CHANGELOG.md). Project
state and release gates are in
[`10_Projects/PROJECT_RELEASE_READINESS.md`](./10_Projects/PROJECT_RELEASE_READINESS.md)
and its latest snapshot
[`PROJECT_RELEASE_READINESS_2026_04_24_PRODUCTION_PASS.md`](./10_Projects/PROJECT_RELEASE_READINESS_2026_04_24_PRODUCTION_PASS.md).

**Status**: 🟢 Ready for development & testing
