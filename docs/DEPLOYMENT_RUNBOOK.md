# TRAVELLINIWITHUS — Deployment & Operations Runbook

**Status**: 🟡 PRE-PRODUCTION  
**Last Updated**: 2026-03-20

---

## 1. PRE-DEPLOYMENT CHECKLIST

### Environment Variables Required

```bash
# Firebase
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_DATABASE_URL=your-db-url
VITE_FIREBASE_STORAGE_BUCKET=your-storage
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIRESTORE_DATABASE_ID=your-database-id

# Payments
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx

# API
GEMINI_API_KEY=your-gemini-key

# Server
PORT=3000
APP_URL=https://travelliniwithus.it
NODE_ENV=production

# Dev Only
ALLOW_MOCK_CHECKOUT=false (production) | true (dev)
```

### Security Checks

- [ ] Firebase security rules deployed and tested
- [ ] Stripe webhook secrets configured
- [ ] Admin emails whitelist updated
- [ ] Environment variables not committed to git
- [ ] CORS origins whitelist configured correctly
- [ ] HTTPS enforced
- [ ] Database backups enabled

### Content Checks

- [ ] All articles marked `published: true`
- [ ] All products marked `published: true`
- [ ] Hero copy updated and reviewed
- [ ] Images optimized and CDN ready
- [ ] Links verified (no 404s)
- [ ] Meta tags and SEO data complete

### Functional Tests

- [ ] Homepage loads (Lighthouse > 80)
- [ ] Article rendering works
- [ ] Product page navigation works (FIX #1 applied)
- [ ] Add to cart → checkout flow works
- [ ] Newsletter signup works
- [ ] Contact form submits successfully
- [ ] Admin login works
- [ ] Admin dashboard loads

---

## 2. DEPLOYMENT STEPS

### Option A: Vercel (Recommended)

```bash
# 1. Connect GitHub repo
vercel link

# 2. Set environment variables in Vercel dashboard
# (copy from .env.local)

# 3. Deploy
vercel --prod

# 4. Test production
curl https://travelliniwithus.it/api/health
```

### Option B: Firebase Hosting

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Initialize
firebase init hosting

# 4. Build
npm run build

# 5. Deploy
firebase deploy --only hosting
```

### Option C: Self-Hosted (Node.js)

```bash
# 1. Build
npm run build

# 2. Transfer to server
scp -r dist/* user@server:/app/public/
scp server.ts user@server:/app/

# 3. Install on server
ssh user@server
cd /app
npm install --production

# 4. Start with PM2
pm2 start server.ts --name "travelliniwithus"
pm2 save
pm2 startup

# 5. Setup reverse proxy (Nginx)
# Configure /etc/nginx/sites-available/travelliniwithus
# Point to localhost:3000
# Enable HTTPS with certbot
```

---

## 3. POST-DEPLOYMENT MONITORING

### Health Checks

```bash
# API endpoint
curl https://travelliniwithus.it/api/health

# Sitemap
curl https://travelliniwithus.it/sitemap.xml

# Home page
curl -I https://travelliniwithus.it
```

### Analytics Setup

- [ ] Google Analytics 4 configured
- [ ] Search Console verified
- [ ] Bing Webmaster Tools configured
- [ ] Sentry (or similar) error tracking enabled
- [ ] Stripe Dashboard monitoring enabled

### Performance Monitoring

- [ ] Core Web Vitals tracked
- [ ] Page load time < 3s
- [ ] Lighthouse score > 80
- [ ] Database query performance monitored
- [ ] Stripe API latency monitored

---

## 4. COMMON ISSUES & SOLUTIONS

### Issue: Stripe checkout returns 503

**Solution**: Check `STRIPE_SECRET_KEY` env var is set
```bash
# Verify
echo $STRIPE_SECRET_KEY

# If missing, set it
export STRIPE_SECRET_KEY=sk_live_xxxxx
```

### Issue: Admin login fails with "unauthorized-domain"

**Solution**: Add localhost and production domain to Firebase Auth
```
Firebase Console → Authentication → Settings
→ Authorized domains
→ Add: localhost, 127.0.0.1, yourdomain.it
```

### Issue: Newsletter subscription not working

**Solution**: Verify Firestore `leads` collection exists
```
Firestore → Create collection "leads"
→ Security rules checked for PUBLIC create permission
```

### Issue: Products not showing in shop

**Solution**: Verify products have `published: true`
```
Firestore Console → products collection
→ Each product document must have: published = true
```

---

## 5. ROLLBACK PROCEDURE

If deployment fails:

```bash
# Option 1: Revert to previous version
git revert HEAD
npm run build
vercel --prod

# Option 2: Rollback on Vercel dashboard
Vercel Dashboard → Deployments → Select previous → Click "Promote to Production"

# Option 3: Rollback on Firebase
firebase deploy --only hosting --version <previous-hash>
```

---

## 6. DATABASE BACKUP & RECOVERY

### Firestore Backup

```bash
# Enable automatic backups in Firebase Console
# Settings → Backup and Restore → Enable for all collections

# Manual export (local)
firebase firestore:export backup/$(date +%Y%m%d_%H%M%S)

# Restore from backup
firebase firestore:import backup/20260320_143000
```

---

## 7. SCALING CONSIDERATIONS

### Current Limits
- Firestore: Free tier = 1 write/sec per document
- Storage: 5GB free
- Functions: 2M invocations/month free

### When to Scale
- Newsletter subscribers > 1000 → upgrade Firestore
- Product images > 5GB → upgrade Storage
- Traffic > 1M/month → consider CDN upgrade

### Scaling Steps
1. Upgrade Firestore plan in Firebase Console
2. Configure CDN (Cloudflare recommended)
3. Add caching headers to static assets
4. Consider separating API from static hosting

---

## 8. SECURITY MAINTENANCE

### Monthly Tasks
- [ ] Review Firebase security rules
- [ ] Check admin access logs
- [ ] Verify SSL certificate valid
- [ ] Review active sessions
- [ ] Backup Firestore

### Quarterly Tasks
- [ ] Security audit of codebase
- [ ] Update dependencies (npm audit)
- [ ] Review error logs for suspicious activity
- [ ] Test disaster recovery procedure

---

## 9. CONTACT & ESCALATION

**On-Call**: skotynyanskiy@gmail.com  
**Stripe Support**: Via Stripe Dashboard  
**Firebase Support**: Firebase Console → Help  
**Error Monitoring**: Check Sentry dashboard (when enabled)

---

## Quick Start (Development)

```bash
# Install
npm install

# Set env vars (copy from .env.local)
export $(cat .env.local | xargs)

# Run dev
npm run dev

# Run server only (for testing Node backend)
npm run start

# Test production build locally
npm run build
npm run preview
```

---

## Next Steps

1. **FIX Critical Bugs** (DONE):
   - [x] Routing `/shop/:slug` (FIX #1)
   - [x] Verify Firestore rules (FIX #2)
   - [x] Test Stripe config (FIX #3)

2. **Add Monitoring** (FIX #4):
   - [ ] Sentry integration
   - [ ] Analytics tracking
   - [ ] Error logging

3. **Prepare for Launch**:
   - [ ] Run E2E tests before deployment
   - [ ] Load test under expected traffic
   - [ ] Have rollback plan ready
   - [ ] Schedule post-launch monitoring

