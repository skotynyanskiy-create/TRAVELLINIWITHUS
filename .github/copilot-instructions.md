# TRAVELLINIWITHUS — GitHub Copilot Instructions

Use `AGENTS.md` as the main repository instruction file.

## Required context

- `README.md`
- `CLAUDE.md`
- `docs/OBSIDIAN_HOME.md`
- `docs/OBSIDIAN_DASHBOARD.md`
- `docs/MARKETING_OPERATIONS_HUB.md`

## Repository purpose

This repo is the website and marketing operating system for the influencer brand `@travelliniwithus`.

It combines:

- public website
- editorial content
- affiliate / shop flows
- collaborations and media kit conversion
- project and marketing operations in `docs/`

## Non-negotiable rules

- `docs/` is part of the operating system, not optional docs
- important work should update the relevant note in `docs/`
- prefer explicit types and avoid new `any`
- preserve the existing visual language unless redesign is requested
- do not assume strict TypeScript
- treat `server.ts`, `firestore.rules` and `src/config/admin.ts` as high-risk

## Important locations

- homepage / hero: `src/components/home/HeroSection.tsx`
- navbar: `src/components/Navbar.tsx`
- destinations section: `src/components/home/DestinationsGrid.tsx`
- project hub: `docs/10_Projects/PROJECT_TRAVELLINIWITHUS_SITE.md`
- marketing hub: `docs/MARKETING_OPERATIONS_HUB.md`

## Commands

```bash
npm run dev
npm run typecheck
npm run build
npm run audit:ui
npm run audit:firebase
npm run audit:stripe
npm run predeploy
```

## Documentation update policy

- UI changes: use project / task / ui-change notes
- bugs: use bug notes
- campaigns: use campaign notes
- partnerships: use partner notes
- content planning: use content brief notes

**Location**: `src/context/`

**Use When**:

- Global UI state (cart, favorites, auth)
- Shallow state tree (avoid deep nesting)
- ≤ 3 context providers total

**Don't Use For**:

- Server state → Use React Query instead
- Complex derived state → Memoize selectors
- Frequently changing data → Use Firestore subscriptions

**Example**:

```tsx
interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  // ...
  return <CartContext.Provider value={{ items, addToCart }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
```

### Services (Business Logic)

**Location**: `src/services/`

**Files**:

- `firebaseService.ts` — All Firestore/Firebase operations
- `analytics.ts` — Event tracking
- `aiVerificationService.ts` — AI verification logic

**Rules**:

