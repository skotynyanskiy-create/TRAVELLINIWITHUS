# TRAVELLINIWITHUS — Production Launch Checklist

**Status**: In Progress  
**Target Date**: 2026-03-27 (1 week)  
**Owner**: Rodrigo & Betta

---

## PRE-LAUNCH TASKS (Do First)

### Phase 1: Environment & Configuration (Day 1)

- [ ] **Firebase Setup**
  - [ ] Create Firestore database (if not exists)
  - [ ] Create collections: `users`, `articles`, `products`, `leads`, `orders`, `siteContent`
  - [ ] Enable Authentication (Google Sign-In)
  - [ ] Add authorized domains: `localhost`, `127.0.0.1`, `travelliniwithus.it`

- [ ] **Environment Variables**
  - [ ] Copy `.env.local.template` → `.env.local`
  - [ ] Fill Firebase config from Firebase Console
  - [ ] Get Stripe keys: `STRIPE_SECRET_KEY` (sk_live_xxx), `STRIPE_PUBLISHABLE_KEY` (pk_live_xxx)
  - [ ] Get Gemini API key from Google AI Studio
  - [ ] Set `APP_URL=https://travelliniwithus.it` (or staging URL)
  - [ ] Verify: `cat .env.local` shows all vars (never commit this)

- [ ] **Admin Setup**
  - [ ] Update `src/config/admin.ts` with real admin emails (Rodrigo & Betta)
  - [ ] Test admin login with Google account
  - [ ] Verify admin dashboard loads

### Phase 2: Content Creation (Days 2-3)

- [ ] **Create Demo Products** (at least 5)
  ```
  Go to: Firebase Console → Firestore → products collection
  Create documents with:
  {
    "name": "Dolomiti Travel Guide",
    "slug": "dolomiti-guide",
    "price": 29.99,
    "category": "guide",
    "description": "Complete guide to Dolomiti hiking...",
    "imageUrl": "https://...",
    "published": true,
    "createdAt": NOW
  }
  ```
  - [ ] Product 1: Dolomiti Guide (guide)
  - [ ] Product 2: Iceland Planner (planner)
  - [ ] Product 3: Travel Presets (preset)
  - [ ] Product 4: Europe Road Trip (guide)
  - [ ] Product 5: Asia Bundle (bundle)

- [ ] **Create Demo Articles** (at least 3)
  ```
  Go to: Firebase Console → Firestore → articles collection
  Create documents with:
  {
    "title": "Hidden Gems of Dolomiti",
    "slug": "dolomiti-hidden-gems",
    "content": "# Dolomiti\n\n...",
    "excerpt": "Discover lesser-known spots...",
    "category": "Destination",
    "country": "Italia",
    "continent": "Europa",
    "author": "Betta & Rodrigo",
    "authorId": "uid-of-author",
    "published": true,
    "createdAt": NOW
  }
  ```
  - [ ] Article 1: Dolomiti Hidden Gems
  - [ ] Article 2: Iceland Winter Adventure
  - [ ] Article 3: Southeast Asia Slow Travel

- [ ] **Update Site Content**
  - [ ] Go to `/admin` → Site Content Editor
  - [ ] Update home page: hero title, hero text, featured destinations
  - [ ] Update contact page: title, description
  - [ ] Update about page: mission statement, team bio

### Phase 3: Quality Assurance (Days 4-5)

- [ ] **Build & Deploy to Staging**
  - [ ] Run: `npm run build`
  - [ ] Verify: `dist/` contains assets
  - [ ] Deploy to staging: `vercel` (or Firebase staging)
  - [ ] Test staging URL works

- [ ] **Smoke Testing**
  - [ ] Homepage loads (< 3 seconds)
  - [ ] Navigate to all main pages (no 404s)
  - [ ] Click products → load `/shop/slug` correctly
  - [ ] Newsletter form saves to Firestore
  - [ ] Contact form saves to Firestore
  - [ ] Admin login works
  - [ ] Admin can edit content

- [ ] **E2E Test Suite**
  - [ ] Run: `npm run e2e`
  - [ ] Fix any failing tests
  - [ ] Document expected vs actual behavior

