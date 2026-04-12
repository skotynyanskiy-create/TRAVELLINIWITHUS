# /predeploy

Run pre-deployment checks for the TRAVELLINIWITHUS project before shipping to production.

## Checks to run (in order)

1. **TypeScript** — Run `npm run typecheck` (or `npx tsc --noEmit`). Must pass with zero errors.

2. **Lint** — Run `npm run lint`. Must pass with zero errors. Warnings are acceptable but should be noted.

3. **Unit Tests** — Run `npm run test -- --run`. All tests must pass.

4. **Build** — Run `npm run build`. Must complete successfully. Check for:
   - Bundle size warnings
   - Missing environment variables
   - Build output in `dist/`

5. **Sitemap** — Verify `dist/sitemap.xml` or `public/sitemap.xml` exists and contains all public routes.

6. **robots.txt** — Verify `public/robots.txt` exists and references the sitemap.

7. **Environment Variables** — Check that all required env vars are documented in `.env.example`:
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_API_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`
   - `GEMINI_API_KEY`
   - `APP_URL`

8. **Security Quick Check**:
   - No `console.log` in production code (search `src/` excluding test files)
   - No hardcoded API keys or secrets in `src/`
   - `firestore.rules` has no `allow read, write: if true`

9. **Obsidian Release Note** — Remind the user to update `docs/10_Projects/PROJECT_RELEASE_READINESS.md`:
   - Mark completed checklist items
   - If all checks pass, suggest creating a release note from `docs/90_Templates/TPL_Release_Note.md`

## Output

Report each check as PASS/FAIL/WARN with details. If any FAIL, do NOT recommend deploying.
If all pass, print: "✓ Ready to deploy. Run /deploy to ship."