- ✅ Pure functions, no side effects
- ✅ Type all parameters and returns
- ✅ Handle errors explicitly (don't swallow them)
- ✅ Query Firestore with proper filters (use `where` clause)
- ❌ Never expose Firebase config or keys client-side

**Example**:

```tsx
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (!slug) throw new Error('Slug is required');

  const q = query(
    collection(db, 'products'),
    where('slug', '==', slug),
    where('published', '==', true)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Product;
}
```

### Utils & Hooks

**Location**: `src/utils/`, `src/hooks/`

**Hooks**:

- Name with `use` prefix: `useSiteContent()`, `useAuth()`
- Return named object (object destructuring friendly)
- Include cleanup (useEffect return)

**Utils**:

- Standalone, pure functions
- No React imports unless necessary
- Examples: `slugify()`, `formatDate()`, `validateEmail()`

---

## 🔐 Firebase & Firestore Conventions

### Collections Structure

```
users/
  ├── {uid}
  │   ├── uid: string
  │   ├── email: string
  │   ├── displayName: string
  │   ├── role: 'admin' | 'user'
  │   └── updatedAt: timestamp

articles/
  ├── {docId}
  │   ├── title: string (required)
  │   ├── slug: string (required, unique)
  │   ├── content: string (markdown, required)
  │   ├── published: boolean (required)
  │   ├── authorId: string (required)
  │   ├── category: string (Guide, Destination, Experience)
  │   ├── country: string (for taxonomy)
  │   ├── continent: string
  │   ├── createdAt: timestamp
  │   └── updatedAt: timestamp

products/
  ├── {docId}
  │   ├── name: string (required)
  │   ├── slug: string (required, unique)
  │   ├── price: number (required, EUR)
  │   ├── category: 'preset' | 'guide' | 'planner' | 'bundle'
  │   ├── description: string
  │   ├── imageUrl: string
  │   ├── published: boolean (required)
  │   └── createdAt: timestamp

leads/
  ├── {docId}
  │   ├── type: 'contact' | 'newsletter' | 'media-kit'
  │   ├── email: string (required)
  │   ├── name?: string
  │   ├── message?: string
  │   └── createdAt: timestamp

orders/
  ├── {orderId}
  │   ├── customerName: string
  │   ├── email: string
  │   ├── total: number
  │   ├── status: 'pending' | 'completed' | 'cancelled'
  │   └── createdAt: timestamp

siteContent/
  ├── home { heroTitle, heroText, ... }
  ├── contact { title, description, ... }
  ├── demo { showEditorialDemo, showShopDemo }
  └── ...
```

### Query Patterns

**Always filter by published**:

```tsx
const q = query(collection(db, 'articles'), where('published', '==', true));
```

**Use serverTimestamp() for dates**:

```tsx
await setDoc(docRef, {
  title: 'Article',
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});
```

**Limit results**:

```tsx
const q = query(collection(db, 'articles'), where('published', '==', true), limit(10));
```

---

## 🛣️ Routing & Navigation

### App.tsx Routes

**File**: `src/App.tsx`

**Rules**:

- Lazy-load all pages with `lazy()`
- Use `Suspense` with `PageLoader` fallback
- Admin routes must use `<ProtectedRoute>`
- Order: specific routes first, then catch-all

**Example**:

```tsx
const MyPage = lazy(() => import('./pages/MyPage'));

<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="my-route" element={<MyPage />} />
    <Route
      path="admin"
      element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Route>
</Routes>;
```

### Navigation Parameters

**Use query params for filters**:

```tsx
// /destinazioni?group=Europa&sort=newest
const [searchParams] = useSearchParams();
const group = searchParams.get('group');
const sort = searchParams.get('sort');
```

**Use route params for IDs**:

```tsx
// /articolo/:slug or /shop/:slug
const { slug } = useParams<{ slug: string }>();
```

---

## 🔐 Authentication & Admin Access

### Admin Check

```tsx
import { useAuth } from '../context/AuthContext';

function AdminComponent() {
  const { isAdmin, user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!isAdmin) return <div>Access denied</div>;

  return <AdminPanel />;
}
```

### Admin Whitelist

**File**: `src/config/admin.ts`

```tsx
const ADMIN_EMAILS = ['your-email@example.com'];

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
```

### Protected Routes

**In App.tsx**:

```tsx
<Route
  path="admin"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

---

## 💾 Data Fetching & Caching

### React Query Setup

**In App.tsx**:

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (was cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

### Usage in Components

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['products'],
  queryFn: async () => {
    return await fetchProducts();
  },
});

if (isLoading) return <Skeleton />;
if (error) return <ErrorMessage error={error} />;
return <ProductList products={data} />;
```

### Invalidate Cache After Mutations

```tsx
const queryClient = useQueryClient();

async function handleSave() {
  await saveArticle(article);
  queryClient.invalidateQueries({ queryKey: ['articles'] });
}
```

---

## 🧪 Testing & Quality

### Unit Tests (Vitest)

**Location**: `src/**/*.test.tsx`

**Run**: `npm run test`

**Pattern**:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### E2E Tests (Playwright)

**Location**: `e2e/**/*.spec.ts`

**Run**: `npm run e2e`

**Critical Flows to Test**:

- [ ] Home page loads
- [ ] Article page renders
- [ ] Product page loads and shows slug in URL
- [ ] Add to cart → checkout flow
- [ ] Newsletter signup
- [ ] Contact form submission
- [ ] Admin login

**Pattern**:

```typescript
test('should load product page', async ({ page }) => {
  await page.goto('/shop/my-product');
  await expect(page.locator('h1')).toBeVisible();
  expect(page.url()).toContain('/shop/my-product');
});
```

### Code Quality

**Lint**: `npm run lint` (ESLint)  
**Format**: `npm run format` (Prettier)  
**Type Check**: `npm run typecheck` (TypeScript)

---

## 🚀 Deployment & Environment

### Environment Variables

**Required**:

```bash
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_API_KEY=...
STRIPE_SECRET_KEY=sk_live_... (production only)
STRIPE_PUBLISHABLE_KEY=pk_live_...
GEMINI_API_KEY=...
APP_URL=https://travelliniwithus.it
NODE_ENV=production
```

**Development**:

```bash
ALLOW_MOCK_CHECKOUT=true  # Don't require real Stripe
PORT=3000
```

### Build & Deploy

**Build**: `npm run build` (generates sitemap, Vite bundle)

**Deploy Options**:

- **Vercel**: `vercel --prod`
- **Firebase Hosting**: `firebase deploy --only hosting`
- **Self-hosted**: Node.js + PM2

See `docs/DEPLOYMENT_RUNBOOK.md` for detailed steps.

---

## 📋 Common Tasks

### Add a New Page

1. Create `src/pages/MyPage.tsx`
2. Add to `src/App.tsx` routes (lazy-load)
3. Add SEO meta tags
4. Add to sitemap if static
5. Test navigation

### Create a Product

1. Go to Firebase Console → Firestore → `products` collection
2. Create document with:
   - `name`, `slug`, `price`, `category`, `published: true`
3. Product appears at `/shop/:slug`

### Publish an Article

1. Go to Firebase Console → Firestore → `articles` collection
2. Create document with:
   - `title`, `slug`, `content`, `authorId`, `published: true`
3. Appears on Home, `/articolo/:slug`, sitemap

### Test Checkout

1. Set `ALLOW_MOCK_CHECKOUT=true` in `.env.local`
2. Add product to cart
3. Click checkout
4. Should redirect to `/shop?success=true`

---

## ⚠️ Anti-Patterns (Don't Do This)

❌ **Hardcode colors**

```tsx
// BAD
className = 'text-blue-500';

// GOOD
className = 'text-[var(--color-accent)]';
```

❌ **Inline Firebase queries in components**

```tsx
// BAD
const [data, setData] = useState([]);
useEffect(() => {
  getDocs(collection(db, 'articles')).then(setData);
}, []);

// GOOD
const { data } = useQuery({ queryKey: ['articles'], queryFn: fetchArticles });
```

❌ **Props without types**

```tsx
// BAD
function MyComponent(props) { ... }

// GOOD
interface MyComponentProps { title: string; }
function MyComponent({ title }: MyComponentProps) { ... }
```

❌ **Untracked API calls**

```tsx
// BAD
fetch('/api/checkout').then(...)

// GOOD
const { mutate: checkout } = useMutation({
  mutationFn: createCheckout,
  onSuccess: () => { /* handle */ }
});
```

---

## 🆘 Debugging Tips

**Check Firebase Auth**:

```
Firebase Console → Authentication → Users
See logged-in users and their roles
```

**Check Firestore Data**:

```
Firebase Console → Firestore → collections
View/edit articles, products, leads
```

**Server Logs**:

```bash
npm run dev
# Shows [vite], [server], [firebase] logs
```

**Browser DevTools**:

```
F12 → Console: React + JS errors
F12 → Network: API calls
F12 → Storage: localStorage, sessionStorage
```

---

## 🔄 Recent Fixes & Status

✅ Routing `/shop/:slug` fixed (was redirecting to `/risorse`)  
✅ Firestore rules verified (solid)  
✅ Stripe checkout ready (needs `STRIPE_SECRET_KEY`)  
✅ Error tracking module added  
✅ Deployment runbook created  
✅ E2E tests added for critical flows  
✅ This instruction file created

**Status**: 🟢 **Ready for development & testing**

---

## 📖 Reference Documents

- [DEPLOYMENT_RUNBOOK.md](../docs/DEPLOYMENT_RUNBOOK.md) — Deploy steps
- [QUICK_START.md](../docs/QUICK_START.md) — Developer onboarding
- [TRAVELLINIWITHUS_MASTER_PLAN.md](../docs/TRAVELLINIWITHUS_MASTER_PLAN.md) — Strategy
- [TRAVELLINIWITHUS_EXECUTION_PLAN.md](../docs/TRAVELLINIWITHUS_EXECUTION_PLAN.md) — Roadmap

---

**Last Updated**: 2026-03-20  
**Owner**: Copilot Agent  
**Status**: Active, team-wide use
