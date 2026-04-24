# TRAVELLINIWITHUS — Quick Start Guide for Developers

> [!warning] Stale — ultimo aggiornamento 2026-03-20 (35 giorni fa)
> Prerequisiti obsoleti: il repo richiede **Node ≥22** (non 18) e npm 10.9+. Per onboarding aggiornato usa `README.md`, `CONTRIBUTING.md` (entrambi root) e `CLAUDE.md`. Questa guida resta valida solo per sezioni non-ambientali (convenzioni codice, struttura cartelle).

**Last Updated**: 2026-03-20  
**Status**: 🟢 Ready to Develop

---

## Prerequisites

- **Node.js**: >= 18.x
- **npm**: >= 9.x
- **Git**: Latest version
- **IDE**: VS Code recommended

---

## 1. Local Setup (5 minutes)

### Clone & Install

```bash
git clone https://github.com/yourusername/travelliniwithus.git
cd travelliniwithus
npm install
```

### Create Environment File

```bash
# Copy template
cp .env.local.template .env.local

# Edit .env.local with your Firebase & Stripe keys
# Get Firebase config from: Firebase Console → Project Settings
# Get Stripe keys from: Stripe Dashboard → API Keys
```

### Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3001` (see `package.json` PORT env var)

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
# 1. Open http://localhost:3001
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
cp .env.local.template .env.local
# Fill in your Firebase config
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

### Run Unit Tests

```bash
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Run E2E Tests

```bash
# Start dev server first
npm run dev

# In another terminal:
npm run e2e

# Or run specific test
npm run e2e -- shop-and-checkout.spec.ts

# Visual mode (interactive)
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

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes, commit
git add .
git commit -m "feat: add my feature"

# Push to GitHub
git push origin feature/my-feature

# Create Pull Request on GitHub
# Peer review, then merge to main

# Back local
git checkout main
git pull origin main
```

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

## Recent Fixes Applied

- ✅ **FIX #1**: `/shop/:slug` routing restored (was redirecting to `/risorse`)
- ✅ **FIX #2**: Firestore security rules verified (solid)
- ✅ **FIX #3**: Stripe checkout verified (needs STRIPE_SECRET_KEY env var)
- ✅ **FIX #4**: Error tracking module added (`lib/errorTracking.ts`)
- ✅ **FIX #5**: Deployment runbook created
- ✅ **FIX #6**: .env.local.template created
- ✅ **FIX #7**: Checkout E2E tests added
- ✅ **FIX #8**: This Quick Start guide created

**Status**: 🟢 Ready for development & testing