- [ ] **Lighthouse Audit**
  - [ ] Chrome DevTools → Lighthouse
  - [ ] Mobile score > 80
  - [ ] Desktop score > 90
  - [ ] Fix any critical issues

### Phase 4: Monitoring & Security (Day 6)

- [ ] **Enable Error Tracking**
  - [ ] Sign up for Sentry (free tier OK)
  - [ ] Configure Sentry in React app
  - [ ] Test error capture

- [ ] **Analytics Setup**
  - [ ] Create Google Analytics 4 property
  - [ ] Add GA4 script to HTML
  - [ ] Verify events are tracked

- [ ] **Security Checklist**
  - [ ] Firestore rules reviewed & deployed
  - [ ] `.env.local` not committed to git
  - [ ] No API keys in client-side code
  - [ ] HTTPS enabled on domain
  - [ ] CORS origins correct

- [ ] **Backup Strategy**
  - [ ] Enable Firestore automated backups (Firebase Console)
  - [ ] Export Firestore manually before launch
  - [ ] Save backup to secure location

### Phase 5: Production Deployment (Day 7)

- [ ] **Final Pre-Flight**
  - [ ] All environment variables set correctly
  - [ ] Admin emails updated
  - [ ] Products & articles published
  - [ ] Homepage copy finalized
  - [ ] E2E tests passing

- [ ] **Deploy to Production**
  - [ ] Option A (Vercel): `vercel --prod`
  - [ ] Option B (Firebase): `firebase deploy --only hosting`
  - [ ] Option C (Self-hosted): Deploy to server + start with PM2

- [ ] **Post-Launch**
  - [ ] Monitor error logs for 24 hours
  - [ ] Check Analytics dashboard
  - [ ] Respond to test emails/contact submissions
  - [ ] Have rollback plan ready

---

## CRITICAL PATHS TO TEST

### Customer Journey
```
Home → Featured Product → /shop/slug → Add to Cart → Checkout → Success
```

### Newsletter Signup
```
Home Newsletter Form → Submit → Firestore leads (type: newsletter)
```

### Contact Form
```
/contatti → Fill form → Submit → Firestore leads (type: contact)
```

### Admin Content Management
```
/admin → Login → Dashboard → Create Article → Publish → Appears on Home
```

---

## ROLLBACK PLAN

If something breaks after launch:

1. **Immediate**: Check error logs (Sentry)
2. **If critical**: Revert to previous commit: `git revert HEAD`
3. **Rebuild**: `npm run build`
4. **Redeploy**: Follow deployment steps above
5. **Expected downtime**: < 5 minutes

---

## LAUNCH DAY RUNBOOK

**7:00 AM**: Final checks complete, team ready
**7:15 AM**: Deploy to production
**7:30 AM**: Smoke tests pass, announce launch
**8:00 AM**: Monitor dashboard, respond to early users
**Ongoing**: Log errors, track metrics

---

## POST-LAUNCH ROADMAP

### Week 1
- Monitor for bugs
- Respond to user feedback
- Fix critical issues immediately
- Track conversion funnel

### Weeks 2-3
- Phase 3: Brand refocus (rewrite copy)
- Create 10+ more products
- Write 5+ more articles
- Set up affiliate partnerships

### Weeks 4+
- SEO optimization
- Content strategy expansion
- Analytics optimization
- Community building

---

## SUCCESS METRICS

✅ **Launch Successful If:**
- Homepage loads < 3 seconds
- Newsletter form captures emails
- Contact form works
- Admin can manage content
- No critical errors in logs
- At least 1 conversion (newsletter) in first day

🟡 **Monitor Closely:**
- Core Web Vitals (LCP, FID, CLS)
- Error rate < 1%
- Conversion rate > 1%

❌ **Rollback If:**
- Stripe checkout broken
- Database inaccessible
- Admin auth non-functional
- Homepage unreachable

---

**Created**: 2026-03-20  
**Ready to Execute**: YES  
**Team Approval**: Pending  
**Next Step**: Complete Phase 1 tasks above
